import React, { useState, useEffect } from "react";
import { Menu, X, User, LogOut, Download } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { Link, useNavigate } from "react-router-dom";
import xtsyLogo from "@/assets/xtsy-brand-logo.png";
import { useMediaQuery } from "@/hooks/use-mobile";
import { useUserAuth } from "@/contexts/UserAuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * Simplified Header Component
 * Only contains: Logo (left) + Sign In button (right)
 * All navigation links (About, XTSY Prime, Travel) removed as per homepage revamp
 */
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const navigate = useNavigate();
  const { user, signOut, isLoading: authLoading } = useUserAuth();
  const isAuthenticated = !!user;
  
  // Use responsive hooks
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  const handleLogoError = () => {
    console.error('Logo failed to load, using fallback');
    setLogoError(true);
  };

  const handleLogoLoad = () => {
    setLogoLoaded(true);
    setLogoError(false);
  };

  return (
    <header className={`sticky top-0 z-50 safe-top safe-left safe-right border-b border-white/10 ${
      isMobile ? 'bg-black/95' : 'bg-black/80 backdrop-blur-md'
    }`}>
      <div className="responsive-container mobile-compact">
        <div className={`flex justify-between items-center ${isMobile ? 'h-14' : 'h-16'}`}>
          {/* Logo - left side */}
          <Link to="/" className="flex items-center space-x-2 touch-target ml-4 sm:ml-6">
            {!logoError ? (
              <img 
                src={xtsyLogo}
                alt="XTSY Travellers Hostel"
                className={`w-auto hover:opacity-80 transition-opacity cursor-pointer ${
                  isMobile ? 'h-10' : isTablet ? 'h-11' : 'h-12'
                }`}
                loading="eager"
                // @ts-expect-error - React 18.3 uses fetchPriority but DOM expects fetchpriority
                fetchpriority="high"
                decoding="sync"
                onLoad={handleLogoLoad}
                onError={handleLogoError}
                title="Go to home page"
              />
            ) : (
              <div className={`bg-gradient-to-r from-orange-500 to-red-600 rounded flex items-center justify-center ${
                isMobile ? 'h-10 w-20' : isTablet ? 'h-11 w-22' : 'h-12 w-24'
              }`}>
                <span className="text-white font-bold text-sm">XTSY</span>
              </div>
            )}
          </Link>

          {/* Right side - Sign In only */}
          <div className="flex items-center gap-3 mr-4 sm:mr-6">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 text-white hover:text-primary transition-colors duration-200 touch-target">
                  {user?.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt={user.displayName || 'Profile'}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/30"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <User size={16} className="text-primary" />
                    </div>
                  )}
                  {isDesktop && (
                    <span className="text-sm font-medium">
                      {user?.displayName || user?.email?.split('@')[0] || 'Account'}
                    </span>
                  )}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-black/95 border-white/20 min-w-[180px]">
                  <div className="px-3 py-2 border-b border-white/10">
                    <p className="text-white font-medium text-sm truncate">
                      {user?.displayName || user?.email?.split('@')[0] || 'Account'}
                    </p>
                    <p className="text-white/60 text-xs truncate">{user?.email}</p>
                  </div>
                  <DropdownMenuItem 
                    className="text-white hover:text-primary cursor-pointer"
                    onClick={() => navigate('/profile')}
                  >
                    <User size={16} className="mr-2" />
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-blue-400 hover:text-blue-300 cursor-pointer"
                    onClick={() => navigate('/install')}
                  >
                    <Download size={16} className="mr-2" />
                    Install App
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-white hover:text-destructive cursor-pointer"
                    onClick={() => signOut()}
                  >
                    <LogOut size={16} className="mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                to="/auth"
                className="flex items-center gap-2 px-4 py-2 text-white bg-primary/20 hover:bg-primary hover:text-white rounded-md transition-all duration-200 font-medium text-sm"
              >
                <User size={16} />
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
