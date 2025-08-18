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
      
      // Provide more user-friendly error messages in French
      if (message.includes("invalid credentials") || message.includes("wrong password")) {
        return "Email ou mot de passe incorrect. Veuillez vérifier vos identifiants et réessayer.";
      }
      if (message.includes("user not found")) {
        return "Aucun compte trouvé avec cette adresse email. Veuillez vérifier votre email ou créer un nouveau compte.";
      }
      if (message.includes("email already exists") || message.includes("already registered")) {
        return "Un compte avec cette adresse email existe déjà. Veuillez vous connecter à la place.";
      }
      if (message.includes("network") || message.includes("connection")) {
        return "Erreur de réseau. Veuillez vérifier votre connexion internet et réessayer.";
      }
      if (message.includes("rate limit") || message.includes("too many requests")) {
        return "Trop de tentatives. Veuillez attendre un moment avant de réessayer.";
      }
      if (message.includes("weak password")) {
        return "Le mot de passe est trop faible. Veuillez choisir un mot de passe plus fort.";
      }
      if (message.includes("invalid email")) {
        return "Veuillez entrer une adresse email valide.";
      }
      
      return err.message;
    }
    return "Une erreur inattendue s'est produite. Veuillez réessayer.";
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
