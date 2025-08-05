import React, { useState, useRef } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

interface MediaPickerProps {
  onUploadComplete: (urls: string[]) => void;
  onUploadError?: (error: Error) => void;
  className?: string;
  accept?: string;
  multiple?: boolean;
}

export default function MediaPicker({
  onUploadComplete,
  onUploadError,
  className = "",
  accept = "image/*",
  multiple = false,
}: MediaPickerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadMedia = useMutation(api.media.uploadMedia);

  const handleFiles = async (files: FileList) => {
    if (!files.length) return;

    setIsUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Determine file type
        const fileType = file.type.startsWith('image/') ? 'image' : 'video';
        
        // For now, we'll just use the file URL as a placeholder
        // In a real implementation, you'd upload to Convex storage
        const url = URL.createObjectURL(file);
        
        // Upload to Convex
        const result = await uploadMedia({
          url,
          type: fileType,
          alt: file.name,
          tags: [fileType],
        });
        
        if (result) {
          uploadedUrls.push(url);
        }
      }
      
      onUploadComplete(uploadedUrls);
    } catch (error) {
      console.error('Upload error:', error);
      if (onUploadError) {
        onUploadError(error instanceof Error ? error : new Error('Upload failed'));
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
        } ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={openFileDialog}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
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
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
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
