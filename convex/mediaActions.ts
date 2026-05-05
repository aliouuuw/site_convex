import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { r2 } from "./r2";

/**
 * Generate a presigned R2 upload URL so the browser can PUT a file
 * directly to Cloudflare R2 without going through Convex storage.
 *
 * Returns:
 *  - key:       R2 object key (UUID)
 *  - uploadUrl: presigned PUT URL (valid 15 min)
 *  - publicUrl: permanent public URL (if R2_PUBLIC_URL is set) or 7-day signed URL
 */
export const generateR2UploadUrl = action({
  args: {},
  returns: v.object({
    key: v.string(),
    uploadUrl: v.string(),
    publicUrl: v.string(),
  }),
  handler: async (_ctx) => {
    const { key, url: uploadUrl } = await r2.generateUploadUrl();
    const publicBase = process.env.R2_PUBLIC_URL;
    const publicUrl = publicBase
      ? `${publicBase.replace(/\/$/, "")}/${key}`
      : await r2.getUrl(key, { expiresIn: 7 * 24 * 60 * 60 });
    return { key, uploadUrl, publicUrl };
  },
});

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
