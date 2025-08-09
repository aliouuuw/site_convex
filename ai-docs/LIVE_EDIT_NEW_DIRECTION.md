# Live Edit New Direction: Centralized Panel Approach

## Overview

The current live editing system has individual editable items highlighted and clickable throughout the page, which creates a cluttered and confusing user experience. This document outlines a new approach using a centralized editing panel that provides better UX and cleaner interface.

## Current Problems

1. **Visual Clutter**: Every editable item is highlighted, making the page look busy
2. **Accidental Clicks**: Users might accidentally click on editable elements while browsing
3. **Inconsistent UX**: Different types of content (text, images, sliders) have different editing behaviors
4. **Poor Mobile Experience**: Small touch targets and overlapping elements
5. **No Context**: Users can't see all editable content at once

## New Direction: Centralized Editing Panel

### Core Concept

Instead of making individual elements clickable, we'll implement a **centralized editing panel** that:
- Shows all editable content for the **current page only**
- Provides a clean, organized interface for editing
- Keeps the main page clean and uncluttered
- Offers better mobile experience

### Page-Based Content Organization

**Key Principle**: Each page has its own set of editable content, and the edit panel only shows content relevant to the current page.

**Benefits**:
- **Focused editing**: Users only see content they can actually edit
- **Better performance**: Only load content for the current page
- **Cleaner organization**: Content is logically grouped by page
- **Scalable**: Easy to add new pages without affecting existing ones

**Example Structure**:
```
Page: Home
├── Hero Section
│   ├── Title
│   ├── Description
│   ├── Background Images
│   └── Statistics
├── Programs Section
│   ├── Section Title
│   ├── Section Description
│   └── Program Images
└── Mission Section
    ├── Title
    ├── Description
    └── Mission Image

Page: About
├── Hero Section
│   ├── Title
│   ├── Description
│   └── Hero Image
└── History Section
    ├── Title
    └── Content

Page: Contact
├── Hero Section
│   ├── Title
│   └── Description
└── Form Section
    ├── Title
    └── Description
```

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Main Page (Clean)                        │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ Hero Section (No highlights, clean display)            │ │
│  │ - Background images (managed via panel)                │ │
│  │ - Text content (managed via panel)                     │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ Programs Section (No highlights)                       │ │
│  │ - Images and text managed via panel                    │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ Mission Section (No highlights)                        │ │
│  │ - Content managed via panel                            │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    Edit Panel (Floating)                   │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ 📝 Page Content Editor                                 │ │
│  │ ┌─────────────────────────────────────────────────────┐ │ │
│  │ │ Hero Section                                       │ │ │
│  │ │ ├─ Background Images [Manage]                      │ │ │
│  │ │ ├─ Title [Edit]                                    │ │ │
│  │ │ ├─ Description [Edit]                              │ │ │
│  │ │ └─ Stats [Edit]                                    │ │ │
│  │ └─────────────────────────────────────────────────────┘ │ │
│  │ ┌─────────────────────────────────────────────────────┐ │ │
│  │ │ Programs Section                                   │ │ │
│  │ │ ├─ Section Title [Edit]                            │ │ │
│  │ │ ├─ Section Description [Edit]                      │ │ │
│  │ │ ├─ Program 1 [Edit]                                │ │ │
│  │ │ ├─ Program 2 [Edit]                                │ │ │
│  │ │ └─ Program 3 [Edit]                                │ │ │
│  │ └─────────────────────────────────────────────────────┘ │ │
│  │ ┌─────────────────────────────────────────────────────┐ │ │
│  │ │ Mission Section                                    │ │ │
│  │ │ ├─ Title [Edit]                                    │ │ │
│  │ │ ├─ Description [Edit]                              │ │ │
│  │ │ └─ Image [Manage]                                  │ │ │
│  │ └─────────────────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Implementation Plan

### Phase 1: Core Infrastructure

