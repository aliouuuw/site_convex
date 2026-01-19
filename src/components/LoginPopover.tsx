import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useAuth } from "../contexts/AuthContext";
import { Eye, EyeOff, AlertCircle, User, Mail, Lock } from "lucide-react";

interface LoginPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
  trigger: React.ReactNode;
}

interface LoginFormData {
  email: string;
  password: string;
  isSignUp: boolean;
}

export function LoginPopover({ 
  isOpen, 
  onClose, 
  onLoginSuccess,
  trigger 
}: LoginPopoverProps) {
  const { signIn, signUp, isLoading, error, clearError } = useAuth();
  const allowSignUp = String((import.meta.env as any).VITE_ENABLE_SIGNUP) === "true";
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    isSignUp: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

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
      const isSignUp = allowSignUp && formData.isSignUp;

      if (isSignUp) {
        await signUp(formData.email, formData.password);
      } else {
        await signIn(formData.email, formData.password);
      }
      
      // Reset form on success
      setFormData({ email: "", password: "", isSignUp: false });
      onLoginSuccess?.();
    } catch (err) {
      // Error is handled by the auth context
      console.error("Authentication failed:", err);
    }
  };

  const toggleMode = () => {
    if (!allowSignUp) return;
    setFormData(prev => ({ ...prev, isSignUp: !prev.isSignUp }));
    setFormError(null);
    clearError();
  };

  const displayError = formError || error;

  return (
    <Popover open={isOpen} onOpenChange={onClose}>
      <PopoverTrigger asChild>
        {trigger}
      </PopoverTrigger>
      <PopoverContent className="w-96" align="end">
        <div className="p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {allowSignUp && formData.isSignUp ? "Créer un compte" : "Bienvenue"}
            </h3>
            <p className="text-sm text-gray-600">
              {allowSignUp && formData.isSignUp 
                ? "Créez un compte pour accéder aux fonctionnalités d'édition" 
                : "Connectez-vous pour accéder aux fonctionnalités d'édition"
              }
            </p>
          </div>

          {/* Form */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              void handleSubmit(e);
            }} 
            className="space-y-5"
          >
            {/* Email Input */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Adresse email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Entrez votre adresse email"
                disabled={isLoading}
                required
                className="pl-10"
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Mot de passe
              </label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Entrez votre mot de passe"
                  disabled={isLoading}
                  required
                  className="pl-10 pr-10"
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
              {allowSignUp && formData.isSignUp && (
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
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 transition-all duration-200"
              disabled={isLoading}
              formNoValidate
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
            </Button>
          </form>

          {allowSignUp && (
            <div className="mt-6 pt-4 border-t border-gray-200">
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
          )}

          {/* Additional Info */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              En continuant, vous acceptez nos Conditions d'utilisation et notre Politique de confidentialité
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
