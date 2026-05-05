import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { r2 } from "./r2";

/**
 * Delete a media record and its corresponding R2 object.
 * Must be called from the client via useAction (not useMutation)
 * because r2.deleteObject requires action context.
 */
export const deleteMediaWithR2 = action({
  args: { id: v.id("media") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const doc = await ctx.runQuery(api.media.getMedia, { id: args.id });
    if (doc?.r2Key) {
      await r2.deleteObject(ctx, doc.r2Key);
    }
    await ctx.runMutation(api.media.deleteMedia, { id: args.id });
    return null;
  },
});
