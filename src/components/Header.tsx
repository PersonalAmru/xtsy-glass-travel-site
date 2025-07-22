
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Menu, X, User, Settings, Users, ShoppingCart, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "./AuthModal";
import { UserMenu } from "./UserMenu";
import { Link } from "react-router-dom";
import TourCartModal from "./TourCartModal";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'signin' | 'signup' | 'newsletter'>('signin');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const { user, loading } = useAuth();

  // Generate or get session ID for this guest
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

  // Listen for cart updates
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

  return (
    <>
      <header className="bg-card/80 backdrop-blur-lg border-b border-border shadow-sm sticky top-0 z-50 safe-area-padding">
        <div className="responsive-container">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 touch-friendly">
              <img 
                src="/lovable-uploads/f60939c8-8351-4f63-80df-a4c6e37e539a.png"
                alt="XTSY Travellers Hostel"
                className="h-8 sm:h-10 w-auto"
              />
            </Link>

            {/* Desktop Navigation - All items aligned right */}
            <nav className="hidden md:flex items-center space-x-8 ml-auto">
              <Link 
                to="/" 
                className="text-foreground hover:text-primary transition-colors"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className="text-foreground hover:text-primary transition-colors"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                About
              </Link>
              <Link 
                to="/gallery" 
                className="text-foreground hover:text-primary transition-colors"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Gallery
              </Link>
              <Link 
                to="/deals" 
                className="text-foreground hover:text-primary transition-colors"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Deals
              </Link>
              
              {/* Travel Navigation Menu */}
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-foreground hover:text-primary transition-colors">
                      Travel
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid gap-3 p-4 w-[300px]">
                        <NavigationMenuLink asChild>
                          <Link 
                            to="/travel?tab=domestic" 
                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors"
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                          >
                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                              🇮🇳
                            </div>
                            <div>
                              <div className="font-semibold text-foreground">Domestic Travel</div>
                              <div className="text-sm text-muted-foreground">Explore India with us</div>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <Link 
                            to="/travel?tab=international" 
                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors"
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                          >
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              🌏
                            </div>
                            <div>
                              <div className="font-semibold text-foreground">International Travel</div>
                              <div className="text-sm text-muted-foreground">XTSY Asia & more</div>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
              
              {/* Authentication Section */}
              <div className="flex items-center space-x-4">
                {loading ? (
                  <div className="w-8 h-8 animate-pulse bg-gray-200 rounded-full"></div>
                ) : user ? (
                  <div className="flex items-center space-x-2">
                    <Link to="/dashboard">
                      <Button variant="ghost" size="sm">
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
                    className="text-green-600 hover:text-green-700"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Newsletter
                  </Button>
                )}
              </div>
            </nav>

            {/* Mobile menu button */}
            <button
              className="md:hidden touch-friendly"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t safe-area-padding">
              <nav className="flex flex-col space-y-3">
                <Link 
                  to="/" 
                  className="text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  to="/about" 
                  className="text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
                <Link 
                  to="/gallery" 
                  className="text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Gallery
                </Link>
                <Link 
                  to="/deals" 
                  className="text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Deals
                </Link>
                
                {/* Mobile Travel Menu */}
                <div className="pl-4 space-y-2">
                  <div className="font-semibold text-foreground">Travel</div>
                  <Link 
                    to="/travel?tab=domestic" 
                    className="block text-muted-foreground hover:text-primary transition-colors pl-4"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    🇮🇳 Domestic Travel
                  </Link>
                  <Link 
                    to="/travel?tab=international" 
                    className="block text-muted-foreground hover:text-primary transition-colors pl-4"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    🌏 International Travel
                  </Link>
                </div>
                
                {user ? (
                  <div className="pt-4 border-t">
                    <Link 
                      to="/dashboard" 
                      className="flex items-center text-foreground hover:text-primary transition-colors mb-4"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                    <div className="text-sm text-muted-foreground">
                      Signed in as {user.user_metadata?.full_name || user.email}
                    </div>
                  </div>
                ) : (
                  <div className="pt-4 border-t space-y-2">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-green-600"
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
    </>
  );
};

export default Header;
