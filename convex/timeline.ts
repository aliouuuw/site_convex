import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const now = () => Date.now();

export const listTimelineEntries = query({
  args: {},
  handler: async (ctx) => {
    const entries = await ctx.db
      .query("timeline_entries")
      .withIndex("by_visible_order", (q) => q.eq("visible", true))
      .order("asc")
      .collect();
    return entries;
  },
});

export const listAllTimelineEntries = query({
  args: {},
  handler: async (ctx) => {
    // TODO: role check once auth wired - only admins/editors should see this
    const entries = await ctx.db
      .query("timeline_entries")
      .withIndex("by_order", (q) => q.gt("order", -Infinity))
      .order("asc")
      .collect();
    return entries;
  },
});

export const createTimelineEntry = mutation({
  args: {
    year: v.string(),
    title: v.string(),
    description: v.string(),
    order: v.optional(v.number()),
    visible: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("timeline_entries", {
      year: args.year,
      title: args.title,
      description: args.description,
      order: args.order ?? 0,
      visible: args.visible ?? true,
      createdAt: now(),
      updatedAt: now(),
    });
    return id;
  },
});

export const updateTimelineEntry = mutation({
  args: {
    id: v.id("timeline_entries"),
    year: v.optional(v.string()),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    order: v.optional(v.number()),
    visible: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const updates: any = { updatedAt: now() };
    for (const k of ["year", "title", "description", "order", "visible"]) {
      if (args[k as keyof typeof args] !== undefined) updates[k] = (args as any)[k];
    }
    await ctx.db.patch(args.id, updates);
    return null;
  },
});

export const deleteTimelineEntry = mutation({
  args: { id: v.id("timeline_entries") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return null;
  },
});

export const countTimelineEntries = query({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    const entries = await ctx.db
      .query("timeline_entries")
      .withIndex("by_order", (q) => q.gt("order", -Infinity))
      .order("asc")
      .collect();
    return entries.length;
  },
});
