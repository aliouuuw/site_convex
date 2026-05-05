import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { isEmptyRichText, looksLikeHtml } from "../shared/contentSanitizer";

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
      const htmlLike = looksLikeHtml(c.content);
      return (c.type === 'richText' || htmlLike) && isEmptyRichText(c.content);
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
      const htmlLike = looksLikeHtml(c.content);
      return (c.type === 'richText' || htmlLike) && isEmptyRichText(c.content);
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
 * Preview media URL migration from r2.dev to custom domain (dry run).
 */
export const previewMigrateMediaUrls = query({
  args: {
    oldBase: v.string(),
    newBase: v.string(),
  },
  returns: v.array(
    v.object({
      _id: v.string(),
      name: v.string(),
      oldUrl: v.string(),
      newUrl: v.string(),
    })
  ),
  handler: async (ctx, { oldBase, newBase }) => {
    const allMedia = await ctx.db.query("media").collect();
    const toMigrate = allMedia.filter((m) => m.url.startsWith(oldBase));
    return toMigrate.map((m) => ({
      _id: m._id as string,
      name: m.name,
      oldUrl: m.url,
      newUrl: m.url.replace(oldBase, newBase),
    }));
  },
});

/**
 * Rewrite media URLs from old domain to new custom domain.
 * Also rewrites content table entries that reference the old media URL.
 */
export const migrateMediaUrls = mutation({
  args: {
    oldBase: v.string(),
    newBase: v.string(),
  },
  returns: v.object({
    mediaUpdated: v.number(),
    contentUpdated: v.number(),
  }),
  handler: async (ctx, { oldBase, newBase }) => {
    // Rewrite media table
    const allMedia = await ctx.db.query("media").collect();
    let mediaUpdated = 0;
    for (const m of allMedia) {
      if (m.url.startsWith(oldBase)) {
        await ctx.db.patch(m._id, { url: m.url.replace(oldBase, newBase) });
        mediaUpdated++;
      }
    }

    // Rewrite content table (image URLs stored as content)
    const allContent = await ctx.db.query("content").collect();
    let contentUpdated = 0;
    for (const c of allContent) {
      if (c.content.includes(oldBase)) {
        await ctx.db.patch(c._id, {
          content: c.content.split(oldBase).join(newBase),
        });
        contentUpdated++;
      }
    }

    return { mediaUpdated, contentUpdated };
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
    const toFix = allContent.filter((c) => c.type === 'text' && looksLikeHtml(c.content));

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
