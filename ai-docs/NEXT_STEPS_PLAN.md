# Structured Content Strategy and Next Steps

This document outlines how to handle structured content (Blog, Team, Gallery, Events, Media) separately from inline live editing, plus concrete next steps aligned with the current codebase.

## Guiding Principles
- Inline Live Edit: For page text, headings, labels, CTAs, schedules, and single images using `data-live-edit-id` and `ContentProvider`.
- Structured CMS Modules: Blog posts, team members, gallery media, events, downloads. Managed via dedicated admin UIs and Convex collections.
- Clear boundaries: Public pages render structured data read-only (no inline edit). Editors manage data in `/admin`.

## Architecture Overview
- Pages (React + Vite): Continue using `useContent()` for inline text/images.
- Convex backend:
  - `pages_content`: key/value for inline content (already implemented).
  - New collections:
    - `blog_posts`: {_id, slug, title, excerpt, content(html), coverImage, author, category, tags[], featured:boolean, status: 'draft'|'published', publishedAt:number}
    - `team_members`: {_id, name, role, photo, bio, order:number, visible:boolean}
    - `media`: {_id, storageId: Id<'_storage'>, type:'image'|'video', alt, width, height, tags[], createdAt}
    - `events` (optional): {_id, title, startAt, endAt, location, coverImage, description, status, publishedAt}
- Auth & Roles: `admin`, `editor`, `viewer`. Gate `/admin` and Convex mutations with role checks.

## Media Strategy: Convex File Storage (Single Solution)
- Use Convex File Storage for all uploads (images, videos, docs).
- Store storageId: Id<'_storage'> in the media collection with metadata (type, alt, width/height, tags, createdAt).
- Serve via short-lived signed URLs fetched at read time (ctx.storage.getUrl) or queries that enrich media with urls.
- Benefits: Simpler stack (no third-party uploader), first-party integration, type-safe, works for all file types.

## Rendering Strategy
- Blog, Team, Gallery pages read from Convex collections.
- Inline live edit stays for hero sections, static copy blocks.
- Preview mode: `?preview=true` to show drafts to authorized users.

## Admin Surface (/admin)
- Protected route with modules: Blog, Team, Gallery, Media, Events (optional).
- CRUD forms with validation, image pickers (convex), and preview links.
- Reusable components: Slug input, Rich text editor (TipTap), Image picker (convex), Publish controls.

## DX and Safety
- Centralize inline content keys (`pages_content`) naming by page.section.key.
- Wrap queries in typed helpers: `listBlogPosts(opts)`, `getBlogPost(slug)`, `saveBlogPost(input)`.
- Add function-level guards in Convex (role checks).

## Concrete Next Steps (Phased)

**Phase 1: Foundation & Initial Admin UI (Complete)**
- **[DONE]** Add Convex schemas and core queries/mutations for `blog_posts`, `team_members`, and `media`.
- **[DONE]** Scaffold a protected `/admin` shell with a sidebar and placeholder pages.
- **[DONE]** Implement basic, styled CRUD forms (Create/Read/Update) for Blog, Team, and Media modules.

**Phase 2: Admin UX & Safety Enhancements (Next Up)**
1.  **Implement User Feedback:**
    -   Add toast notifications for success/error on all form submissions.
    -   Show loading states on buttons during mutation execution.
2.  **Add Deletion with Confirmation:**
    -   Implement `deleteBlogPost`, `deleteTeamMember`, and `deleteMedia` mutations.
    -   Add "Delete" buttons to the admin UI.
    -   Implement a confirmation dialog to prevent accidental deletion.
3.  **Improve Form Error Handling:**
    -   Display server-side validation errors directly in the forms (e.g., for a non-unique slug).

**Phase 3: Feature Completion & Business Logic**
1.  **Complete Blog Module:**
    -   Create a new Convex query to fetch *all* posts (drafts and published) for the admin view.
    -   Add "Publish" and "Unpublish" buttons.
    -   Display status badges ("Draft", "Published") on each post card.
2.  **Integrate Media Library (Convex File Storage):**
    - Implement Convex upload flow (generateUploadUrl -> POST bytes -> store media record with storageId).
    - Build a reusable MediaPicker using the new flow.
    - Replace the "Cover Image" and "Photo URL" text inputs with the new MediaPicker that persists storageId.
3.  **Complete Team Module:**
    -   Display the member's photo in the list, with a fallback to the initial.

**Phase 4: Public Page Integration**
1.  **Refactor Blog Pages:**
    -   Update the public `/journal` page to use `listPublishedBlogPosts`.
    -   Update the `/journal/:slug` page to use `getBlogBySlug`.
    -   Implement preview mode for drafts.
2.  **Refactor Team Page:**
    -   Update the public `/equipe` page to use `listTeamMembers`.

**Phase 5: Advanced Features & Final Polish**
1.  **Rich Text Editor:** Integrate TipTap into the blog post form for a true WYSIWYG experience.
2.  **Drag-and-Drop Reordering:** Implement drag-and-drop for the team member list.
3.  **Authentication:** Replace temporary role checks with a full Convex authentication system.
4.  **Editor QoL:** Add autosave, optimistic updates, and other quality-of-life improvements.

## Immediate Tasks Checklist for Next Session
- [ ] **UX:** Install a toast library (e.g., `react-hot-toast`) and add success/error notifications to all forms.
- [ ] **UX:** Add loading states to form submission buttons.
- [ ] **Deletion:** Implement `deleteBlogPost` mutation and add a delete button with a confirmation dialog.
- [ ] **Blog Admin:** Create and use a new query to show all posts (drafts and published) in the admin list.
- [ ] **Blog Admin:** Add status badges and publish/unpublish buttons.
