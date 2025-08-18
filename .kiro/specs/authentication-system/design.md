# Authentication System Design

## Overview

The authentication system for Les Hirondelles website provides secure access control for both the live edit functionality and the admin panel. It integrates with Convex Auth to provide a seamless user experience while maintaining security best practices.

## Architecture

### Core Components

#### 1. Authentication Infrastructure
- **Convex Auth Integration**: Uses Convex Auth with Password provider for secure authentication
- **AuthProvider**: React context wrapper that provides authentication state throughout the application
- **Session Management**: Automatic session persistence and expiry detection

#### 2. UI Components
- **ProfileButton**: Displays authentication state and provides login/logout functionality
- **LoginPopover**: Modal dialog for email/password authentication
- **LoginPage**: Full-page authentication for admin access
- **AuthGuard**: Route protection component for admin routes

#### 3. Edit Mode Integration
- **useEditMode Hook**: Enhanced with authentication checks
- **EditProvider**: Manages edit mode state with authentication gating
- **Live Edit System**: Protected behind authentication

### Component Hierarchy

```
App
├── AuthProvider (Convex Auth wrapper)
├── EditProvider (Edit mode management)
├── Navigation
│   └── ProfileButton
│       ├── LoginPopover (unauthenticated)
│       └── User Dropdown (authenticated)
│           ├── Admin Panel Link
│           └── Logout Button
├── AuthGuard (admin routes)
│   └── Admin Pages
└── Public Pages
```

## Data Flow

### Authentication Flow
1. **User clicks "Se connecter"** → LoginPopover opens
2. **User enters credentials** → AuthProvider calls Convex Auth
3. **Authentication success** → User state updated, edit mode available
4. **Authentication failure** → Error message displayed

### Edit Mode Flow
1. **User navigates to page** → useEditMode checks authentication
2. **User enables edit mode** → Authentication required, redirect to login if needed
3. **Edit mode active** → Live edit functionality available
4. **Session expires** → Automatic edit mode disable with user notification

### Admin Access Flow
1. **User tries to access /admin/*** → AuthGuard checks authentication
2. **Unauthenticated** → Redirect to /login with return URL
3. **Authenticated** → Admin panel access granted
4. **Session expires** → Automatic logout and redirect

## State Management

### AuthProvider State
```typescript
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}
```

### Edit Mode State
```typescript
interface EditModeState {
  isEditMode: boolean;
  canEdit: boolean; // isAuthenticated && isEditMode
  editPanelOpen: boolean;
  currentPage: string;
  // ... other state properties
}
```

## Security Features

### Route Protection
- **Admin Routes**: All `/admin/*` routes protected by AuthGuard
- **Edit Mode**: Live edit functionality gated behind authentication
- **Session Management**: Automatic session expiry detection

### Error Handling
- **User-friendly Messages**: French error messages for all authentication failures
- **Loading States**: Proper loading indicators during authentication operations
- **Graceful Degradation**: Fallback behavior when authentication fails

### Session Security
- **Automatic Logout**: Session expiry detection and automatic logout
- **State Cleanup**: Proper cleanup of edit mode when session expires
- **Redirect Handling**: Secure redirect after authentication

## UI/UX Design

### French Localization
All authentication UI components use French language:
- **Form Labels**: "Adresse email", "Mot de passe"
- **Buttons**: "Se connecter", "Se déconnecter", "Créer un compte"
- **Error Messages**: User-friendly French error messages
- **Loading States**: "Veuillez patienter...", "Vérification de l'authentification..."

### Responsive Design
- **Mobile**: Optimized for touch interactions
- **Desktop**: Hover states and keyboard navigation
- **Accessibility**: Proper ARIA labels and focus management

### Visual Design
- **Consistent Styling**: Matches existing site design system
- **Smooth Transitions**: CSS transitions for state changes
- **Clear Feedback**: Visual indicators for authentication state

## Integration Points

### Convex Backend
- **Auth Functions**: Leverages Convex Auth for secure authentication
- **User Management**: User data stored in Convex database
- **Session Persistence**: Automatic session management

### React Router
- **Route Protection**: AuthGuard component for protected routes
- **Redirect Handling**: Proper redirect after authentication
- **URL State**: Edit mode state managed via URL parameters

### Live Edit System
- **Authentication Gating**: Edit mode requires authentication
- **State Synchronization**: Edit mode state synchronized with auth state
- **Session Expiry**: Automatic edit mode disable on session expiry

## Error Handling Strategy

### Authentication Errors
```typescript
const getErrorMessage = (err: unknown): string => {
  // French error messages for different error types
  if (message.includes("invalid credentials")) {
    return "Email ou mot de passe incorrect. Veuillez vérifier vos identifiants et réessayer.";
  }
  // ... other error types
};
```

### Network Errors
- **Connection Issues**: User-friendly network error messages
- **Retry Logic**: Automatic retry for transient failures
- **Offline Handling**: Graceful degradation when offline

### Session Errors
- **Expiry Detection**: Automatic detection and user notification
- **State Cleanup**: Proper cleanup of application state
- **Redirect Logic**: Secure redirect to login page

## Testing Strategy

### Unit Tests
- **AuthProvider**: Test authentication state management
- **useEditMode**: Test edit mode authentication integration
- **Error Handling**: Test error message generation

### Integration Tests
- **Authentication Flow**: Complete login/logout flow
- **Edit Mode Access**: Authentication-gated edit mode
- **Admin Access**: Protected route access

### User Acceptance Tests
- **French Language**: Verify all text is in French
- **Responsive Design**: Test on different screen sizes
- **Accessibility**: Verify keyboard navigation and screen reader support

## Production Considerations

### Security
- **HTTPS Only**: All authentication over secure connections
- **Password Requirements**: Minimum password strength requirements
- **Rate Limiting**: Protection against brute force attacks

### Performance
- **Lazy Loading**: Authentication components loaded on demand
- **State Optimization**: Efficient state management
- **Caching**: Appropriate caching of authentication state

### Monitoring
- **Error Tracking**: Monitor authentication failures
- **Usage Analytics**: Track authentication patterns
- **Security Monitoring**: Monitor for suspicious activity

## Future Enhancements

### Role-Based Access
- **Admin Roles**: Different admin permission levels
- **Content Roles**: Specific content editing permissions
- **Audit Trail**: Track user actions for security

### Multi-Factor Authentication
- **2FA Support**: Additional security layer
- **SMS/Email Verification**: Multiple verification methods
- **Backup Codes**: Recovery options for 2FA

### Social Authentication
- **OAuth Providers**: Google, Facebook, etc.
- **Single Sign-On**: Integration with school systems
- **Federation**: Cross-domain authentication

## Implementation Status: ✅ COMPLETE

The authentication system has been successfully implemented with all planned features:

- ✅ **Core Authentication**: Convex Auth integration
- ✅ **UI Components**: ProfileButton, LoginPopover, LoginPage
- ✅ **Route Protection**: AuthGuard for admin routes
- ✅ **Edit Mode Integration**: Authentication-gated live editing
- ✅ **French Localization**: Complete French language support
- ✅ **Error Handling**: User-friendly error messages
- ✅ **Session Management**: Automatic session expiry detection
- ✅ **Responsive Design**: Mobile and desktop optimization
- ✅ **Accessibility**: ARIA labels and keyboard navigation

The system is production-ready and fully integrated with the Les Hirondelles website.