#### 1.1 Edit Panel Component
```typescript
// components/EditPanel.tsx
interface EditPanelProps {
  page: string; // Current page identifier (e.g., 'home', 'about', 'contact')
  isOpen: boolean;
  onClose: () => void;
}

interface EditableItem {
  id: string; // Unique identifier within the page (e.g., 'hero.title', 'programs.description')
  type: 'text' | 'image' | 'imageSlider' | 'richText';
  label: string; // Human-readable label for the UI
  currentValue: any; // Current content value
  section: string; // Section within the page (e.g., 'hero', 'programs', 'mission')
  page: string; // Page this item belongs to
}

// The panel only shows content for the current page
const EditPanel: React.FC<EditPanelProps> = ({ page, isOpen, onClose }) => {
  // Get content registry for the current page only
  const pageContent = contentRegistry[page] || {};
  
  return (
    <div className={`edit-panel ${isOpen ? 'open' : ''}`}>
      <div className="panel-header">
        <h2>Edit {page.charAt(0).toUpperCase() + page.slice(1)} Page</h2>
        <button onClick={onClose}>✕</button>
      </div>
      
      <div className="panel-content">
        {Object.entries(pageContent).map(([section, items]) => (
          <div key={section} className="content-section">
            <h3>{section.charAt(0).toUpperCase() + section.slice(1)}</h3>
            {items.map((item) => (
              <EditableItemComponent key={item.id} item={item} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
```

#### 1.2 Content Registry System
```typescript
// lib/contentRegistry.ts
interface ContentRegistry {
  [pageId: string]: {
    [sectionId: string]: EditableItem[];
  };
}

// Register all editable content BY PAGE
const contentRegistry: ContentRegistry = {
  'home': {
    'hero': [
      { id: 'hero.title', type: 'text', label: 'Hero Title', section: 'hero' },
      { id: 'hero.description', type: 'text', label: 'Hero Description', section: 'hero' },
      { id: 'hero.background', type: 'imageSlider', label: 'Background Images', section: 'hero' },
      { id: 'hero.stats.students', type: 'text', label: 'Students Count', section: 'hero' },
      { id: 'hero.stats.success', type: 'text', label: 'Success Rate', section: 'hero' },
      { id: 'hero.stats.years', type: 'text', label: 'Years Experience', section: 'hero' },
    ],
    'programs': [
      { id: 'programs.title', type: 'text', label: 'Section Title', section: 'programs' },
      { id: 'programs.description', type: 'text', label: 'Section Description', section: 'programs' },
      { id: 'programs.preschool.image', type: 'image', label: 'Preschool Image', section: 'programs' },
      { id: 'programs.primary.image', type: 'image', label: 'Primary Image', section: 'programs' },
      { id: 'programs.middleschool.image', type: 'image', label: 'Middle School Image', section: 'programs' },
    ],
    'mission': [
      { id: 'mission.title', type: 'text', label: 'Mission Title', section: 'mission' },
      { id: 'mission.description', type: 'text', label: 'Mission Description', section: 'mission' },
      { id: 'mission.main', type: 'richText', label: 'Main Mission Text', section: 'mission' },
      { id: 'mission.secondary', type: 'richText', label: 'Secondary Mission Text', section: 'mission' },
      { id: 'mission.image', type: 'image', label: 'Mission Image', section: 'mission' },
    ],
    'news': [
      { id: 'news.title', type: 'text', label: 'News Title', section: 'news' },
      { id: 'news.description', type: 'text', label: 'News Description', section: 'news' },
      { id: 'news.featured.image', type: 'image', label: 'Featured News Image', section: 'news' },
    ],
  },
  'about': {
    'hero': [
      { id: 'about.hero.title', type: 'text', label: 'About Hero Title', section: 'hero' },
      { id: 'about.hero.description', type: 'text', label: 'About Hero Description', section: 'hero' },
      { id: 'about.hero.image', type: 'image', label: 'About Hero Image', section: 'hero' },
    ],
    'history': [
      { id: 'about.history.title', type: 'text', label: 'History Title', section: 'history' },
      { id: 'about.history.content', type: 'richText', label: 'History Content', section: 'history' },
    ],
  },
  'contact': {
    'hero': [
      { id: 'contact.hero.title', type: 'text', label: 'Contact Hero Title', section: 'hero' },
      { id: 'contact.hero.description', type: 'text', label: 'Contact Hero Description', section: 'hero' },
    ],
    'form': [
      { id: 'contact.form.title', type: 'text', label: 'Form Title', section: 'form' },
      { id: 'contact.form.description', type: 'text', label: 'Form Description', section: 'form' },
    ],
  },
  // Each page has its own content structure
};
```

