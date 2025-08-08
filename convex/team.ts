import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const now = () => Date.now();

export const listTeamMembers = query({
  args: {},
  handler: async (ctx) => {
    const members = await ctx.db
      .query("team_members")
      .withIndex("by_visible_order", (q) => q.eq("visible", true))
      .order("asc")
      .collect();
    return members;
  },
});

export const listAllTeamMembers = query({
  args: {},
  handler: async (ctx) => {
    // TODO: role check once auth wired - only admins/editors should see this
    const members = await ctx.db
      .query("team_members")
      .withIndex("by_order", (q) => q.gt("order", -Infinity))
      .order("asc")
      .collect();
    return members;
  },
});

export const createTeamMember = mutation({
  args: {
    name: v.string(),
    role: v.optional(v.string()),
    photo: v.optional(v.string()),
    bio: v.optional(v.string()),
    order: v.optional(v.number()),
    visible: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("team_members", {
      name: args.name,
      role: args.role,
      photo: args.photo,
      bio: args.bio,
      order: args.order ?? 0,
      visible: args.visible ?? true,
      createdAt: now(),
      updatedAt: now(),
    });
    return id;
  },
});

export const updateTeamMember = mutation({
  args: {
    id: v.id("team_members"),
    name: v.optional(v.string()),
    role: v.optional(v.string()),
    photo: v.optional(v.string()),
    bio: v.optional(v.string()),
    order: v.optional(v.number()),
    visible: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const updates: any = { updatedAt: now() };
    for (const k of ["name", "role", "photo", "bio", "order", "visible"]) {
      if (args[k as keyof typeof args] !== undefined) updates[k] = (args as any)[k];
    }
    await ctx.db.patch(args.id, updates);
    return null;
  },
});

export const deleteTeamMember = mutation({
  args: { id: v.id("team_members") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return null;
  },
});

export const countTeamMembers = query({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    const members = await ctx.db
      .query("team_members")
      .withIndex("by_order", (q) => q.gt("order", -Infinity))
      .order("asc")
      .collect();
    return members.length;
  },
});
