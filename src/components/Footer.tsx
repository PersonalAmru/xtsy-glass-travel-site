import { Link } from "react-router-dom";
import { Phone, Mail, Instagram, Youtube, Home, Info, Image as ImageIcon, Camera, Plane, HelpCircle } from "lucide-react";
import { pushToDataLayer } from "@/utils/dataLayerService";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import xtsyLogo from "@/assets/xtsy-color-logo.png";
import PolicyModal from "./PolicyModals";

const Footer = () => {
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [policyModal, setPolicyModal] = useState<{
    isOpen: boolean;
    type: 'cancellation' | 'travel' | 'terms' | null;
  }>({
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

  const linkClass = "text-muted-foreground hover:text-primary transition-colors duration-300";
  const footerLinkClass = `${linkClass} flex items-center gap-2 text-xs sm:text-sm lg:text-base justify-center py-1 touch-manipulation`;

  return <footer className="bg-card border-t border-border text-foreground py-4 sm:py-6">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-3 sm:mb-4">
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-2 sm:gap-6 text-xs sm:text-sm">
            <Link to="/privacy-policy" className={`${linkClass} py-1`}>Privacy Policy</Link>
            <Link to="/terms-of-service" className={`${linkClass} py-1`}>Terms of Service</Link>
            <button onClick={() => setPolicyModal({ isOpen: true, type: 'cancellation' })} className={`${linkClass} py-1`}>Cancellation Policy</button>
            <button onClick={() => setPolicyModal({ isOpen: true, type: 'travel' })} className={`${linkClass} py-1`}>Travel Policies</button>
            <button onClick={() => setPolicyModal({ isOpen: true, type: 'terms' })} className={`${linkClass} py-1`}>Hostel Terms & Conditions</button>
          </div>
        </div>
        
        <p className="text-muted-foreground text-xs sm:text-sm lg:text-base text-center">© 2024 XTSY Travel. All rights reserved. Experience the XTSY Vibe.</p>
      </div>
      
      {policyModal.type && <PolicyModal isOpen={policyModal.isOpen} onClose={() => setPolicyModal({ isOpen: false, type: null })} type={policyModal.type} />}
    </footer>;
};
export default Footer;
