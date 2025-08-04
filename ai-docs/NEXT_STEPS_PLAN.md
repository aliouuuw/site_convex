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
    - `media`: {_id, url, provider:'uploadthing', type:'image'|'video', alt, width, height, tags[], createdAt}
    - `events` (optional): {_id, title, startAt, endAt, location, coverImage, description, status, publishedAt}
- Auth & Roles: `admin`, `editor`, `viewer`. Gate `/admin` and Convex mutations with role checks.

## Media Strategy: UploadThing (Single Solution)
- Chosen provider: UploadThing for uploads, storage backend, CDN delivery, and simple policies.
- Use UploadThing for all structured media (blogs, gallery, team portraits, videos) and page images where convenient.
- Keep media metadata normalized in Convex (`media` collection) with `provider:'uploadthing'` and essential fields (url, width/height, alt, tags).
- Benefits: Great DX, TS-first, simple server routes, good CDN performance, straightforward integration with Vite/React.

## Rendering Strategy
- Blog, Team, Gallery pages read from Convex collections.
- Inline live edit stays for hero sections, static copy blocks.
- Preview mode: `?preview=true` to show drafts to authorized users.

## Admin Surface (/admin)
- Protected route with modules: Blog, Team, Gallery, Media, Events (optional).
- CRUD forms with validation, image pickers (UploadThing), and preview links.
- Reusable components: Slug input, Rich text editor (TipTap), Image picker (UploadThing), Publish controls.

## DX and Safety
- Centralize inline content keys (`pages_content`) naming by page.section.key.
- Wrap queries in typed helpers: `listBlogPosts(opts)`, `getBlogPost(slug)`, `saveBlogPost(input)`.
- Add function-level guards in Convex (role checks).

## Concrete Next Steps (Phased)

Phase 1: Foundation (Short)
1. Add Convex schemas:
   - `blog_posts`, `team_members`, `media` (and indexes).
   - Queries: `listPublishedBlogPosts`, `getBlogBySlug`, `listTeamMembers`, `searchMedia`.
   - Mutations: `createBlogPost`, `updateBlogPost`, `publishBlogPost`, `deleteBlogPost`, media CRUD.
2. Add `/admin` shell (protected): sidebar + placeholder cards for modules.
3. Wire role-based access in client and Convex (temporary hardcoded roles ok initially).

Phase 2: Blog Module
4. Admin UI for Blog: list, create/edit form (title, slug, excerpt, content, cover, category, featured, status, publishedAt), preview link.
5. Public Blog pages:
   - `BlogPage`: read `listPublishedBlogPosts` with pagination; keep featured support.
   - `BlogDetailPage`: read `getBlogBySlug` with `?preview=true` support.
   - Remove inline edit for blog content entirely.

Phase 3: Media Library (UploadThing)
6. Media admin with UploadThing integration:
   - Implement UploadThing uploader and callbacks.
   - Store metadata in `media` collection, enable search/filter and re-use.
   - Use media picker in Blog/Team admin forms.

Phase 4: Team Module
7. Team admin: order drag/drop, visible toggle, photo selection from media library.
8. Public team page refactor to read from `team_members`.

Phase 5: Hardening & UX
9. Auth integration (Convex auth): real roles, server guards, `preview` access.
10. Editor quality-of-life: autosave in admin, optimistic updates, toasts.
11. Optional: Events module with calendar list and detail pages.

## Key Decisions to Align On
- Media provider: UploadThing (single provider).
- Rich text editor: TipTap in admin for blog content.
- Slug strategy: auto-generate from title, ensure uniqueness via Convex index.
- Preview mode policy: query param + role-gated.

## Immediate Tasks Checklist
- [ ] Create Convex collections and queries/mutations for blog/team/media
- [ ] Scaffold `/admin` layout (protected)
- [ ] Implement Blog Admin CRUD
- [ ] Switch Blog public pages to read from Convex
- [ ] Implement Media Library with UploadThing and wire media picker
- [ ] Implement Team Admin and refactor team page
- [ ] Add role-based guards and preview handling

This plan keeps inline live-edit for simple page content and moves complex/structured content into focused admin modules, using UploadThing as the single media pipeline for consistent, developer-friendly DX.
