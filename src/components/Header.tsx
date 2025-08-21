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

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'signin' | 'signup' | 'newsletter'>('signin');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isTravelModalOpen, setIsTravelModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const { user, loading } = useAuth();
  const { setCurrency } = useApp();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  const handleAuthClick = (tab: 'signin' | 'signup' | 'newsletter') => {
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
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo - critical above-the-fold image with proper error handling */}
            <Link to="/" className="flex items-center space-x-2 touch-target ml-4 sm:ml-6">
              {!logoError ? (
                <img 
                  src={xtsyLogo}
                  alt="XTSY Travellers Hostel"
                  className="h-10 sm:h-12 w-auto hover:opacity-80 transition-opacity cursor-pointer"
                  loading="eager"
                  fetchPriority="high"
                  decoding="sync"
                  onLoad={handleLogoLoad}
                  onError={handleLogoError}
                  onClick={(e) => {
                    e.preventDefault();
                    window.open('/gallery?category=brand-assets', '_blank');
                  }}
                  title="View brand assets in gallery"
                />
              ) : (
                <div className="h-10 sm:h-12 w-20 bg-gradient-to-r from-orange-500 to-red-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-sm">XTSY</span>
                </div>
              )}
            </Link>

            {/* Desktop Navigation - All items aligned right */}
            <nav className="hidden lg:flex items-center space-x-2 ml-auto">
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
                to="/gallery" 
                className="px-3 py-2 text-white hover:text-primary hover:bg-white/10 hover:scale-105 rounded-md transition-all duration-200 font-medium touch-target shadow-sm hover:shadow-md"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Gallery
              </Link>
              <Link 
                to="/deals" 
                className="px-3 py-2 text-white hover:text-primary hover:bg-white/10 hover:scale-105 rounded-md transition-all duration-200 font-medium touch-target shadow-sm hover:shadow-md"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Deals
              </Link>
              <Link 
                to={XTSY270_DATA.path}
                className="px-3 py-2 text-white hover:text-primary hover:bg-white/10 hover:scale-105 rounded-md transition-all duration-200 font-medium touch-target shadow-sm hover:shadow-md"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                {XTSY270_DATA.shortName}
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
                    <Link to="/dashboard">
                      <Button variant="ghost" size="sm" className="touch-target text-white hover:text-primary hover:bg-white/10">
                        <Settings className="h-4 w-4 mr-2" />
                        Dashboard
                      </Button>
                    </Link>
                    <UserMenu />
                  </div>
                ) : (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleAuthClick('newsletter')}
                    className="text-green-400 hover:text-green-300 hover:bg-white/10 touch-target"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Newsletter
                  </Button>
                )}
              </div>
            </nav>

            {/* Mobile and Tablet menu button */}
            <button
              className="lg:hidden touch-target text-white p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

            {/* Mobile and Tablet Navigation */}
            {isMenuOpen && (
              <div className="lg:hidden py-4 border-t border-white/20 safe-area-padding">
                <nav className="flex flex-col space-y-3">
                  <Link 
                    to="/" 
                    className="text-white hover:text-primary transition-colors"
                    onClick={() => {
                      setIsMenuOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    Home
                  </Link>
                  <Link 
                    to="/about" 
                    className="text-white hover:text-primary transition-colors"
                    onClick={() => {
                      setIsMenuOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    About
                  </Link>
                  <Link 
                    to="/gallery" 
                    className="text-white hover:text-primary transition-colors"
                    onClick={() => {
                      setIsMenuOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    Gallery
                  </Link>
                   <Link 
                     to="/deals" 
                     className="text-white hover:text-primary transition-colors"
                     onClick={() => {
                       setIsMenuOpen(false);
                       window.scrollTo({ top: 0, behavior: 'smooth' });
                     }}
                   >
                     Deals
                   </Link>
                   <Link 
                     to={XTSY270_DATA.path} 
                     className="text-white hover:text-primary transition-colors"
                     aria-label={`${XTSY270_DATA.name} details`}
                     title={XTSY270_DATA.seoTitle}
                     onClick={() => {
                       setIsMenuOpen(false);
                       window.scrollTo({ top: 0, behavior: 'smooth' });
                     }}
                   >
                     {XTSY270_DATA.shortName}
                   </Link>
                  
                   <button
                    onClick={() => {
                      setIsTravelModalOpen(true);
                      setIsMenuOpen(false);
                    }}
                    className="text-white hover:text-primary transition-colors text-left"
                  >
                    Travel
                  </button>
                
                  {/* Currency Selector for Mobile */}
                  <div className="pt-3 pb-2 border-t border-white/20">
                    <div className="text-sm font-medium text-white/80 mb-3">Select Currency:</div>
                    <CurrencySelector 
                      className="w-full bg-black/50 border border-white/20 rounded-md text-white" 
                      onCurrencyChange={setCurrency}
                    />
                  </div>
                
                {user ? (
                  <div className="pt-4 border-t border-white/20">
                    <Link 
                      to="/dashboard" 
                      className="flex items-center text-white hover:text-primary transition-colors mb-4"
                      onClick={() => {
                        setIsMenuOpen(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                    <div className="text-sm text-white/60">
                      Signed in as {user.user_metadata?.full_name || user.email}
                    </div>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-white/20 space-y-2">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-green-400 hover:text-green-300 hover:bg-white/10"
                      onClick={() => {
                        handleAuthClick('newsletter');
                        setIsMenuOpen(false);
                      }}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Newsletter
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
