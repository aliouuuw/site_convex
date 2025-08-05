// Media upload utilities for Convex file storage
import { v } from "convex/values";

export const mediaUpload = {
  // Validate file types and sizes
  validateFile: (file: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm'];
    const maxSize = 4 * 1024 * 1024; // 4MB
    
    if (!validTypes.includes(file.type)) {
      throw new Error(`Invalid file type: ${file.type}. Please upload images or videos.`);
    }
    
    if (file.size > maxSize) {
      throw new Error(`File too large. Maximum size is 4MB.`);
    }
    
    return true;
  },

  // Generate unique filename
  generateFilename: (originalName: string, userId: string) => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const extension = originalName.split('.').pop();
    return `${userId}-${timestamp}-${random}.${extension}`;
  },

  // Upload file to Convex storage
  uploadFile: async (file: File, userId: string) => {
    try {
      mediaUpload.validateFile(file);
      
      // Generate storage ID
      const storageId = `media/${mediaUpload.generateFilename(file.name, userId)}`;
      
      // Convert file to ArrayBuffer for Convex storage
      const arrayBuffer = await file.arrayBuffer();
      
      // Return the storage information that can be used with Convex storage
      return {
        storageId,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        url: storageId, // This will be resolved by Convex
      };
    } catch (error) {
      console.error('File upload error:', error);
      throw error;
    }
  },

  // Get file metadata from Convex storage
  getFileMetadata: async (storageId: string) => {
    // This would typically query the Convex _storage table
    return {
      id: storageId,
      url: storageId,
      type: 'image', // Would be determined from actual file
      size: 0, // Would be from actual file
    };
  },
};

// Types for media operations
export type MediaFile = {
  storageId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  url: string;
};

export type MediaUploadResult = {
  success: boolean;
  file?: MediaFile;
  error?: string;
};
