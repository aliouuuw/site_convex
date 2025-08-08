import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({
  ...authTables,
  numbers: defineTable({
    value: v.number(),
  }),
  content: defineTable({
    id: v.string(),
    content: v.string(),
    type: v.union(v.literal("text"), v.literal("image")),
    page: v.string(),
    lastModified: v.number(),
  })
    .index("by_content_id", ["id"]) // existing indexes
    .index("by_page", ["page"]),

  // New: Blog posts for structured CMS content
  blog_posts: defineTable({
    slug: v.string(),
    title: v.string(),
    excerpt: v.optional(v.string()),
    contentHtml: v.optional(v.string()),
    coverImageUrl: v.optional(v.string()), // URL to Uploadthing file
    coverImageName: v.optional(v.string()), // Original filename
    coverImageSize: v.optional(v.number()), // File size in bytes
    coverImageUploadedAt: v.optional(v.string()), // ISO timestamp
    author: v.optional(v.string()),
    category: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    featured: v.optional(v.boolean()),
    status: v.union(v.literal("draft"), v.literal("published")),
    publishedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"]) // ensure ability to enforce uniqueness at logic level
    .index("by_status_publishedAt", ["status", "publishedAt"]) // for listing published posts
    .index("by_featured", ["featured"])
    .index("by_coverImageUrl", ["coverImageUrl"]), // for querying posts with cover images

  // New: Team members
  team_members: defineTable({
    name: v.string(),
    role: v.optional(v.string()),
    photo: v.optional(v.string()), // URL to media
    bio: v.optional(v.string()),
    order: v.optional(v.number()),
    visible: v.optional(v.boolean()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_visible_order", ["visible", "order"]) // list visible in order
    .index("by_order", ["order"]),

  // Media library entries backed by Uploadthing
  media: defineTable({
    url: v.string(), // Uploadthing file URL
    name: v.string(), // Original filename
    size: v.number(), // File size in bytes
    type: v.union(v.literal("image"), v.literal("video")),
    alt: v.optional(v.string()),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    uploadedAt: v.string(), // ISO timestamp
    uploadedBy: v.string(), // User ID
  })
    .index("by_uploadedAt", ["uploadedAt"]) // for recent media
    .index("by_tag", ["tags"]), // basic tag search
});
