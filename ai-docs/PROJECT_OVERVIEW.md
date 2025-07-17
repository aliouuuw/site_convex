# Project Overview: Les Hirondelles Website Migration

## Project Context

### Original System (To Be Migrated From)
- **Framework**: Next.js with App Router
- **CMS**: Sanity (headless CMS)
- **Styling**: Custom CSS with Tailwind utility classes
- **Content**: French language educational institution website
- **Institution**: Les Hirondelles - Private school in Dakar, Senegal

### Current Project State
- **Framework**: React + Vite ✅ (Configured)
- **Backend/CMS**: Convex ✅ (Basic setup complete)
- **Authentication**: Convex Auth ✅ (Working auth flow)
- **Styling**: Tailwind CSS ✅ (Configured)
- **TypeScript**: ✅ (Configured)
- **Development Environment**: ✅ (Working)

### Target System (In Progress)
- **Framework**: React + Vite
- **Backend/CMS**: Convex with integrated content management
- **Authentication**: Convex Auth (for admin panel)
- **Styling**: Custom CSS system + Tailwind utilities
- **Features**: Content management panel for non-technical users

## Website Structure

### Current Pages
```
/                     - Homepage with hero, programs, mission, news, testimonials
/about               - School history, values, leadership team
/blog                - News and events listing
/blog/[id]           - Individual blog post
/contact             - Contact information and form
/inscription         - Admissions process and pre-registration
/programs/preschool  - Preschool program (3-5 years)
/programs/primary    - Primary program (6-11 years)
/programs/middleschool - Middle school program (11-15 years)
```

### Key Components
- **Navigation**: Fixed header with responsive menu
- **ImageSlider**: Hero background carousel
- **Layout**: Consistent footer and navigation
- **Styling**: Sophisticated design system with:
  - Custom CSS variables for colors and spacing
  - Premium button system
  - Card components
  - Section layouts
  - Responsive grid system

## Technical Requirements

### Performance
- Fast page loads with Vite's optimized bundling
- Image optimization for hero carousel and content images
- SEO-friendly routing and meta tags

### Content Management
- Intuitive interface for school administrators
- Multi-language support (primarily French)
- Rich text editing for blog posts and page content
- Image upload and management
- Event/news management
- Program information editing

### Authentication & Security
- Secure admin access using Convex Auth
- Role-based permissions for content editing
- Safe content validation and sanitization

## Current Status & Next Steps

### ✅ Completed Setup
1. React + Vite project initialized with TypeScript
2. Convex backend configured and working
3. Convex Auth implemented with email/password flow
4. Tailwind CSS configured
5. Basic development environment running
6. ESLint and Prettier configured

### 🔄 Phase 1: Frontend Migration (In Progress)
**Immediate Next Steps:**
1. **Install missing dependencies**:
   - `react-router-dom` (routing)
   - `react-icons` (icon system)
   - Additional UI libraries as needed

2. **Create proper folder structure**:
   - `/src/components/` (reusable components)
   - `/src/pages/` (page components)
   - `/src/hooks/` (custom hooks)
   - `/src/utils/` (utility functions)
   - `/src/types/` (TypeScript definitions)
   - `/src/styles/` (CSS files)

3. **Migrate core components**:
   - Navigation/Header component
   - Footer component
   - Layout wrapper
   - Basic routing structure

4. **Migrate homepage sections**:
   - Hero section with image slider
   - Programs overview
   - Mission section
   - News/testimonials

### 📋 Phase 2: Content Schema & Data (Upcoming)
1. Design Convex schema for all content types
2. Create content management functions
3. Implement data fetching hooks
4. Build admin interface components
5. Content migration strategy

### 🎯 Phase 3: Full CMS Features (Future)
1. Rich text editor integration
2. Image upload and management
3. User roles and permissions
4. Content workflow (draft/publish)
5. SEO management tools

## Success Criteria

### Phase 1 Requirements (Frontend Migration)
- [ ] Install required dependencies (react-router-dom, react-icons)
- [ ] Create proper project folder structure
- [ ] Migrate existing design system and styles
- [ ] Build responsive navigation component
- [ ] Create homepage with all sections
- [ ] Implement routing for all pages
- [ ] Ensure mobile responsiveness
- [ ] Test cross-browser compatibility

### Phase 2 Requirements (Convex Integration)
- [ ] Design comprehensive Convex schema
- [ ] Implement content fetching with real-time updates
- [ ] Create admin authentication flow
- [ ] Build basic content management interface
- [ ] Migrate existing content to Convex

### Phase 3 Requirements (Full CMS)
- [ ] Rich content editing capabilities
- [ ] Image upload and optimization
- [ ] User roles and permissions system
- [ ] Content workflow management
- [ ] SEO tools and meta tag management
- [ ] Performance optimization
- [ ] Backup and recovery system

## Key Stakeholders

### School Administration
- Content updates for programs and admissions
- News and event management
- Contact information maintenance

### Technical Team
- Code maintenance and updates
- Security and performance monitoring
- Feature development and bug fixes

### Students and Parents
- Easy access to information
- Smooth user experience
- Mobile-friendly interface

## Risk Assessment

### Technical Risks
- **Data Migration**: Ensuring content transfer without loss
- **Design Consistency**: Maintaining visual fidelity during migration
- **Performance**: Ensuring new stack performs as well or better
- **SEO Impact**: Preserving search engine rankings

### Mitigation Strategies
- Comprehensive testing at each phase
- Staged deployment with rollback capability
- Content backup and verification procedures
- SEO monitoring and optimization

## Immediate Timeline (Next 2 Weeks)

### Week 1: Foundation & Structure
**Days 1-2: Project Setup Completion**
- Install missing dependencies (react-router-dom, react-icons)
- Create proper folder structure following architecture docs
- Set up routing configuration

**Days 3-5: Core Components**
- Build navigation/header component
- Create layout wrapper component
- Implement footer component
- Set up basic routing structure

**Days 6-7: Homepage Foundation**
- Create hero section component
- Build image slider component
- Start programs section

### Week 2: Content Migration
**Days 1-3: Homepage Completion**
- Complete all homepage sections
- Implement responsive design
- Add animations and interactions

**Days 4-5: Additional Pages**
- About page structure
- Contact page with forms
- Basic program pages

**Days 6-7: Polish & Testing**
- Cross-browser testing
- Mobile responsiveness
- Performance optimization

### Next Phase Dependencies
- Complete Convex schema design
- Content audit from existing site
- Admin interface wireframes
- Content migration strategy

## Success Metrics

### Performance Metrics
- Page load times < 3 seconds
- Mobile PageSpeed score > 90
- SEO ranking maintenance or improvement

### User Experience Metrics
- Content update frequency increase
- Admin user satisfaction scores
- Reduced time for content updates

### Technical Metrics
- Zero data loss during migration
- 99.9% uptime post-migration
- Reduced maintenance overhead