import React, { useState } from "react";
import { User, LogIn, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { LoginPopover } from "./LoginPopover";

interface ProfileButtonProps {
  className?: string;
}

export function ProfileButton({ className = "" }: ProfileButtonProps) {
  const { isAuthenticated, user, signOut, isLoading } = useAuth();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsPopoverOpen(false);
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  const handleSignOutClick = () => {
    handleSignOut().catch(console.error);
  };

  const handleLoginSuccess = () => {
    setIsPopoverOpen(false);
  };

  const handleProfileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsPopoverOpen(!isPopoverOpen);
  };

  const handleBackdropClick = () => {
    setIsPopoverOpen(false);
  };

  if (isAuthenticated) {
    return (
      <div className="relative">
        <button
          onClick={handleProfileClick}
          className={`flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 relative z-[51] ${className}`}
          disabled={isLoading}
          aria-label="Profile menu"
          aria-expanded={isPopoverOpen}
          aria-haspopup="true"
        >
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">
              {user?.name?.split(' ')[0] || user?.email?.split('@')[0] || "User"}
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isPopoverOpen ? 'rotate-180' : ''}`} />
          </div>
        </button>

        {isPopoverOpen && (
          <>
            <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-[60] overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.name || "User"}
                </p>
                {user?.email && (
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                )}
              </div>
              <button
                onClick={handleSignOutClick}
                disabled={isLoading}
                className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>

            {/* Backdrop to close popover */}
            <div
              className="fixed inset-0 z-[55] bg-black bg-opacity-20 backdrop-blur-sm"
              onClick={handleBackdropClick}
            />
          </>
        )}
      </div>
    );
  }

  return (
    <LoginPopover
      isOpen={isPopoverOpen}
      onClose={() => setIsPopoverOpen(false)}
      onLoginSuccess={handleLoginSuccess}
      trigger={
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsPopoverOpen(true);
          }}
          className={`flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 relative z-[51] ${className}`}
          aria-label="Sign in"
        >
          <LogIn className="w-4 h-4" />
          <span className="hidden sm:inline">Sign In</span>
        </button>
      }
    />
  );
}
