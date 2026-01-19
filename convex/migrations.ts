import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Utility to check if rich text HTML is effectively empty (only empty tags, no real content).
 */
function isEmptyRichText(html: string): boolean {
  if (!html) return true;
  const hasMedia = /<(img|video|iframe|svg|figure|picture)\b/i.test(html);
  if (hasMedia) return false;
  const plainText = html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim();
  return plainText.length === 0;
}

/**
 * Preview which content entries would be cleaned (dry run).
 */
export const previewCleanEmptyRichText = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.string(),
      id: v.string(),
      content: v.string(),
      type: v.string(),
      page: v.string(),
    })
  ),
  handler: async (ctx) => {
    const allContent = await ctx.db.query("content").collect();
    const toClean = allContent.filter((c) => {
      // Check if it's a richText type OR if it looks like HTML but is empty
      const looksLikeHtml = /<[^>]+>/.test(c.content);
      return (c.type === 'richText' || looksLikeHtml) && isEmptyRichText(c.content);
    });
    return toClean.map((c) => ({
      _id: c._id as string,
      id: c.id,
      content: c.content,
      type: c.type,
      page: c.page,
    }));
  },
});

/**
 * Clean all content entries that have empty rich text (e.g., `<p></p>`, `<p style="..."></p>`).
 * Sets their content to empty string and ensures type is 'richText'.
 */
export const cleanEmptyRichText = mutation({
  args: {},
  returns: v.object({
    cleaned: v.number(),
    ids: v.array(v.string()),
  }),
  handler: async (ctx) => {
    const allContent = await ctx.db.query("content").collect();
    const toClean = allContent.filter((c) => {
      const looksLikeHtml = /<[^>]+>/.test(c.content);
      return (c.type === 'richText' || looksLikeHtml) && isEmptyRichText(c.content);
    });

    const cleanedIds: string[] = [];
    for (const c of toClean) {
      await ctx.db.patch(c._id, {
        content: '',
        type: 'richText',
        lastModified: Date.now(),
      });
      cleanedIds.push(c.id);
    }

    return { cleaned: cleanedIds.length, ids: cleanedIds };
  },
});

/**
 * Fix content type for entries that contain HTML but are marked as 'text'.
 * This ensures DisplayText renders them correctly.
 */
export const fixRichTextTypes = mutation({
  args: {},
  returns: v.object({
    fixed: v.number(),
    ids: v.array(v.string()),
  }),
  handler: async (ctx) => {
    const allContent = await ctx.db.query("content").collect();
    const toFix = allContent.filter((c) => {
      const looksLikeHtml = /<[^>]+>/.test(c.content);
      return c.type === 'text' && looksLikeHtml;
    });

    const fixedIds: string[] = [];
    for (const c of toFix) {
      await ctx.db.patch(c._id, {
        type: 'richText',
        lastModified: Date.now(),
      });
      fixedIds.push(c.id);
    }

    return { fixed: fixedIds.length, ids: fixedIds };
  },
});
