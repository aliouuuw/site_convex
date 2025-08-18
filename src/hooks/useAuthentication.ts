/**
 * Custom hook that provides authentication functionality
 * This is a convenience hook that wraps the AuthContext
 */

import { useAuth } from "../contexts/AuthContext";

export function useAuthentication() {
  const auth = useAuth();

  return {
    ...auth,
    // Additional computed properties for convenience
    canEdit: auth.isAuthenticated, // This will be used by edit mode components
    isSignedIn: auth.isAuthenticated,
    isSignedOut: !auth.isAuthenticated,
  };
}

export default useAuthentication;
