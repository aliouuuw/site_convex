# Next Phase Implementation Plan - Les Hirondelles CMS

## Overview

This document outlines the detailed implementation plan for Phase 2 of the Les Hirondelles website migration, focusing on completing the content management system with authentication, rich media support, and advanced editing capabilities.

## 🎯 **PHASE 2 OBJECTIVES**

### Core Goals
1. **Complete Content Attribution**: Add `data-live-edit-id` to all remaining pages
2. **Authentication Integration**: Secure edit mode access with user management
3. **Rich Media Support**: Image and video embedding with Convex file storage
4. **Rich Text Editing**: TipTap integration for blog content management

### Success Criteria
- ✅ All pages have editable content marked with data attributes
- ✅ Edit mode only accessible to authenticated users
- ✅ Image and video upload/embedding working
- ✅ Rich text editing for blog posts functional
- ✅ Content persistence and real-time updates working

---

## 📋 **IMPLEMENTATION TASKS**

### Phase 2.1: Complete Data Attribution (Day 1)

#### 1. AboutPage.tsx Content Attribution
```typescript
// Add data-live-edit-id to editable elements
<h1 data-live-edit-id="about.hero.title">Notre Histoire</h1>
<p data-live-edit-id="about.hero.description">Découvrez l'histoire de notre école...</p>

// School history section
<h2 data-live-edit-id="about.history.title">Une Histoire d'Excellence</h2>
<p data-live-edit-id="about.history.content">Fondée en 1985, Les Hirondelles...</p>

// Values section
<h2 data-live-edit-id="about.values.title">Nos Valeurs</h2>
<div data-live-edit-id="about.values.excellence">Excellence académique</div>
<div data-live-edit-id="about.values.respect">Respect et intégrité</div>
<div data-live-edit-id="about.values.community">Communauté et solidarité</div>

// Leadership section
<h2 data-live-edit-id="about.leadership.title">Notre Équipe</h2>
<div data-live-edit-id="about.leadership.director.name">Mme Fatou Diop</div>
<div data-live-edit-id="about.leadership.director.role">Directrice Générale</div>
<div data-live-edit-id="about.leadership.director.bio">Avec plus de 20 ans d'expérience...</div>
```

#### 2. ContactPage.tsx Content Attribution
```typescript
// Contact information
<h1 data-live-edit-id="contact.hero.title">Contactez-nous</h1>
<p data-live-edit-id="contact.hero.description">Nous sommes là pour répondre à vos questions...</p>

// Contact details
<div data-live-edit-id="contact.info.address">123 Avenue de l'Éducation, Dakar</div>
<div data-live-edit-id="contact.info.phone">+221 33 123 45 67</div>
<div data-live-edit-id="contact.info.email">contact@leshirondelles.sn</div>

// Office hours
<h3 data-live-edit-id="contact.hours.title">Heures d'ouverture</h3>
<div data-live-edit-id="contact.hours.weekdays">Lundi - Vendredi: 7h30 - 17h30</div>
<div data-live-edit-id="contact.hours.saturday">Samedi: 8h00 - 12h00</div>

// Call to action
<h2 data-live-edit-id="contact.cta.title">Prêt à nous rejoindre ?</h2>
<p data-live-edit-id="contact.cta.description">Planifiez une visite ou posez vos questions...</p>
```

#### 3. InscriptionPage.tsx Content Attribution
```typescript
// Admissions content
<h1 data-live-edit-id="inscription.hero.title">Inscription</h1>
<p data-live-edit-id="inscription.hero.description">Découvrez notre processus d'admission...</p>

// Process steps
<h2 data-live-edit-id="inscription.process.title">Processus d'Admission</h2>
<div data-live-edit-id="inscription.process.step1">1. Demande de rendez-vous</div>
<div data-live-edit-id="inscription.process.step2">2. Visite de l'établissement</div>
<div data-live-edit-id="inscription.process.step3">3. Évaluation académique</div>
<div data-live-edit-id="inscription.process.step4">4. Décision d'admission</div>

// Requirements
<h2 data-live-edit-id="inscription.requirements.title">Documents Requis</h2>
<ul data-live-edit-id="inscription.requirements.list">
  <li>Certificat de naissance</li>
  <li>Bulletins scolaires</li>
  <li>Certificat médical</li>
</ul>

// Fees information
<h2 data-live-edit-id="inscription.fees.title">Frais de Scolarité</h2>
<p data-live-edit-id="inscription.fees.description">Nos frais de scolarité comprennent...</p>
```

