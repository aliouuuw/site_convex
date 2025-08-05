import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const now = () => Date.now();

// Helpers
const _blogPostDoc = {
  _id: v.id("blog_posts"),
  _creationTime: v.number(),
  slug: v.string(),
  title: v.string(),
  excerpt: v.optional(v.string()),
  contentHtml: v.optional(v.string()),
  coverImage: v.optional(v.string()),
  author: v.optional(v.string()),
  category: v.optional(v.string()),
  tags: v.optional(v.array(v.string())),
  featured: v.optional(v.boolean()),
  status: v.union(v.literal("draft"), v.literal("published")),
  publishedAt: v.optional(v.number()),
  createdAt: v.number(),
  updatedAt: v.number(),
};

export const listPublishedBlogPosts = query({
  args: {
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()), // simple cursor: last slug
    featuredOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const limit = Math.min(args.limit ?? 10, 50);

    let q = ctx.db
      .query("blog_posts")
      .withIndex("by_status_publishedAt", (q) => q.eq("status", "published"));

    if (args.featuredOnly) {
      q = q.filter((q2) => q2.eq(q2.field("featured"), true));
    }

    const posts = await q
      .order("desc")
      .take(limit);

    return posts.map((p) => ({
      _id: p._id,
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      coverImage: p.coverImage,
      author: p.author,
      category: p.category,
      tags: p.tags ?? [],
      featured: !!p.featured,
      publishedAt: p.publishedAt ?? p.createdAt,
    }));
  },
});

export const listAllBlogPosts = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // TODO: role check once auth wired - only admins/editors should see this
    const limit = Math.min(args.limit ?? 50, 100);

    const posts = await ctx.db
      .query("blog_posts")
      .order("desc")
      .take(limit);

    return posts.map((p) => ({
      _id: p._id,
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      coverImage: p.coverImage,
      author: p.author,
      category: p.category,
      tags: p.tags ?? [],
      featured: !!p.featured,
      status: p.status,
      publishedAt: p.publishedAt,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));
  },
});

export const getBlogBySlug = query({
  args: {
    slug: v.string(),
    preview: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { slug, preview } = args;
    
    const q = ctx.db.query("blog_posts").withIndex("by_slug", (q) => q.eq("slug", slug));
    const posts = await q.take(1);
    
    if (posts.length === 0) return null;
    
    const post = posts[0];
    
    if (!preview && post.status !== "published") return null;
    
    return post;
  },
});

// Add a query specifically for editing that bypasses status checks
export const getBlogPostForEdit = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const { slug } = args;
        
    const q = ctx.db.query("blog_posts").withIndex("by_slug", (q) => q.eq("slug", slug));
    const posts = await q.take(1);
    
    if (posts.length === 0) {
      console.log("getBlogPostForEdit - No posts found for slug:", slug);
      return null;
    }
    
    return posts[0];
  },
});

export const getBlogPost = query({
  args: {
    id: v.id("blog_posts"),
  },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.id);
    if (!post) return null;
    return post;
  },
});

export const createBlogPost = mutation({
  args: {
    slug: v.string(),
    title: v.string(),
    excerpt: v.optional(v.string()),
    contentHtml: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    author: v.optional(v.string()),
    category: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    featured: v.optional(v.boolean()),
    status: v.optional(v.union(v.literal("draft"), v.literal("published"))),
    publishedAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // TODO: role check once auth wired
    const existing = await ctx.db
      .query("blog_posts")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .take(1);
    if (existing.length > 0) throw new Error("Slug already exists");

    const doc = {
      slug: args.slug,
      title: args.title,
      excerpt: args.excerpt,
      contentHtml: args.contentHtml,
      coverImage: args.coverImage,
      author: args.author,
      category: args.category,
      tags: args.tags,
      featured: args.featured ?? false,
      status: args.status ?? "draft",
      publishedAt: args.publishedAt,
      createdAt: now(),
      updatedAt: now(),
    };

    const id = await ctx.db.insert("blog_posts", doc);
    return id;
  },
});

export const updateBlogPost = mutation({
  args: {
    id: v.id("blog_posts"),
    title: v.optional(v.string()),
    excerpt: v.optional(v.string()),
    contentHtml: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    author: v.optional(v.string()),
    category: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    featured: v.optional(v.boolean()),
    status: v.optional(v.union(v.literal("draft"), v.literal("published"))),
    publishedAt: v.optional(v.number()),
    slug: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // TODO: role check once auth wired
    const updates: any = { updatedAt: now() };
    for (const k of [
      "title",
      "excerpt",
      "contentHtml",
      "coverImage",
      "author",
      "category",
      "tags",
      "featured",
      "status",
      "publishedAt",
      "slug",
    ]) {
      if (args[k as keyof typeof args] !== undefined) updates[k] = (args as any)[k];
    }
    await ctx.db.patch(args.id, updates);
    return null;
  },
});

export const publishBlogPost = mutation({
  args: { id: v.id("blog_posts"), publishedAt: v.optional(v.number()) },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: "published", publishedAt: args.publishedAt ?? now(), updatedAt: now() });
    return null;
  },
});

export const unpublishBlogPost = mutation({
  args: { id: v.id("blog_posts") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: "draft", updatedAt: now() });
    return null;
  },
});

export const deleteBlogPost = mutation({
  args: { id: v.id("blog_posts") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return null;
  },
});
