import React, { useState, useRef } from 'react';

interface MediaPickerProps {
  /**
   * Called after uploads complete.
   * Receives both local preview URLs for immediate UI and the Uploadthing file data for persistence.
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
  accept = "image/*",
  multiple = false,
  disabled = false,
}: MediaPickerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList) => {
    if (!files.length) return;

    setIsUploading(true);
    const previewUrls: string[] = [];
    const uploadData: Array<{ url: string; name: string; size: number; mediaId?: string }> = [];

    try {
      // Use Convex deployment URL for upload endpoint
      const convexBase = (import.meta.env as any).VITE_CONVEX_URL_HTTP_ACTIONS;
      if (!convexBase) {
        throw new Error("VITE_CONVEX_URL not configured");
      }
      const uploadEndpoint = `${String(convexBase).replace(/\/$/, "")}/api/uploadthing`;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Create object URL for immediate preview
        const objectUrl = URL.createObjectURL(file);
        previewUrls.push(objectUrl);

        // Upload file to Uploadthing endpoint
        const form = new FormData();
        form.append("file", file);

        const res = await fetch(uploadEndpoint, {
          method: "POST",
          body: form,
        });

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(`Upload failed (${res.status}) ${text}`);
        }

        const json = await res.json().catch(() => null);
        if (!json || json.success === false) {
          throw new Error((json && json.message) || "Upload failed");
        }

        // Use returned url if available, otherwise fall back to object URL
        uploadData.push({
          url: json.url || objectUrl,
          name: json.name || file.name,
          size: json.size || file.size,
          mediaId: json.mediaId || undefined,
        });
      }

      // Return both previews (blob: URLs) for immediate UI and uploadData for persistence
      onUploadComplete({ previews: previewUrls, uploadData });
    } catch (error) {
      console.error("Upload error:", error);
      if (onUploadError) {
        onUploadError(error instanceof Error ? error : new Error("Upload failed"));
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
              {accept} files (max 4MB each)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