### Phase 2.2: Authentication Integration (Days 2-3)

#### 1. Update EditProvider with Authentication
```typescript
// src/components/EditProvider.tsx
import { useAuth } from "convex/react";

export default function EditProvider({ children }: EditProviderProps) {
  const { isAuthenticated, user } = useAuth();
  const { isEditMode, toggleEditMode } = useEditModeHook();
  
  // Only allow edit mode for authenticated users
  const canEdit = isAuthenticated && user?.role === "admin";
  
  // Initialize live edit system only for authorized users
  useEffect(() => {
    if (canEdit) {
      const convex = new ConvexReactClient(
        import.meta.env.VITE_CONVEX_URL as string,
      );
      liveEditRef.current = new LiveEditPrototype(convex, (editMode) => {
        if (editMode !== isEditMode) {
          toggleEditMode();
        }
      });
      setIsInitialized(true);
    }
  }, [canEdit, toggleEditMode, isEditMode]);

  // Only show edit toggle for authorized users
  return (
    <EditContext.Provider value={contextValue}>
      {children}
      {canEdit && isInitialized && liveEditRef.current && (
        <EditModeToggle liveEdit={liveEditRef.current} />
      )}
    </EditContext.Provider>
  );
}
```

#### 2. Update Convex Schema for User Roles
```typescript
// convex/schema.ts
export default defineSchema({
  ...authTables,
  users: defineTable({
    name: v.string(),
    email: v.string(),
    role: v.union(v.literal("admin"), v.literal("editor"), v.literal("viewer")),
    permissions: v.array(v.string()),
    lastLogin: v.optional(v.number()),
  }).index("by_email", ["email"]),
  
  content: defineTable({
    id: v.string(),
    content: v.string(),
    type: v.union(v.literal("text"), v.literal("image"), v.literal("video")),
    page: v.string(),
    lastModified: v.number(),
    lastModifiedBy: v.id("users"),
  }).index("by_content_id", ["id"]).index("by_page", ["page"]),
});
```

#### 3. Add Authentication Functions
```typescript
// convex/auth.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    role: v.union(v.literal("admin"), v.literal("editor"), v.literal("viewer")),
  },
  returns: v.id("users"),
  handler: async (ctx, args) => {
    const userId = await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      role: args.role,
      permissions: getPermissionsForRole(args.role),
      lastLogin: Date.now(),
    });
    return userId;
  },
});

export const getUserRole = query({
  args: { userId: v.id("users") },
  returns: v.union(v.literal("admin"), v.literal("editor"), v.literal("viewer")),
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    return user?.role || "viewer";
  },
});

function getPermissionsForRole(role: string): string[] {
  switch (role) {
    case "admin":
      return ["read", "write", "delete", "manage_users"];
    case "editor":
      return ["read", "write"];
    case "viewer":
      return ["read"];
    default:
      return ["read"];
  }
}
```

### Phase 2.3: Rich Media Support (Days 4-5)

#### 1. Update Convex Schema for File Storage
```typescript
// convex/schema.ts
export default defineSchema({
  ...authTables,
  // ... existing tables
  
  media: defineTable({
    filename: v.string(),
    originalName: v.string(),
    contentType: v.string(),
    size: v.number(),
    url: v.string(),
    thumbnailUrl: v.optional(v.string()),
    alt: v.optional(v.string()),
    uploadedBy: v.id("users"),
    uploadedAt: v.number(),
    tags: v.array(v.string()),
  }).index("by_filename", ["filename"])
    .index("by_content_type", ["contentType"])
    .index("by_uploaded_by", ["uploadedBy"]),
});
```

