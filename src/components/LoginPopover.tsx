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
      setFormError("Email is required");
      return false;
    }
    
    if (!formData.email.includes("@")) {
      setFormError("Please enter a valid email address");
      return false;
    }
    
    if (!formData.password.trim()) {
      setFormError("Password is required");
      return false;
    }
    
    if (formData.password.length < 6) {
      setFormError("Password must be at least 6 characters");
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
      onLoginSuccess?.();
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
              {formData.isSignUp ? "Create Account" : "Welcome Back"}
            </h3>
            <p className="text-sm text-gray-600">
              {formData.isSignUp 
                ? "Create an account to access editing features" 
                : "Sign in to access editing features"
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
                Email Address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
                disabled={isLoading}
                required
                className="pl-10"
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  disabled={isLoading}
                  required
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isLoading}
                  aria-label={showPassword ? "Hide password" : "Show password"}
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
                  Password must be at least 6 characters long
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
                    <span>Please wait...</span>
                  </div>
                ) 
                : formData.isSignUp 
                  ? "Create Account" 
                  : "Sign In"
              }
            </Button>
          </form>

          {/* Mode Toggle */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={toggleMode}
              className="w-full text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              disabled={isLoading}
            >
              {formData.isSignUp 
                ? "Already have an account? Sign in" 
                : "Need an account? Create one"
              }
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
