import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const updateContent = mutation({
  args: {
    id: v.string(),
    content: v.string(),
    type: v.union(v.literal("text"), v.literal("image")),
    page: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const { id, content, type, page } = args;
    
    // Check if content already exists
    const existing = await ctx.db
      .query("content")
      .filter((q) => q.eq(q.field("id"), id))
      .unique();
    
    if (existing) {
      // Update existing content
      await ctx.db.patch(existing._id, {
        content,
        type,
        page,
        lastModified: Date.now(),
      });
    } else {
      // Create new content
      await ctx.db.insert("content", {
        id,
        content,
        type,
        page,
        lastModified: Date.now(),
      });
    }
    
    return null;
  },
});

export const getContent = query({
  args: {
    id: v.string(),
  },
  returns: v.union(
    v.object({
      _id: v.string(),
      _creationTime: v.number(),
      id: v.string(),
      content: v.string(),
      type: v.union(v.literal("text"), v.literal("image")),
      page: v.string(),
      lastModified: v.number(),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const content = await ctx.db
      .query("content")
      .filter((q) => q.eq(q.field("id"), args.id))
      .unique();
    
    return content;
  },
});

export const getContentByPage = query({
  args: {
    page: v.string(),
  },
  returns: v.array(
    v.object({
      _id: v.string(),
      _creationTime: v.number(),
      id: v.string(),
      content: v.string(),
      type: v.union(v.literal("text"), v.literal("image")),
      page: v.string(),
      lastModified: v.number(),
    })
  ),
  handler: async (ctx, args) => {
    const contents = await ctx.db
      .query("content")
      .withIndex("by_page", (q) => q.eq("page", args.page))
      .collect();
    
    return contents;
  },
});

export const getAllContent = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.string(),
      _creationTime: v.number(),
      id: v.string(),
      content: v.string(),
      type: v.union(v.literal("text"), v.literal("image")),
      page: v.string(),
      lastModified: v.number(),
    })
  ),
  handler: async (ctx) => {
    const contents = await ctx.db.query("content").collect();
    return contents;
  },
}); 