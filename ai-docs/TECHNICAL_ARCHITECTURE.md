# Technical Architecture: Les Hirondelles Website

## System Overview

The Les Hirondelles website is built on a modern React + Vite stack with Convex as the backend, featuring a comprehensive authentication system, live editing capabilities, and a protected admin panel. The architecture emphasizes security, performance, and user experience with complete French localization.

## Technology Stack

### Frontend
- **Framework**: React 19 + Vite 6
- **Language**: TypeScript (strict mode)
- **Routing**: React Router v7.7.0
- **Styling**: Tailwind CSS 4.0 + Custom CSS system
- **Icons**: React Icons (Font Awesome, Lucide)
- **State Management**: React Context + Convex real-time state

### Backend
- **Platform**: Convex (serverless backend)
- **Database**: Convex Database (built on FoundationDB)
- **Authentication**: Convex Auth with Password provider
- **File Storage**: Convex File Storage
- **Real-time**: Built-in real-time subscriptions

### Development Tools
- **Package Manager**: npm/bun
- **Linting**: ESLint
- **Type Checking**: TypeScript
- **Hot Reload**: Vite dev server

## Architecture Components

### 1. Authentication System ✅

**Core Components:**
```
src/
├── contexts/
│   └── AuthContext.tsx              ✅ (Convex Auth integration)
├── components/
│   ├── AuthGuard.tsx                ✅ (Route protection)
│   ├── ProfileButton.tsx            ✅ (Authentication UI)
│   ├── LoginPopover.tsx             ✅ (Login modal)
│   └── LoginPage.tsx                ✅ (Full-page login)
├── hooks/
│   └── useEditMode.ts               ✅ (Enhanced with auth checks)
└── pages/
    └── admin/                       ✅ (Protected admin routes)
```

**Authentication Flow:**
1. **User Authentication**: Convex Auth with Password provider
2. **Route Protection**: AuthGuard component for admin routes
3. **Session Management**: Automatic session expiry detection
4. **State Synchronization**: Authentication state across components

**Security Features:**
- ✅ **Route Protection**: All `/admin/*` routes require authentication
- ✅ **Edit Mode Gating**: Live edit functionality requires authentication
- ✅ **Session Security**: Automatic session expiry detection
- ✅ **Error Handling**: User-friendly French error messages

### 2. Live Edit System ✅

**Core Components:**
```
src/
├── lib/
│   └── liveEdit.ts                  ✅ (LiveEditPrototype class)
├── components/
│   ├── EditProvider.tsx             ✅ (Edit mode context with auth)
│   ├── EditModeToggle.tsx           ✅ (Toggle button with shortcuts)
│   ├── EditPanel.tsx                ✅ (Centralized editing interface)
│   └── ContentProvider.tsx          ✅ (Convex content integration)
├── hooks/
│   └── useEditMode.ts               ✅ (Edit mode state management with auth)
└── lib/
    └── contentRegistry.ts           ✅ (Content field definitions)
```

**Live Edit Features:**
- ✅ **Inline Editing**: Direct content editing on live pages
- ✅ **Real-time Persistence**: Changes saved to Convex database
- ✅ **Authentication Gating**: Edit mode requires authentication
- ✅ **Visual Feedback**: Hover effects and edit indicators
- ✅ **Keyboard Shortcuts**: Ctrl+E to toggle, Enter/Escape for actions

### 3. Admin Panel System ✅

**Admin Components:**
```
src/pages/admin/
├── AdminLayout.tsx                  ✅ (Admin interface with French localization)
├── BlogAdminPage.tsx                ✅ (Blog management)
├── BlogEditorPage.tsx               ✅ (Blog editing)
├── TestimonialsAdminPage.tsx        ✅ (Testimonials management)
├── MediaAdminPage.tsx               ✅ (Media library)
├── TeamAdminPage.tsx                ✅ (Team management)
└── TimelineAdminPage.tsx            ✅ (Timeline management)
```

**Admin Features:**
- ✅ **Protected Routes**: All admin routes require authentication
- ✅ **CRUD Operations**: Create, read, update, delete for all content types
- ✅ **French Localization**: Complete French language support
- ✅ **Real-time Updates**: Live content updates across admin interface
- ✅ **Media Management**: File upload and management capabilities

### 4. Content Management System ✅

