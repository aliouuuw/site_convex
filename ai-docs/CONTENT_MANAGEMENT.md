# Content Management Strategy - Les Hirondelles Website

## Overview

This document outlines the comprehensive content management strategy for the Les Hirondelles website migration from NextJS + Sanity to React + Vite + Convex. The new system will provide an intuitive, powerful content management experience while maintaining the site's sophisticated design and functionality.

## Content Architecture

### Content Types Hierarchy

```
├── Pages (Static Content)
│   ├── Homepage
│   ├── About
│   ├── Contact
│   └── Admissions
│
├── Programs
│   ├── Preschool (3-5 years)
│   ├── Primary (6-11 years)
│   └── Middle School (11-15 years)
│
├── Blog & News
│   ├── Articles
│   ├── Events
│   └── Announcements
│
├── Media Assets
│   ├── Images
│   ├── Documents
│   └── Videos
│
├── Team & Leadership
│   └── Staff Profiles
│
└── Settings
    ├── Site Configuration
    ├── Contact Information
    └── SEO Settings
```

## Convex Schema Design

### Core Content Types

#### 1. Pages Schema
```typescript
// convex/schema.ts
export const pages = defineTable({
  slug: v.string(),
  title: v.string(),
  metaTitle: v.optional(v.string()),
  metaDescription: v.optional(v.string()),
  content: v.array(v.object({
    type: v.string(), // "hero", "section", "grid", "text", "image"
    data: v.any()
  })),
  seo: v.object({
    title: v.string(),
    description: v.string(),
    keywords: v.array(v.string()),
    ogImage: v.optional(v.string())
  }),
  status: v.union(v.literal("draft"), v.literal("published")),
  publishedAt: v.optional(v.number()),
  createdAt: v.number(),
  updatedAt: v.number(),
  lastModifiedBy: v.id("users")
}).index("by_slug", ["slug"]);
```

#### 2. Blog Posts Schema
```typescript
export const blogPosts = defineTable({
  title: v.string(),
  slug: v.string(),
  excerpt: v.string(),
  content: v.string(), // Rich text HTML
  featuredImage: v.optional(v.string()),
  category: v.string(), // "Actualités", "Événements", "Succès", etc.
  tags: v.array(v.string()),
  author: v.object({
    name: v.string(),
    role: v.string(),
    avatar: v.optional(v.string())
  }),
  seo: v.object({
    title: v.string(),
    description: v.string(),
    keywords: v.array(v.string())
  }),
  status: v.union(v.literal("draft"), v.literal("published")),
  featured: v.boolean(),
  publishedAt: v.optional(v.number()),
  readTime: v.number(), // minutes
  createdAt: v.number(),
  updatedAt: v.number(),
  lastModifiedBy: v.id("users")
}).index("by_slug", ["slug"])
  .index("by_status", ["status"])
  .index("by_category", ["category"])
  .index("by_published_date", ["publishedAt"]);
```

#### 3. Programs Schema
```typescript
export const programs = defineTable({
  name: v.string(), // "Préscolaire", "Primaire", "Collège"
  slug: v.string(),
  ageRange: v.string(), // "3-5 ans"
  description: v.string(),
  heroImage: v.string(),
  features: v.array(v.object({
    icon: v.string(),
    title: v.string(),
    description: v.string()
  })),
  curriculum: v.array(v.object({
    subject: v.string(),
    description: v.string(),
    hours: v.string()
  })),
  schedule: v.array(v.object({
    time: v.string(),
    activity: v.string()
  })),
  achievements: v.array(v.object({
    icon: v.string(),
    title: v.string(),
    description: v.string()
  })),
  gallery: v.array(v.string()), // Image URLs
  order: v.number(),
  status: v.union(v.literal("draft"), v.literal("published")),
  createdAt: v.number(),
  updatedAt: v.number(),
  lastModifiedBy: v.id("users")
}).index("by_slug", ["slug"])
  .index("by_order", ["order"]);
```

