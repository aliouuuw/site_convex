# Live Edit Prototype Implementation - Les Hirondelles Website

## Overview

Implementation of a quick prototype for inline content editing capabilities that allows editing any page/component directly from the live website (localhost or deployed). This is a proof-of-concept implementation before building the full Live Edit Engine MVP.

**Goal**: Edit content inline on any page by visiting `/edit` routes with changes persisted to Convex.

---

## 🎯 **PROTOTYPE OBJECTIVES**

### Core Features
- [ ] **URL-based Edit Mode**: Visit any page with `/edit` to enable editing
- [ ] **Inline Text Editing**: Click on any marked element to edit content
- [ ] **Visual Indicators**: Clear outline/hover effects for editable elements
- [ ] **Convex Persistence**: Auto-save changes to Convex database
- [ ] **Zero Impact**: No changes to existing page components (just add data attributes)

### Success Criteria
- ✅ **4 Hour Implementation**: Complete prototype in one afternoon
- ✅ **Proof of Concept**: Demonstrates core inline editing concept
- ✅ **Immediate Value**: Can edit content on existing pages right away
- ✅ **Foundation Ready**: Provides base for full Live Edit Engine development

---

## 📋 **IMPLEMENTATION TASKS**

### Phase 1: Core Infrastructure (2-3 hours)

#### 1. Create Live Edit Core System
- [ ] **Create `src/lib/liveEdit.ts`**
  - [ ] `LiveEditPrototype` class with edit mode toggle
  - [ ] DOM scanning for `data-live-edit-id` attributes
  - [ ] Element enhancement with click handlers
  - [ ] Inline editor creation and management
  - [ ] Convex integration for persistence

#### 2. CSS Styling System
- [ ] **Add Live Edit styles to `src/index.css`**
  - [ ] `.live-edit-mode` body class styles
  - [ ] `.live-edit-element` outline and hover effects
  - [ ] `.live-edit-input` inline editor styling
  - [ ] Responsive design considerations

#### 3. Edit Mode Toggle Component
- [ ] **Create `src/components/EditModeToggle.tsx`**
  - [ ] Toggle button for edit mode on/off
  - [ ] Visual state indication
  - [ ] Keyboard shortcuts (optional)

### Phase 2: Routing Integration (30 minutes)

#### 1. Edit Routes Setup
- [ ] **Create edit route pattern**
  - [ ] Add `/edit` routes for existing pages
  - [ ] Route configuration in `src/main.tsx`
  - [ ] Automatic edit mode activation

#### 2. Route Components
- [ ] **Create edit wrappers for existing pages**
  - [ ] `src/pages/edit/HomePageEdit.tsx`
  - [ ] `src/pages/edit/AboutPageEdit.tsx`
  - [ ] `src/pages/edit/ContactPageEdit.tsx`
  - [ ] Generic edit wrapper component

### Phase 3: Convex Integration (30 minutes)

#### 1. Database Schema
- [ ] **Update `convex/schema.ts`**
  - [ ] Add `content` table definition
  - [ ] Index configuration for efficient queries
  - [ ] Type definitions

#### 2. Convex Functions
- [ ] **Create `convex/content.ts`**
  - [ ] `updateContent` mutation
  - [ ] `getContent` query
  - [ ] `getContentByPage` query

### Phase 4: Content Attribution (15 minutes per page)

#### 1. Add Data Attributes to Existing Pages
- [ ] **HomePage.tsx updates**
  - [ ] Add `data-live-edit-id` to editable elements
  - [ ] Hero section content
  - [ ] Programs section
  - [ ] Mission and values text

- [ ] **AboutPage.tsx updates**
  - [ ] Add `data-live-edit-id` to editable elements
  - [ ] School history content
  - [ ] Values and mission text
  - [ ] Leadership information

- [ ] **ContactPage.tsx updates**
  - [ ] Add `data-live-edit-id` to editable elements
  - [ ] Contact information
  - [ ] Description text
  - [ ] Call-to-action content

- [ ] **Other pages** (BlogPage, InscriptionPage, etc.)
  - [ ] Add data attributes to editable content
  - [ ] Test edit functionality

