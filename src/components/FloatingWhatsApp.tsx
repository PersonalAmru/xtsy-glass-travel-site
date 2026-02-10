import { useLocation } from 'react-router-dom';
import whatsappIcon from '@/assets/whatsapp-icon.svg';

const WHATSAPP_URL = 'https://wa.me/918837317070';

const HIDDEN_ROUTES = ['/admin', '/booking'];

const FloatingWhatsApp = () => {
  const location = useLocation();

  const isHidden = HIDDEN_ROUTES.some(route => location.pathname.startsWith(route));
  if (isHidden) return null;

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-20 md:bottom-6 right-4 z-50 w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#1ebe5b] flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200 touch-manipulation"
    >
      <img src={whatsappIcon} alt="WhatsApp" className="w-8 h-8" />
    </a>
  );
};

export default FloatingWhatsApp;