#### 4. Team Members Schema
```typescript
export const teamMembers = defineTable({
  name: v.string(),
  role: v.string(),
  department: v.string(), // "Direction", "Pédagogie", "Administration"
  bio: v.string(),
  photo: v.string(),
  email: v.optional(v.string()),
  phone: v.optional(v.string()),
  qualifications: v.array(v.string()),
  experience: v.string(),
  order: v.number(),
  featured: v.boolean(), // For leadership team
  status: v.union(v.literal("active"), v.literal("inactive")),
  createdAt: v.number(),
  updatedAt: v.number(),
  lastModifiedBy: v.id("users")
}).index("by_department", ["department"])
  .index("by_order", ["order"])
  .index("by_featured", ["featured"]);
```

#### 5. Site Settings Schema
```typescript
export const siteSettings = defineTable({
  key: v.string(), // Unique identifier
  section: v.string(), // "contact", "seo", "social", "general"
  data: v.any(),
  description: v.string(),
  updatedAt: v.number(),
  lastModifiedBy: v.id("users")
}).index("by_key", ["key"])
  .index("by_section", ["section"]);
```

#### 6. Media Assets Schema
```typescript
export const mediaAssets = defineTable({
  filename: v.string(),
  originalName: v.string(),
  mimeType: v.string(),
  size: v.number(),
  url: v.string(),
  alt: v.string(),
  caption: v.optional(v.string()),
  tags: v.array(v.string()),
  folder: v.string(), // "hero", "programs", "blog", "team"
  uploadedBy: v.id("users"),
  createdAt: v.number()
}).index("by_folder", ["folder"])
  .index("by_tags", ["tags"]);
```

#### 7. Users & Permissions Schema
```typescript
export const users = defineTable({
  email: v.string(),
  name: v.string(),
  role: v.union(
    v.literal("super_admin"),
    v.literal("admin"),
    v.literal("editor"),
    v.literal("author")
  ),
  avatar: v.optional(v.string()),
  permissions: v.array(v.string()),
  status: v.union(v.literal("active"), v.literal("inactive")),
  lastLogin: v.optional(v.number()),
  createdAt: v.number(),
  updatedAt: v.number()
}).index("by_email", ["email"])
  .index("by_role", ["role"]);
```

## User Roles & Permissions

### Role Hierarchy

#### 1. Super Admin
**Permissions:**
- Full system access
- User management
- System settings
- Content management
- Media management
- Analytics access

**Typical Users:**
- Technical administrators
- IT department

#### 2. Admin
**Permissions:**
- Content management (all)
- Media management
- User management (limited)
- Site settings (limited)
- Analytics access

**Typical Users:**
- School directors
- Communications managers

#### 3. Editor
**Permissions:**
- Content editing (all content types)
- Media upload and management
- Publish/unpublish content
- SEO management

**Typical Users:**
- Content managers
- Marketing staff
- Administrative assistants

#### 4. Author
**Permissions:**
- Create and edit own content
- Submit for review
- Upload media
- Limited publishing rights

**Typical Users:**
- Teachers
- Department heads
- Guest contributors

### Permission Matrix

```yaml
Content Types:
  Pages:
    super_admin: [create, read, update, delete, publish]
    admin: [create, read, update, delete, publish]
    editor: [create, read, update, publish]
    author: [read, update_own]

  Blog Posts:
    super_admin: [create, read, update, delete, publish]
    admin: [create, read, update, delete, publish]
    editor: [create, read, update, publish]
    author: [create, read, update_own, submit_for_review]

  Programs:
    super_admin: [create, read, update, delete, publish]
    admin: [create, read, update, delete, publish]
    editor: [read, update, publish]
    author: [read]

  Team Members:
    super_admin: [create, read, update, delete]
    admin: [create, read, update, delete]
    editor: [read, update]
    author: [read, update_own]

  Settings:
    super_admin: [read, update]
    admin: [read, update_limited]
    editor: [read]
    author: [read]

  Media:
    super_admin: [upload, read, update, delete]
    admin: [upload, read, update, delete]
    editor: [upload, read, update]
    author: [upload, read, update_own]
```

