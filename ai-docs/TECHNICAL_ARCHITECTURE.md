# Technical Architecture - Les Hirondelles Website Migration

## Architecture Overview

### Original Architecture (NextJS + Sanity - To Migrate From)
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js App  │───▶│   Sanity CMS    │───▶│   Content API   │
│   (Frontend)    │    │   (Headless)    │    │   (GraphQL)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Static Pages  │    │   Content       │    │   CDN Delivery  │
│   + SSR/SSG     │    │   Management    │    │   (Images)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Current Implementation (React + Vite + Convex) ✅
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React + Vite  │───▶│     Convex      │───▶│   Real-time     │
│   (Frontend) ✅ │    │   (Backend) ✅  │    │   Updates ✅    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   SPA + CSR ✅  │    │   Content +     │    │   Edge Delivery │
│   Fast Builds ✅│    │   Auth ✅ + CMS │    │   (Via Hosting) │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

**Status Legend:**
- ✅ = Implemented and working
- 🔄 = In progress / partially implemented
- ⏳ = Planned for next phase
</text>

<old_text line=40>
### Frontend Technologies
```yaml
Core Framework:
  - React 18+ (with hooks and concurrent features)
  - Vite 5+ (build tool and dev server)
  - TypeScript (type safety and developer experience)

Routing:
  - React Router v6 (client-side routing)
  - Dynamic imports for code splitting

Styling:
  - Custom CSS with CSS Variables
  - Tailwind CSS (utility classes)
  - PostCSS (processing and optimization)

State Management:
  - React Context API (global state)
  - Convex React hooks (server state)
  - Local component state (useState, useReducer)

Development Tools:
  - ESLint (code quality)
  - Prettier (code formatting)
  - Husky (git hooks)
  - Vite DevTools
```

## Technology Stack

### Frontend Technologies
```yaml
Core Framework:
  - React 18+ (with hooks and concurrent features)
  - Vite 5+ (build tool and dev server)
  - TypeScript (type safety and developer experience)

Routing:
  - React Router v6 (client-side routing)
  - Dynamic imports for code splitting

Styling:
  - Custom CSS with CSS Variables
  - Tailwind CSS (utility classes)
  - PostCSS (processing and optimization)

State Management:
  - React Context API (global state)
  - Convex React hooks (server state)
  - Local component state (useState, useReducer)

Development Tools:
  - ESLint (code quality)
  - Prettier (code formatting)
  - Husky (git hooks)
  - Vite DevTools
```

### Backend Technologies

#### ✅ Currently Implemented
```yaml
Convex Platform:
  - Convex 1.23.0 ✅ (serverless backend)
  - Convex Database ✅ (document database)
  - Convex Auth 0.0.81 ✅ (authentication system)
  - Convex File Storage ✅ (ready for asset management)

Features Currently Working:
  - Real-time subscriptions ✅
  - Optimistic updates ✅
  - Type-safe API calls ✅
  - Built-in caching ✅
  - Authentication flow ✅

Schema Currently Defined:
  - Auth tables ✅
  - Example numbers table ✅
  - Ready for content schemas 🔄
```

## Project Structure

### Directory Architecture

#### ✅ Current Structure (Minimal Setup)
```
site_convex/
├── public/                     # Static assets ✅
│   └── convex.svg             # Convex logo (placeholder)
│
├── src/                       # Source code ✅
│   ├── App.tsx               # Main App component ✅
│   ├── main.tsx              # Entry point ✅
│   ├── index.css             # Basic styles ✅
│   └── vite-env.d.ts         # Vite type definitions ✅
│
├── convex/                    # Convex backend ✅
│   ├── _generated/           # Generated Convex types ✅
│   ├── auth.config.ts        # Auth configuration ✅
│   ├── auth.ts               # Auth implementation ✅
│   ├── http.ts               # HTTP endpoints ✅
│   ├── myFunctions.ts        # Example functions ✅
│   ├── schema.ts             # Database schema ✅
│   └── tsconfig.json         # Convex TypeScript config ✅
│
├── package.json              # Dependencies ✅
├── vite.config.ts            # Vite configuration ✅
├── tsconfig.json             # TypeScript configuration ✅
└── README.md                 # Documentation ✅
```

