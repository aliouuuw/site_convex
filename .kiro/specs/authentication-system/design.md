# Design Document

## Overview

The authentication system will integrate Convex Auth with the existing project to secure editing functionality. The design leverages the existing Convex Auth setup (Password provider) and integrates seamlessly with the current UI patterns and edit mode system. The solution replaces the public EditModeToggle with authentication-gated access while preserving the existing edit mode URL-based state management.

## Architecture

### Authentication Flow
```
User clicks Profile Icon → Login Popover → Convex Auth → Update Auth State → Enable Edit Access
```

### Component Integration
- **Navigation Component**: Add profile icon button with authentication state display
- **Login Popover**: Modal dialog for credential input using existing UI components
- **Auth Context**: Convex Auth integration with React context for state management
- **Edit Mode Hook**: Enhanced to check authentication status before enabling edit mode
- **EditModeToggle**: Commented out but preserved for potential future use

### State Management
- Convex Auth handles authentication state persistence
- React context provides authentication status to components
- URL-based edit mode state remains unchanged (edit=true parameter)
- Authentication status gates access to edit mode functionality

## Components and Interfaces

### 1. AuthProvider Component
```typescript
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>; // Temporary for testing
  signOut: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}
```

### 2. LoginPopover Component
```typescript
interface LoginPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  trigger: React.ReactNode;
}

interface LoginFormData {
  email: string;
  password: string;
  isSignUp: boolean; // Temporary for testing
}
```

### 3. ProfileButton Component
```typescript
interface ProfileButtonProps {
  className?: string;
}
```

### 4. Enhanced useEditMode Hook
```typescript
interface EditModeHook {
  isEditMode: boolean;
  isAuthenticated: boolean;
  canEdit: boolean; // New: combines auth + edit mode
  enableEditMode: () => void; // Now checks authentication
  disableEditMode: () => void;
  toggleEditMode: () => void; // Now checks authentication
  // ... existing properties
}
```

## Data Models

### User Model (Convex Schema)
```typescript
// Already defined in convex/schema.ts via Convex Auth
interface User {
  _id: Id<"users">;
  email: string;
  emailVerified?: boolean;
  // Additional fields as needed
}
```

### Authentication State
```typescript
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}
```

## Error Handling

### Authentication Errors
- **Invalid Credentials**: Display user-friendly error message in login form
- **Network Errors**: Show retry option with appropriate messaging
- **Session Expiry**: Automatically disable edit mode and show login prompt
- **Rate Limiting**: Display temporary lockout message

### Edit Mode Access Errors
- **Unauthenticated Access**: Redirect to login when edit mode is attempted
- **Session Loss**: Gracefully exit edit mode and preserve user work
- **Permission Errors**: Clear error messaging with login option

### Error Display Strategy
- Form-level errors for login/signup validation
- Toast notifications for session-related errors
- Inline messaging for access control issues

## Testing Strategy

### Unit Tests
- **AuthProvider**: Authentication state management and context provision
- **LoginPopover**: Form validation, submission, and error handling
- **ProfileButton**: Authentication state display and interaction
- **useEditMode**: Enhanced authentication checks and edit mode gating

### Integration Tests
- **Authentication Flow**: Complete login/logout cycle with UI updates
- **Edit Mode Integration**: Authentication-gated edit mode access
- **Session Management**: Persistence across page refreshes and navigation
- **Error Scenarios**: Network failures, invalid credentials, session expiry

### Manual Testing Scenarios
1. **Initial Setup**: Signup flow for testing purposes
2. **Login Flow**: Credential validation and successful authentication
3. **Edit Mode Access**: Authentication requirement for edit functionality
4. **Session Persistence**: Maintaining login state across browser sessions
5. **Logout Flow**: Clean session termination and UI state reset
6. **Error Handling**: Various failure scenarios and recovery

## Implementation Details

### UI Integration Points
1. **Navigation Bar**: Profile icon placement next to inscription button
2. **Login Popover**: Positioned relative to profile icon with proper z-index
3. **Edit Mode Indicators**: Authentication-aware display of edit capabilities
4. **Error States**: Consistent with existing design system patterns

### Styling Approach
- Reuse existing button variants from `src/components/ui/button.tsx`
- Leverage existing popover component from `src/components/ui/popover.tsx`
- Match navigation styling patterns from `Navigation.tsx`
- Consistent with CSS custom properties and design tokens

### Security Considerations
- Password-based authentication via Convex Auth
- Secure session management with automatic expiry
- Client-side authentication state validation
- Protection against unauthorized edit mode access

### Performance Considerations
- Lazy loading of authentication components
- Efficient re-rendering with proper React context usage
- Minimal impact on existing page load performance
- Optimized authentication state checks

## Migration Strategy

### Phase 1: Authentication Infrastructure
- Set up AuthProvider and context
- Create login/profile components
- Integrate with existing Convex Auth setup

### Phase 2: UI Integration
- Add profile button to navigation
- Implement login popover with existing UI components
- Comment out EditModeToggle component

### Phase 3: Edit Mode Integration
- Enhance useEditMode hook with authentication checks
- Update edit mode access throughout application
- Test authentication-gated functionality

### Phase 4: Testing and Refinement
- Comprehensive testing of authentication flows
- Error handling validation
- Performance optimization
- Temporary signup removal for production