import { mutation, query } from "./_generated/server";
import { v } from "convex/values";


/**
 * Store media record after Uploadthing upload completes.
 */
export const storeMediaRecord = mutation({
  args: {
    url: v.string(),
    storageId: v.optional(v.id("_storage")),
    name: v.string(),
    title: v.optional(v.string()),
    size: v.number(),
    type: v.union(v.literal("image"), v.literal("video")),
    alt: v.optional(v.string()),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    thumbnailUrl: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    uploadedBy: v.optional(v.string()),
    source: v.optional(v.union(v.literal("upload"), v.literal("youtube"))),
    externalId: v.optional(v.string()),
  },
  returns: v.id("media"),
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("media", {
      url: args.url,
      name: args.name,
      title: args.title,
      size: args.size,
      type: args.type,
      alt: args.alt,
      width: args.width,
      height: args.height,
      thumbnailUrl: args.thumbnailUrl,
      source: args.source || "upload",
      externalId: args.externalId,
      tags: args.tags,
      uploadedAt: new Date().toISOString(),
      uploadedBy: args.uploadedBy || "unknown",
    });
    return id;
  },
});

/**
 * Get media record by ID.
 */
export const getMedia = query({
  args: { id: v.id("media") },
  returns: v.union(
    v.object({
      _id: v.id("media"),
      url: v.string(),
      name: v.string(),
      title: v.optional(v.string()),
      size: v.number(),
      type: v.union(v.literal("image"), v.literal("video")),
      alt: v.optional(v.string()),
      width: v.optional(v.number()),
      height: v.optional(v.number()),
      thumbnailUrl: v.optional(v.string()),
      source: v.optional(v.union(v.literal("upload"), v.literal("youtube"))),
      externalId: v.optional(v.string()),
      tags: v.optional(v.array(v.string())),
      uploadedAt: v.string(),
      uploadedBy: v.string(),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const media = await ctx.db.get(args.id);
    return media || null;
  },
});

/**
 * Find media record by URL.
 */
export const getMediaByUrl = query({
  args: { url: v.string() },
  returns: v.union(
    v.object({
      _id: v.id("media"),
      url: v.string(),
      name: v.string(),
      title: v.optional(v.string()),
      size: v.number(),
      type: v.union(v.literal("image"), v.literal("video")),
      alt: v.optional(v.string()),
      width: v.optional(v.number()),
      height: v.optional(v.number()),
      thumbnailUrl: v.optional(v.string()),
      source: v.optional(v.union(v.literal("upload"), v.literal("youtube"))),
      externalId: v.optional(v.string()),
      tags: v.optional(v.array(v.string())),
      uploadedAt: v.string(),
      uploadedBy: v.string(),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const media = await ctx.db
      .query("media")
      .filter((q) => q.eq(q.field("url"), args.url))
      .first();
    return media || null;
  },
});

/**
 * Update media record with additional metadata.
 */
export const updateMediaRecord = mutation({
  args: {
    id: v.id("media"),
    alt: v.optional(v.string()),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    type: v.optional(v.union(v.literal("image"), v.literal("video"))),
    title: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
    return null;
  },
});

/**
 * Search media with optional tag filter.
 */
export const searchMedia = query({
  args: { tag: v.optional(v.string()), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = Math.min(args.limit ?? 20, 50);

    let items;
    if (typeof args.tag === "string") {
      const normalizedTag = args.tag.trim().toLowerCase();
      // For tag filtering, we need to scan all media and filter in memory
      // since Convex doesn't support array contains queries on indexes
      const allItems = await ctx.db
        .query("media")
        .order("desc")
        .collect();
      
      items = allItems
        .filter((item) =>
          item.tags?.some((t) => t.trim().toLowerCase() === normalizedTag)
        )
        .slice(0, limit);
    } else {
      items = await ctx.db
        .query("media")
        .order("desc")
        .take(limit);
    }

    return items;
  },
});

/**
 * Delete a media record.
 * Note: With Uploadthing, file deletion is handled automatically by the service.
 */
export const deleteMedia = mutation({
  args: { id: v.id("media") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const doc = await ctx.db.get(args.id);
    if (doc) {
      // Files are stored in Convex storage and will be cleaned up automatically
      await ctx.db.delete(args.id);
    }
    return null;
  },
});

/**
 * Get Uploadthing upload component configuration.
 */
export const getUploadConfig = query({
  args: {},
  returns: v.object({
    url: v.string(),
    permissions: v.array(v.string()),
    maxFileSize: v.number(),
    allowedFileTypes: v.array(v.string()),
  }),
  handler: async (_ctx) => {
    return {
      url: "/api/upload", // This would be your Convex upload endpoint
      permissions: ["upload"],
      maxFileSize: 4 * 1024 * 1024, // 4MB
      allowedFileTypes: ["image/*", "video/*"],
    };
  },
});

export const countMediaFiles = query({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    const mediaFiles = await ctx.db
      .query("media")
      .order("desc")
      .collect();
    return mediaFiles.length;
  },
});