#### 1.3 Edit Mode Context
```typescript
// hooks/useEditMode.ts
interface EditModeContext {
  isEditMode: boolean;
  editPanelOpen: boolean;
  openEditPanel: () => void;
  closeEditPanel: () => void;
  currentPage: string; // Current page being viewed/edited
}

// Usage in components
const { isEditMode, editPanelOpen, openEditPanel, currentPage } = useEditMode();

// The edit panel will automatically show content for the current page
<EditPanel 
  page={currentPage} 
  isOpen={editPanelOpen} 
  onClose={closeEditPanel} 
/>
```

### Phase 2: Edit Panel UI

#### 2.1 Panel Layout
- **Floating panel** that slides in from the right
- **Collapsible sections** for better organization
- **Search/filter** functionality for large pages
- **Breadcrumb navigation** for deep content structures

#### 2.2 Content Types Support

**Text Content:**
- Inline text editor with rich text support
- Preview of current content
- Character count and validation

**Image Content:**
- Thumbnail preview
- Upload/replace functionality
- Image optimization settings

**Image Sliders:**
- List of current images
- Drag-and-drop reordering
- Add/remove images
- Individual image editing

**Rich Text Content:**
- Full WYSIWYG editor
- Formatting options
- Media embedding

### Phase 3: Component Updates

#### 3.1 Remove Individual Editability (Completed)
- All `Editable*` components have been replaced in `src/pages/HomePage.tsx` with `Display*` components.
- Old `Editable*` components are now deprecated wrappers that only display content and perform no inline editing.
- All edits are performed exclusively through the centralized panel.

#### 3.2 Content Display Components (Completed)
- Implemented simple `DisplayText`, `DisplayImage`, and `DisplayImageSlider` components that only render content fetched from Convex.
- These components contain no edit handlers and no special edit-mode styling.

### Phase 4: Edit Panel Features

#### 4.1 Content Management
- **Bulk operations**: Edit multiple items at once
- **Content validation**: Real-time validation and error display
- **Version history**: View and restore previous versions
- **Publish/unpublish**: Draft and live content management

#### 4.2 User Experience
- **Keyboard shortcuts**: Quick navigation and editing
- **Auto-save**: Automatic saving of changes
- **Undo/redo**: Full editing history
- **Preview mode**: See changes before publishing

#### 4.3 Mobile Optimization
- **Responsive panel**: Adapts to mobile screen sizes
- **Touch-friendly**: Large touch targets and gestures
- **Offline support**: Work offline, sync when connected

## Migration Strategy

### Step 1: Infrastructure Setup
1. Create EditPanel component
2. Implement content registry system
3. Update EditMode context
4. Create display components

### Step 2: Page Migration (In progress)
1. Home Page: Completed — replaced all inline editable components with display-only components and wired to panel
2. Other pages: Pending — repeat the same pattern using the registry

### Step 3: Content Registration
1. Register all editable content in registry
2. Organize by sections and pages
3. Add metadata and validation rules

### Step 4: Panel Enhancement
1. Add search and filtering
2. Implement bulk operations
3. Add preview functionality
4. Optimize for mobile

## Benefits of New Approach

### For Users
- **Cleaner interface**: No visual clutter from highlights
- **Better organization**: All editable content in one place
- **Improved workflow**: Systematic approach to content editing
- **Mobile-friendly**: Better touch experience

### For Developers
- **Simpler components**: Display components are much simpler
- **Better maintainability**: Centralized editing logic
- **Easier testing**: Isolated editing functionality
- **Scalable architecture**: Easy to add new content types

### For Content Managers
- **Overview**: See all editable content at once
- **Efficiency**: Bulk operations and keyboard shortcuts
- **Consistency**: Standardized editing interface
- **Validation**: Built-in content validation

## Technical Considerations

### Performance
- **Lazy loading**: Load panel content on demand
- **Virtual scrolling**: Handle large content lists
- **Caching**: Cache content and panel state
- **Optimistic updates**: Immediate UI feedback

