import React, { useState } from "react";
import { Menu, X, User, LogOut, Download, Phone, MessageCircle, MapPin, Mountain, Plane, HelpCircle, Camera, Sparkles, PawPrint } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import xtsyLogo from "@/assets/xtsy-brand-logo.webp";
import { useMediaQuery } from "@/hooks/use-mobile";
import { useUserAuth } from "@/contexts/UserAuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

const Header = () => {
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useUserAuth();
  const isAuthenticated = !!user;

  const isMobile = useMediaQuery('(max-width: 767px)');
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  const handleLogoError = () => {
    setLogoError(true);
  };

  const handleLogoLoad = () => {
    setLogoLoaded(true);
    setLogoError(false);
  };

  const primeLinks = [
    { to: "/xtsy-270", label: "XTSY Experience 270°", icon: Mountain },
    { to: "/pet-friendly", label: "Pet Friendly Stays", icon: PawPrint },
    { to: "/female-travellers", label: "Female Travellers", icon: Sparkles },
    { to: "/gallery", label: "Gallery", icon: Camera },
  ];

  const navLinks = [
    { to: "/travel", label: "Travel", icon: Plane },
    { to: "/faq", label: "FAQs", icon: HelpCircle },
  ];

  return (
    <header className={`sticky top-0 z-50 safe-top safe-left safe-right border-b border-white/10 ${
      isMobile ? 'bg-black/95' : 'bg-black/80 backdrop-blur-md'
    }`}>
      <div className="responsive-container mobile-compact">
        <div className={`flex justify-between items-center ${isMobile ? 'h-14' : 'h-16'}`}>
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 touch-target ml-4 sm:ml-6">
            {!logoError ? (
              <img
                src={xtsyLogo}
                alt="XTSY Travellers Hostel"
                className={`w-auto hover:opacity-80 transition-opacity cursor-pointer ${
                  isMobile ? 'h-12' : isTablet ? 'h-14' : 'h-16'
                }`}
                loading="eager"
                // @ts-expect-error - fetchpriority
                fetchpriority="high"
                decoding="sync"
                onLoad={handleLogoLoad}
                onError={handleLogoError}
              />
            ) : (
              <div className={`bg-gradient-to-r from-orange-500 to-red-600 rounded flex items-center justify-center ${
                isMobile ? 'h-10 w-20' : isTablet ? 'h-11 w-22' : 'h-12 w-24'
              }`}>
                <span className="text-white font-bold text-sm">XTSY</span>
              </div>
            )}
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-3 mr-4 sm:mr-6">
            {/* Sign In / Profile */}
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
                  <DropdownMenuItem className="text-white hover:text-primary cursor-pointer" onClick={() => navigate('/profile')}>
                    <User size={16} className="mr-2" /> My Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-blue-400 hover:text-blue-300 cursor-pointer" onClick={() => navigate('/install')}>
                    <Download size={16} className="mr-2" /> Install App
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-white hover:text-destructive cursor-pointer" onClick={() => signOut()}>
                    <LogOut size={16} className="mr-2" /> Sign Out
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

            {/* Hamburger Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <button
                  className="flex items-center justify-center w-10 h-10 rounded-md text-white hover:bg-white/10 transition-colors touch-target"
                  aria-label="Open navigation menu"
                >
                  <Menu size={22} />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-gray-950 border-white/10 w-[300px] sm:w-[340px] p-0 overflow-y-auto">
                <SheetHeader className="px-5 pt-5 pb-3 border-b border-white/10">
                  <SheetTitle className="text-white text-lg font-semibold text-left">Explore XTSY</SheetTitle>
                </SheetHeader>

                <nav className="flex flex-col py-3">
                  {/* XTSY Prime Section */}
                  <div className="px-5 py-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary/80">XTSY Prime</span>
                  </div>
                  {primeLinks.map((link) => (
                    <SheetClose asChild key={link.to}>
                      <Link
                        to={link.to}
                        className="flex items-center gap-3 px-5 py-3 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium"
                      >
                        <link.icon size={18} className="text-primary/70" />
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}

                  <div className="mx-5 my-2 border-t border-white/10" />

                  {/* Pages */}
                  {navLinks.map((link) => (
                    <SheetClose asChild key={link.to}>
                      <Link
                        to={link.to}
                        className="flex items-center gap-3 px-5 py-3 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium"
                      >
                        <link.icon size={18} className="text-primary/70" />
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}

                  <div className="mx-5 my-2 border-t border-white/10" />

                  {/* Contact CTAs */}
                  <div className="px-5 py-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary/80">Connect</span>
                  </div>

                  <a
                    href="tel:+918837317070"
                    className="flex items-center gap-3 px-5 py-3 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium"
                  >
                    <Phone size={18} className="text-emerald-400" />
                    +91 8837317070
                  </a>

                  <a
                    href="https://wa.me/918837317070"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-5 py-3 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium"
                  >
                    <MessageCircle size={18} className="text-[#25D366]" />
                    WhatsApp Us
                  </a>

                  <a
                    href="https://maps.app.goo.gl/6WaBkJmkb1NjEB2i9"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-5 py-3 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium"
                  >
                    <MapPin size={18} className="text-rose-400" />
                    Get Directions
                  </a>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