**Content Structure:**
```typescript
// Convex Schema
export default defineSchema({
  // Content management
  content: defineTable({
    page: v.string(),
    section: v.string(),
    key: v.string(),
    value: v.string(),
    type: v.union(v.literal("text"), v.literal("rich_text"), v.literal("image")),
    updatedAt: v.number(),
  }).index("by_page_section", ["page", "section"])
    .index("by_key", ["key"]),
    
  // Blog system
  blog_posts: defineTable({
    title: v.string(),
    slug: v.string(),
    excerpt: v.optional(v.string()),
    contentHtml: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    category: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    author: v.optional(v.string()),
    status: v.union(v.literal("draft"), v.literal("published")),
    featured: v.optional(v.boolean()),
    publishedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_slug", ["slug"])
    .index("by_status_publishedAt", ["status", "publishedAt"])
    .index("by_featured", ["featured"]),
    
  // Team management
  team_members: defineTable({
    name: v.string(),
    position: v.string(),
    bio: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    order: v.number(),
    active: v.boolean(),
  }).index("by_order", ["order"]),
    
  // Media management
  media_files: defineTable({
    filename: v.string(),
    originalName: v.string(),
    contentType: v.string(),
    size: v.number(),
    url: v.string(),
    thumbnailUrl: v.optional(v.string()),
    alt: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    uploadedBy: v.optional(v.string()),
    uploadedAt: v.number(),
  }).index("by_uploadedAt", ["uploadedAt"])
    .index("by_contentType", ["contentType"]),
    
  // Testimonials
  testimonials: defineTable({
    author: v.string(),
    content: v.string(),
    rating: v.optional(v.number()),
    authorImage: v.optional(v.string()),
    authorTitle: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    order: v.number(),
    active: v.boolean(),
  }).index("by_order", ["order"])
    .index("by_featured", ["featured"]),
    
  // Timeline
  timeline_entries: defineTable({
    title: v.string(),
    description: v.string(),
    date: v.number(),
    image: v.optional(v.string()),
    category: v.optional(v.string()),
    order: v.number(),
    active: v.boolean(),
  }).index("by_date", ["date"])
    .index("by_order", ["order"]),
});
```

## Component Architecture

### Current Components ✅
```
src/
├── components/
│   ├── Navigation.tsx               ✅ (Header navigation with auth)
│   ├── Footer.tsx                   ✅ (Site footer)
│   ├── ImageSlider.tsx              ✅ (Hero carousel)
│   ├── ScrollToTop.tsx              ✅ (Scroll behavior)
│   ├── EditProvider.tsx             ✅ (Edit mode context with auth)
│   ├── EditModeToggle.tsx           ✅ (Edit controls)
│   ├── EditPanel.tsx                ✅ (Centralized editing interface)
│   ├── ContentProvider.tsx          ✅ (Content context)
│   ├── AuthGuard.tsx                ✅ (Route protection)
│   ├── ProfileButton.tsx            ✅ (Authentication UI)
│   ├── LoginPopover.tsx             ✅ (Login modal)
│   └── LoginPage.tsx                ✅ (Full-page authentication)
├── hooks/
│   └── useEditMode.ts               ✅ (Edit mode state with auth)
├── lib/
│   ├── liveEdit.ts                  ✅ (Live edit engine)
│   └── contentRegistry.ts           ✅ (Content field definitions)
└── pages/                           ✅ (All pages with auth integration)
    ├── HomePage.tsx                 ✅ (Complete with live edit + auth)
    ├── AboutPage.tsx                ✅ (Complete)
    ├── ContactPage.tsx              ✅ (Complete)
    ├── InscriptionPage.tsx          ✅ (Complete)
    ├── LoginPage.tsx                ✅ (Authentication)
    ├── NotFoundPage.tsx             ✅ (Complete)
    └── admin/                       ✅ (Protected admin pages)
        ├── AdminLayout.tsx          ✅ (Admin interface)
        ├── BlogAdminPage.tsx        ✅ (Blog management)
        ├── BlogEditorPage.tsx       ✅ (Blog editing)
        ├── TestimonialsAdminPage.tsx ✅ (Testimonials)
        ├── MediaAdminPage.tsx       ✅ (Media library)
        ├── TeamAdminPage.tsx        ✅ (Team management)
        └── TimelineAdminPage.tsx    ✅ (Timeline management)
```

## API Architecture

