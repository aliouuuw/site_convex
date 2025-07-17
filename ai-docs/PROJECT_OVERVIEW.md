# Project Overview: Les Hirondelles Website Migration

## Project Context

### Current System
- **Framework**: Next.js with App Router
- **CMS**: Sanity (implied from migration description)
- **Styling**: Custom CSS with Tailwind utility classes
- **Content**: French language educational institution website
- **Institution**: Les Hirondelles - Private school in Dakar, Senegal

### Target System
- **Framework**: React + Vite
- **Backend/CMS**: Convex with integrated content management
- **Authentication**: Convex Auth (already installed)
- **Styling**: Maintain existing custom CSS system
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

## Migration Goals

### Phase 1: Frontend Duplication
1. Set up React + Vite project structure
2. Migrate all existing pages and components
3. Preserve current styling and design system
4. Ensure feature parity with existing site
5. Test responsive design and functionality

### Phase 2: Convex Integration
1. Design Convex schema for content types
2. Implement data fetching and caching
3. Create content management interface
4. Integrate Convex Auth for admin access
5. Data migration from current system

### Phase 3: Content Management Panel
1. Build intuitive admin dashboard
2. Create content editing interfaces
3. Implement image upload and management
4. Add user management and permissions
5. Testing and training documentation

## Success Criteria

### Functional Requirements
- [ ] All existing pages render correctly
- [ ] Responsive design works across devices
- [ ] Contact forms and interactions function
- [ ] SEO meta tags and structure preserved
- [ ] Fast loading times maintained

### Content Management Requirements
- [ ] Non-technical staff can edit content easily
- [ ] Blog posts can be created, edited, and published
- [ ] Program information can be updated
- [ ] Contact information and forms can be modified
- [ ] Image galleries can be managed

### Technical Requirements
- [ ] Clean, maintainable code structure
- [ ] Proper error handling and loading states
- [ ] Secure authentication and authorization
- [ ] Data validation and sanitization
- [ ] Backup and recovery procedures

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

## Timeline Considerations

### Development Phases
1. **Setup & Basic Migration** (1-2 weeks)
2. **Content Integration** (2-3 weeks)
3. **CMS Development** (2-3 weeks)
4. **Testing & Refinement** (1-2 weeks)
5. **Deployment & Training** (1 week)

### Dependencies
- Convex schema design and implementation
- Content audit and organization
- User training and documentation
- DNS and hosting setup for new system

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