### Accessibility
- **Keyboard navigation**: Full keyboard support
- **Screen readers**: Proper ARIA labels and roles
- **Focus management**: Logical tab order
- **High contrast**: Support for accessibility themes

### Security
- **Content validation**: Server-side validation
- **Permission checks**: Role-based editing access
- **Audit trail**: Track all content changes
- **Backup system**: Automatic content backups

## Future Enhancements

### Advanced Features
- **Content templates**: Pre-built content structures
- **A/B testing**: Test different content versions
- **Analytics integration**: Track content performance
- **Multi-language support**: Edit content in multiple languages

### Integration
- **CMS integration**: Connect to external CMS
- **API endpoints**: RESTful API for content management
- **Webhook support**: Notify external systems of changes
- **Export/import**: Content migration tools

## Conclusion

This new centralized panel approach will provide a much better user experience for content editing while maintaining the flexibility and power of the current system. The clean separation between display and editing concerns will make the codebase more maintainable and the interface more professional.

---

## Current Status (Sprint Update)

- Centralized Edit Panel implemented (`src/components/EditPanel.tsx`) with support for:
  - Text fields (textarea in-panel with explicit Save)
  - Images (thumbnail + Replace via MediaPicker)
  - Image sliders (list, add, remove) — used by `home.hero.background`
- Display-only components created and adopted on Home page:
  - `DisplayText`, `DisplayImage`, `DisplayImageSlider`
- Content registry introduced (`src/lib/contentRegistry.ts`) and used to scope panel items by page/section
- Home page hero overlay adjusted so edit mode no longer blocks interactions (click-through not needed anymore since editing is panel-only)

## Known Gaps / Issues (to fix next)

- Panel data hydration is incomplete for some content
  - Symptom: Some persisted content does not appear prefilled in the panel editors
  - Root causes to address:
    - Panel currently looks up values per item ID; not all DB content is guaranteed to be represented in the registry
    - For sliders, panel should prefetch current values using a page-level query and hydrate editors
  - Plan:
    - Add a single `getContentByPage(page)` query in the panel, build a `Map<string, Content>`
    - Use this map to prefill all editors; render an "Unregistered content" section for DB items not present in the registry to avoid data drift
    - Add light warnings for IDs in DB but missing from registry (developer visibility only)

- Edit Mode toggle button placement overlaps UI
  - Symptom: Toggle overlaps the Exit Edit button
  - Plan:
    - Move the edit mode toggle to top-left (or bottom-left) with safe spacing
    - When panel is open, shift or hide the toggle to avoid overlap; rely on keyboard (Ctrl+E) as secondary affordance
    - Ensure consistent `z-index` stack: Panel (1000+), Toggle (990), Open Panel FAB (1001)

- Registry and content drift
  - Enforce that all editable IDs must be in the registry; add dev-only console warnings if content exists in DB but is not in registry
  - Add a CI check (optional) to fail on unknown IDs detected in DB dumps

- Rich text editing
  - Current panel uses basic textarea for `richText`; replace with `RichTextEditor` for a better experience

## Next Steps

1. Panel hydration
   - Add `useQuery(api.content.getContentByPage, { page })` in `EditPanel`
   - Build `id -> content` map and prefill editors from it
   - Render extra section for DB content not in registry (read-only preview + CTA to add to registry)

2. UI polish
   - Reposition edit mode toggle and ensure non-overlapping with panel controls
   - Add keyboard shortcut helper in panel header

3. Page rollout
   - Replace inline `Editable*` usage with `Display*` across remaining pages
   - Extend `contentRegistry` for each page/section

4. Rich text support
   - Integrate `RichTextEditor` into panel for `richText` fields with a modal/editor area

5. Safety & validation
   - Add lightweight validation rules in registry (e.g., max length for titles)
   - Add optimistic updates + toasts

## QA Checklist for Panel-Only Editing

- Display components have no click handlers or edit affordances
- All edits are initiated and confirmed in the panel
- Panel shows all registered items for the current page, hydrated with DB values
- Slider editing supports add/remove and persists in Convex
- Edit toggle and panel do not overlap critical UI
- Accessibility: focus states and keyboard navigation within the panel
