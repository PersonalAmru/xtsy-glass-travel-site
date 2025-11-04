
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

  // Enhanced property-specific amenity access rules
  const getPropertyTags = (serviceTitle: string) => {
    const amenityMatrix = {
      'Free Wi-Fi': ['XTSY Travellers Hostel ✅', 'XTSY Economy ✅', 'XTSY Luxury ✅'],
      'High Speed Wi-Fi': ['XTSY Luxury ✅'],
      'Free Parking': ['XTSY Travellers Hostel ✅', 'XTSY Economy ❗ Not available', 'XTSY Luxury ✅'],
      'In-House Cafe': ['XTSY Travellers Hostel ✅', 'XTSY Economy ❗ Upgrade required', 'XTSY Luxury ✅'],
      'Shared Lounge': ['XTSY Travellers Hostel ✅', 'XTSY Economy (Upgrade Required)', 'XTSY Luxury ✅'],
      'Common Room': ['XTSY Travellers Hostel ✅', 'XTSY Economy (Upgrade Required)', 'XTSY Luxury ✅'],
      'Games Room': ['XTSY Travellers Hostel ✅', 'XTSY Economy ❗ Strictly NOT available', 'XTSY Luxury ✅'],
      'Laundry': ['XTSY Travellers Hostel ✅', 'XTSY Economy ❗ Upgrade required', 'XTSY Luxury ✅'],
      'Terrace Access': ['XTSY Travellers Hostel ✅', 'XTSY Economy (Upgrade Required)', 'XTSY Luxury ✅'],
      'Bonfire Nights': ['XTSY Travellers Hostel ✅', 'XTSY Economy (Upgrade Required)', 'XTSY Luxury ✅'],
      'BBQ Experience': ['XTSY Travellers Hostel (Paid)', 'XTSY Economy (Upgrade Required)', 'XTSY Luxury ✅'],
      'Dome Photoshoot': ['XTSY Travellers Hostel ✅', 'XTSY Economy (Upgrade Required)', 'XTSY Luxury ✅'],
      'Convenience Store': ['XTSY Travellers Hostel (10% Off)', 'XTSY Economy (MRP Pricing)', 'XTSY Luxury ✅'],
      'Charging Point': ['XTSY Travellers Hostel ✅', 'XTSY Economy 🚫', 'XTSY Luxury ✅'],
      'Study Light': ['XTSY Travellers Hostel ✅', 'XTSY Economy 🚫', 'XTSY Luxury ✅'],
      'Free Room Upgrade': ['XTSY Travellers Hostel ✅', 'XTSY Economy 🚫', 'XTSY Luxury ✅'],
      '24/7 Security': ['XTSY Travellers Hostel ✅', 'XTSY Economy ✅', 'XTSY Luxury ✅'],
      'Tour Assistance': ['XTSY Travellers Hostel ✅', 'XTSY Economy ❗ Strictly NOT available', 'XTSY Luxury ✅'],
      'Group Bookings': ['XTSY Travellers Hostel ✅', 'XTSY Economy ❗ Group size capped at 8 guests', 'XTSY Luxury 💎 Exclusive signature stay – only 1 available per night in India. Limited edition. Book fast.'],
      'Event Space': ['XTSY Travellers Hostel ✅', 'XTSY Economy ❗ Upgrade required', 'XTSY Luxury ✅'],
      '24/7 Support': ['XTSY Travellers Hostel ✅', 'XTSY Economy 🕐 WhatsApp support only during working hours', 'XTSY Luxury ✅'],
      'Flexible Check-in': ['XTSY Travellers Hostel ✅', 'XTSY Economy ❗ Strictly NOT allowed', 'XTSY Luxury ✅']
    };

    return amenityMatrix[serviceTitle] || ['XTSY Travellers Hostel ✅', 'XTSY Luxury ✅'];
  };

  // Enhanced special notes with property-specific access rules
  const getSpecialNotes = (serviceTitle: string) => {
    const accessRules = {
      'Free Parking': [
        { property: 'XTSY Economy', note: 'Not available for XTSY Economy bookings', type: 'restriction' }
      ],
      'In-House Cafe': [
        { property: 'XTSY Economy', note: 'Upgrade required for service', type: 'restriction' }
      ],
      'Shared Lounge': [
        { property: 'XTSY Travellers Hostel', note: 'Free access included', type: 'info' },
        { property: 'XTSY Economy', note: 'Upgrade required for access', type: 'restriction' },
        { property: 'XTSY Luxury', note: 'Premium lounge access included', type: 'premium' }
      ],
      'Common Room': [
        { property: 'XTSY Travellers Hostel', note: 'Free access included', type: 'info' },
        { property: 'XTSY Economy', note: 'Upgrade required for access', type: 'restriction' },
        { property: 'XTSY Luxury', note: 'Exclusive common room access', type: 'premium' }
      ],
      'Games Room': [
        { property: 'XTSY Economy', note: 'Strictly NOT available', type: 'restriction' }
      ],
      'Laundry': [
        { property: 'XTSY Travellers Hostel', note: '50% discount on laundry services', type: 'info' },
        { property: 'XTSY Economy', note: 'Upgrade required for service', type: 'restriction' },
        { property: 'XTSY Luxury', note: 'Complimentary laundry service', type: 'premium' }
      ],
      'Terrace Access': [
        { property: 'XTSY Travellers Hostel', note: 'Free terrace access', type: 'info' },
        { property: 'XTSY Economy', note: 'Upgrade required for terrace', type: 'restriction' },
        { property: 'XTSY Luxury', note: 'Private terrace access', type: 'premium' }
      ],
      'Bonfire Nights': [
        { property: 'XTSY Travellers Hostel', note: 'Free participation', type: 'info' },
        { property: 'XTSY Economy', note: 'Upgrade required to join', type: 'restriction' },
        { property: 'XTSY Luxury', note: 'VIP bonfire experience', type: 'premium' }
      ],
      'BBQ Experience': [
        { property: 'XTSY Travellers Hostel', note: 'Paid experience available', type: 'info' },
        { property: 'XTSY Economy', note: 'Upgrade required + fees', type: 'restriction' },
        { property: 'XTSY Luxury', note: 'Complimentary BBQ included', type: 'premium' }
      ],
      'Dome Photoshoot': [
        { property: 'XTSY Travellers Hostel', note: 'Included experience', type: 'info' },
        { property: 'XTSY Economy', note: 'Upgrade required for access', type: 'restriction' },
        { property: 'XTSY Luxury', note: 'Professional photoshoot included', type: 'premium' }
      ],
      'Convenience Store': [
        { property: 'XTSY Travellers Hostel', note: '10% discount on all items', type: 'info' },
        { property: 'XTSY Economy', note: 'MRP pricing applies', type: 'restriction' },
        { property: 'XTSY Luxury', note: 'Complimentary store credit included', type: 'premium' }
      ],
      'Charging Point': [
        { property: 'XTSY Economy', note: 'Not available - upgrade needed', type: 'restriction' }
      ],
      'Study Light': [
        { property: 'XTSY Economy', note: 'Not available - upgrade needed', type: 'restriction' }
      ],
      'Free Room Upgrade': [
        { property: 'XTSY Economy', note: 'Not available', type: 'restriction' }
      ],
      'Tour Assistance': [
        { property: 'XTSY Economy', note: 'Strictly NOT available', type: 'restriction' },
        { property: 'XTSY Luxury', note: 'Dedicated tour concierge service', type: 'premium' }
      ],
      'Group Bookings': [
        { property: 'XTSY Economy', note: 'Group size capped at 8 guests', type: 'restriction' },
        { property: 'XTSY Luxury', note: 'Exclusive signature stay – only 1 available per night in India. Limited edition. Book fast.', type: 'premium' }
      ],
      'Event Space': [
        { property: 'XTSY Economy', note: 'Upgrade required for access', type: 'restriction' },
        { property: 'XTSY Luxury', note: 'Premium event facilities with catering', type: 'premium' }
      ],
      '24/7 Support': [
        { property: 'All Properties', note: 'WhatsApp support only during working hours', type: 'info' }
      ],
      'Flexible Check-in': [
        { property: 'XTSY Economy', note: 'Strictly NOT allowed', type: 'restriction' }
      ]
    };

    return accessRules[serviceTitle] || [];
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