## Content Management Interface Design

### Admin Dashboard Layout

#### 1. Main Navigation
```
┌─────────────────────────────────────────────────────────────┐
│ Les Hirondelles Admin                           [User Menu] │
├─────────────────────────────────────────────────────────────┤
│ 📊 Dashboard                                                │
│ 📄 Pages                                                    │
│ 📝 Blog & News                                             │
│ 🎓 Programs                                                 │
│ 👥 Team                                                     │
│ 🖼️  Media                                                   │
│ ⚙️  Settings                                                │
│ 👤 Users (Admin only)                                      │
│ 📈 Analytics                                               │
└─────────────────────────────────────────────────────────────┘
```

#### 2. Dashboard Overview
```typescript
// Dashboard components
interface DashboardStats {
  totalPosts: number;
  draftPosts: number;
  totalViews: number;
  recentActivity: Activity[];
  quickActions: QuickAction[];
}

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
      <StatsGrid stats={stats} />
      <RecentActivity activities={recentActivity} />
      <QuickActions actions={quickActions} />
      <ContentOverview />
    </div>
  );
};
```

#### 3. Content Editor Interface
```typescript
// Rich text editor with custom blocks
interface ContentEditor {
  content: ContentBlock[];
  onChange: (content: ContentBlock[]) => void;
  autosave: boolean;
}

const ContentEditor: React.FC<ContentEditor> = ({ content, onChange }) => {
  return (
    <div className="content-editor">
      <EditorToolbar />
      <BlockEditor
        blocks={content}
        onChange={onChange}
        plugins={[
          ImagePlugin,
          LinkPlugin,
          ListPlugin,
          QuotePlugin,
          CodePlugin
        ]}
      />
      <EditorSidebar>
        <SEOPanel />
        <MediaLibrary />
        <PublishPanel />
      </EditorSidebar>
    </div>
  );
};
```

### Content Editing Workflows

#### 1. Blog Post Creation Workflow
```
1. Create New Post
   ├── Basic Information (Title, Slug, Category)
   ├── Content Creation (Rich Text Editor)
   ├── Media Selection (Featured Image, Gallery)
   ├── SEO Optimization (Meta Tags, Keywords)
   ├── Author Information
   └── Publishing Options

2. Review Process
   ├── Save as Draft
   ├── Submit for Review (Author role)
   ├── Editor Review & Approval
   └── Publish

3. Post-Publication
   ├── Analytics Tracking
   ├── Social Media Sharing
   ├── SEO Monitoring
   └── Content Updates
```

#### 2. Page Content Management
```
1. Page Selection
   ├── Homepage Sections
   ├── About Page Content
   ├── Contact Information
   └── Program Pages

2. Section-Based Editing
   ├── Hero Section Editor
   ├── Content Block Manager
   ├── Image Gallery Manager
   └── Form Builder

3. Preview & Publish
   ├── Desktop Preview
   ├── Mobile Preview
   ├── SEO Preview
   └── Publish Changes
```

## Content Types & Templates

### Homepage Content Management

#### 1. Hero Section
```typescript
interface HeroSection {
  title: string;
  subtitle: string;
  description: string;
  backgroundImages: string[]; // Image slider
  ctaButtons: {
    primary: { text: string; url: string };
    secondary: { text: string; url: string };
  };
  stats: {
    students: number;
    successRate: number;
    experience: number;
  };
}
```

#### 2. Programs Section
```typescript
interface ProgramsSection {
  title: string;
  description: string;
  programs: {
    id: string;
    title: string;
    ageRange: string;
    description: string;
    image: string;
    highlights: string[];
    link: string;
  }[];
}
```

