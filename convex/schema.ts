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
    type: v.union(v.literal("text"), v.literal("image"), v.literal("richText")),
    page: v.string(),
    lastModified: v.number(),
    mediaId: v.optional(v.id("media")),
    alt: v.optional(v.string()),
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
    category: v.optional(v.string()), // e.g., "leadership", "administration", "teachers"
    photo: v.optional(v.string()), // URL to media
    bio: v.optional(v.string()),
    order: v.optional(v.number()),
    visible: v.optional(v.boolean()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_visible_order", ["visible", "order"]) // list visible in order
    .index("by_order", ["order"])
    .index("by_category_visible", ["category", "visible"]), // for filtering by category

  // New: Testimonials
  testimonials: defineTable({
    quote: v.string(),
    author: v.string(),
    role: v.string(),
    imageUrl: v.optional(v.string()), // URL to Uploadthing file
    imageName: v.optional(v.string()), // Original filename
    imageSize: v.optional(v.number()), // File size in bytes
    imageUploadedAt: v.optional(v.string()), // ISO timestamp
    featured: v.optional(v.boolean()),
    visible: v.optional(v.boolean()),
    order: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_visible_order", ["visible", "order"]) // for listing visible testimonials in order
    .index("by_featured", ["featured"])
    .index("by_order", ["order"]),

  // Media library entries backed by Uploadthing
  media: defineTable({
    url: v.string(), // Uploadthing file URL
    name: v.string(), // Original filename
    title: v.optional(v.string()), // Custom title for the media
    size: v.number(), // File size in bytes
    type: v.union(v.literal("image"), v.literal("video")),
    alt: v.optional(v.string()),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    thumbnailUrl: v.optional(v.string()), // Video thumbnail URL
    // Source of the media: 'upload' for Uploadthing files, 'youtube' for YouTube embeds
    source: v.optional(v.union(v.literal("upload"), v.literal("youtube"))),
    // External video ID (for YouTube embeds)
    externalId: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    uploadedAt: v.string(), // ISO timestamp
    uploadedBy: v.string(), // User ID
  })
    .index("by_uploadedAt", ["uploadedAt"]) // for recent media
    .index("by_tag", ["tags"]), // basic tag search

  // Timeline entries for the about page
  timeline_entries: defineTable({
    year: v.string(),
    title: v.string(),
    description: v.string(),
    order: v.optional(v.number()),
    visible: v.optional(v.boolean()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_visible_order", ["visible", "order"]) // list visible in order
    .index("by_order", ["order"]),

  // Site Settings - Singleton pattern (ERP/CMS best practice)
  // One row contains all site-wide configuration, fetched in a single query
  site_settings: defineTable({
    // -- Organization Info --
    orgName: v.string(),
    orgTagline: v.optional(v.string()),
    orgDescription: v.optional(v.string()),
    
    // -- Contact: Address --
    addressLine1: v.optional(v.string()),
    addressLine2: v.optional(v.string()),
    city: v.optional(v.string()),
    country: v.optional(v.string()),
    postalCode: v.optional(v.string()),
    mapUrl: v.optional(v.string()), // Google Maps embed or link
    mapCoordinates: v.optional(v.string()), // "lat,lng" format
    
    // -- Contact: Phone Numbers --
    phoneMain: v.optional(v.string()),
    phoneMobile: v.optional(v.string()),
    phoneWhatsApp: v.optional(v.string()),
    whatsAppUrl: v.optional(v.string()),
    
    // -- Contact: Emails --
    emailGeneral: v.optional(v.string()),
    emailDirection: v.optional(v.string()),
    emailInscription: v.optional(v.string()),
    emailVieScolaire: v.optional(v.string()),
    
    // -- Social Media --
    socialFacebook: v.optional(v.string()), // URL
    socialInstagram: v.optional(v.string()),
    socialLinkedIn: v.optional(v.string()),
    socialTwitter: v.optional(v.string()),
    socialYouTube: v.optional(v.string()),
    socialTikTok: v.optional(v.string()),
    
    // -- Business Hours (structured) --
    hoursWeekdays: v.optional(v.string()), // e.g., "8h00 - 17h00"
    hoursSaturday: v.optional(v.string()),
    hoursSunday: v.optional(v.string()),
    hoursNote: v.optional(v.string()), // special notes
    
    // -- Department Contacts (structured objects) --
    departments: v.optional(v.array(v.object({
      name: v.string(),
      contactPerson: v.optional(v.string()),
      email: v.optional(v.string()),
      phone: v.optional(v.string()),
      order: v.optional(v.number()),
    }))),
    
    // -- Metadata --
    updatedAt: v.number(),
    updatedBy: v.optional(v.string()),
  }),

  // Newsletter subscriptions
  newsletter_subscriptions: defineTable({
    email: v.string(),
    name: v.optional(v.string()),
    subscribedAt: v.number(),
    status: v.union(v.literal("active"), v.literal("unsubscribed")),
    source: v.optional(v.string()), // where they signed up from
  })
    .index("by_email", ["email"])
    .index("by_status", ["status"]),

  // Contact form messages
  contact_messages: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    subject: v.string(),
    message: v.string(),
    department: v.optional(v.string()), // which department the message is for
    status: v.union(v.literal("new"), v.literal("read"), v.literal("replied"), v.literal("archived")),
    receivedAt: v.number(),
    repliedAt: v.optional(v.number()),
    replyMessage: v.optional(v.string()),
    notes: v.optional(v.string()), // internal notes for staff
  })
    .index("by_status", ["status"])
    .index("by_receivedAt", ["receivedAt"])
    .index("by_email", ["email"]),
});