#### 2. Create Media Management Functions
```typescript
// convex/media.ts
import { mutation, query, action } from "./_generated/server";
import { v } from "convex/values";

export const generateUploadUrl = mutation({
  args: {},
  returns: v.string(),
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const saveMediaMetadata = mutation({
  args: {
    storageId: v.id("_storage"),
    filename: v.string(),
    originalName: v.string(),
    contentType: v.string(),
    size: v.number(),
    alt: v.optional(v.string()),
    tags: v.array(v.string()),
  },
  returns: v.id("media"),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity.email))
      .unique();

    if (!user || user.role === "viewer") {
      throw new Error("Insufficient permissions");
    }

    const url = await ctx.storage.getUrl(args.storageId);
    if (!url) {
      throw new Error("Failed to get file URL");
    }

    const mediaId = await ctx.db.insert("media", {
      filename: args.filename,
      originalName: args.originalName,
      contentType: args.contentType,
      size: args.size,
      url,
      alt: args.alt,
      uploadedBy: user._id,
      uploadedAt: Date.now(),
      tags: args.tags,
    });

    return mediaId;
  },
});

export const getMedia = query({
  args: { mediaId: v.id("media") },
  returns: v.union(
    v.object({
      _id: v.id("media"),
      filename: v.string(),
      originalName: v.string(),
      contentType: v.string(),
      size: v.number(),
      url: v.string(),
      thumbnailUrl: v.optional(v.string()),
      alt: v.optional(v.string()),
      uploadedBy: v.id("users"),
      uploadedAt: v.number(),
      tags: v.array(v.string()),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    return await ctx.db.get(args.mediaId);
  },
});

export const listMedia = query({
  args: {
    contentType: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  returns: v.array(
    v.object({
      _id: v.id("media"),
      filename: v.string(),
      originalName: v.string(),
      contentType: v.string(),
      size: v.number(),
      url: v.string(),
      thumbnailUrl: v.optional(v.string()),
      alt: v.optional(v.string()),
      uploadedAt: v.number(),
      tags: v.array(v.string()),
    })
  ),
  handler: async (ctx, args) => {
    let query = ctx.db.query("media");
    
    if (args.contentType) {
      query = query.filter((q) => q.eq(q.field("contentType"), args.contentType));
    }
    
    if (args.tags && args.tags.length > 0) {
      query = query.filter((q) => 
        q.and(...args.tags!.map(tag => q.eq(q.field("tags"), tag)))
      );
    }
    
    return await query.order("desc").collect();
  },
});
```

#### 3. Create Media Upload Component
```typescript
// src/components/MediaUpload.tsx
import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

interface MediaUploadProps {
  onUploadComplete: (mediaId: string, url: string) => void;
  acceptedTypes?: string[];
  maxSize?: number; // in bytes
}

export default function MediaUpload({ 
  onUploadComplete, 
  acceptedTypes = ["image/*", "video/*"],
  maxSize = 10 * 1024 * 1024 // 10MB
}: MediaUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const generateUploadUrl = useMutation(api.media.generateUploadUrl);
  const saveMediaMetadata = useMutation(api.media.saveMediaMetadata);

  const handleFileUpload = async (file: File) => {
    if (file.size > maxSize) {
      alert(`File too large. Maximum size is ${maxSize / 1024 / 1024}MB`);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Generate upload URL
      const uploadUrl = await generateUploadUrl();
      
      // Upload file to Convex storage
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!result.ok) {
        throw new Error("Upload failed");
      }

      const { storageId } = await result.json();
      
      // Save metadata
      const mediaId = await saveMediaMetadata({
        storageId,
        filename: file.name,
        originalName: file.name,
        contentType: file.type,
        size: file.size,
        tags: [],
      });

      // Get the media object to get the URL
      const media = await api.media.get({ mediaId });
      if (media) {
        onUploadComplete(mediaId, media.url);
      }

      setUploadProgress(100);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="media-upload">
      <input
        type="file"
        accept={acceptedTypes.join(",")}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleFileUpload(file);
          }
        }}
        disabled={isUploading}
      />
      
      {isUploading && (
        <div className="upload-progress">
          <div 
            className="progress-bar" 
            style={{ width: `${uploadProgress}%` }}
          />
          <span>Uploading... {uploadProgress}%</span>
        </div>
      )}
    </div>
  );
}
```