#### 3. Mission Section
```typescript
interface MissionSection {
  title: string;
  description: string;
  mainText: string;
  image: string;
  values: {
    icon: string;
    title: string;
    description: string;
  }[];
}
```

#### 4. News Section
```typescript
interface NewsSection {
  title: string;
  description: string;
  featuredPost: string; // Blog post ID
  recentPosts: string[]; // Blog post IDs
  ctaText: string;
  ctaUrl: string;
}
```

#### 5. Testimonials Section
```typescript
interface TestimonialsSection {
  title: string;
  testimonials: {
    quote: string;
    author: string;
    role: string;
    image: string;
  }[];
}
```

### Rich Text Content Blocks

#### 1. Text Block
```typescript
interface TextBlock {
  type: "text";
  content: string; // Rich HTML
  alignment: "left" | "center" | "right";
  style: "normal" | "lead" | "small";
}
```

#### 2. Image Block
```typescript
interface ImageBlock {
  type: "image";
  src: string;
  alt: string;
  caption?: string;
  size: "small" | "medium" | "large" | "full";
  alignment: "left" | "center" | "right";
}
```

#### 3. Gallery Block
```typescript
interface GalleryBlock {
  type: "gallery";
  images: {
    src: string;
    alt: string;
    caption?: string;
  }[];
  layout: "grid" | "carousel" | "masonry";
  columns: 2 | 3 | 4;
}
```

#### 4. Quote Block
```typescript
interface QuoteBlock {
  type: "quote";
  text: string;
  author?: string;
  cite?: string;
  style: "standard" | "pullquote" | "blockquote";
}
```

#### 5. Call-to-Action Block
```typescript
interface CTABlock {
  type: "cta";
  title: string;
  description: string;
  buttons: {
    text: string;
    url: string;
    style: "primary" | "secondary";
  }[];
  background: "light" | "dark" | "primary" | "accent";
}
```

## Media Management

### Asset Organization

#### 1. Folder Structure
```
Media Library
├── Hero Images
│   ├── Homepage Slider
│   ├── Page Headers
│   └── Background Images
├── Programs
│   ├── Preschool
│   ├── Primary
│   └── Middle School
├── Blog & News
│   ├── Featured Images
│   ├── Article Images
│   └── Event Photos
├── Team & Staff
│   ├── Leadership
│   ├── Teachers
│   └── Staff
├── About
│   ├── School History
│   ├── Facilities
│   └── Values
└── Documents
    ├── Brochures
    ├── Forms
    └── Policies
```

#### 2. Image Processing Pipeline
```typescript
interface ImageProcessing {
  upload: (file: File) => Promise<ProcessedImage>;
  resize: (sizes: ImageSize[]) => ProcessedImage[];
  optimize: (quality: number) => ProcessedImage;
  generateWebP: () => ProcessedImage;
  extractMetadata: () => ImageMetadata;
}

interface ImageSize {
  name: string; // "thumbnail", "medium", "large", "hero"
  width: number;
  height?: number;
  quality: number;
}
```

#### 3. Media Library Interface
```typescript
const MediaLibrary: React.FC = () => {
  return (
    <div className="media-library">
      <MediaToolbar>
        <UploadButton />
        <SearchInput />
        <FilterDropdown />
        <ViewToggle />
      </MediaToolbar>
      
      <FolderNavigation />
      
      <MediaGrid>
        {assets.map(asset => (
          <MediaItem
            key={asset.id}
            asset={asset}
            onSelect={handleSelect}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </MediaGrid>
      
      <MediaPagination />
    </div>
  );
};
```

## SEO & Multilingual Strategy

### SEO Management

#### 1. Page-Level SEO
```typescript
interface SEOSettings {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: "summary" | "summary_large_image";
  structuredData?: any;
  robots?: string;
}
```

