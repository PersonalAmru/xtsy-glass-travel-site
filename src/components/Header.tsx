
import { useState } from "react";
import { Menu, X, ShoppingCart } from "lucide-react";
import CartModal from "./CartModal";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Mock cart items count - you can replace this with actual cart state
  const cartItemsCount = 0; // This should come from your cart context/state

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "Deals & Offers", href: "#deals" },
    { name: "Services", href: "#services" },
    { name: "Rooms", href: "#rooms" },
    { name: "Reviews", href: "#reviews" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-slate-900/70 border-b border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Made bigger */}
            <div className="flex-shrink-0">
              <img 
                src="https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/image-assets/Header/Color%20logo%20-%20no%20background.png"
                alt="XTSY Logo"
                className="h-20 w-auto"
              />
            </div>

            {/* Desktop Navigation - Right Aligned */}
            <nav className="hidden md:flex space-x-8 flex-1 justify-end mr-8">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {item.name}
                </a>
              ))}
            </nav>

            {/* Cart Icon with Badge */}
            <div className="hidden md:flex relative">
              <button 
                className="text-gray-300 hover:text-white transition-colors duration-200 p-2 relative"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className="h-6 w-6" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {cartItemsCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-300 hover:text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden mt-2 pb-4 backdrop-blur-lg bg-slate-900/90 rounded-lg border border-white/10">
              <nav className="flex flex-col space-y-2 px-4 pt-2">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200 font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {item.name}
                  </a>
                ))}
                <div className="mt-4 pt-2 border-t border-white/10">
                  <button 
                    className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2 relative"
                    onClick={() => {
                      setIsCartOpen(true);
                      setIsMenuOpen(false);
                    }}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    Cart
                    {cartItemsCount > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold ml-1">
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
