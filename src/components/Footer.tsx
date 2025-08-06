import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter, Home, Info, Image, Tag, Plane, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
const Footer = () => {
  return <footer className="bg-gray-900 text-white py-8 sm:py-12">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
          {/* Brand Section */}
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center justify-center md:justify-start">
              <img src="/lovable-uploads/784b2108-6432-4589-b79b-0433fa26bc3b.png" alt="XTSY Brand Logo" className="w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 object-contain" />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed text-center md:text-left">Experience the authentic vibe of Shillong and unforgettable adventures with XTSY!</p>
            <div className="flex space-x-6 justify-center md:justify-start">
              <Instagram className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 hover:text-white cursor-pointer transition-colors duration-300" />
              <Facebook className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 hover:text-white cursor-pointer transition-colors duration-300" />
              <Twitter className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 hover:text-white cursor-pointer transition-colors duration-300" />
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-3 text-sm">
                  <Home className="h-4 w-4 sm:h-5 sm:w-5" />
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-3 text-sm">
                  <Info className="h-4 w-4 sm:h-5 sm:w-5" />
                  About
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-3 text-sm">
                  <Image className="h-4 w-4 sm:h-5 sm:w-5" />
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/deals" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-3 text-sm">
                  <Tag className="h-4 w-4 sm:h-5 sm:w-5" />
                  Deals
                </Link>
              </li>
               <li>
                 <Link to="/travel" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-3 text-sm">
                   <Plane className="h-4 w-4 sm:h-5 sm:w-5" />
                   Travel
                 </Link>
               </li>
               <li>
                 <Link to="/faq" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-3 text-sm">
                   <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                   FAQ
                 </Link>
               </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-orange-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400 text-sm leading-relaxed">
                  XTSY Travellers Hostel, Diengiong Village,<br />
                  Mawdiangdiang road, New Shillong Township,<br />
                  Meghalaya - 793018
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-orange-400 flex-shrink-0" />
                  <div className="text-gray-400 text-xs sm:text-sm">
                    <div>Bookings: +91 88373 17070</div>
                    <div>Reception: +91 98633 17070</div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-orange-400 flex-shrink-0" />
                  <div className="text-gray-400 text-xs sm:text-sm">
                    <div>booking@xtsy.one</div>
                  </div>
                </div>
                <div className="mt-3">
                  <Button onClick={() => window.open('https://maps.app.goo.gl/Apj4xBxDWv8hBbSm6', '_blank')} className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white text-xs sm:text-sm px-3 sm:px-4 py-2 w-full sm:w-auto">
                    Get Directions
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
          <p className="text-gray-400 text-xs sm:text-sm">© 2024 XTSY. All rights reserved. Experience the XTSY Vibe.</p>
        </div>
      </div>
    </footer>;
};
export default Footer;