#### 2. Global SEO Settings
```typescript
interface GlobalSEO {
  siteName: string;
  siteDescription: string;
  defaultKeywords: string[];
  defaultOGImage: string;
  favicon: string;
  appleTouchIcon: string;
  googleAnalyticsId?: string;
  googleTagManagerId?: string;
  facebookPixelId?: string;
}
```

#### 3. SEO Monitoring
```typescript
interface SEOMetrics {
  pageViews: number;
  bounceRate: number;
  averageSessionDuration: number;
  searchRankings: {
    keyword: string;
    position: number;
    change: number;
  }[];
  backlinks: number;
  socialShares: number;
}
```

### Content Localization (Future)

#### 1. Language Structure
```typescript
interface LocalizedContent {
  fr: ContentData; // Primary language
  en?: ContentData; // Optional English
  ar?: ContentData; // Optional Arabic
}

interface LanguageSettings {
  defaultLanguage: "fr";
  supportedLanguages: ("fr" | "en" | "ar")[];
  fallbackLanguage: "fr";
  rtlLanguages: ("ar")[];
}
```

## Publishing Workflows

### Content Review Process

#### 1. Draft → Review → Publish
```typescript
enum ContentStatus {
  DRAFT = "draft",
  PENDING_REVIEW = "pending_review",
  APPROVED = "approved",
  PUBLISHED = "published",
  ARCHIVED = "archived"
}

interface ContentWorkflow {
  currentStatus: ContentStatus;
  history: {
    status: ContentStatus;
    timestamp: number;
    user: string;
    comment?: string;
  }[];
  assignedReviewer?: string;
  publishSchedule?: number;
}
```

#### 2. Approval Notifications
```typescript
interface NotificationSystem {
  onStatusChange: (content: Content, newStatus: ContentStatus) => void;
  onAssignReviewer: (content: Content, reviewer: User) => void;
  onCommentAdded: (content: Content, comment: Comment) => void;
  onPublishScheduled: (content: Content, publishDate: Date) => void;
}
```

### Scheduled Publishing

#### 1. Content Scheduling
```typescript
interface ScheduledContent {
  contentId: string;
  publishAt: number;
  timezone: string;
  recurringPattern?: {
    frequency: "daily" | "weekly" | "monthly";
    interval: number;
    endDate?: number;
  };
  status: "scheduled" | "published" | "failed";
}
```

#### 2. Automated Publishing
```typescript
// Convex scheduled function
export const publishScheduledContent = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const scheduledContent = await ctx.db
      .query("scheduledContent")
      .filter(q => q.and(
        q.lte(q.field("publishAt"), now),
        q.eq(q.field("status"), "scheduled")
      ))
      .collect();

    for (const item of scheduledContent) {
      await publishContent(ctx, item.contentId);
      await ctx.db.patch(item._id, { status: "published" });
    }
  }
});
```

## Analytics & Insights

### Content Performance Tracking

#### 1. Page Analytics
```typescript
interface PageAnalytics {
  pageViews: number;
  uniqueVisitors: number;
  bounceRate: number;
  averageTimeOnPage: number;
  exitRate: number;
  conversions: number;
  topReferrers: string[];
  searchKeywords: string[];
}
```

#### 2. Content Insights
```typescript
interface ContentInsights {
  mostViewedPages: PageAnalytics[];
  popularBlogPosts: BlogPost[];
  topSearchQueries: string[];
  userEngagement: {
    commentsCount: number;
    sharesCount: number;
    newsletterSignups: number;
    contactFormSubmissions: number;
  };
  contentGaps: {
    searchQuery: string;
    frequency: number;
    suggestedContent: string;
  }[];
}
```

### Dashboard Metrics

#### 1. Content Management KPIs
```typescript
interface ContentKPIs {
  contentVelocity: number; // Posts per week
  publishingConsistency: number; // % of scheduled posts published on time
  contentQuality: number; // Based on engagement metrics
  teamProductivity: {
    user: string;
    postsCreated: number;
    avgTimeToPublish: number;
  }[];
}
```

