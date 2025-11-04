
import { Link } from "react-router-dom";
import { Phone, Mail, Instagram, Youtube, Home, Info, Image as ImageIcon, Camera, Plane, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import xtsyLogo from "@/assets/xtsy-brand-logo.png";
import PolicyModal from "./PolicyModals";

const Footer = () => {
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [policyModal, setPolicyModal] = useState<{isOpen: boolean, type: 'cancellation' | 'travel' | 'terms' | null}>({
    isOpen: false,
    type: null
  });

  useEffect(() => {
    setLogoLoaded(true);
  }, []);

  const handleLogoError = () => {
    console.error('Footer logo failed to load, using fallback');
    setLogoError(true);
  };

  const handleLogoLoad = () => {
    setLogoLoaded(true);
    setLogoError(false);
  };

  return (
    <footer className="bg-gray-900 text-white py-4 sm:py-8 md:py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Brand Section - Center aligned for all screens */}
          <div className="text-center order-1 lg:order-1">
            <div className="flex items-center gap-2 justify-center mb-3 sm:mb-4 lg:mb-6">
              {!logoError ? (
                <img 
                  src={xtsyLogo}
                  alt="XTSY Travellers Hostel Logo"
                  className="h-8 sm:h-12 lg:h-16 w-auto object-contain"
                  loading="lazy"
                  onLoad={handleLogoLoad}
                  onError={handleLogoError}
                />
              ) : (
                <div className="h-8 sm:h-12 lg:h-16 w-16 sm:w-20 lg:w-24 bg-gradient-to-r from-orange-500 to-red-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-xs sm:text-sm lg:text-lg">XTSY</span>
                </div>
              )}
            </div>
            <p className="text-gray-300 text-xs sm:text-sm lg:text-base leading-relaxed mb-3 sm:mb-4 lg:mb-6 px-2">
              Experience the authentic vibe of Shillong and unforgettable adventures with XTSY!
            </p>
            <div className="flex space-x-4 sm:space-x-6 justify-center">
              <a href="https://www.instagram.com/xtsy.one/?next=%2F" target="_blank" rel="noopener noreferrer">
                <Instagram className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 hover:text-orange-400 cursor-pointer transition-colors duration-300 touch-manipulation" />
              </a>
              <a href="https://www.youtube.com/@XTSY_Shillong" target="_blank" rel="noopener noreferrer">
                <Youtube className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 hover:text-orange-400 cursor-pointer transition-colors duration-300 touch-manipulation" />
              </a>
            </div>
          </div>

          {/* Quick Links - Center aligned for all screens */}
          <div className="text-center order-2 lg:order-2">
            <h3 className="text-sm sm:text-lg lg:text-xl font-semibold mb-3 sm:mb-4 lg:mb-6 text-white">Quick Links</h3>
            <ul className="space-y-2 sm:space-y-3 lg:space-y-4">
              <li>
                <Link to="/" className="text-gray-300 hover:text-orange-400 transition-colors duration-300 flex items-center gap-2 text-xs sm:text-sm lg:text-base justify-center py-1 touch-manipulation">
                  <Home className="h-4 w-4 sm:h-5 sm:w-5" />
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-orange-400 transition-colors duration-300 flex items-center gap-2 text-xs sm:text-sm lg:text-base justify-center py-1 touch-manipulation">
                  <Info className="h-4 w-4 sm:h-5 sm:w-5" />
                  About
                </Link>
              </li>
              <li>
                <Link to="/xtsy-270" className="text-gray-300 hover:text-orange-400 transition-colors duration-300 flex items-center gap-2 text-xs sm:text-sm lg:text-base justify-center py-1 touch-manipulation">
                  <Camera className="h-4 w-4 sm:h-5 sm:w-5" />
                  XTSY 270°
                </Link>
              </li>
               <li>
                 <Link to="/travel" className="text-gray-300 hover:text-orange-400 transition-colors duration-300 flex items-center gap-2 text-xs sm:text-sm lg:text-base justify-center py-1 touch-manipulation">
                   <Plane className="h-4 w-4 sm:h-5 sm:w-5" />
                   Travel
                 </Link>
               </li>
            </ul>
          </div>

          {/* Contact Info - Center aligned for all screens */}
          <div className="text-center order-3 lg:order-3">
            <h3 className="text-sm sm:text-lg lg:text-xl font-semibold mb-3 sm:mb-4 lg:mb-6 text-white">Contact Us</h3>
            <div className="space-y-2 sm:space-y-3 lg:space-y-4">
              <div className="flex items-start space-x-2 sm:space-x-3 justify-center">
                <div className="text-gray-300 text-xs sm:text-sm lg:text-base leading-relaxed text-center">
                  <div className="font-medium text-white mb-1">XTSY Travellers Hostel</div>
                  <div className="text-xs sm:text-sm">Diengiong, Mawdiangdiang road</div>
                  <div className="text-xs sm:text-sm">New Shillong Township, Meghalaya - 793018</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-2 sm:space-x-3 justify-center">
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-orange-400 mt-0.5 flex-shrink-0" />
                <div className="text-gray-300 text-xs sm:text-sm lg:text-base text-center">
                  <div className="font-medium">Bookings: +91 88373 17070</div>
                  <div className="font-medium">Reception: +91 98633 17070</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 sm:space-x-3 justify-center">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-orange-400 flex-shrink-0" />
                <div className="text-gray-300 text-xs sm:text-sm lg:text-base font-medium">
                  booking@xtsy.one
                </div>
              </div>
              
              <div className="pt-2 sm:pt-3 lg:pt-4 flex justify-center">
                <Button 
                  onClick={() => window.open('https://maps.app.goo.gl/Apj4xBxDWv8hBbSm6', '_blank')} 
                  className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white text-xs sm:text-sm lg:text-base px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 lg:py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 shadow-lg min-h-[44px] touch-manipulation"
                >
                  Get Directions
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-4 sm:mt-6 lg:mt-8 pt-3 sm:pt-4 lg:pt-6">
          {/* Policy Links */}
          <div className="text-center mb-4 sm:mb-6">
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm">
              <button 
                onClick={() => setPolicyModal({isOpen: true, type: 'cancellation'})}
                className="text-gray-400 hover:text-orange-400 transition-colors duration-300 py-1"
              >
                Cancellation Policy
              </button>
              <button 
                onClick={() => setPolicyModal({isOpen: true, type: 'travel'})}
                className="text-gray-400 hover:text-orange-400 transition-colors duration-300 py-1"
              >
                Travel Policies
              </button>
              <button 
                onClick={() => setPolicyModal({isOpen: true, type: 'terms'})}
                className="text-gray-400 hover:text-orange-400 transition-colors duration-300 py-1"
              >
                Hostel Terms & Conditions
              </button>
            </div>
          </div>
          
          <p className="text-gray-400 text-xs sm:text-sm lg:text-base text-center">© 2024 XTSY. All rights reserved. Experience the XTSY Vibe.</p>
        </div>
      </div>
      
      {/* Policy Modals */}
      {policyModal.type && (
        <PolicyModal
          isOpen={policyModal.isOpen}
          onClose={() => setPolicyModal({isOpen: false, type: null})}
          type={policyModal.type}
        />
      )}
    </footer>
  );
};

export default Footer;
