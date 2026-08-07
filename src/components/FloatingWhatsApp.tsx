import { useLocation } from '@/lib/router-compat';
import { useEffect, useState, useCallback } from 'react';
import whatsappIcon from '@/assets/whatsapp-icon.svg';
import { routeGTMEvent } from '@/utils/gtmEventRouter';

const WHATSAPP_NUMBER = '918837317070';
const HIDDEN_ROUTES = ['/admin', '/booking'];

const HOMEPAGE_MESSAGE = 'Hey, Tell me more about XTSY!';

/**
 * Build a context-aware welcome message:
 * - Homepage / generic → fixed homepage greeting
 * - Property / Tour / SEO landing pages → uses page H1 (or document.title fallback)
 *
 * Resolved at click-time (not render) so route-driven SPA H1 changes are captured.
 */
const buildWelcomeMessage = (pathname: string): string => {
  if (pathname === '/' || pathname === '') return HOMEPAGE_MESSAGE;

  // Try to read the page H1 — most accurate intent signal
  const h1 = typeof document !== 'undefined'
    ? document.querySelector('h1')?.textContent?.trim()
    : '';

  // Route-type intent prefix
  const isTour = /\/(tours|travel|tour-)/i.test(pathname);
  const isProperty = /\/(properties|book|hostel|hotel|stay|rentals|campsite|270|glamping|homestay)/i.test(pathname);
  const isDestination = /\/(destinations|things-to-do|meghalaya|shillong|cherrapunji|dawki)/i.test(pathname);

  const subject = (h1 && h1.length <= 120 ? h1 : '')
    || document.title?.split('|')[0]?.trim()
    || 'XTSY';

  if (isTour) return `Hi XTSY! I'd like more details about: ${subject}`;
  if (isProperty) return `Hi XTSY! I'm interested in booking: ${subject}`;
  if (isDestination) return `Hi XTSY! Tell me more about visiting: ${subject}`;
  return `Hi XTSY! I'm exploring ${subject} — could you share more?`;
};

const FloatingWhatsApp = () => {
  const location = useLocation();
  const [href, setHref] = useState(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(HOMEPAGE_MESSAGE)}`);

  // Recompute href when route or DOM heading changes (post-render)
  useEffect(() => {
    // Defer to next frame so the new page's <h1> has rendered
    const id = window.requestAnimationFrame(() => {
      const msg = buildWelcomeMessage(location.pathname);
      setHref(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`);
    });
    return () => window.cancelAnimationFrame(id);
  }, [location.pathname]);

  const isHidden = HIDDEN_ROUTES.some(route => location.pathname.startsWith(route));
  if (isHidden) return null;

  const handleClick = useCallback(() => {
    // Re-resolve at click time for absolute accuracy
    const msg = buildWelcomeMessage(location.pathname);
    const finalHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    setHref(finalHref);

    routeGTMEvent({
      eventName: 'lead_initiated',
      params: {
        lead_type: 'whatsapp',
        estimated_revenue: 500,
        page_path: location.pathname,
        message_context: msg.slice(0, 80),
      },
    });
  }, [location.pathname]);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      onClick={handleClick}
      className="fixed bottom-20 md:bottom-6 right-4 z-50 w-14 h-14 min-w-[56px] min-h-[56px] rounded-full bg-[#25D366] hover:bg-[#1ebe5b] flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200 touch-manipulation"
    >
      <img src={whatsappIcon} alt="WhatsApp" width="32" height="32" className="w-8 h-8" />
    </a>
  );
};

export default FloatingWhatsApp;
