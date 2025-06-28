
import { useState } from "react";
import { Menu, X, ShoppingCart } from "lucide-react";
import CartModal from "./CartModal";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "Services", href: "#services" },
    { name: "Rooms", href: "#rooms" },
    { name: "Reviews", href: "#reviews" },
    { name: "Deals & Offers", href: "#deals" },
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
                className="h-14 w-auto"
              />
            </div>

            {/* Desktop Navigation - Left Aligned */}
            <nav className="hidden md:flex space-x-8 flex-1 ml-12">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
                >
                  {item.name}
                </a>
              ))}
            </nav>

            {/* Cart Icon */}
            <div className="hidden md:flex">
              <button 
                className="text-gray-300 hover:text-white transition-colors duration-200 p-2"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className="h-6 w-6" />
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
                  >
                    {item.name}
                  </a>
                ))}
                <div className="mt-4 pt-2 border-t border-white/10">
                  <button 
                    className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2"
                    onClick={() => {
                      setIsCartOpen(true);
                      setIsMenuOpen(false);
                    }}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    Cart
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