## Migration Strategy

### Content Migration Plan

#### 1. Data Export from Current System
```typescript
interface MigrationData {
  pages: CurrentPageData[];
  blogPosts: CurrentBlogData[];
  media: CurrentMediaData[];
  settings: CurrentSettingsData;
}

interface MigrationMapping {
  fieldMappings: {
    oldField: string;
    newField: string;
    transformer?: (value: any) => any;
  }[];
  contentTransformers: {
    type: string;
    transformer: (content: any) => ContentBlock[];
  }[];
}
```

#### 2. Migration Scripts
```typescript
// Migration utilities
export const migrateBlogPosts = async (posts: CurrentBlogData[]) => {
  for (const post of posts) {
    const migratedPost = {
      title: post.title,
      slug: generateSlug(post.title),
      content: transformRichText(post.content),
      featuredImage: await migrateImage(post.featuredImage),
      category: mapCategory(post.category),
      publishedAt: post.publishedAt,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      status: "published" as const
    };
    
    await db.insert("blogPosts", migratedPost);
  }
};
```

#### 3. Content Validation
```typescript
interface ValidationRules {
  required: string[];
  maxLength: { [field: string]: number };
  format: { [field: string]: RegExp };
  custom: { [field: string]: (value: any) => boolean };
}

const validateContent = (content: any, rules: ValidationRules): ValidationResult => {
  const errors: string[] = [];
  
  // Validation logic
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
```

## Content Security & Backup

### Security Measures

#### 1. Input Sanitization
```typescript
import DOMPurify from 'dompurify';

const sanitizeContent = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'img', 'blockquote'],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class']
  });
};
```

#### 2. Access Control
```typescript
const checkPermission = (user: User, action: string, resource: string): boolean => {
  const userPermissions = getUserPermissions(user.role);
  return userPermissions.includes(`${action}:${resource}`);
};
```

### Backup Strategy

#### 1. Automated Backups
```typescript
// Daily backup function
export const createBackup = internalMutation({
  args: {},
  handler: async (ctx) => {
    const timestamp = Date.now();
    const backup = {
      timestamp,
      pages: await ctx.db.query("pages").collect(),
      blogPosts: await ctx.db.query("blogPosts").collect(),
      programs: await ctx.db.query("programs").collect(),
      teamMembers: await ctx.db.query("teamMembers").collect(),
      settings: await ctx.db.query("siteSettings").collect()
    };
    
    // Store backup in external service
    await storeBackup(backup);
  }
});
```

#### 2. Recovery Procedures
```typescript
const restoreFromBackup = async (backupId: string) => {
  const backup = await retrieveBackup(backupId);
  
  // Restore content with validation
  for (const [table, data] of Object.entries(backup)) {
    if (table !== 'timestamp') {
      await restoreTable(table, data);
    }
  }
};
```

## Training & Documentation

### User Training Materials

#### 1. Admin User Guide
- System overview and navigation
- Content creation workflows
- Media management
- SEO optimization
- Publishing procedures
- User management

#### 2. Editor Quick Start Guide
- Basic content editing
- Rich text editor usage
- Image insertion and optimization
- SEO best practices
- Content review process

#### 3. Video Tutorials
- Homepage content management
- Blog post creation
- Program information updates
- Team member management
- Media library usage

### Support Documentation

#### 1. Troubleshooting Guide
- Common issues and solutions
- Error message explanations
- Performance optimization tips
- Browser compatibility notes

#### 2. Best Practices
- Content writing guidelines
- Image optimization standards
- SEO optimization checklist
- Accessibility guidelines

This comprehensive content management strategy ensures that the Les Hirondelles website will have a powerful, user-friendly system for managing all aspects of their digital presence while maintaining the high-quality design and functionality of the original site.