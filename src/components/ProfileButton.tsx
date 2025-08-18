import React, { useState } from "react";
import { User, LogIn, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { LoginPopover } from "./LoginPopover";
import { Link } from "react-router-dom";
import { FaUserCog } from "react-icons/fa";

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

  if (isAuthenticated) {
    return (
      <div className="relative">
        <button
          onClick={handleProfileClick}
          className={`btn btn-secondary flex items-center gap-2 relative z-[51] ${className}`}
          disabled={isLoading}
          aria-label="Menu du profil"
          aria-expanded={isPopoverOpen}
          aria-haspopup="true"
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            fontFamily: 'var(--font-poppins)',
            letterSpacing: '0.025em'
          }}
        >
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">
              {user?.name?.split(' ')[0] || user?.email?.split('@')[0] || "Utilisateur"}
            </span>
            <ChevronDown 
              className="w-4 h-4 transition-transform duration-300" 
              style={{ 
                transform: isPopoverOpen ? 'rotate(180deg)' : 'rotate(0deg)' 
              }} 
            />
          </div>
        </button>

        {isPopoverOpen && (
          <>
            <div 
              className="absolute top-full right-0 mt-2 w-64 bg-white shadow-lg z-[60] overflow-hidden"
              style={{
                border: '1px solid var(--gray-200)',
                borderRadius: 'var(--radius)',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div 
                className="px-4 py-3 border-b"
                style={{
                  borderBottomColor: 'var(--gray-200)',
                  backgroundColor: 'var(--gray-50)'
                }}
              >
                <p 
                  className="font-semibold truncate"
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--gray-900)',
                    fontFamily: 'var(--font-poppins)'
                  }}
                >
                  {user?.name || "Utilisateur"}
                </p>
                {user?.email && (
                  <p 
                    className="truncate"
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--gray-500)',
                      marginTop: '0.25rem'
                    }}
                  >
                    {user.email}
                  </p>
                )}
              </div>
              <Link to="/admin">
                <button
                  className="w-full px-4 py-3 text-left flex items-center gap-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--gray-700)',
                    fontFamily: 'var(--font-inter)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--gray-50)';
                    e.currentTarget.style.color = 'var(--gray-900)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--gray-700)';
                  }}
                >
                  <FaUserCog className="w-4 h-4" />
                  <span>Administration</span>
                </button>
              </Link>
              <button
                onClick={handleSignOutClick}
                disabled={isLoading}
                className="w-full px-4 py-3 text-left flex items-center gap-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--gray-700)',
                  fontFamily: 'var(--font-inter)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#fef2f2';
                  e.currentTarget.style.color = '#dc2626';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--gray-700)';
                }}
              >
                <LogOut className="w-4 h-4" />
                <span>Se déconnecter</span>
              </button>
            </div>
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
          className={`btn btn-secondary flex items-center gap-2 relative z-[51] ${className}`}
          aria-label="Se connecter"
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            fontFamily: 'var(--font-poppins)',
            letterSpacing: '0.025em'
          }}
        >
          <LogIn className="w-4 h-4" />
          <span className="hidden sm:inline">Se connecter</span>
        </button>
      }
    />
  );
}