#### 4. Update LiveEdit for Media Support
```typescript
// src/lib/liveEdit.ts - Add to LiveEditPrototype class

private async handleImageUpload(element: HTMLElement, editElement: LiveEditElement): Promise<void> {
  // Create file input
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  
  fileInput.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    try {
      // Show upload indicator
      element.style.opacity = "0.5";
      
      // Upload file and get URL
      const uploadUrl = await this.convex.mutation(api.media.generateUploadUrl);
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!result.ok) throw new Error("Upload failed");
      
      const { storageId } = await result.json();
      
      // Save metadata
      const mediaId = await this.convex.mutation(api.media.saveMediaMetadata, {
        storageId,
        filename: file.name,
        originalName: file.name,
        contentType: file.type,
        size: file.size,
        tags: [],
      });

      // Get media URL
      const media = await this.convex.query(api.media.get, { mediaId });
      if (media) {
        // Update image src
        element.setAttribute("src", media.url);
        
        // Save to content
        await this.saveContent(editElement.id, media.url, true);
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Image upload failed. Please try again.");
    } finally {
      element.style.opacity = "1";
    }
  };

  fileInput.click();
}

// Update startEditing method to handle images
private startEditing(editElement: LiveEditElement): void {
  const { element, id } = editElement;
  const isImage = element.tagName === "IMG";
  
  if (isImage) {
    this.handleImageUpload(element, editElement);
    return;
  }
  
  // ... existing text editing logic
}
```

### Phase 2.4: Rich Text Editing (Days 6-7)

#### 1. Install TipTap Dependencies
```bash
npm install @tiptap/react @tiptap/pm @tiptap/starter-kit @tiptap/extension-link @tiptap/extension-image @tiptap/extension-youtube
```

#### 2. Create Rich Text Editor Component
```typescript
// src/components/RichTextEditor.tsx
import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import YouTube from "@tiptap/extension-youtube";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  editable?: boolean;
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder = "Start writing...",
  editable = true,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 hover:text-blue-800 underline",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg",
        },
      }),
      YouTube.configure({
        HTMLAttributes: {
          class: "w-full aspect-video rounded-lg",
        },
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none",
      },
    },
  });

  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt("Enter URL");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt("Enter image URL");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addYouTube = () => {
    const url = window.prompt("Enter YouTube URL");
    if (url) {
      const videoId = extractYouTubeId(url);
      if (videoId) {
        editor.chain().focus().setYoutubeVideo({ src: videoId }).run();
      }
    }
  };

  return (
    <div className="rich-text-editor">
      {editable && (
        <div className="toolbar border-b border-gray-200 p-2 flex flex-wrap gap-2">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`btn-toolbar ${editor.isActive("bold") ? "active" : ""}`}
          >
            Bold
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`btn-toolbar ${editor.isActive("italic") ? "active" : ""}`}
          >
            Italic
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`btn-toolbar ${editor.isActive("heading", { level: 2 }) ? "active" : ""}`}
          >
            H2
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`btn-toolbar ${editor.isActive("heading", { level: 3 }) ? "active" : ""}`}
          >
            H3
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`btn-toolbar ${editor.isActive("bulletList") ? "active" : ""}`}
          >
            List
          </button>
          <button
            onClick={addLink}
            className={`btn-toolbar ${editor.isActive("link") ? "active" : ""}`}
          >
            Link
          </button>
          <button onClick={addImage} className="btn-toolbar">
            Image
          </button>
          <button onClick={addYouTube} className="btn-toolbar">
            YouTube
          </button>
        </div>
      )}
      
      <EditorContent editor={editor} className="content-area p-4 min-h-[200px]" />
    </div>
  );
}

function extractYouTubeId(url: string): string | null {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}
```

