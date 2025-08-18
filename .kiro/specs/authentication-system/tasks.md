# Implementation Plan

- [x] 1. Set up authentication infrastructure
  - Create AuthProvider context component to wrap the application with Convex Auth integration
  - Implement authentication state management with user session persistence
  - Write unit tests for AuthProvider context and state management
  - _Requirements: 1.1, 1.3, 1.4_

- [x] 2. Create authentication UI components
  - [x] 2.1 Implement ProfileButton component
    - Create ProfileButton component with authentication state display (logged in/out icons)
    - Add click handler to trigger login popover
    - Style component to match existing navigation button patterns
    - Write unit tests for ProfileButton component interactions
    - _Requirements: 2.1, 2.5, 5.1_

  - [x] 2.2 Implement LoginPopover component
    - Create LoginPopover component using existing Radix UI popover primitives
    - Implement login form with email/password fields using existing input components
    - Add form validation and error display functionality
    - Include temporary signup option for testing purposes
    - Style popover to match existing design system patterns
    - Write unit tests for LoginPopover form validation and submission
    - _Requirements: 2.2, 2.3, 2.4, 3.1, 3.2, 5.2, 5.3_

- [x] 3. Integrate authentication with navigation
  - Modify Navigation.tsx to include ProfileButton next to inscription button
  - Ensure ProfileButton positioning matches existing navigation layout
  - Test responsive behavior on mobile and desktop viewports
  - _Requirements: 2.1, 2.5, 5.1_

- [ ] 4. Enhance edit mode system with authentication
  - [ ] 4.1 Update useEditMode hook
    - Modify useEditMode hook to include authentication status checks
    - Add canEdit computed property that combines authentication and edit mode state
    - Update toggleEditMode to require authentication before enabling edit mode
    - Preserve existing URL-based edit mode state management
    - Write unit tests for enhanced useEditMode hook functionality
    - _Requirements: 1.1, 1.2, 1.3_

  - [ ] 4.2 Comment out EditModeToggle component
    - Comment out EditModeToggle component usage in relevant pages/components
    - Preserve component code for potential future restoration
    - Update any imports or references to EditModeToggle
    - _Requirements: 4.1, 4.2, 4.3_

- [ ] 5. Implement authentication-gated edit access
  - Update all editable components to check authentication status before showing edit controls
  - Modify edit mode indicators to reflect authentication requirements
  - Add authentication prompts when unauthenticated users attempt to access edit functionality
  - Test edit mode access control across different page types
  - _Requirements: 1.1, 1.2, 1.3_

- [ ] 6. Add error handling and user feedback
  - Implement error handling for authentication failures (invalid credentials, network errors)
  - Add session expiry detection and automatic edit mode disabling
  - Create user-friendly error messages consistent with existing UI patterns
  - Add loading states for authentication operations
  - Write unit tests for error handling scenarios
  - _Requirements: 2.4, 1.4_

- [ ] 7. Create authentication integration tests
  - Write integration tests for complete authentication flow (login/logout)
  - Test authentication-gated edit mode access scenarios
  - Verify session persistence across page navigation and browser refresh
  - Test error scenarios including network failures and invalid credentials
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.2, 2.3_

- [ ] 8. Update application root with AuthProvider
  - Wrap main App component with AuthProvider to provide authentication context
  - Ensure proper provider ordering with existing context providers
  - Test authentication state availability throughout component tree
  - _Requirements: 1.1, 1.3_

- [ ] 9. Implement logout functionality
  - Add logout option to ProfileButton when user is authenticated
  - Implement signOut functionality with proper session cleanup
  - Update UI state after logout to reflect unauthenticated status
  - Test logout flow and edit mode state cleanup
  - _Requirements: 2.6, 1.4_

- [ ] 10. Final integration and testing
  - Test complete authentication system with all edit mode functionality
  - Verify responsive design and accessibility compliance
  - Validate error handling and edge cases
  - Ensure no regression in existing non-edit functionality
  - Document temporary signup removal process for production deployment
  - _Requirements: 3.3, 5.4_
