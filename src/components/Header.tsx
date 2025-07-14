
import { useState } from "react";
import { Menu, X, ShoppingCart, ArrowLeft } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import CartModal from "./CartModal";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // Mock cart items count - you can replace this with actual cart state
  const cartItemsCount = 0;

  const navItems = [
    { name: "Home", href: "#home", section: "home" },
    { name: "Services", href: "#services", section: "services" },
    { name: "Our Properties", href: "#rooms", section: "rooms" },
    { name: "Deals & Offers", href: "#deals", section: "deals" },
    { name: "Gallery", href: "#gallery", section: "gallery" },
    { name: "Reviews", href: "#reviews", section: "reviews" },
    { name: "About Us", href: "#about", section: "about" },
    { name: "Contact", href: "#contact", section: "contact" },
  ];

  const handleNavClick = (sectionId: string) => {
    setIsMenuOpen(false);
    
    if (!isHomePage) {
      // If not on home page, navigate to home first
      window.location.href = `/#${sectionId}`;
      return;
    }

    // Smooth scroll to section on home page
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleContactClick = () => {
    setIsMenuOpen(false);
    
    if (!isHomePage) {
      window.location.href = '/#contact';
      return;
    }

    // Scroll to footer/contact area
    const footerElement = document.querySelector('footer');
    if (footerElement) {
      footerElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/80 border-b border-white/10">
        <div className="container mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Back Button for non-home pages */}
            {!isHomePage && (
              <Link 
                to="/"
                className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors duration-200 mr-4"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="hidden sm:inline font-seasons text-sm">Back</span>
              </Link>
            )}

            {/* Logo */}
            <div className="flex-shrink-0">
              <img 
                src="https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/image-assets/Header/Color%20logo%20-%20no%20background.png"
                alt="XTSY Logo"
                className="h-8 sm:h-10 md:h-12 w-auto"
                loading="eager"
                decoding="async"
              />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-6 xl:space-x-8 flex-1 justify-end mr-6">
              {navItems.map((item) => (
                item.name === "Contact" ? (
                  <button
                    key={item.name}
                    onClick={handleContactClick}
                    className="text-gray-300 hover:text-white transition-colors duration-200 font-medium font-seasons text-sm xl:text-base cursor-pointer"
                  >
                    {item.name}
                  </button>
                ) : (
                  <button
                    key={item.name}
                    onClick={() => handleNavClick(item.section)}
                    className="text-gray-300 hover:text-white transition-colors duration-200 font-medium font-seasons text-sm xl:text-base cursor-pointer"
                  >
                    {item.name}
                  </button>
                )
              ))}
            </nav>

            {/* Cart Icon with Badge */}
            <div className="hidden lg:flex relative">
              <button 
                className="text-gray-300 hover:text-white transition-colors duration-200 p-2 relative"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className="h-5 w-5 xl:h-6 xl:w-6" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {cartItemsCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden text-gray-300 hover:text-white p-1"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden mt-2 pb-4 backdrop-blur-lg bg-black/95 rounded-lg border border-white/10 mx-2">
              <nav className="flex flex-col space-y-1 px-4 pt-2">
                {navItems.map((item) => (
                  item.name === "Contact" ? (
                    <button
                      key={item.name}
                      onClick={handleContactClick}
                      className="text-gray-300 hover:text-white transition-colors duration-200 font-medium py-3 px-2 font-seasons text-sm border-b border-white/10 last:border-b-0 text-left"
                    >
                      {item.name}
                    </button>
                  ) : (
                    <button
                      key={item.name}
                      onClick={() => handleNavClick(item.section)}
                      className="text-gray-300 hover:text-white transition-colors duration-200 font-medium py-3 px-2 font-seasons text-sm border-b border-white/10 last:border-b-0 text-left"
                    >
                      {item.name}
                    </button>
                  )
                ))}
                <div className="mt-3 pt-3 border-t border-white/20">
                  <button 
                    className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2 relative py-2 px-2 font-seasons text-sm"
                    onClick={() => {
                      setIsCartOpen(true);
                      setIsMenuOpen(false);
                    }}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Cart 🛒
                    {cartItemsCount > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold ml-1">
                        {cartItemsCount}
                      </span>
                    )}
                  </button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Header;