#### 🔄 Target Structure (To Be Created)
```
site_convex/
├── public/                     # Static assets
│   ├── images/                # Image assets (TO CREATE)
│   │   ├── hero/             # Hero section images
│   │   ├── programs/         # Program page images
│   │   └── logo/             # Logo variations
│   └── favicon.ico           # Site favicon (TO ADD)
│
├── src/
│   ├── components/           # Reusable components (TO CREATE)
│   │   ├── common/          # Generic components
│   │   ├── navigation/      # Navigation components
│   │   ├── home/           # Homepage components
│   │   ├── forms/          # Form components
│   │   └── layout/         # Layout components
│   │
│   ├── pages/              # Page components (TO CREATE)
│   │   ├── HomePage.tsx
│   │   ├── AboutPage.tsx
│   │   ├── ContactPage.tsx
│   │   └── programs/
│   │
│   ├── hooks/              # Custom React hooks (TO CREATE)
│   ├── utils/              # Utility functions (TO CREATE)
│   ├── types/              # TypeScript definitions (TO CREATE)
│   ├── styles/             # Styling files (TO CREATE)
│   └── router/             # Routing configuration (TO CREATE)
│
├── convex/                 # Convex backend (EXPAND)
│   ├── blog.ts            # Blog-related functions (TO CREATE)
│   ├── contact.ts         # Contact form handlers (TO CREATE)
│   └── programs.ts        # Programs data functions (TO CREATE)
```

#### 🚀 Immediate Action Items
1. **Install missing packages**: `react-router-dom`, `react-icons`
2. **Create folder structure**: components/, pages/, hooks/, utils/, types/, styles/
3. **Set up routing**: AppRouter.tsx and basic routes
4. **Create basic components**: Navigation, Layout, HomePage

## Component Architecture

### Component Hierarchy
```
App
├── Router
│   ├── Layout
│   │   ├── Navigation
│   │   │   └── MobileMenu
│   │   ├── Main Content (Route-based)
│   │   └── Footer
│   └── Error Boundaries
```

### Component Design Patterns

#### 1. Composition Pattern
```typescript
// Flexible component composition
<Section>
  <SectionHeader>
    <SectionTitle>Our Programs</SectionTitle>
    <SectionDescription>Quality education for every age</SectionDescription>
  </SectionHeader>
  <SectionContent>
    <ProgramsGrid />
  </SectionContent>
</Section>
```

#### 2. Render Props Pattern
```typescript
// For complex state sharing
<IntersectionObserver>
  {({ isVisible, ref }) => (
    <div ref={ref} className={`animate-${isVisible ? 'in' : 'out'}`}>
      <AnimatedSection />
    </div>
  )}
</IntersectionObserver>
```

### Custom Hooks Pattern
```typescript
// Reusable logic extraction
const useScrollAnimation = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Intersection Observer logic
  }, []);
  
  return { isVisible, ref };
};

// Convex data fetching pattern (already working)
const useBlogPosts = () => {
  const posts = useQuery(api.blog.getAllPosts);
  return posts || [];
};
```

## State Management Strategy

### State Categories

#### 1. Server State (Convex)
```typescript
// Real-time data from Convex
const blogPosts = useQuery(api.blog.getAllPosts);
const programs = useQuery(api.programs.getAll);
const teamMembers = useQuery(api.about.getTeamMembers);
```

#### 2. Client State (React Context)
```typescript
// Global application state
interface AppState {
  theme: 'light' | 'dark';
  language: 'fr' | 'en';
  mobileMenuOpen: boolean;
  loading: boolean;
}

const AppContext = createContext<AppState | null>(null);
```

