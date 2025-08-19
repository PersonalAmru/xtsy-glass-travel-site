
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Instagram, Facebook, Youtube, Home, Info, Image, Tag, Plane, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Brand Section */}
          <div className="text-center lg:text-left">
            <div className="flex items-center gap-3 justify-center lg:justify-start mb-8">
              <img 
                src="/src/assets/xtsy-color-logo.png" 
                alt="XTSY Travellers Hostel Logo" 
                className="h-16 sm:h-20 w-auto object-contain"
              />
            </div>
            <ul className="space-y-6">
              <li className="text-gray-300 text-base leading-relaxed justify-center lg:justify-start">
                Experience the authentic vibe of Shillong and unforgettable adventures with XTSY!
              </li>
              <li className="flex space-x-6 justify-center lg:justify-start">
                <Instagram className="h-6 w-6 text-gray-400 hover:text-orange-400 cursor-pointer transition-colors duration-300" />
                <Facebook className="h-6 w-6 text-gray-400 hover:text-orange-400 cursor-pointer transition-colors duration-300" />
                <Youtube className="h-6 w-6 text-gray-400 hover:text-orange-400 cursor-pointer transition-colors duration-300" />
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="text-center lg:text-left">
            <h3 className="text-xl font-semibold mb-6 text-white">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/" className="text-gray-300 hover:text-orange-400 transition-colors duration-300 flex items-center gap-3 text-base justify-center lg:justify-start">
                  <Home className="h-5 w-5" />
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-orange-400 transition-colors duration-300 flex items-center gap-3 text-base justify-center lg:justify-start">
                  <Info className="h-5 w-5" />
                  About
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-gray-300 hover:text-orange-400 transition-colors duration-300 flex items-center gap-3 text-base justify-center lg:justify-start">
                  <Image className="h-5 w-5" />
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/deals" className="text-gray-300 hover:text-orange-400 transition-colors duration-300 flex items-center gap-3 text-base justify-center lg:justify-start">
                  <Tag className="h-5 w-5" />
                  Deals
                </Link>
              </li>
               <li>
                 <Link to="/travel" className="text-gray-300 hover:text-orange-400 transition-colors duration-300 flex items-center gap-3 text-base justify-center lg:justify-start">
                   <Plane className="h-5 w-5" />
                   Travel
                 </Link>
               </li>
               <li>
                 <Link to="/faq" className="text-gray-300 hover:text-orange-400 transition-colors duration-300 flex items-center gap-3 text-base justify-center lg:justify-start">
                   <HelpCircle className="h-5 w-5" />
                   FAQ
                 </Link>
               </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="text-center lg:text-left">
            <h3 className="text-xl font-semibold mb-6 text-white">Contact Us</h3>
            <div className="space-y-5">
              <div className="flex items-start space-x-4 justify-center lg:justify-start">
                <MapPin className="h-6 w-6 text-orange-400 mt-1 flex-shrink-0" />
                <div className="text-gray-300 text-base leading-relaxed">
                  <div className="font-medium text-white mb-1">XTSY Travellers Hostel</div>
                  <div>Diengiong, Mawdiangdiang road, New Shillong Township,</div>
                  <div>Meghalaya - 793018</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 justify-center lg:justify-start">
                <Phone className="h-6 w-6 text-orange-400 mt-1 flex-shrink-0" />
                <div className="text-gray-300 text-base">
                  <div className="font-medium">Bookings: +91 88373 17070</div>
                  <div className="font-medium">Reception: +91 98633 17070</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 justify-center lg:justify-start">
                <Mail className="h-6 w-6 text-orange-400 flex-shrink-0" />
                <div className="text-gray-300 text-base font-medium">
                  booking@xtsy.one
                </div>
              </div>
              
              <div className="pt-4">
                <Button onClick={() => window.open('https://maps.app.goo.gl/Apj4xBxDWv8hBbSm6', '_blank')} className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white text-base px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 shadow-lg">
                  Get Directions
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center">
          <p className="text-gray-400 text-base">© 2024 XTSY. All rights reserved. Experience the XTSY Vibe.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
