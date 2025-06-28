
import { Facebook, Instagram, Twitter, Youtube, MessageCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer id="contact" className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 px-4 relative overflow-hidden">
      {/* Background animations */}
      <div className="absolute inset-0">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="absolute w-32 h-32 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-xl animate-pulse"
            style={{
              left: `${15 + i * 25}%`,
              bottom: `${20 + i * 15}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${4 + i * 0.5}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <img 
              src="https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/image-assets/Header/Color%20logo%20-%20no%20background.png"
              alt="XTSY Logo"
              className="h-16 w-auto mb-4"
            />
            <p className="text-gray-400 mb-6 font-seasons">
              Experience the vibrant culture and breathtaking landscapes of Shillong with XTSY. 
              Your gateway to authentic Northeast Indian hospitality and unforgettable adventures.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Youtube className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <MessageCircle className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4 font-serif-sans">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#home" className="text-gray-400 hover:text-white transition-colors duration-200 font-seasons">Home</a></li>
              <li><a href="#rooms" className="text-gray-400 hover:text-white transition-colors duration-200 font-seasons">Our Properties</a></li>
              <li><a href="#services" className="text-gray-400 hover:text-white transition-colors duration-200 font-seasons">Services</a></li>
              <li><a href="/gallery" className="text-gray-400 hover:text-white transition-colors duration-200 font-seasons">Gallery</a></li>
              <li><a href="#reviews" className="text-gray-400 hover:text-white transition-colors duration-200 font-seasons">Reviews</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold mb-4 font-serif-sans">Contact</h3>
            <div className="space-y-2 text-gray-400 font-seasons">
              <p>Shillong, Meghalaya</p>
              <p>Email: info@xtsy.com</p>
              <p>Website: www.xtsy.com</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8 text-center">
          <p className="text-gray-400 font-seasons">
            © 2024 XTSY. All rights reserved. | Live the Shillong Vibe
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
