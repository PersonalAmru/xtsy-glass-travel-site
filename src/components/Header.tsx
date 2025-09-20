import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Menu, X, User, Settings, Users, ShoppingCart, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "./AuthModal";
import { UserMenu } from "./UserMenu";
import { CurrencySelector } from "./CurrencySelector";
import { useApp } from "@/contexts/AppContext";
import { Link } from "react-router-dom";
import TourCartModal from "./TourCartModal";
import TravelSelectionModal from "./TravelSelectionModal";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "./ui/hover-card";
import { XTSY270_DATA } from "@/data/rooms/xtsy270";
import xtsyLogo from "@/assets/xtsy-brand-logo.png";
import { useMediaQuery } from "@/hooks/use-mobile";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'signin' | 'signup'>('signin');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isTravelModalOpen, setIsTravelModalOpen] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const { user, loading } = useAuth();
  const { setCurrency } = useApp();
  
  // Use the new responsive hooks
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const isTouchDevice = useMediaQuery('(hover: none) and (pointer: coarse)');

  useEffect(() => {
    setLogoLoaded(true);
  }, []);

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

  const handleAuthClick = (tab: 'signin' | 'signup') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

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
      <header className="sticky top-0 z-50 safe-top safe-left safe-right bg-black/80 backdrop-blur-md border-b border-white/10">
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
                  fetchPriority="high"
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
                  className="px-3 py-2 text-white hover:text-primary hover:bg-white/10 hover:scale-105 rounded-md transition-all duration-200 font-medium touch-target shadow-sm hover:shadow-md"
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
                <Link 
                  to={XTSY270_DATA.path}
                  className="px-3 py-2 text-white hover:text-primary hover:bg-white/10 hover:scale-105 rounded-md transition-all duration-200 font-medium touch-target shadow-sm hover:shadow-md"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  {XTSY270_DATA.shortName}
                </Link>
                
                <Link 
                  to="/events" 
                  className="px-3 py-2 text-white hover:text-primary hover:bg-white/10 hover:scale-105 rounded-md transition-all duration-200 font-medium touch-target shadow-sm hover:shadow-md"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  Events
                </Link>
                
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
                </div>
                
                {/* Authentication Section */}
                <div className="flex items-center space-x-4">
                  {loading ? (
                    <div className="w-8 h-8 animate-pulse bg-white/20 rounded-full"></div>
                  ) : user ? (
                    <div className="flex items-center space-x-2">
                      <UserMenu />
                    </div>
                  ) : (
                     <div className="flex items-center space-x-2">
                       <Button 
                         variant="ghost" 
                         size="sm"
                         onClick={() => handleAuthClick('signin')}
                         className="text-white hover:text-primary hover:bg-white/10 touch-target"
                       >
                         <User className="h-4 w-4 mr-2" />
                         Sign In
                       </Button>
                     </div>
                  )}
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
                <Link 
                  to={XTSY270_DATA.path} 
                  className="px-4 py-3 text-white hover:text-primary hover:bg-white/10 rounded-md transition-all duration-200 font-medium touch-target text-left"
                  aria-label={`${XTSY270_DATA.name} details`}
                  title={XTSY270_DATA.seoTitle}
                  onClick={() => {
                    setIsMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  {XTSY270_DATA.shortName}
                </Link>
                
                <Link 
                  to="/events" 
                  className="px-4 py-3 text-white hover:text-primary hover:bg-white/10 rounded-md transition-all duration-200 font-medium touch-target text-left"
                  onClick={() => {
                    setIsMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  Events
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
              
                {/* Currency Selector for Mobile/Tablet - responsive layout */}
                <div className="mx-4 mt-4 pt-4 pb-2 border-t border-white/20">
                  <div className="text-sm font-medium text-white/80 mb-3">Select Currency:</div>
                  <CurrencySelector 
                    className="w-full bg-black/50 border border-white/20 rounded-md text-white" 
                    onCurrencyChange={setCurrency}
                  />
                </div>
              
                {user ? (
                  <div className="mx-4 pt-4 border-t border-white/20">
                    <div className="text-sm text-white/60 px-4 py-2">
                      Signed in as {user.email}
                    </div>
                  </div>
                ) : (
                  <div className="mx-4 pt-4 border-t border-white/20 space-y-2">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start px-4 py-3 text-white hover:text-primary hover:bg-white/10 rounded-md touch-target"
                      onClick={() => {
                        handleAuthClick('signin');
                        setIsMenuOpen(false);
                      }}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Sign In
                    </Button>
                  </div>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultTab={authModalTab}
      />

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