#### 3. Local State (useState/useReducer)
```typescript
// Component-specific state
const [formData, setFormData] = useState<ContactFormData>({});
const [isSubmitting, setIsSubmitting] = useState(false);
const [errors, setErrors] = useState<ValidationErrors>({});
```

#### 4. URL State (React Router)
```typescript
// Route parameters and search params
const { postId } = useParams<{ postId: string }>();
const [searchParams, setSearchParams] = useSearchParams();
```

## Data Flow Architecture

### Unidirectional Data Flow
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Action   │───▶│   Component     │───▶│   Convex API    │
│   (Click/Form)  │    │   Handler       │    │   Function      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         ▲                       │                       │
         │                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   UI Update     │◀───│   State Update  │◀───│   Database      │
│   (Re-render)   │    │   (Hook)        │    │   Operation     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Real-time Updates
```typescript
// Convex provides real-time subscriptions (already working)
const useRealtimeBlogPosts = () => {
  const posts = useQuery(api.blog.getAllPosts);
  
  // Automatically updates when data changes
  return posts || [];
};

// Current working example (from existing code)
const useNumbers = () => {
  const { viewer, numbers } = useQuery(api.myFunctions.listNumbers, { count: 10 }) ?? {};
  return { viewer, numbers };
};
```

## Routing Strategy

### Route Configuration
```typescript
// Planned routing structure (TO IMPLEMENT)
const routes = [
  { path: '/', component: HomePage },
  { path: '/about', component: AboutPage },
  { path: '/blog', component: BlogPage },
  { path: '/blog/:id', component: BlogPostPage },
  { path: '/contact', component: ContactPage },
  { path: '/inscription', component: AdmissionsPage },
  { path: '/programs/preschool', component: PreschoolPage },
  { path: '/programs/primary', component: PrimaryPage },
  { path: '/programs/middleschool', component: MiddleSchoolPage },
  { path: '*', component: NotFoundPage }
];

// Current state: No routing yet - needs react-router-dom installation
```

### Code Splitting Strategy
```typescript
// Lazy loading for better performance
const BlogPage = lazy(() => import('../pages/BlogPage'));
const AboutPage = lazy(() => import('../pages/AboutPage'));

// Wrap with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    {/* Route components */}
  </Routes>
</Suspense>
```

## Styling Architecture

### CSS Custom Properties System
```css
:root {
  /* Color System */
  --primary: #00538d;
  --accent: #ffce1b;
  --gray-50: #fafafa;
  --gray-900: #171717;
  
  /* Spacing System */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 2rem;
  --spacing-xl: 4rem;
  
  /* Typography Scale */
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  
  /* Component Specific */
  --header-height: 80px;
  --section-padding: 120px;
  --border-radius: 0.625rem;
}
```

### Component Styling Strategy
```css
/* BEM-like methodology with CSS modules approach */
.hero-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: var(--white);
}

.hero-section__content {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
}

.hero-section__title {
  font-size: clamp(3rem, 6vw, 5rem);
  font-weight: 700;
  color: var(--gray-900);
}
```

## Performance Optimization

### Bundle Optimization
```typescript
// Vite configuration for optimization
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          icons: ['react-icons'],
          convex: ['convex']
        }
      }
    }
  }
});
```

### Image Optimization Strategy
```typescript
// Progressive image loading
const ImageWithLoading: React.FC<ImageProps> = ({ src, alt, ...props }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  return (
    <div className="image-container">
      {loading && <Skeleton />}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoading(false)}
        onError={() => setError(true)}
        {...props}
      />
    </div>
  );
};
```

### Caching Strategy
```typescript
// Convex automatic caching + manual cache strategies
const useCachedQuery = <T>(query: any, args: any) => {
  const result = useQuery(query, args);
  
  // Convex handles caching automatically
  // Additional client-side caching if needed
  const cachedResult = useMemo(() => result, [result]);
  
  return cachedResult;
};
```

## Security Architecture