#### 3. Create Blog Schema and Functions
```typescript
// convex/blog.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createBlogPost = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    excerpt: v.string(),
    content: v.string(), // Rich text HTML
    featuredImage: v.optional(v.string()),
    category: v.string(),
    tags: v.array(v.string()),
    author: v.object({
      name: v.string(),
      role: v.string(),
      avatar: v.optional(v.string()),
    }),
    seo: v.object({
      title: v.string(),
      description: v.string(),
      keywords: v.array(v.string()),
    }),
    status: v.union(v.literal("draft"), v.literal("published")),
    featured: v.boolean(),
  },
  returns: v.id("blogPosts"),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity.email))
      .unique();

    if (!user || user.role === "viewer") {
      throw new Error("Insufficient permissions");
    }

    const blogPostId = await ctx.db.insert("blogPosts", {
      ...args,
      readTime: calculateReadTime(args.content),
      publishedAt: args.status === "published" ? Date.now() : undefined,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      lastModifiedBy: user._id,
    });

    return blogPostId;
  },
});

export const updateBlogPost = mutation({
  args: {
    id: v.id("blogPosts"),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    excerpt: v.optional(v.string()),
    content: v.optional(v.string()),
    featuredImage: v.optional(v.string()),
    category: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    seo: v.optional(v.object({
      title: v.string(),
      description: v.string(),
      keywords: v.array(v.string()),
    })),
    status: v.optional(v.union(v.literal("draft"), v.literal("published"))),
    featured: v.optional(v.boolean()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity.email))
      .unique();

    if (!user || user.role === "viewer") {
      throw new Error("Insufficient permissions");
    }

    const { id, ...updates } = args;
    
    await ctx.db.patch(id, {
      ...updates,
      readTime: updates.content ? calculateReadTime(updates.content) : undefined,
      publishedAt: updates.status === "published" ? Date.now() : undefined,
      updatedAt: Date.now(),
      lastModifiedBy: user._id,
    });

    return null;
  },
});

export const getBlogPost = query({
  args: { slug: v.string() },
  returns: v.union(
    v.object({
      _id: v.id("blogPosts"),
      title: v.string(),
      slug: v.string(),
      excerpt: v.string(),
      content: v.string(),
      featuredImage: v.optional(v.string()),
      category: v.string(),
      tags: v.array(v.string()),
      author: v.object({
        name: v.string(),
        role: v.string(),
        avatar: v.optional(v.string()),
      }),
      seo: v.object({
        title: v.string(),
        description: v.string(),
        keywords: v.array(v.string()),
      }),
      status: v.union(v.literal("draft"), v.literal("published")),
      featured: v.boolean(),
      readTime: v.number(),
      publishedAt: v.optional(v.number()),
      createdAt: v.number(),
      updatedAt: v.number(),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("blogPosts")
      .filter((q) => q.eq(q.field("slug"), args.slug))
      .unique();
  },
});

export const listBlogPosts = query({
  args: {
    status: v.optional(v.union(v.literal("draft"), v.literal("published"))),
    category: v.optional(v.string()),
    featured: v.optional(v.boolean()),
  },
  returns: v.array(
    v.object({
      _id: v.id("blogPosts"),
      title: v.string(),
      slug: v.string(),
      excerpt: v.string(),
      featuredImage: v.optional(v.string()),
      category: v.string(),
      tags: v.array(v.string()),
      author: v.object({
        name: v.string(),
        role: v.string(),
        avatar: v.optional(v.string()),
      }),
      status: v.union(v.literal("draft"), v.literal("published")),
      featured: v.boolean(),
      readTime: v.number(),
      publishedAt: v.optional(v.number()),
      createdAt: v.number(),
    })
  ),
  handler: async (ctx, args) => {
    let query = ctx.db.query("blogPosts");
    
    if (args.status) {
      query = query.filter((q) => q.eq(q.field("status"), args.status));
    }
    
    if (args.category) {
      query = query.filter((q) => q.eq(q.field("category"), args.category));
    }
    
    if (args.featured !== undefined) {
      query = query.filter((q) => q.eq(q.field("featured"), args.featured));
    }
    
    return await query.order("desc").collect();
  },
});

function calculateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}
```