### Current Convex Functions ✅
```typescript
// convex/content.ts
export const updateContent = mutation({...}) ✅
export const getContent = query({...}) ✅
export const getContentByPage = query({...}) ✅
export const getAllContent = query({...}) ✅

// convex/auth.ts
export const getCurrentUser = query({...}) ✅

// convex/blog.ts
export const listAllBlogPosts = query({...}) ✅
export const getBlogPost = query({...}) ✅
export const createBlogPost = mutation({...}) ✅
export const updateBlogPost = mutation({...}) ✅
export const deleteBlogPost = mutation({...}) ✅
export const publishBlogPost = mutation({...}) ✅
export const unpublishBlogPost = mutation({...}) ✅
export const countBlogPosts = query({...}) ✅

// convex/team.ts
export const listAllTeamMembers = query({...}) ✅
export const createTeamMember = mutation({...}) ✅
export const updateTeamMember = mutation({...}) ✅
export const deleteTeamMember = mutation({...}) ✅
export const countTeamMembers = query({...}) ✅

// convex/media.ts
export const listAllMediaFiles = query({...}) ✅
export const generateUploadUrl = mutation({...}) ✅
export const storeMediaRecord = mutation({...}) ✅
export const deleteMediaFile = mutation({...}) ✅
export const countMediaFiles = query({...}) ✅

// convex/testimonials.ts
export const listAllTestimonials = query({...}) ✅
export const createTestimonial = mutation({...}) ✅
export const updateTestimonial = mutation({...}) ✅
export const deleteTestimonial = mutation({...}) ✅

// convex/timeline.ts
export const listAllTimelineEntries = query({...}) ✅
export const createTimelineEntry = mutation({...}) ✅
export const updateTimelineEntry = mutation({...}) ✅
export const deleteTimelineEntry = mutation({...}) ✅
export const countTimelineEntries = query({...}) ✅
```

## Security Architecture

### Authentication & Authorization
- **Convex Auth**: Secure authentication with Password provider
- **Route Protection**: AuthGuard component for admin routes
- **Session Management**: Automatic session expiry detection
- **Access Control**: Edit mode gated behind authentication

### Data Security
- **Input Validation**: Convex validators for all data
- **Type Safety**: TypeScript strict mode throughout
- **Error Handling**: Graceful error handling with user feedback
- **Session Security**: Secure session management

## Performance Architecture

### Frontend Performance
- **Vite Build**: Fast development and optimized production builds
- **Code Splitting**: Automatic code splitting by routes
- **Lazy Loading**: Components loaded on demand
- **State Optimization**: Efficient React state management

### Backend Performance
- **Convex Database**: High-performance FoundationDB backend
- **Real-time Subscriptions**: Efficient real-time updates
- **Caching**: Built-in caching for queries
- **Serverless**: Automatic scaling and optimization

## Deployment Architecture

### Development Environment
- **Local Development**: Vite dev server with hot reload
- **Convex Dev**: Local Convex development environment
- **TypeScript**: Strict type checking
- **ESLint**: Code quality enforcement

### Production Environment
- **Vercel**: Frontend deployment platform
- **Convex**: Backend deployment platform
- **CDN**: Global content delivery
- **SSL**: Secure HTTPS connections

## Monitoring & Analytics

### Error Tracking
- **Error Boundaries**: React error boundaries for graceful error handling
- **Console Logging**: Structured logging for debugging
- **User Feedback**: User-friendly error messages

### Performance Monitoring
- **Vite Metrics**: Build and runtime performance metrics
- **Convex Analytics**: Backend performance monitoring
- **User Experience**: Real user monitoring

## Future Enhancements

### Planned Features
- **Role-Based Access**: Different permission levels for users
- **Multi-Factor Authentication**: Additional security layer
- **Content Workflow**: Draft/publish states and approval workflow
- **SEO Tools**: Meta tag management and SEO optimization
- **Analytics Integration**: User behavior tracking and analytics

### Technical Improvements
- **Service Workers**: Offline support and caching
- **Progressive Web App**: PWA capabilities
- **Internationalization**: Multi-language support beyond French
- **Advanced Media**: Video embedding and advanced media management

## Implementation Status: ✅ PRODUCTION READY

The Les Hirondelles website architecture is complete and production-ready with:

- ✅ **Complete Authentication System**: Secure login/logout with French localization
- ✅ **Live Edit System**: Inline content editing with authentication gating
- ✅ **Admin Panel**: Protected content management interface
- ✅ **Real-time Updates**: Live content synchronization
- ✅ **Responsive Design**: Mobile-first approach
- ✅ **Performance Optimized**: Fast loading and efficient state management
- ✅ **Security Hardened**: Route protection and session management
- ✅ **French Localization**: Complete French language support

The architecture provides a solid foundation for future enhancements while delivering a professional, secure, and user-friendly experience for the Les Hirondelles school website.
