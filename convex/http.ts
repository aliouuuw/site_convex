import { httpRouter } from "convex/server";
import { auth } from "./auth";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

// Add auth routes
auth.addHttpRoutes(http);

/**
 * HTTP upload endpoint that accepts multipart/form-data with field "file".
 * Stores the uploaded file in Convex file storage, inserts a `media` record,
 * and returns { success, storageId, mediaId, url, name, size, uploadedAt }.
 *
 * Client usage (example):
 * const form = new FormData();
 * form.append('file', file);
 * const res = await fetch('/api/upload', { method: 'POST', body: form });
 * const json = await res.json();
 */
http.route({
  path: "/api/upload",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    try {
      const contentType = req.headers.get("content-type") || "";
      if (!contentType.includes("multipart/form-data")) {
        return new Response(JSON.stringify({ success: false, message: "Expected multipart/form-data" }), { status: 400, headers: { "Content-Type": "application/json" } });
      }

      const form = await req.formData();
      const file = form.get("file") as File | null;
      if (!file) {
        return new Response(JSON.stringify({ success: false, message: "Missing file field" }), { status: 400, headers: { "Content-Type": "application/json" } });
      }

      const arrayBuffer = await file.arrayBuffer();
      const blob = new Blob([arrayBuffer], { type: file.type || "application/octet-stream" });

      // store returns an Id<"_storage"> in http actions
      const storageId = await ctx.storage.store(blob);
      const url = await ctx.storage.getUrl(storageId);

      const uploadedAt = new Date().toISOString();
      const size = (file as any).size || arrayBuffer.byteLength;
      const name = (file as any).name || "file";
      const mime = file.type || "application/octet-stream";
      const type = mime.startsWith("image/") ? "image" as const : "video" as const;

      // Try to get authenticated user id if available
      let uploadedBy = "unknown";
      try {
        if (ctx.auth && typeof ctx.auth.getUserIdentity === "function") {
          const identity = await ctx.auth.getUserIdentity();
          // Identity shape may vary; attempt common fields
          uploadedBy = (identity && ((identity.userId as string) || (identity.sub as string) || (identity.id as string))) || "unknown";
        }
      } catch (e) {
        // ignore; leave uploadedBy as unknown
      }

      // Insert a media record via a Convex mutation (actions don't have direct DB access)
      let mediaId = null;
      try {
        mediaId = await ctx.runMutation(api.media.storeMediaRecord, {
          url: url || "",
          name,
          size,
          type,
          uploadedBy,
        });
      } catch (e) {
        console.error("Failed to insert media record via mutation:", e);
      }

      const result = {
        success: true,
        storageId,
        mediaId,
        url,
        name,
        size,
        uploadedAt,
      };

      return new Response(JSON.stringify(result), { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (err: any) {
      console.error("Upload endpoint error:", err);
      return new Response(JSON.stringify({ success: false, message: err?.message || "Upload failed" }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
  }),
});

export default http;
