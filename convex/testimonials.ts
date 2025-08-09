import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

const now = () => Date.now();

// Helpers
const _testimonialDoc = {
  _id: v.id("testimonials"),
  _creationTime: v.number(),
  quote: v.string(),
  author: v.string(),
  role: v.string(),
  imageUrl: v.optional(v.string()),
  imageName: v.optional(v.string()),
  imageSize: v.optional(v.number()),
  imageUploadedAt: v.optional(v.string()),
  featured: v.optional(v.boolean()),
  visible: v.optional(v.boolean()),
  order: v.optional(v.number()),
  createdAt: v.number(),
  updatedAt: v.number(),
};

export const listVisibleTestimonials = query({
  args: {
    limit: v.optional(v.number()),
    featuredOnly: v.optional(v.boolean()),
  },
  returns: v.array(v.object({
    _id: v.id("testimonials"),
    quote: v.string(),
    author: v.string(),
    role: v.string(),
    imageUrl: v.optional(v.string()),
    imageName: v.optional(v.string()),
    imageSize: v.optional(v.number()),
    imageUploadedAt: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    order: v.optional(v.number()),
  })),
  handler: async (ctx, args) => {
    const limit = Math.min(args.limit ?? 10, 50);

    let q = ctx.db
      .query("testimonials")
      .withIndex("by_visible_order", (q) => q.eq("visible", true));

    if (args.featuredOnly) {
      q = q.filter((q2) => q2.eq(q2.field("featured"), true));
    }

    const testimonials = await q.order("asc").take(limit);

    return testimonials.map((t) => ({
      _id: t._id,
      quote: t.quote,
      author: t.author,
      role: t.role,
      imageUrl: t.imageUrl,
      imageName: t.imageName,
      imageSize: t.imageSize,
      imageUploadedAt: t.imageUploadedAt,
      featured: t.featured,
      order: t.order ?? 0,
    }));
  },
});

export const listAllTestimonials = query({
  args: {
    limit: v.optional(v.number()),
  },
  returns: v.array(v.object(_testimonialDoc)),
  handler: async (ctx, args) => {
    // TODO: role check once auth wired - only admins/editors should see this
    const limit = Math.min(args.limit ?? 50, 100);

    const testimonials = await ctx.db
      .query("testimonials")
      .withIndex("by_order")
      .order("asc")
      .take(limit);

    return testimonials.map((t) => ({
      _id: t._id,
      _creationTime: t._creationTime,
      quote: t.quote,
      author: t.author,
      role: t.role,
      imageUrl: t.imageUrl,
      imageName: t.imageName,
      imageSize: t.imageSize,
      imageUploadedAt: t.imageUploadedAt,
      featured: t.featured,
      visible: t.visible,
      order: t.order,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    }));
  },
});

export const getTestimonial = query({
  args: {
    id: v.id("testimonials"),
  },
  returns: v.union(v.object(_testimonialDoc), v.null()),
  handler: async (ctx, args) => {
    const testimonial = await ctx.db.get(args.id);
    if (!testimonial) return null;
    
    return {
      _id: testimonial._id,
      _creationTime: testimonial._creationTime,
      quote: testimonial.quote,
      author: testimonial.author,
      role: testimonial.role,
      imageUrl: testimonial.imageUrl,
      imageName: testimonial.imageName,
      imageSize: testimonial.imageSize,
      imageUploadedAt: testimonial.imageUploadedAt,
      featured: testimonial.featured,
      visible: testimonial.visible,
      order: testimonial.order,
      createdAt: testimonial.createdAt,
      updatedAt: testimonial.updatedAt,
    };
  },
});

export const createTestimonial = mutation({
  args: {
    quote: v.string(),
    author: v.string(),
    role: v.string(),
    imageUrl: v.optional(v.string()),
    imageName: v.optional(v.string()),
    imageSize: v.optional(v.number()),
    imageUploadedAt: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    visible: v.optional(v.boolean()),
    order: v.optional(v.number()),
  },
  returns: v.id("testimonials"),
  handler: async (ctx, args) => {
    const currentTime = now();
    
    return await ctx.db.insert("testimonials", {
      quote: args.quote.trim(),
      author: args.author.trim(),
      role: args.role.trim(),
      imageUrl: args.imageUrl,
      imageName: args.imageName,
      imageSize: args.imageSize,
      imageUploadedAt: args.imageUploadedAt,
      featured: args.featured ?? false,
      visible: args.visible ?? true,
      order: args.order ?? 0,
      createdAt: currentTime,
      updatedAt: currentTime,
    });
  },
});

export const updateTestimonial = mutation({
  args: {
    id: v.id("testimonials"),
    quote: v.optional(v.string()),
    author: v.optional(v.string()),
    role: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    imageName: v.optional(v.string()),
    imageSize: v.optional(v.number()),
    imageUploadedAt: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    visible: v.optional(v.boolean()),
    order: v.optional(v.number()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    
    const existingTestimonial = await ctx.db.get(id);
    if (!existingTestimonial) {
      throw new Error("Testimonial not found");
    }

    const updateData: any = {
      updatedAt: now(),
    };

    // Only update fields that are provided
    if (updates.quote !== undefined) updateData.quote = updates.quote.trim();
    if (updates.author !== undefined) updateData.author = updates.author.trim();
    if (updates.role !== undefined) updateData.role = updates.role.trim();
    if (updates.imageUrl !== undefined) updateData.imageUrl = updates.imageUrl;
    if (updates.imageName !== undefined) updateData.imageName = updates.imageName;
    if (updates.imageSize !== undefined) updateData.imageSize = updates.imageSize;
    if (updates.imageUploadedAt !== undefined) updateData.imageUploadedAt = updates.imageUploadedAt;
    if (updates.featured !== undefined) updateData.featured = updates.featured;
    if (updates.visible !== undefined) updateData.visible = updates.visible;
    if (updates.order !== undefined) updateData.order = updates.order;

    await ctx.db.patch(id, updateData);
    return null;
  },
});

export const deleteTestimonial = mutation({
  args: {
    id: v.id("testimonials"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const existingTestimonial = await ctx.db.get(args.id);
    if (!existingTestimonial) {
      throw new Error("Testimonial not found");
    }

    await ctx.db.delete(args.id);
    return null;
  },
});

export const toggleTestimonialVisibility = mutation({
  args: {
    id: v.id("testimonials"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const testimonial = await ctx.db.get(args.id);
    if (!testimonial) {
      throw new Error("Testimonial not found");
    }

    await ctx.db.patch(args.id, {
      visible: !testimonial.visible,
      updatedAt: now(),
    });
    return null;
  },
});

export const toggleTestimonialFeatured = mutation({
  args: {
    id: v.id("testimonials"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const testimonial = await ctx.db.get(args.id);
    if (!testimonial) {
      throw new Error("Testimonial not found");
    }

    await ctx.db.patch(args.id, {
      featured: !testimonial.featured,
      updatedAt: now(),
    });
    return null;
  },
});
