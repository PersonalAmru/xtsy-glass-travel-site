
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: {
    icon: React.ReactNode;
    title: string;
    description: string;
    badge: string;
  } | null;
}

const ServiceModal = ({ isOpen, onClose, service }: ServiceModalProps) => {
  if (!service) return null;

  // Define which properties offer each service
  const getPropertyTags = (serviceTitle: string) => {
    switch (serviceTitle) {
      case 'Free WiFi':
        return ['XTSY Economy', 'XTSY Travellers Hostel', 'XTSY Luxury'];
      case 'High Speed WiFi':
        return ['XTSY Luxury'];
      case 'Flexible Check-in':
        return ['XTSY Travellers Hostel', 'XTSY Luxury'];
      case 'Free parking':
        return ['XTSY Travellers Hostel', 'XTSY Luxury'];
      case 'In-House Cafe':
        return ['XTSY Travellers Hostel', 'XTSY Luxury'];
      case 'Games Room':
        return ['XTSY Travellers Hostel', 'XTSY Luxury'];
      case 'Laundry':
        return ['XTSY Economy', 'XTSY Travellers Hostel', 'XTSY Luxury'];
      case '24/7 Security':
        return ['XTSY Economy', 'XTSY Travellers Hostel', 'XTSY Luxury'];
      case 'Tour Assistance':
        return ['XTSY Travellers Hostel', 'XTSY Luxury'];
      case 'Group Bookings':
        return ['XTSY Economy', 'XTSY Travellers Hostel', 'XTSY Luxury'];
      case 'Event Space':
        return ['XTSY Travellers Hostel', 'XTSY Luxury'];
      case '24/7 Support':
        return ['XTSY Economy', 'XTSY Travellers Hostel', 'XTSY Luxury'];
      default:
        return ['XTSY Travellers Hostel', 'XTSY Luxury'];
    }
  };

  // Get special notes for specific services and properties
  const getSpecialNotes = (serviceTitle: string) => {
    switch (serviceTitle) {
      case 'Flexible Check-in':
        return [
          { property: 'XTSY Economy', note: 'Strictly No Flexible check-in', type: 'restriction' }
        ];
      case 'Free parking':
        return [
          { property: 'XTSY Economy', note: 'Not sure; based on rush hours', type: 'info' }
        ];
      case 'In-House Cafe':
        return [
          { property: 'XTSY Economy', note: 'No In-House cafe; Upgrade your stay plan to avail In-House Cafe', type: 'restriction' }
        ];
      case 'Games Room':
        return [
          { property: 'XTSY Economy', note: 'No games room facility', type: 'restriction' }
        ];
      case 'Laundry':
        return [
          { property: 'XTSY Economy', note: 'Paid service [with taxes]', type: 'restriction' },
          { property: 'XTSY Travellers Hostel', note: '50% Off', type: 'info' },
          { property: 'XTSY Luxury', note: 'Free', type: 'premium' }
        ];
      case 'Tour Assistance':
        return [
          { property: 'XTSY Economy', note: 'Basic assistance only', type: 'restriction' },
          { property: 'XTSY Luxury', note: 'Dedicated tour concierge', type: 'premium' }
        ];
      case 'Event Space':
        return [
          { property: 'XTSY Economy', note: 'No event space available', type: 'restriction' },
          { property: 'XTSY Luxury', note: 'Premium event facilities', type: 'premium' }
        ];
      case '24/7 Support':
        return [
          { property: 'XTSY Economy', note: 'Phone support only', type: 'info' }
        ];
      default:
        return [];
    }
  };

  const propertyTags = getPropertyTags(service.title);
  const specialNotes = getSpecialNotes(service.title);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white border border-gray-300 shadow-2xl max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between mb-4">
            <div className="text-purple-600 flex-shrink-0 bg-purple-100 p-3 rounded-lg">
              {service.icon}
            </div>
            <Badge variant="outline" className="border-purple-400 text-purple-800 bg-purple-100 font-semibold">
              {service.badge}
            </Badge>
          </div>
          <DialogTitle className="text-2xl font-bold text-gray-900 text-left">
            {service.title}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-gray-700 leading-relaxed text-left text-lg font-medium mb-4">
          {service.description}
        </DialogDescription>
        
        {/* Property Tags */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-600">Available at:</p>
          <div className="flex flex-wrap gap-2">
            {propertyTags.map((property, index) => (
              <Badge 
                key={index}
                variant="outline" 
                className="border-green-400 text-green-800 bg-green-50 font-medium text-xs"
              >
                {property}
              </Badge>
            ))}
          </div>
          
          {/* Special Notes/Restrictions */}
          {specialNotes.length > 0 && (
            <div className="mt-3">
              <p className="text-sm font-semibold text-gray-600 mb-2">Special Notes:</p>
              <div className="flex flex-wrap gap-2">
                {specialNotes.map((note, index) => (
                  <Badge 
                    key={index}
                    variant="outline" 
                    className={`font-medium text-xs ${
                      note.type === 'restriction' 
                        ? 'border-red-400 text-red-800 bg-red-50' 
                        : note.type === 'premium'
                        ? 'border-blue-400 text-blue-800 bg-blue-50'
                        : 'border-amber-400 text-amber-800 bg-amber-50'
                    }`}
                  >
                    {note.property}: {note.note}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceModal;
