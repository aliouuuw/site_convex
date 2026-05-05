/**
 * One-time migration: move existing media files from Convex _storage to Cloudflare R2.
 *
 * Usage:
 *   bun run scripts/migrate-media-to-r2.ts
 *
 * Prerequisites:
 *   - .env.local with CONVEX_DEPLOYMENT and R2_* vars set
 *   - R2 bucket with CORS configured
 *   - R2 API token with Object Read & Write permissions
 */

import { ConvexClient } from "convex/browser";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { api } from "../convex/_generated/api.js";

// Load env vars from .env.local
const envFile = await Bun.file(".env.local").text();
for (const line of envFile.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eqIdx = trimmed.indexOf("=");
  if (eqIdx === -1) continue;
  const key = trimmed.slice(0, eqIdx).trim();
  const value = trimmed.slice(eqIdx + 1).trim();
  if (!process.env[key]) {
    process.env[key] = value;
  }
}

const CONVEX_URL = process.env.VITE_CONVEX_URL;
if (!CONVEX_URL) {
  console.error("❌ VITE_CONVEX_URL not set in .env.local");
  process.exit(1);
}

const R2_ENDPOINT = process.env.R2_ENDPOINT;
const R2_BUCKET = process.env.R2_BUCKET;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL;

if (!R2_ENDPOINT || !R2_BUCKET || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
  console.error("❌ Missing R2_* environment variables in .env.local");
  process.exit(1);
}

const r2Client = new S3Client({
  region: "auto",
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
});

const convex = new ConvexClient(CONVEX_URL);

console.log(`📡 Connected to Convex: ${CONVEX_URL}`);
console.log(`🪣 R2 bucket: ${R2_BUCKET}`);
console.log(`🌐 R2 public URL: ${R2_PUBLIC_URL || "(none — will use signed URLs)"}`);

// Fetch all media records
const allMedia: any[] = await convex.query(api.media.searchMedia, { limit: 1000 });
console.log(`\n📊 Total media records: ${allMedia.length}`);

const toMigrate = allMedia.filter(
  (m: any) => !m.r2Key && m.source !== "youtube" && m.url && !m.url.startsWith("https://pub-")
);
const alreadyMigrated = allMedia.filter((m: any) => !!m.r2Key).length;
const youtubeCount = allMedia.filter((m: any) => m.source === "youtube" || m.externalId).length;

console.log(`   Already migrated: ${alreadyMigrated}`);
console.log(`   YouTube/external: ${youtubeCount}`);
console.log(`   Needs migration:  ${toMigrate.length}`);

if (toMigrate.length === 0) {
  console.log("\n✅ Nothing to migrate!");
  process.exit(0);
}

console.log(`\n🚀 Starting migration of ${toMigrate.length} files...\n`);

let migrated = 0;
let failed = 0;
const errors: string[] = [];

for (let i = 0; i < toMigrate.length; i++) {
  const media = toMigrate[i];
  const progress = `[${i + 1}/${toMigrate.length}]`;
  try {
    // 1. Download the file from its current URL
    const dlResponse = await fetch(media.url);
    if (!dlResponse.ok) {
      throw new Error(`HTTP ${dlResponse.status} downloading`);
    }
    const arrayBuffer = await dlResponse.arrayBuffer();
    const mime = dlResponse.headers.get("content-type")
      || (media.type === "video" ? "video/mp4" : "image/jpeg");

    // 2. Upload to R2
    const r2Key = crypto.randomUUID();
    await r2Client.send(new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: r2Key,
      Body: new Uint8Array(arrayBuffer),
      ContentType: mime,
    }));

    // 3. Build public URL
    const newUrl = R2_PUBLIC_URL
      ? `${R2_PUBLIC_URL.replace(/\/$/, "")}/${r2Key}`
      : media.url; // keep old URL if no public base

    // 4. Patch the media record in Convex
    await convex.mutation(api.media.updateMediaRecord, {
      id: media._id,
      url: newUrl,
      r2Key,
    } as any);

    migrated++;
    console.log(`${progress} ✅ ${media.name} → ${r2Key}`);
  } catch (err: any) {
    failed++;
    const msg = `${media._id} (${media.name}): ${err?.message ?? String(err)}`;
    errors.push(msg);
    console.error(`${progress} ❌ ${msg}`);
  }
}

console.log(`\n📊 Migration complete:`);
console.log(`   Migrated: ${migrated}`);
console.log(`   Failed:   ${failed}`);
console.log(`   Skipped:  ${alreadyMigrated}`);

if (errors.length > 0) {
  console.log(`\n❌ Errors:`);
  for (const e of errors) {
    console.log(`   - ${e}`);
  }
}

convex.close();
process.exit(failed > 0 ? 1 : 0);
