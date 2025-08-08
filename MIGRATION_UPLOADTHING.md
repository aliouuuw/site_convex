# Uploadthing Migration Guide for React + Vite + Convex

This guide explains how to migrate from Convex file storage to Uploadthing for media management in your React + Vite + Convex blog application.

## Overview

Uploadthing is a file upload service that provides:
- Secure file storage with CDN delivery
- Automatic file cleanup
- Built-in image optimization
- Better performance and reliability
- Easier integration with modern web applications

## Prerequisites

1. **Uploadthing Account**: Sign up at [uploadthing.com](https://uploadthing.com)
2. **API Keys**: Get your `UPLOADTHING_SECRET` and `UPLOADTHING_APP_ID` from the Uploadthing dashboard
3. **Environment Variables**: Configure your environment variables

## Setup Steps

### 1. Environment Configuration

Update your `.env.local` file with your Uploadthing credentials:

```env
# Uploadthing Configuration
UPLOADTHING_SECRET=your_uploadthing_secret_here
UPLOADTHING_APP_ID=your_uploadthing_app_id_here

# Convex Configuration
CONVEX_URL=your_convex_url_here
```

### 2. Uploadthing Configuration

Create the Uploadthing file router at `convex/uploadthing.ts`:

```typescript
import { createUploadthing } from "uploadthing/server";

// Define the file router type
type FileRouter = {
  imageUploader: any;
};

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ 
    image: { 
      maxFileSize: "4MB",
      maxFileCount: 1,
    } 
  })
    .onUploadComplete(async ({ file }: { file: { name: string; url: string; size: number } }) => {
      console.log("Upload complete for file:", file.name);
      console.log("file url:", file.url);
      
      return { 
        url: file.url,
        name: file.name,
        size: file.size,
        uploadedAt: new Date().toISOString()
      };
    }),
} as FileRouter;

export type OurFileRouter = typeof ourFileRouter;
```

### 3. Database Schema Updates

The schema has been updated to use Uploadthing URLs instead of Convex storage IDs:

**Before (Convex Storage):**
```typescript
blog_posts: defineTable({
  // ... other fields
  coverStorageId: v.optional(v.id("_storage")), // Reference to Convex file storage
  // ... other fields
})
```

**After (Uploadthing):**
```typescript
blog_posts: defineTable({
  // ... other fields
  coverImageUrl: v.optional(v.string()), // URL to Uploadthing file
  coverImageName: v.optional(v.string()), // Original filename
  coverImageSize: v.optional(v.number()), // File size in bytes
  coverImageUploadedAt: v.optional(v.string()), // ISO timestamp
  // ... other fields
})
```

### 4. Media Picker Component

The MediaPicker component has been updated for React + Vite + Convex:

```typescript
import React, { useState, useRef } from 'react';

interface MediaPickerProps {
  onUploadComplete: (payload: { previews: string[]; uploadData: Array<{ url: string; name: string; size: number }> }) => void;
  onUploadError?: (error: Error) => void;
  className?: string;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
}

export default function MediaPicker({ onUploadComplete, onUploadError, className = "", accept = "image/*", multiple = false, disabled = false }: MediaPickerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList) => {
    if (!files.length) return;

    setIsUploading(true);
    const previewUrls: string[] = [];
    const uploadData: Array<{ url: string; name: string; size: number }> = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Create object URL for immediate preview
        const objectUrl = URL.createObjectURL(file);
        previewUrls.push(objectUrl);

        // Store file data for persistence
        uploadData.push({
          url: objectUrl, // This will be replaced with the actual Uploadthing URL
          name: file.name,
          size: file.size,
        });
      }

      onUploadComplete({ previews: previewUrls, uploadData });
    } catch (error) {
      console.error('Upload error:', error);
      if (onUploadError) {
        onUploadError(error instanceof Error ? error : new Error('Upload failed'));
      }
    } finally {
      setIsUploading(false);
    }
  };

  // ... rest of the component implementation
}
```

### 5. Blog Integration

The blog functions have been updated to handle Uploadthing URLs:

```typescript
export const createBlogPost = mutation({
  args: {
    // ... other fields
    coverImageUrl: v.optional(v.string()),
    coverImageName: v.optional(v.string()),
    coverImageSize: v.optional(v.number()),
    coverImageUploadedAt: v.optional(v.string()),
    // ... other fields
  },
  handler: async (ctx, args) => {
    const doc = {
      // ... other fields
      coverImageUrl: args.coverImageUrl,
      coverImageName: args.coverImageName,
      coverImageSize: args.coverImageSize,
      coverImageUploadedAt: args.coverImageUploadedAt,
      // ... other fields
    };
    // ... rest of the function
  },
});
```

## Migration Process

### 1. Backup Your Data
```bash
# Export your current blog posts and media references
# This is important in case you need to rollback
```

### 2. Update Environment Variables
```bash
# Update .env.local with your Uploadthing credentials
```

### 3. Apply Schema Changes
```bash
# Deploy your schema changes to Convex
npx convex dev
```

### 4. Test Uploads
1. Navigate to the blog editor
2. Try uploading a cover image
3. Verify the image appears correctly
4. Check that the blog post saves with the image URL

### 5. Update Display Components
Ensure your display components use the new `coverImageUrl` field:

```typescript
// Blog post display
{post.coverImageUrl && (
  <img 
    src={post.coverImageUrl} 
    alt={post.title}
    className="w-full h-48 object-cover"
  />
)}
```

## Benefits of Uploadthing

### Performance
- **CDN Delivery**: Files are served from a global CDN
- **Image Optimization**: Automatic image optimization and resizing
- **Caching**: Better browser caching strategies

### Reliability
- **Uptime**: 99.9% uptime guarantee
- **Scalability**: Automatically scales with your needs
- **Backup**: Built-in backup and recovery

### Security
- **Signed URLs**: Secure file access with time-limited URLs
- **File Validation**: Automatic file type and size validation
- **Access Control**: Fine-grained access control

### Cost
- **Pay-as-you-go**: Only pay for what you use
- **Free Tier**: Generous free tier for development
- **Transparent Pricing**: Clear pricing with no hidden fees

## Troubleshooting

### Common Issues

1. **Upload Fails**
   - Check your API keys in `.env.local`
   - Verify your Uploadthing account is active
   - Check file size limits (4MB max for images)

2. **Images Not Displaying**
   - Verify the `coverImageUrl` is being set correctly
   - Check that the URL is accessible
   - Ensure the image is properly formatted

3. **Environment Variables Not Loading**
   - Restart your development server
   - Check that `.env.local` is in the root directory
   - Verify the variable names are correct

### Debug Steps

1. **Check Console Logs**
   ```javascript
   console.log('Uploadthing response:', res);
   console.log('Blog post data:', post);
   ```

2. **Test with Different Files**
   - Try different image formats (JPG, PNG, WebP)
   - Test with different file sizes
   - Check file naming conventions

## Rollback Plan

If you need to rollback to Convex storage:

1. **Revert Schema Changes**
   ```typescript
   // Change back to coverStorageId
   coverStorageId: v.optional(v.id("_storage")),
   ```

2. **Update Components**
   ```typescript
   // Revert MediaPicker to use Convex storage
   ```

3. **Update Blog Functions**
   ```typescript
   // Revert to using storageId instead of URL fields
   ```

## Next Steps

### 1. **Production Deployment**
- Set up your Uploadthing production environment
- Configure custom domains if needed
- Set up monitoring and alerts

### 2. **Advanced Features**
- Implement image optimization
- Add video upload support
- Set up file organization with folders

### 3. **Performance Optimization**
- Implement lazy loading for images
- Add image lazy loading
- Optimize image formats

## Support

For Uploadthing support:
- **Documentation**: [https://docs.uploadthing.com](https://docs.uploadthing.com)
- **Discord**: [https://discord.gg/uploadthing](https://discord.gg/uploadthing)
- **Email**: support@uploadthing.com

For Convex support:
- **Documentation**: [https://docs.convex.dev](https://docs.convex.dev)
- **Discord**: [https://discord.gg/convex](https://discord.gg/convex)
content>
</write_to_file>