---

## 🛠 **TECHNICAL IMPLEMENTATION**

### File Structure
```
src/
├── lib/
│   └── liveEdit.ts              # Core prototype system
├── components/
│   ├── EditModeToggle.tsx       # Edit mode toggle button
│   └── EditWrapper.tsx          # Generic edit wrapper
├── pages/
│   └── edit/                    # Edit route components
│       ├── HomePageEdit.tsx
│       ├── AboutPageEdit.tsx
│       └── ContactPageEdit.tsx
└── styles/
    └── liveEdit.css            # Edit mode styles (or in index.css)

convex/
├── schema.ts                   # Updated with content table
└── content.ts                  # Content CRUD operations
```

### Core Implementation Approach
1. **Minimal DOM Manipulation**: Use simple click handlers and input replacement
2. **Progressive Enhancement**: Existing pages work normally, edit mode is additive
3. **Simple State Management**: No complex state, direct DOM updates
4. **Immediate Persistence**: Auto-save on blur/enter, no batching
5. **Error Tolerance**: Graceful fallbacks if edit system fails

### Data Attribution Pattern
```typescript
// Simple pattern for marking editable content
<h1 data-live-edit-id="hero.title">Welcome to Our School</h1>
<p data-live-edit-id="hero.subtitle">Excellence in education since 1985</p>
<img data-live-edit-id="hero.image" src="/hero.jpg" alt="School building" />
```

---

## 🚀 **IMMEDIATE NEXT STEPS**

### Day 1 Implementation (4 hours)
1. **Hour 1**: Create `LiveEditPrototype` class and CSS styles
2. **Hour 2**: Build edit route wrappers and toggle component
3. **Hour 3**: Integrate Convex schema and functions
4. **Hour 4**: Add data attributes to HomePage and test functionality

### Testing Checklist
- [ ] Visit `localhost:5173/edit` and see edit indicators
- [ ] Click on text elements and see inline editor
- [ ] Edit text and verify auto-save to Convex
- [ ] Refresh page and confirm changes persist
- [ ] Test on multiple pages (Home, About, Contact)
- [ ] Verify no impact on normal page viewing

### Success Validation
- [ ] **Demo Ready**: Can show live editing in 5 minutes
- [ ] **Content Team Tested**: Non-technical users can edit content
- [ ] **Performance Checked**: No noticeable impact on page load
- [ ] **Mobile Responsive**: Works on tablet/mobile devices
- [ ] **Error Handling**: Graceful failures, no crashes

---

## 📈 **FUTURE DEVELOPMENT PATH**

This prototype serves as the foundation for the full Live Edit Engine:

### Immediate Enhancements (Next Iteration)
- [ ] Rich text editing with formatting
- [ ] Image upload and replacement
- [ ] Batch editing and publish workflow
- [ ] User authentication and permissions
- [ ] Better error handling and validation

### Full MVP Features (12-week plan)
- [ ] Plugin system for different content types
- [ ] Real-time collaborative editing
- [ ] Version history and rollback
- [ ] Advanced permissions and workflows
- [ ] Performance optimization and caching

---

## 🎯 **SUCCESS METRICS**

### Technical Metrics
- **Implementation Time**: ≤ 4 hours total
- **Bundle Size Impact**: ≤ 10KB additional
- **Performance Impact**: ≤ 100ms page load increase
- **Error Rate**: 0% crashes during normal usage

### User Experience Metrics
- **Learning Curve**: ≤ 2 minutes to understand and use
- **Edit Speed**: ≤ 3 seconds from click to editable state
- **Save Speed**: ≤ 1 second from blur to Convex save
- **Mobile Usability**: Fully functional on touch devices

### Business Value
- **Immediate ROI**: Content team can edit within hours of deployment
- **Validation**: Proves market need for inline editing solution
- **Foundation**: Provides solid base for full product development
- **Competitive Advantage**: Demonstrates innovative approach to CMS

---

**Status**: 🟡 Ready to implement
**Priority**: High - Proof of concept validation
**Owner**: Development team
**Timeline**: 1 day implementation + testing 