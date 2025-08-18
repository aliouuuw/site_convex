import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Eye, EyeOff, AlertCircle, User, Mail, Lock } from "lucide-react";

interface LoginFormData {
  email: string;
  password: string;
  isSignUp: boolean;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signIn, signUp, isLoading, error, clearError, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    isSignUp: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Get redirect URL from query parameters
  const redirectTo = searchParams.get("redirect") || "/admin";

  // If already authenticated, redirect to the intended destination
  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectTo]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear errors when user starts typing
    if (formError) setFormError(null);
    if (error) clearError();
  };

  const validateForm = (): boolean => {
    if (!formData.email.trim()) {
      setFormError("L'adresse email est requise");
      return false;
    }
    
    if (!formData.email.includes("@")) {
      setFormError("Veuillez entrer une adresse email valide");
      return false;
    }
    
    if (!formData.password.trim()) {
      setFormError("Le mot de passe est requis");
      return false;
    }
    
    if (formData.password.length < 6) {
      setFormError("Le mot de passe doit contenir au moins 6 caractères");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setFormError(null);
    clearError();
    
    try {
      if (formData.isSignUp) {
        await signUp(formData.email, formData.password);
      } else {
        await signIn(formData.email, formData.password);
      }
      
      // Reset form on success
      setFormData({ email: "", password: "", isSignUp: false });
      
      // Redirect will be handled by the useEffect above
    } catch (err) {
      // Error is handled by the auth context
      console.error("Authentication failed:", err);
    }
  };

  const toggleMode = () => {
    setFormData(prev => ({ ...prev, isSignUp: !prev.isSignUp }));
    setFormError(null);
    clearError();
  };

  const displayError = formError || error;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {formData.isSignUp ? "Créer un compte" : "Bienvenue"}
          </h2>
          <p className="text-gray-600">
            {formData.isSignUp 
              ? "Créez un compte pour accéder au panneau d'administration" 
              : "Connectez-vous pour accéder au panneau d'administration"
            }
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Adresse email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Entrez votre adresse email"
                disabled={isLoading}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Entrez votre mot de passe"
                  disabled={isLoading}
                  required
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isLoading}
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {formData.isSignUp && (
                <p className="text-xs text-gray-500">
                  Le mot de passe doit contenir au moins 6 caractères
                </p>
              )}
            </div>

            {/* Error Message */}
            {displayError && (
              <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{displayError}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading 
                ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Veuillez patienter...</span>
                  </div>
                ) 
                : formData.isSignUp 
                  ? "Créer un compte" 
                  : "Se connecter"
              }
            </button>
          </form>

          {/* Mode Toggle */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={toggleMode}
              className="w-full text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              disabled={isLoading}
            >
              {formData.isSignUp 
                ? "Vous avez déjà un compte ? Se connecter" 
                : "Besoin d'un compte ? En créer un"
              }
            </button>
          </div>

          {/* Back to Home */}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              ← Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