#### 4. Create Blog Management Components
```typescript
// src/components/BlogEditor.tsx
import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import RichTextEditor from "./RichTextEditor";

interface BlogEditorProps {
  initialData?: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: string;
    tags: string[];
    status: "draft" | "published";
    featured: boolean;
  };
  onSave?: (blogId: string) => void;
}

export default function BlogEditor({ initialData, onSave }: BlogEditorProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    excerpt: initialData?.excerpt || "",
    content: initialData?.content || "",
    category: initialData?.category || "Actualités",
    tags: initialData?.tags || [],
    status: initialData?.status || "draft",
    featured: initialData?.featured || false,
  });

  const createBlogPost = useMutation(api.blog.createBlogPost);
  const updateBlogPost = useMutation(api.blog.updateBlogPost);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const blogData = {
        ...formData,
        author: {
          name: "Admin User", // Get from auth context
          role: "Administrator",
        },
        seo: {
          title: formData.title,
          description: formData.excerpt,
          keywords: formData.tags,
        },
      };

      if (initialData) {
        // Update existing post
        await updateBlogPost(blogData);
      } else {
        // Create new post
        const blogId = await createBlogPost(blogData);
        onSave?.(blogId);
      }
    } catch (error) {
      console.error("Failed to save blog post:", error);
      alert("Failed to save blog post. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="blog-editor space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Slug
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Excerpt
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Content
            </label>
            <RichTextEditor
              content={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
            />
          </div>
        </div>

        <div className="space-y-6">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="Actualités">Actualités</option>
              <option value="Événements">Événements</option>
              <option value="Succès">Succès</option>
              <option value="Pédagogie">Pédagogie</option>
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tags
            </label>
            <input
              type="text"
              value={formData.tags.join(", ")}
              onChange={(e) => setFormData({ 
                ...formData, 
                tags: e.target.value.split(",").map(tag => tag.trim()).filter(Boolean)
              })}
              placeholder="tag1, tag2, tag3"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ 
                ...formData, 
                status: e.target.value as "draft" | "published"
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          {/* Featured */}
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Featured Post
            </label>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {initialData ? "Update Post" : "Create Post"}
          </button>
        </div>
      </div>
    </form>
  );
}
```

---

## 🚀 **IMPLEMENTATION TIMELINE**

### **Week 1: Foundation**
- **Day 1**: Complete data attribution for all pages
- **Day 2**: Authentication integration and user management
- **Day 3**: Convex file storage setup and media functions
- **Day 4**: Media upload components and integration
- **Day 5**: TipTap installation and basic rich text editor

### **Week 2: Advanced Features**
- **Day 6**: Blog schema and management functions
- **Day 7**: Blog editor component and integration
- **Day 8**: Testing and bug fixes
- **Day 9**: Performance optimization
- **Day 10**: Documentation and deployment preparation

---

## 🎯 **SUCCESS METRICS**

### Technical Metrics
- **Authentication**: 100% secure edit mode access
- **Media Upload**: < 5 seconds upload time for 5MB images
- **Rich Text**: Full formatting capabilities working
- **Performance**: < 100ms additional load time

### User Experience Metrics
- **Content Attribution**: All pages have editable content marked
- **Edit Mode**: Intuitive and fast editing experience
- **Media Management**: Easy image/video upload and embedding
- **Blog Management**: Complete blog creation and editing workflow

### Business Value
- **Immediate ROI**: Content team can edit all site content
- **Rich Media**: Professional image and video management
- **Blog System**: Complete content publishing workflow
- **Scalability**: Foundation for advanced CMS features

---

**Status**: 🟡 Ready to implement
**Priority**: High - Complete content management system
**Owner**: Development team
**Timeline**: 2 weeks to full implementation 