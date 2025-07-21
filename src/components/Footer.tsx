
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter, Home, Info, Image, Tag, Plane } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/f60939c8-8351-4f63-80df-a4c6e37e539a.png" 
                alt="XTSY Logo" 
                className="w-10 h-10 object-contain"
                onError={(e) => {
                  // Fallback to gradient circle if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = document.createElement('div');
                  fallback.className = 'w-10 h-10 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center';
                  fallback.innerHTML = '<span class="text-white font-bold text-lg">X</span>';
                  target.parentNode?.insertBefore(fallback, target);
                }}
              />
              <span className="text-xl font-bold">XTSY</span>
            </div>
            <p className="text-gray-400 text-sm">
              Experience the authentic vibe of Shillong with premium accommodations and unforgettable adventures.
            </p>
            <div className="flex space-x-4">
              <Instagram className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Facebook className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  About
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  <Image className="h-4 w-4" />
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/deals" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Deals
                </Link>
              </li>
              <li>
                <Link to="/travel" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  <Plane className="h-4 w-4" />
                  Travel
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Accommodation Booking</li>
              <li>Adventure Tours</li>
              <li>Group Bookings</li>
              <li>Corporate Events</li>
              <li>Travel Planning</li>
              <li>Local Experiences</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-orange-400 mt-0.5" />
                <span className="text-gray-400 text-sm">
                  XTSY Travellers Hostel, Diengiong Village,<br />
                  Mawdiangdiang road, New Shillong Township,<br />
                  Meghalaya - 793018
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-orange-400" />
                  <div className="text-gray-400 text-sm">
                    <div>Bookings: +91 88373 17070</div>
                    <div>Reception: +91 98633 17070</div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-orange-400" />
                  <div className="text-gray-400 text-sm">
                    <div>booking@xtsy.one</div>
                    <div>admin@xtsy.one</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 XTSY. All rights reserved. Experience the Shillong Vibe.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