### Authentication Flow
```typescript
// Convex Auth integration
const useAuth = () => {
  const { isLoading, isAuthenticated, user } = useConvexAuth();
  
  return {
    isLoading,
    isAuthenticated,
    user,
    login: () => signIn(),
    logout: () => signOut()
  };
};
```

### Content Security
```typescript
// Input validation and sanitization
const validateContactForm = (data: ContactFormData): ValidationResult => {
  const errors: ValidationErrors = {};
  
  if (!data.email || !isValidEmail(data.email)) {
    errors.email = 'Email valide requis';
  }
  
  if (!data.message || data.message.length < 10) {
    errors.message = 'Message trop court';
  }
  
  return { isValid: Object.keys(errors).length === 0, errors };
};
```

## Development Workflow

### Environment Setup
```bash
# Development commands
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

### Git Workflow
```yaml
Branching Strategy:
  - main: Production-ready code
  - develop: Integration branch
  - feature/*: Feature development
  - hotfix/*: Critical fixes

Commit Convention:
  - feat: New features
  - fix: Bug fixes
  - docs: Documentation
  - style: Formatting changes
  - refactor: Code restructuring
  - test: Testing updates
```

## Deployment Strategy

### Build Process
```yaml
Build Steps:
  1. Install dependencies
  2. Run type checking
  3. Run linting
  4. Run tests
  5. Build production bundle
  6. Deploy to hosting platform

Environment Variables:
  - VITE_CONVEX_URL: Convex deployment URL
  - VITE_SITE_URL: Website URL
  - VITE_CONTACT_EMAIL: Contact email
```

### Hosting Configuration
```yaml
Platform: Vercel/Netlify (recommended for Vite)
Features:
  - Automatic deployments from Git
  - Preview deployments for PRs
  - Edge functions support
  - Global CDN
  - Custom domains
  - SSL certificates
```

## Monitoring and Analytics

### Performance Monitoring
```typescript
// Web Vitals tracking
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

const sendToAnalytics = (metric: Metric) => {
  // Send to analytics service
  console.log(metric);
};

// Measure all Web Vitals
getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

### Error Tracking
```typescript
// Error boundary for React components
class ErrorBoundary extends Component {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to monitoring service
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }

    return this.props.children;
  }
}
```

## Scalability Considerations

### Code Organization
- Modular component architecture
- Shared utilities and hooks
- Type-safe API contracts
- Consistent naming conventions

### Performance Scaling
- Lazy loading of routes and components
- Image optimization and lazy loading
- Bundle splitting and tree shaking
- CDN for static assets

### Content Scaling
- Convex's automatic scaling
- Efficient database queries
- Image and file optimization
- Caching strategies

## Implementation Status & Next Steps

### ✅ Phase 1: Foundation (COMPLETED)
1. ✅ Set up Vite + React project with TypeScript
2. ✅ Configure Convex backend
3. ✅ Implement Convex Auth
4. ✅ Set up Tailwind CSS
5. ✅ Configure development environment

### 🔄 Phase 2: Frontend Structure (IN PROGRESS)
**Immediate Tasks (Next 48 hours):**
1. 🔄 Install react-router-dom and react-icons
2. 🔄 Create proper folder structure
3. 🔄 Build navigation component
4. 🔄 Implement basic routing
5. 🔄 Create layout system

**Week 1 Goals:**
1. Homepage with hero section
2. Basic about and contact pages
3. Responsive navigation
4. Clean design system

### ⏳ Phase 3: Content Integration (PLANNED)
1. Design Convex schemas for blog, programs, content
2. Create content management functions
3. Implement data fetching throughout app
4. Build admin interface

### ⏳ Phase 4: Advanced Features (FUTURE)
1. Rich text editor for content
2. Image upload and management
3. User roles and permissions
4. Performance optimization
5. SEO enhancements

## Current Development Priority

**Focus:** Get the frontend structure in place first, then integrate with Convex for dynamic content. The backend foundation is solid, now we need to build the user-facing interface.

This architecture provides a solid foundation that's already partially implemented and ready for rapid frontend development.