import React, { createContext, useContext, ReactNode } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

interface User {
  _id: Id<"users">;
  _creationTime: number;
  name?: string;
  email?: string;
  phone?: string;
  image?: string;
  emailVerificationTime?: number;
  phoneVerificationTime?: number;
  isAnonymous?: boolean;
}

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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { signIn: convexSignIn, signOut: convexSignOut } = useAuthActions();
  const user = useQuery(api.myFunctions.getCurrentUser);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const isAuthenticated = !!user;

  const clearError = () => {
    setError(null);
  };

  const getErrorMessage = (err: unknown): string => {
    if (err instanceof Error) {
      const message = err.message.toLowerCase();
      
      // Provide more user-friendly error messages
      if (message.includes("invalid credentials") || message.includes("wrong password")) {
        return "Invalid email or password. Please check your credentials and try again.";
      }
      if (message.includes("user not found")) {
        return "No account found with this email address. Please check your email or create a new account.";
      }
      if (message.includes("email already exists") || message.includes("already registered")) {
        return "An account with this email already exists. Please sign in instead.";
      }
      if (message.includes("network") || message.includes("connection")) {
        return "Network error. Please check your internet connection and try again.";
      }
      if (message.includes("rate limit") || message.includes("too many requests")) {
        return "Too many attempts. Please wait a moment before trying again.";
      }
      if (message.includes("weak password")) {
        return "Password is too weak. Please choose a stronger password.";
      }
      if (message.includes("invalid email")) {
        return "Please enter a valid email address.";
      }
      
      return err.message;
    }
    return "An unexpected error occurred. Please try again.";
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await convexSignIn("password", { email, password, flow: "signIn" });
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await convexSignIn("password", { email, password, flow: "signUp" });
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await convexSignOut();
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    isAuthenticated,
    user: user ?? null,
    signIn,
    signUp,
    signOut,
    isLoading,
    error,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
