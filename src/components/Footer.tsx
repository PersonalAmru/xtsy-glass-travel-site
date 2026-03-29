import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Instagram, Youtube } from "lucide-react";
import { useState } from "react";
import PolicyModal from "./PolicyModals";

const Footer = () => {
  const [policyModal, setPolicyModal] = useState<{
    isOpen: boolean;
    type: 'cancellation' | 'travel' | 'terms' | null;
  }>({ isOpen: false, type: null });

  const linkClass = "text-muted-foreground hover:text-primary transition-colors duration-300 text-xs sm:text-sm";

  return (
    <footer className="bg-card border-t border-border text-foreground py-6 sm:py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground text-sm mb-3">Explore</h3>
            <ul className="space-y-1.5">
              <li><Link to="/" className={linkClass}>Home</Link></li>
              <li><Link to="/about" className={linkClass}>About XTSY</Link></li>
              <li><Link to="/gallery" className={linkClass}>Gallery</Link></li>
              <li><Link to="/travel" className={linkClass}>Tour Packages</Link></li>
              <li><Link to="/blog" className={linkClass}>Blog</Link></li>
              <li><Link to="/destinations" className={linkClass}>Destinations</Link></li>
            </ul>
          </div>

          {/* Stays */}
          <div>
            <h3 className="font-semibold text-foreground text-sm mb-3">Stays</h3>
            <ul className="space-y-1.5">
              <li><Link to="/booking" className={linkClass}>Book a Room</Link></li>
              <li><Link to="/xtsy-270" className={linkClass}>270° Glass Suite</Link></li>
              <li><Link to="/pet-friendly" className={linkClass}>Pet-Friendly</Link></li>
              <li><Link to="/female-travellers" className={linkClass}>Women Safe Stays</Link></li>
              <li><Link to="/work-from-home" className={linkClass}>Workation</Link></li>
              <li><Link to="/xtsy-rentals" className={linkClass}>Bike Rentals</Link></li>
            </ul>
          </div>

          {/* Contact - NAP */}
          <div>
            <h3 className="font-semibold text-foreground text-sm mb-3">Contact</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 mt-0.5 text-primary flex-shrink-0" />
                <span>Laitumkhrah, Shillong, Meghalaya 793003, India</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <a href="tel:+918837317070" className="hover:text-primary transition-colors">+91 8837317070</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <a href="mailto:admin@xtsy.one" className="hover:text-primary transition-colors">admin@xtsy.one</a>
              </li>
            </ul>
            <div className="flex items-center gap-3 mt-3">
              <a href="https://www.instagram.com/xtsyhostel" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="XTSY Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://www.youtube.com/@xtsyhostel" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="XTSY YouTube">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-foreground text-sm mb-3">Legal</h3>
            <ul className="space-y-1.5">
              <li><Link to="/privacy-policy" className={linkClass}>Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className={linkClass}>Terms of Service</Link></li>
              <li><button onClick={() => setPolicyModal({ isOpen: true, type: 'cancellation' })} className={linkClass}>Cancellation Policy</button></li>
              <li><button onClick={() => setPolicyModal({ isOpen: true, type: 'travel' })} className={linkClass}>Travel Policies</button></li>
              <li><button onClick={() => setPolicyModal({ isOpen: true, type: 'terms' })} className={linkClass}>Hostel Terms</button></li>
            </ul>
          </div>
        </div>

        {/* Popular Searches */}
        <div className="border-t border-border/50 pt-4 mb-4">
          <p className="text-[10px] sm:text-xs text-muted-foreground mb-2 font-medium">Popular Searches</p>
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: "Best Hostel Shillong", to: "/search?q=best+hostel+shillong" },
              { label: "Meghalaya Tour Packages", to: "/travel" },
              { label: "Glass Suite Stargazing", to: "/xtsy-270" },
              { label: "Living Root Bridges", to: "/destinations#living-root-bridges" },
              { label: "Dawki River", to: "/destinations#dawki-umngot-river" },
              { label: "Budget Stay Meghalaya", to: "/booking" },
            ].map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        <p className="text-muted-foreground text-[10px] sm:text-xs text-center">
          © 2025 XTSY Travel. All rights reserved. Experience the XTSY Vibe.
        </p>
      </div>

      {policyModal.type && (
        <PolicyModal
          isOpen={policyModal.isOpen}
          onClose={() => setPolicyModal({ isOpen: false, type: null })}
          type={policyModal.type}
        />
      )}
    </footer>
  );
};

export default Footer;
