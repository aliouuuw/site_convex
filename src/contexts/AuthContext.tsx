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

  const getConciseAuthErrorInfo = (rawMessage: string) => {
    const message = rawMessage || "";

    // Try to extract a meaningful error code like "InvalidSecret" from Convex stack traces.
    const codeMatch = message.match(/\b([A-Z][A-Za-z0-9]+)\b(?=\s+at\s+)/);
    const explicitInvalidSecret = message.includes("InvalidSecret");
    const code = explicitInvalidSecret ? "InvalidSecret" : codeMatch?.[1];

    // Also provide a short summary line if possible (avoid leaking stack traces)
    const summary = message
      .replace(/^\s*\[CONVEX[^\]]*\]\s*/i, "")
      .replace(/\[Request ID:[^\]]+\]\s*/i, "")
      .replace(/Server Error\s*/i, "")
      .split("\n")[0]
      .split(" at ")[0]
      .trim();

    return { code, summary };
  };

  const getErrorMessage = (err: unknown, context?: "signIn" | "signUp" | "signOut"): string => {
    if (err instanceof Error) {
      const { code, summary } = getConciseAuthErrorInfo(err.message);
      const message = err.message.toLowerCase();
      
      // Provide more user-friendly error messages in French
      if (
        message.includes("invalid credentials") ||
        message.includes("wrong password") ||
        message.includes("invalid password") ||
        message.includes("invalid login") ||
        message.includes("incorrect password")
      ) {
        return "Email ou mot de passe incorrect. Veuillez vérifier vos identifiants et réessayer.";
      }
      if (code === "InvalidSecret") {
        return "Mot de passe incorrect. Veuillez réessayer.";
      }
      if (message.includes("user not found") || message.includes("no user")) {
        return "Aucun compte trouvé avec cette adresse email. Veuillez vérifier votre email ou créer un nouveau compte.";
      }
      if (
        message.includes("email already exists") ||
        message.includes("already registered") ||
        message.includes("user already exists")
      ) {
        return "Un compte avec cette adresse email existe déjà. Veuillez vous connecter à la place.";
      }
      if (message.includes("email not verified") || message.includes("verify your email")) {
        return "Votre adresse email n'est pas encore vérifiée. Veuillez consulter votre boîte mail.";
      }
      if (message.includes("account disabled") || message.includes("account locked")) {
        return "Votre compte est temporairement désactivé. Veuillez contacter l'administrateur.";
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
      if (message.includes("missing") || message.includes("required")) {
        if (message.includes("email")) {
          return "L'adresse email est requise pour continuer.";
        }
        if (message.includes("password")) {
          return "Le mot de passe est requis pour continuer.";
        }
        return "Certaines informations obligatoires sont manquantes.";
      }
      if (message.includes("not allowed") || message.includes("unauthorized")) {
        return "Action non autorisée. Veuillez vérifier vos droits d'accès.";
      }

      if (context === "signOut") {
        return "Impossible de vous déconnecter pour le moment. Veuillez réessayer.";
      }

      if (code) {
        return `Erreur d'authentification (code : ${code}). Veuillez réessayer.`;
      }

      if (summary) {
        return `Erreur d'authentification : ${summary}`;
      }

      return "Impossible de vous authentifier pour le moment. Veuillez réessayer.";
    }
    return "Une erreur inattendue s'est produite. Veuillez réessayer.";
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await convexSignIn("password", { email, password, flow: "signIn" });
    } catch (err) {
      const errorMessage = getErrorMessage(err, "signIn");
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
      const errorMessage = getErrorMessage(err, "signUp");
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
      const errorMessage = getErrorMessage(err, "signOut");
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
