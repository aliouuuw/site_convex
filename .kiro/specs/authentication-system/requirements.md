# Requirements Document

## Introduction

This feature adds authentication to the project using Convex Auth to prevent unauthorized public editing. The system will replace the current public edit mode toggle with a secure authentication-based approach, where only authenticated users can access edit functionality. The implementation includes a login interface integrated into the existing navigation and proper access control for editing features.

## Requirements

### Requirement 1

**User Story:** As a site administrator, I want to secure the editing functionality behind authentication, so that only authorized users can modify content.

#### Acceptance Criteria

1. WHEN an unauthenticated user visits the site THEN the system SHALL hide all editing controls and functionality
2. WHEN an unauthenticated user attempts to access edit mode THEN the system SHALL prevent access and redirect to login
3. WHEN an authenticated user visits the site THEN the system SHALL display editing controls and allow edit mode access
4. IF a user's session expires THEN the system SHALL automatically disable edit mode and require re-authentication

### Requirement 2

**User Story:** As a site administrator, I want a login interface integrated into the navigation, so that I can easily authenticate without disrupting the user experience.

#### Acceptance Criteria

1. WHEN viewing the navigation THEN the system SHALL display a profile icon button next to the inscription button
2. WHEN the profile icon is clicked THEN the system SHALL show a popover/dialog with login credentials form
3. WHEN login credentials are entered correctly THEN the system SHALL authenticate the user and close the dialog
4. WHEN login fails THEN the system SHALL display appropriate error messages
5. WHEN a user is authenticated THEN the profile icon SHALL indicate the logged-in state
6. WHEN an authenticated user clicks the profile icon THEN the system SHALL show logout option

### Requirement 3

**User Story:** As a developer, I want to temporarily allow user signup for testing purposes, so that I can validate the authentication system before restricting access.

#### Acceptance Criteria

1. WHEN the login dialog is displayed THEN the system SHALL include a signup option for testing
2. WHEN signup is used THEN the system SHALL create a new user account and authenticate them
3. WHEN testing is complete THEN the signup functionality SHALL be easily removable without affecting login
4. IF signup is disabled THEN the system SHALL only show login options

### Requirement 4

**User Story:** As a site administrator, I want the EditModeToggle component to be disabled but preserved, so that it can be restored if needed without losing the implementation.

#### Acceptance Criteria

1. WHEN the authentication system is implemented THEN the EditModeToggle component SHALL be commented out but not deleted
2. WHEN edit mode is needed THEN the system SHALL use authentication status instead of the toggle
3. WHEN the component is commented out THEN the system SHALL not display the toggle in the UI
4. IF the component needs to be restored THEN the code SHALL be easily uncommented

### Requirement 5

**User Story:** As a user, I want the login interface to match the existing design system, so that the authentication feels integrated and consistent.

#### Acceptance Criteria

1. WHEN the profile icon button is displayed THEN it SHALL match the style and positioning of other navigation buttons
2. WHEN the login dialog appears THEN it SHALL use consistent styling with existing UI components
3. WHEN form elements are displayed THEN they SHALL use the same design patterns as other forms in the project
4. WHEN the authentication state changes THEN visual feedback SHALL be consistent with the overall design language