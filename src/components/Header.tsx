import React, { useState, useEffect } from "react";
import { Menu, X, ShieldCheck, User, LogOut } from "lucide-react";
import { CurrencySelector } from "./CurrencySelector";
import { useApp } from "@/contexts/AppContext";
import { Link, useNavigate } from "react-router-dom";
import TourCartModal from "./TourCartModal";
import TravelSelectionModal from "./TravelSelectionModal";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "./ui/hover-card";
import { XTSY270_DATA } from "@/data/rooms/xtsy270";
import xtsyLogo from "@/assets/xtsy-brand-logo.png";
import { useMediaQuery } from "@/hooks/use-mobile";
import { useUserAuth } from "@/contexts/UserAuthContext";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isTravelModalOpen, setIsTravelModalOpen] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const { setCurrency } = useApp();
  const navigate = useNavigate();
  const { user, signOut, isLoading: authLoading } = useUserAuth();
  const isAuthenticated = !!user;
  
  // Use the new responsive hooks
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const isTouchDevice = useMediaQuery('(hover: none) and (pointer: coarse)');

  // Prefetch XTSY Prime pages on hover for faster navigation
  const prefetchXTSYPrimePages = () => {
    // Prefetch all XTSY Prime page chunks
    import("@/pages/XTSY270");
    import("@/pages/PetFriendly");
    import("@/pages/XTSYvsZostel");
    import("@/pages/FemaleTravellers");
    import("@/pages/WorkFromHome");
    import("@/pages/XTSYRentals");
  };

  useEffect(() => {
    let sessionId = localStorage.getItem("current_guest_session");
    if (!sessionId) {
      sessionId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("current_guest_session", sessionId);
    }
    setCurrentSessionId(sessionId);
    updateCartCount(sessionId);
  }, []);

  const updateCartCount = (sessionId: string) => {
    const cartData = localStorage.getItem(`tour_cart_${sessionId}`);
    if (cartData) {
      const items = JSON.parse(cartData);
      setCartItemCount(items.length);
    } else {
      setCartItemCount(0);
    }
  };

  useEffect(() => {
    const handleStorageChange = () => {
      if (currentSessionId) {
        updateCartCount(currentSessionId);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [currentSessionId]);


  const handleLogoError = () => {
    console.error('Logo failed to load, using fallback');
    setLogoError(true);
  };

  const handleLogoLoad = () => {
    setLogoLoaded(true);
    setLogoError(false);
  };

  return (
    <>
      <header className={`sticky top-0 z-50 safe-top safe-left safe-right border-b border-white/10 ${
        isMobile ? 'bg-black/95' : 'bg-black/80 backdrop-blur-md'
      }`}>
        <div className="responsive-container mobile-compact">
          <div className={`flex justify-between items-center ${isMobile ? 'h-14' : 'h-16'}`}>
            {/* Logo - responsive sizing based on screen size */}
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

            {/* Desktop Navigation - conditional rendering based on screen size */}
            {isDesktop && (
              <nav className="flex items-center space-x-2 ml-auto">
                <Link 
                  to="/" 
                  className="px-3 py-2 text-white hover:text-primary hover:bg-white/10 rounded-md transition-colors duration-200 font-medium touch-target"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  Home
                </Link>
                <Link 
                  to="/about" 
                  className="px-3 py-2 text-white hover:text-primary hover:bg-white/10 hover:scale-105 rounded-md transition-all duration-200 font-medium touch-target shadow-sm hover:shadow-md"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  About
                </Link>
                <NavigationMenu>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger 
                        className="px-3 py-2 text-white hover:text-primary hover:bg-white/10 rounded-md transition-all duration-200 font-medium bg-transparent"
                        onMouseEnter={prefetchXTSYPrimePages}
                      >
                        XTSY Prime
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className="bg-black/95 backdrop-blur-md border border-white/20">
                        <ul className="w-48 p-2">
                          <li>
                            <NavigationMenuLink asChild>
                              <Link
                                to={XTSY270_DATA.path}
                                className="block px-4 py-3 text-white hover:text-primary hover:bg-white/10 rounded-md transition-all duration-200"
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                              >
                                XTSY 270°
                              </Link>
                            </NavigationMenuLink>
                          </li>
                          <li>
                            <NavigationMenuLink asChild>
                              <Link
                                to="/pet-friendly"
                                className="block px-4 py-3 text-white hover:text-primary hover:bg-white/10 rounded-md transition-all duration-200"
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                              >
                                Pet Friendly
                              </Link>
                            </NavigationMenuLink>
                          </li>
                          <li>
                            <NavigationMenuLink asChild>
                              <Link
                                to="/xtsy-vs-zostel"
                                className="block px-4 py-3 text-white hover:text-primary hover:bg-white/10 rounded-md transition-all duration-200"
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                              >
                                XTSY vs Zostel
                              </Link>
                            </NavigationMenuLink>
                          </li>
                          <li>
                            <NavigationMenuLink asChild>
                              <Link
                                to="/female-travellers"
                                className="block px-4 py-3 text-white hover:text-primary hover:bg-white/10 rounded-md transition-all duration-200"
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                              >
                                Female Travellers
                              </Link>
                            </NavigationMenuLink>
                          </li>
                          <li>
                            <NavigationMenuLink asChild>
                              <Link
                                to="/work-from-home"
                                className="block px-4 py-3 text-white hover:text-primary hover:bg-white/10 rounded-md transition-all duration-200"
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                              >
                                Work From Home
                              </Link>
                            </NavigationMenuLink>
                          </li>
                          <li>
                            <NavigationMenuLink asChild>
                              <Link
                                to="/xtsy-rentals"
                                className="block px-4 py-3 text-white hover:text-primary hover:bg-white/10 rounded-md transition-all duration-200"
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                              >
                                XTSY Rentals
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
                
                <button
                  onClick={() => setIsTravelModalOpen(true)}
                  className="px-3 py-2 text-white hover:text-primary hover:bg-white/10 hover:scale-105 rounded-md transition-all duration-200 font-medium touch-target shadow-sm hover:shadow-md"
                >
                  Travel
                </button>
                
                
                {/* Language and Currency Selectors */}
                <div className="flex items-center gap-3 border-l border-white/20 pl-4">
                  <CurrencySelector 
                    className="text-white" 
                    onCurrencyChange={setCurrency}
                  />
                  
                  {/* User Auth Button */}
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
                      className="flex items-center gap-2 px-3 py-1.5 text-white bg-primary/20 hover:bg-primary hover:text-white rounded-md transition-all duration-200 font-medium text-sm"
                    >
                      <User size={16} />
                      Sign In
                    </Link>
                  )}
                  
                  <Link
                    to="/admin-login"
                    className="text-white/70 hover:text-primary hover:scale-110 transition-all duration-200 touch-target"
                    title="Admin Login"
                    aria-label="Admin Login"
                  >
                    <ShieldCheck size={20} />
                  </Link>
                </div>
              </nav>
            )}

            {/* Mobile and Tablet menu button - conditional rendering */}
            {!isDesktop && (
              <button
                className="touch-target text-white p-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            )}
          </div>

          {/* Mobile and Tablet Navigation - conditional rendering with responsive layout */}
          {!isDesktop && isMenuOpen && (
            <div className="py-4 border-t border-white/20 safe-area-padding">
              <nav className="flex flex-col px-4 sm:px-6 gap-responsive">
                <Link 
                  to="/" 
                  className="px-4 py-3 text-white hover:text-primary hover:bg-white/10 rounded-md transition-all duration-200 font-medium touch-target text-left"
                  onClick={() => {
                    setIsMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  Home
                </Link>
                <Link 
                  to="/about" 
                  className="px-4 py-3 text-white hover:text-primary hover:bg-white/10 rounded-md transition-all duration-200 font-medium touch-target text-left"
                  onClick={() => {
                    setIsMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  About
                </Link>
{/* XTSY Prime Dropdown */}
                <details className="group" onToggle={prefetchXTSYPrimePages}>
                  <summary className="px-4 py-3 text-center text-primary text-base font-bold bg-white/5 border-y border-white/10 cursor-pointer list-none flex items-center justify-center gap-2">
                    XTSY Prime
                    <svg 
                      className="w-4 h-4 transition-transform group-open:rotate-180" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="space-y-1 py-2 bg-black/30">
                    <Link 
                      to={XTSY270_DATA.path} 
                      className="px-6 py-3 text-white bg-gradient-to-r from-primary/20 to-transparent hover:from-primary/30 hover:text-primary border-l-4 border-primary rounded-md transition-all duration-200 font-semibold text-base touch-target text-left block shadow-sm"
                      onClick={() => {
                        setIsMenuOpen(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      ✨ XTSY 270°
                    </Link>
                    <Link 
                      to="/pet-friendly"
                      className="px-6 py-3 text-white bg-gradient-to-r from-primary/20 to-transparent hover:from-primary/30 hover:text-primary border-l-4 border-primary rounded-md transition-all duration-200 font-semibold text-base touch-target text-left block shadow-sm"
                      onClick={() => {
                        setIsMenuOpen(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      🐾 Pet Friendly
                    </Link>
                    <Link 
                      to="/xtsy-vs-zostel"
                      className="px-6 py-3 text-white bg-gradient-to-r from-primary/20 to-transparent hover:from-primary/30 hover:text-primary border-l-4 border-primary rounded-md transition-all duration-200 font-semibold text-base touch-target text-left block shadow-sm"
                      onClick={() => {
                        setIsMenuOpen(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      ⚡ XTSY vs Zostel
                    </Link>
                    <Link 
                      to="/female-travellers"
                      className="px-6 py-3 text-white bg-gradient-to-r from-primary/20 to-transparent hover:from-primary/30 hover:text-primary border-l-4 border-primary rounded-md transition-all duration-200 font-semibold text-base touch-target text-left block shadow-sm"
                      onClick={() => {
                        setIsMenuOpen(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      👩 Female Travellers
                    </Link>
                    <Link 
                      to="/work-from-home"
                      className="px-6 py-3 text-white bg-gradient-to-r from-primary/20 to-transparent hover:from-primary/30 hover:text-primary border-l-4 border-primary rounded-md transition-all duration-200 font-semibold text-base touch-target text-left block shadow-sm"
                      onClick={() => {
                        setIsMenuOpen(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      💼 Work From Home
                    </Link>
                    <Link 
                      to="/xtsy-rentals"
                      className="px-6 py-3 text-white bg-gradient-to-r from-primary/20 to-transparent hover:from-primary/30 hover:text-primary border-l-4 border-primary rounded-md transition-all duration-200 font-semibold text-base touch-target text-left block shadow-sm"
                      onClick={() => {
                        setIsMenuOpen(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      🚗 XTSY Rentals
                    </Link>
                  </div>
                </details>
                
                <Link 
                  to="/gallery" 
                  className="px-4 py-3 text-white hover:text-primary hover:bg-white/10 rounded-md transition-all duration-200 font-medium touch-target text-left"
                  onClick={() => {
                    setIsMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  Gallery
                </Link>
                
                <button
                  onClick={() => {
                    setIsTravelModalOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="px-4 py-3 text-white hover:text-primary hover:bg-white/10 rounded-md transition-all duration-200 font-medium touch-target text-left"
                >
                  Travel
                </button>
              
                {/* Currency Selector and Auth for Mobile/Tablet */}
                <div className="mx-4 mt-4 pt-4 pb-2 border-t border-white/20">
                  <div className="text-sm font-medium text-white/80 mb-3">Select Currency:</div>
                  <CurrencySelector 
                    className="w-full bg-black/50 border border-white/20 rounded-md text-white" 
                    onCurrencyChange={setCurrency}
                  />
                  
                  {/* User Auth Button for Mobile */}
                  {isAuthenticated ? (
                    <div className="mt-3 space-y-1">
                      <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-lg">
                        {user?.photoURL ? (
                          <img 
                            src={user.photoURL} 
                            alt={user.displayName || 'Profile'}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/30"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <User size={20} className="text-primary" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate">
                            {user?.displayName || user?.email?.split('@')[0] || 'Account'}
                          </p>
                          <p className="text-white/60 text-xs truncate">{user?.email}</p>
                        </div>
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 w-full px-4 py-3 text-white hover:text-primary hover:bg-white/10 rounded-md transition-all duration-200 font-medium touch-target text-left"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User size={18} />
                        My Profile
                      </Link>
                      <button
                        onClick={() => {
                          signOut();
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center gap-2 w-full px-4 py-3 text-white hover:text-destructive hover:bg-destructive/10 rounded-md transition-all duration-200 font-medium touch-target text-left"
                      >
                        <LogOut size={18} />
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <Link
                      to="/auth"
                      className="flex items-center gap-2 w-full px-4 py-3 mt-3 text-white bg-primary/20 hover:bg-primary rounded-md transition-all duration-200 font-medium touch-target justify-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User size={18} />
                      Sign In
                    </Link>
                  )}
                  
                  <Link
                    to="/admin-login"
                    className="flex items-center gap-2 px-4 py-3 mt-2 text-white/70 hover:text-primary hover:bg-white/10 rounded-md transition-all duration-200 font-medium touch-target text-left"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <ShieldCheck size={18} />
                    Admin Login
                  </Link>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      <TourCartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        sessionId={currentSessionId || undefined}
      />

      <TravelSelectionModal
        isOpen={isTravelModalOpen}
        onClose={() => setIsTravelModalOpen(false)}
      />
    </>
  );
};

export default Header;
