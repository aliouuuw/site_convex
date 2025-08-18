import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  redirectTo?: string;
}

export default function AuthGuard({ 
  children, 
  requireAdmin = false, 
  redirectTo = "/" 
}: AuthGuardProps) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login or specified redirect path
  if (!isAuthenticated) {
    // Store the attempted URL to redirect back after login
    const currentPath = location.pathname + location.search;
    const loginUrl = `/login?redirect=${encodeURIComponent(currentPath)}`;
    
    return <Navigate to={loginUrl} replace />;
  }

  // If admin access is required, check if user has admin role
  if (requireAdmin) {
    // For now, we'll consider any authenticated user as admin
    // In the future, you can add role-based checks here
    // const isAdmin = user?.role === "admin" || user?.role === "super_admin";
    const isAdmin = true; // Temporary: allow all authenticated users as admin
    
    if (!isAdmin) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Accès refusé</h2>
            <p className="text-gray-600 mb-4">
              Vous n'avez pas la permission d'accéder à cette page. Veuillez contacter un administrateur si vous pensez qu'il s'agit d'une erreur.
            </p>
            <button
              onClick={() => window.history.back()}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Retour
            </button>
          </div>
        </div>
      );
    }
  }

  // If authenticated and authorized, render the children
  return <>{children}</>;
}
