import React from 'react';
import { Home, Search, Calendar, Tag, Phone } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const MobileBottomNav = () => {
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Explore', path: '/gallery' },
    { icon: Calendar, label: 'Book', path: '/', action: 'book' },
    { icon: Tag, label: 'Deals', path: '/deals' },
    { icon: Phone, label: 'Contact', path: 'tel:+918837317070', external: true }
  ];

  const handleBookingClick = () => {
    const bookingModal = document.querySelector('[data-booking-modal]');
    if (bookingModal) {
      (bookingModal as HTMLElement).click();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-bottom z-50">
      <div className="flex justify-around items-center py-1">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          if (item.action === 'book') {
            return (
              <button
                key={index}
                onClick={handleBookingClick}
                className="flex flex-col items-center justify-center p-2 text-gray-600 hover:text-primary transition-colors touch-target"
              >
                <Icon size={20} />
                <span className="text-xs mt-1 font-medium">{item.label}</span>
              </button>
            );
          }
          
          if (item.external) {
            return (
              <a
                key={index}
                href={item.path}
                className="flex flex-col items-center justify-center p-2 text-gray-600 hover:text-primary transition-colors touch-target"
              >
                <Icon size={20} />
                <span className="text-xs mt-1 font-medium">{item.label}</span>
              </a>
            );
          }
          
          return (
            <Link
              key={index}
              to={item.path}
              className={`flex flex-col items-center justify-center p-2 transition-colors touch-target ${
                isActive 
                  ? 'text-primary' 
                  : 'text-gray-600 hover:text-primary'
              }`}
            >
              <Icon size={20} />
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;