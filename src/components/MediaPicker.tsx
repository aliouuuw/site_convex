import React, { useState, useRef } from 'react';
import { useAction, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

interface MediaPickerProps {
  /**
   * Called after uploads complete.
   * Receives both local preview URLs for immediate UI and the upload data for persistence.
   */
  onUploadComplete: (payload: { previews: string[]; uploadData: Array<{ url: string; name: string; size: number; mediaId?: string }> }) => void;
  onUploadError?: (error: Error) => void;
  className?: string;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
}

export default function MediaPicker({
  onUploadComplete,
  onUploadError,
  className = "",
  accept = "image/*,video/*",
  multiple = false,
  disabled = false,
}: MediaPickerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const generateR2UploadUrl = useAction(api.mediaActions.generateR2UploadUrl);
  const storeMediaRecord = useMutation(api.media.storeMediaRecord);

  const MAX_UPLOAD_DIMENSION = 1920;
  const WEBP_QUALITY = 0.85;

  const processImageFile = (file: File): Promise<{ file: File; width?: number; height?: number }> => {
    return new Promise((resolve) => {
      if (!file.type.startsWith("image/")) {
        resolve({ file }); // passthrough for non-images
        return;
      }

      const url = URL.createObjectURL(file);
      const img = new Image();

      img.onload = () => {
        URL.revokeObjectURL(url);

        let { naturalWidth: w, naturalHeight: h } = img;

        // Resize if any dimension exceeds max
        if (w > MAX_UPLOAD_DIMENSION || h > MAX_UPLOAD_DIMENSION) {
          const scale = Math.min(MAX_UPLOAD_DIMENSION / w, MAX_UPLOAD_DIMENSION / h);
          w = Math.round(w * scale);
          h = Math.round(h * scale);
        }

        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve({ file }); // fallback to original
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve({ file });
              return;
            }
            const processed = new File([blob], file.name.replace(/\.[^.]+$/, "").concat(".webp"), {
              type: "image/webp",
            });
            console.log(`Resized ${file.name}: ${(file.size / 1024).toFixed(0)}KB -> ${(processed.size / 1024).toFixed(0)}KB, ${img.naturalWidth}x${img.naturalHeight} -> ${w}x${h}`);
            resolve({ file: processed, width: w, height: h });
          },
          "image/webp",
          WEBP_QUALITY
        );
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve({ file });
      };

      img.src = url;
    });
  };

  const uploadFileToR2 = async (rawFile: File, maxRetries = 2) => {
    const { file, width, height } = await processImageFile(rawFile);

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        // 1. Get presigned R2 upload URL from Convex action
        const { key: r2Key, uploadUrl, publicUrl } = await generateR2UploadUrl();

        // 2. PUT file directly to R2 with cache headers so Cloudflare CDN caches aggressively
        console.log(`Uploading to R2 (attempt ${attempt + 1}): ${file.name}`);
        const res = await fetch(uploadUrl, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type || "application/octet-stream",
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          console.error("R2 upload failed:", res.status, text);
          throw new Error(`R2 upload failed (${res.status}): ${text.slice(0, 200)}`);
        }

        // 3. Save media metadata in Convex (including dimensions for layout-shift prevention)
        const mime = file.type || "application/octet-stream";
        const mediaType = mime.startsWith("image/") ? "image" as const : "video" as const;
        const mediaId = await storeMediaRecord({
          url: publicUrl,
          r2Key,
          name: file.name,
          size: file.size,
          type: mediaType,
          source: "upload",
          ...(width !== undefined && height !== undefined ? { width, height } : {}),
        });

        console.log("Upload complete:", { r2Key, publicUrl, mediaId });
        return { url: publicUrl, name: file.name, size: file.size, mediaId };
      } catch (error) {
        if (attempt === maxRetries) throw error;
        const delay = Math.pow(2, attempt) * 1000;
        console.log(`Upload attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    throw new Error("Upload failed after all retries");
  };

  const handleFiles = async (files: FileList) => {
    if (!files.length) return;

    // Check file sizes before uploading (20MB limit)
    const maxSize = 20 * 1024 * 1024; // 20MB in bytes
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > maxSize) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
        const errorMessage = `File "${file.name}" is ${sizeMB}MB, which exceeds the 20MB limit`;
        if (onUploadError) {
          onUploadError(new Error(errorMessage));
        }
        return;
      }
    }

    setIsUploading(true);
    const previewUrls: string[] = [];
    const uploadData: Array<{ url: string; name: string; size: number; mediaId?: string }> = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Create object URL for immediate preview
        const objectUrl = URL.createObjectURL(file);
        previewUrls.push(objectUrl);

        // Upload directly to R2, then save metadata in Convex
        const result = await uploadFileToR2(file);
        if (result) {
          uploadData.push(result);
        }
      }

      onUploadComplete({ previews: previewUrls, uploadData });
    } catch (error) {
      console.error("Upload error:", error);
      
      let errorMessage = "Upload failed";
      if (error instanceof Error) {
        if (error.message.includes("Failed to fetch")) {
          errorMessage = "Network error - please check your connection and try again";
        } else if (error.message.includes("HTTP2_PROTOCOL_ERROR")) {
          errorMessage = "Connection error - please try again";
        } else if (error.message.includes("stream size exceeded limit")) {
          errorMessage = "File too large - maximum size is 20MB";
        } else {
          errorMessage = error.message;
        }
      }
      
      if (onUploadError) {
        onUploadError(new Error(errorMessage));
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      void handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      void handleFiles(e.target.files);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleChange}
        accept={accept}
        multiple={multiple}
        className="hidden"
      />
      
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          dragActive
            ? "border-primary bg-primary/5"
            : "border-gray-300 hover:border-gray-400"
        } ${isUploading ? "opacity-50 cursor-not-allowed" : ""} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={!disabled ? openFileDialog : undefined}
        onDragEnter={!disabled ? handleDrag : undefined}
        onDragLeave={!disabled ? handleDrag : undefined}
        onDragOver={!disabled ? handleDrag : undefined}
        onDrop={!disabled ? handleDrop : undefined}
      >
        {isUploading ? (
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-2"></div>
            <p className="text-sm text-gray-600">Uploading files...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <svg
              className="w-12 h-12 text-gray-400 mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 48 48"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              />
            </svg>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium text-primary">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              Images and videos (max 20MB each)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
