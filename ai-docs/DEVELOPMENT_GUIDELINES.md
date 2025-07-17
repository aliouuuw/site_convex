# Development Guidelines - Les Hirondelles Website

## Table of Contents

- [Code Style & Formatting](#code-style--formatting)
- [TypeScript Guidelines](#typescript-guidelines)
- [React Component Standards](#react-component-standards)
- [Styling Guidelines](#styling-guidelines)
- [State Management](#state-management)
- [Performance Guidelines](#performance-guidelines)
- [Accessibility Standards](#accessibility-standards)
- [Security Best Practices](#security-best-practices)
- [Testing Strategy](#testing-strategy)
- [Git Workflow](#git-workflow)
- [Code Review Process](#code-review-process)
- [Documentation Standards](#documentation-standards)
- [Error Handling](#error-handling)
- [Build & Deployment](#build--deployment)

## Code Style & Formatting

### ESLint Configuration

```json
{
  "extends": [
    "@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended"
  ],
  "rules": {
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "jsx-a11y/alt-text": "error",
    "jsx-a11y/aria-props": "error",
    "jsx-a11y/aria-proptypes": "error",
    "jsx-a11y/aria-unsupported-elements": "error",
    "jsx-a11y/role-has-required-aria-props": "error",
    "jsx-a11y/role-supports-aria-props": "error"
  }
}
```

### Prettier Configuration

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

### Naming Conventions

#### Files and Directories
```
✅ Good
components/NavigationBar.tsx
pages/HomePage.tsx
hooks/useScrollPosition.ts
utils/formatDate.ts

❌ Bad
components/navigation-bar.tsx
pages/homePage.tsx
hooks/use_scroll_position.ts
utils/format-date.ts
```

#### Variables and Functions
```typescript
// ✅ Good - camelCase
const userName = 'John Doe';
const isAuthenticated = true;
const getUserProfile = () => { /* */ };

// ❌ Bad
const user_name = 'John Doe';
const IsAuthenticated = true;
const get_user_profile = () => { /* */ };
```

#### Components and Interfaces
```typescript
// ✅ Good - PascalCase
interface UserProfile {
  name: string;
  email: string;
}

const NavigationBar: React.FC = () => { /* */ };

// ❌ Bad
interface userProfile {
  name: string;
  email: string;
}

const navigationBar: React.FC = () => { /* */ };
```

#### Constants
```typescript
// ✅ Good - SCREAMING_SNAKE_CASE for module-level constants
const API_BASE_URL = 'https://api.leshirondelles.sn';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// ✅ Good - camelCase for local constants
const defaultOptions = { timeout: 5000 };
```

## TypeScript Guidelines

### Type Definitions

#### Interface vs Type Aliases
```typescript
// ✅ Prefer interfaces for object shapes
interface User {
  id: string;
  name: string;
  email: string;
}

// ✅ Use type aliases for unions, primitives, and computed types
type Status = 'loading' | 'success' | 'error';
type UserWithTimestamps = User & {
  createdAt: Date;
  updatedAt: Date;
};
```

#### Strict Typing
```typescript
// ✅ Good - Explicit types
interface BlogPostProps {
  title: string;
  content: string;
  publishedAt: Date;
  author: {
    name: string;
    email: string;
  };
}

// ❌ Bad - Using any
interface BlogPostProps {
  title: any;
  content: any;
  publishedAt: any;
  author: any;
}
```

#### Optional vs Required Properties
```typescript
// ✅ Good - Clear optionality
interface ContactFormData {
  name: string;
  email: string;
  phone?: string; // Optional
  message: string;
  subject?: string; // Optional
}
```

### Utility Types Usage
```typescript
// ✅ Good - Using utility types
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

type PublicUser = Omit<User, 'password'>;
type UserUpdate = Partial<Pick<User, 'name' | 'email'>>;
type CreateUser = Omit<User, 'id'>;
```

### Generic Constraints
```typescript
// ✅ Good - Proper generic constraints
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

function processApiResponse<T extends Record<string, unknown>>(
  response: ApiResponse<T>
): T {
  return response.data;
}
```

## React Component Standards

### Component Structure
```typescript
// ✅ Good - Consistent component structure
import React from 'react';
import { SomeIcon } from 'react-icons/fa';
import './ComponentName.css';

interface ComponentNameProps {
  title: string;
  description?: string;
  onAction?: () => void;
}

const ComponentName: React.FC<ComponentNameProps> = ({
  title,
  description,
  onAction
}) => {
  // Hooks first
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Event handlers
  const handleClick = useCallback(() => {
    if (onAction) {
      onAction();
    }
  }, [onAction]);

  // Effects
  useEffect(() => {
    // Effect logic
  }, []);

  // Early returns
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Main render
  return (
    <div className="component-name">
      <h2 className="component-name__title">{title}</h2>
      {description && (
        <p className="component-name__description">{description}</p>
      )}
      <button onClick={handleClick} className="component-name__button">
        <SomeIcon />
        Action
      </button>
    </div>
  );
};

export default ComponentName;
```

### Props Interface Guidelines
```typescript
// ✅ Good - Descriptive prop names and types
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  'aria-label'?: string;
}

// ❌ Bad - Vague or overly complex props
interface ButtonProps {
  text: any;
  style: any;
  handler: Function;
  config: {
    theme: any;
    options: any[];
  };
}
```

### Custom Hooks Guidelines
```typescript
// ✅ Good - Custom hook structure
import { useState, useEffect, useCallback } from 'react';

interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

function useApi<T>(url: string): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
```

### Component Composition
```typescript
// ✅ Good - Composable components
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => (
  <div className={`card ${className}`}>
    {children}
  </div>
);

const CardHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="card__header">
    {children}
  </div>
);

const CardContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="card__content">
    {children}
  </div>
);

const CardFooter: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="card__footer">
    {children}
  </div>
);

// Usage
const BlogPostCard = () => (
  <Card>
    <CardHeader>
      <h3>Blog Post Title</h3>
    </CardHeader>
    <CardContent>
      <p>Blog post content...</p>
    </CardContent>
    <CardFooter>
      <Button>Read More</Button>
    </CardFooter>
  </Card>
);
```

## Styling Guidelines

### CSS Organization
```css
/* ✅ Good - Organized CSS structure */

/* 1. CSS Custom Properties */
:root {
  --primary-color: #00538d;
  --accent-color: #ffce1b;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 2rem;
}

/* 2. Base component styles */
.button {
  /* Layout properties first */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-sm) var(--spacing-md);
  
  /* Typography */
  font-family: var(--font-poppins);
  font-weight: 500;
  font-size: 0.875rem;
  
  /* Visual properties */
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 0.25rem;
  
  /* Interactive states */
  cursor: pointer;
  transition: all 0.3s ease;
}

/* 3. Modifiers */
.button--secondary {
  background: transparent;
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
}

.button--large {
  padding: var(--spacing-md) var(--spacing-lg);
  font-size: 1rem;
}

/* 4. States */
.button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* 5. Child elements */
.button__icon {
  margin-right: 0.5rem;
}

.button__text {
  line-height: 1;
}
```

### BEM Methodology
```css
/* ✅ Good - BEM naming convention */
.navigation {
  display: flex;
  align-items: center;
  padding: 1rem 2rem;
}

.navigation__logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.navigation__menu {
  display: flex;
  list-style: none;
  gap: 2rem;
  margin: 0;
  padding: 0;
}

.navigation__link {
  text-decoration: none;
  color: var(--gray-700);
  font-weight: 500;
  transition: color 0.3s ease;
}

.navigation__link--active {
  color: var(--primary-color);
  position: relative;
}

.navigation__link--active::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--primary-color);
}
```

### Responsive Design
```css
/* ✅ Good - Mobile-first responsive design */
.hero-section {
  padding: 2rem 1rem;
  text-align: center;
}

.hero-section__title {
  font-size: 2rem;
  margin-bottom: 1rem;
}

/* Tablet */
@media (min-width: 768px) {
  .hero-section {
    padding: 4rem 2rem;
  }
  
  .hero-section__title {
    font-size: 3rem;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .hero-section {
    padding: 6rem 2rem;
    text-align: left;
  }
  
  .hero-section__title {
    font-size: 4rem;
  }
}
```

## State Management

### Local State Guidelines
```typescript
// ✅ Good - useState for simple state
const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: ''
  });
  
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = useCallback((field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  // Rest of component...
};
```

### useReducer for Complex State
```typescript
// ✅ Good - useReducer for complex state logic
interface FormState {
  data: ContactFormData;
  errors: ValidationErrors;
  isSubmitting: boolean;
  submitAttempted: boolean;
}

type FormAction =
  | { type: 'UPDATE_FIELD'; field: keyof ContactFormData; value: string }
  | { type: 'SET_ERRORS'; errors: ValidationErrors }
  | { type: 'SET_SUBMITTING'; isSubmitting: boolean }
  | { type: 'SUBMIT_ATTEMPTED' }
  | { type: 'RESET_FORM' };

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return {
        ...state,
        data: { ...state.data, [action.field]: action.value },
        errors: { ...state.errors, [action.field]: undefined }
      };
    case 'SET_ERRORS':
      return { ...state, errors: action.errors };
    case 'SET_SUBMITTING':
      return { ...state, isSubmitting: action.isSubmitting };
    case 'SUBMIT_ATTEMPTED':
      return { ...state, submitAttempted: true };
    case 'RESET_FORM':
      return initialFormState;
    default:
      return state;
  }
};
```

### Context Usage
```typescript
// ✅ Good - Context for app-wide state
interface AppContextValue {
  user: User | null;
  theme: 'light' | 'dark';
  language: 'fr' | 'en';
  updateTheme: (theme: 'light' | 'dark') => void;
  updateLanguage: (language: 'fr' | 'en') => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export const useAppContext = (): AppContextValue => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState<'fr' | 'en'>('fr');

  const updateTheme = useCallback((newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  }, []);

  const updateLanguage = useCallback((newLanguage: 'fr' | 'en') => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  }, []);

  const value = useMemo(() => ({
    user,
    theme,
    language,
    updateTheme,
    updateLanguage
  }), [user, theme, language, updateTheme, updateLanguage]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
```

## Performance Guidelines

### Memoization Best Practices
```typescript
// ✅ Good - Memoize expensive calculations
const ExpensiveComponent: React.FC<{ data: ComplexData[] }> = ({ data }) => {
  const processedData = useMemo(() => {
    return data
      .filter(item => item.isActive)
      .sort((a, b) => b.priority - a.priority)
      .map(item => ({
        ...item,
        formattedDate: formatDate(item.createdAt)
      }));
  }, [data]);

  return (
    <div>
      {processedData.map(item => (
        <ItemComponent key={item.id} item={item} />
      ))}
    </div>
  );
};

// ✅ Good - Memoize callback functions
const ParentComponent: React.FC = () => {
  const [filter, setFilter] = useState('');
  
  const handleItemClick = useCallback((itemId: string) => {
    // Handle item click
    console.log('Item clicked:', itemId);
  }, []);

  const handleFilterChange = useCallback((newFilter: string) => {
    setFilter(newFilter);
  }, []);

  return (
    <div>
      <FilterInput onFilterChange={handleFilterChange} />
      <ItemList onItemClick={handleItemClick} filter={filter} />
    </div>
  );
};
```

### Code Splitting
```typescript
// ✅ Good - Route-based code splitting
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

const HomePage = lazy(() => import('../pages/HomePage'));
const AboutPage = lazy(() => import('../pages/AboutPage'));
const BlogPage = lazy(() => import('../pages/BlogPage'));

const AppRouter: React.FC = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/blog" element={<BlogPage />} />
    </Routes>
  </Suspense>
);

// ✅ Good - Component-based code splitting
const HeavyComponent = lazy(() => import('./HeavyComponent'));

const ConditionalComponent: React.FC<{ showHeavy: boolean }> = ({ showHeavy }) => (
  <div>
    {showHeavy && (
      <Suspense fallback={<div>Loading...</div>}>
        <HeavyComponent />
      </Suspense>
    )}
  </div>
);
```

### Image Optimization
```typescript
// ✅ Good - Optimized image component
interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  sizes?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  loading = 'lazy',
  sizes
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => setIsLoaded(true);
  const handleError = () => setHasError(true);

  if (hasError) {
    return (
      <div className={`image-placeholder ${className}`}>
        <span>Image failed to load</span>
      </div>
    );
  }

  return (
    <div className={`image-container ${className}`}>
      {!isLoaded && <div className="image-skeleton" />}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        sizes={sizes}
        onLoad={handleLoad}
        onError={handleError}
        className={`image ${isLoaded ? 'image--loaded' : ''}`}
      />
    </div>
  );
};
```

## Accessibility Standards

### ARIA Guidelines
```typescript
// ✅ Good - Proper ARIA usage
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-content"
    >
      <div
        ref={modalRef}
        className="modal-content"
        tabIndex={-1}
      >
        <header className="modal-header">
          <h2 id="modal-title">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Fermer la boîte de dialogue"
            className="modal-close"
          >
            ×
          </button>
        </header>
        <div id="modal-content" className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};
```

### Keyboard Navigation
```typescript
// ✅ Good - Keyboard navigation support
const Dropdown: React.FC<DropdownProps> = ({ options, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (focusedIndex >= 0) {
          onSelect(options[focusedIndex]);
          setIsOpen(false);
        } else {
          setIsOpen(!isOpen);
        }
        break;
      case 'ArrowDown':
        event.preventDefault();
        setFocusedIndex(prev => 
          prev < options.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setFocusedIndex(prev => 
          prev > 0 ? prev - 1 : options.length - 1
        );
        break;
      case 'Escape':
        setIsOpen(false);
        setFocusedIndex(-1);
        break;
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="dropdown"
      role="combobox"
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* Dropdown implementation */}
    </div>
  );
};
```

### Focus Management
```typescript
// ✅ Good - Focus management utilities
export const useFocusTrap = (isActive: boolean) => {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }, [isActive]);

  return containerRef;
};
```

## Security Best Practices

### Input Validation
```typescript
// ✅ Good - Input validation and sanitization
import DOMPurify from 'dompurify';

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => boolean;
}

interface ValidationRules {
  [key: string]: ValidationRule;
}

const validateForm = (data: Record<string, string>, rules: ValidationRules) => {
  const errors: Record<string, string> = {};

  Object.entries(rules).forEach(([field, rule]) => {
    const value = data[field];

    if (rule.required && (!value || value.trim() === '')) {
      errors[field] = 'Ce champ est requis';
      return;
    }

    if (value) {
      if (rule.minLength && value.length < rule.minLength) {
        errors[field] = `Minimum ${rule.minLength} caractères requis`;
      }

      if (rule.maxLength && value.length > rule.maxLength) {
        errors[field] = `Maximum ${rule.maxLength} caractères autorisés`;
      }

      if (rule.pattern && !rule.pattern.test(value)) {
        errors[field] = 'Format invalide';
      }

      if (rule.custom && !rule.custom(value)) {
        errors[field] = 'Valeur invalide';
      }
    }
  });

  return errors;
};

const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['class']
  });
};
```

### XSS Prevention
```typescript
// ✅ Good - Safe content rendering
interface SafeHtmlProps {
  content: string;
  className?: string;
}

const SafeHtml: React.FC<SafeHtmlProps> = ({ content, className = '' }) => {
  const sanitizedContent = useMemo(() => {
    return DOMPurify.sanitize(content, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a'],
      ALLOWED_ATTR: ['href', 'title', 'class'],
      ALLOW_DATA_ATTR: false
    });
  }, [content]);

  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
};

// ❌ Bad - Direct innerHTML usage
const UnsafeComponent = ({ content }: { content: string }) => (
  <div dangerouslySetInnerHTML={{ __html: content }} />
);
```

## Testing Strategy

### Unit Testing Guidelines
```typescript
// ✅ Good - Component testing with React Testing Library
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactForm } from './ContactForm';

describe('ContactForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all required fields', () => {
    render(<ContactForm onSubmit={mockOnSubmit} />);
    
    expect(screen.getByLabelText(/nom/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /envoyer/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty required fields', async () => {
    const user = userEvent.setup();
    render(<ContactForm onSubmit={mockOnSubmit} />);
    
    const submitButton = screen.getByRole('button', { name: /envoyer/i });
    await user.click(submitButton);

    expect(await screen.findByText(/nom est requis/i)).toBeInTheDocument();
    expect(await screen.findByText(/email est requis/i)).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    render(<ContactForm onSubmit={mockOnSubmit} />);
    
    await user.type(screen.getByLabelText(/nom/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user