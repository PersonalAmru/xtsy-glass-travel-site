
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Menu, X, User, Settings, Users, ShoppingCart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "./AuthModal";
import { UserMenu } from "./UserMenu";
import { Link } from "react-router-dom";
import TourCartModal from "./TourCartModal";

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
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/f60939c8-8351-4f63-80df-a4c6e37e539a.png"
                alt="XTSY Travellers Hostel"
                className="h-10 w-auto"
              />
            </Link>

            {/* Desktop Navigation - All items aligned right */}
            <nav className="hidden md:flex items-center space-x-8 ml-auto">
              <Link to="/" className="text-gray-700 hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-primary transition-colors">
                About
              </Link>
              <Link to="/gallery" className="text-gray-700 hover:text-primary transition-colors">
                Gallery
              </Link>
              <Link to="/deals" className="text-gray-700 hover:text-primary transition-colors">
                Deals
              </Link>
              
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
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <nav className="flex flex-col space-y-4">
                <Link 
                  to="/" 
                  className="text-gray-700 hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  to="/about" 
                  className="text-gray-700 hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
                <Link 
                  to="/gallery" 
                  className="text-gray-700 hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Gallery
                </Link>
                <Link 
                  to="/deals" 
                  className="text-gray-700 hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Deals
                </Link>
                
                {user ? (
                  <div className="pt-4 border-t">
                    <Link 
                      to="/dashboard" 
                      className="flex items-center text-gray-700 hover:text-primary transition-colors mb-4"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                    <div className="text-sm text-gray-600">
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
