import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const now = () => Date.now();

export const searchMedia = query({
  args: { tag: v.optional(v.string()), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = Math.min(args.limit ?? 20, 50);

    // If a tag is provided, query using a secondary index on the `tags` array.
    // Ensure you have an index defined like: db.index("by_tag", ["tags"])
    let items;
    if (typeof args.tag === "string") {
      items = await ctx.db
        .query("media")
        .withIndex("by_tag", (q) => q.eq("tags", [args.tag as string]))
        .order("desc")
        .take(limit);
    } else {
      items = await ctx.db
        .query("media")
        .withIndex("by_createdAt")
        .order("desc")
        .take(limit);
    }

    return items;
  },
});

export const upsertMedia = mutation({
  args: {
    url: v.string(),
    type: v.union(v.literal("image"), v.literal("video")),
    alt: v.optional(v.string()),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("media", {
      url: args.url,
      provider: "uploadthing",
      type: args.type,
      alt: args.alt,
      width: args.width,
      height: args.height,
      tags: args.tags,
      createdAt: now(),
    });
    return id;
  },
});

export const deleteMedia = mutation({
  args: { id: v.id("media") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return null;
  },
});
