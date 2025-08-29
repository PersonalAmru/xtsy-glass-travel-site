
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
      'Free Wi-Fi': ['XTSY Travellers Hostel ✅', 'XTSY Luxury ✅', 'XTSY Economy ✅'],
      'Free Parking': ['XTSY Travellers Hostel ✅', 'XTSY Luxury ✅', 'XTSY Economy ❗ Paid Parking'],
      'In-House Cafe': ['XTSY Travellers Hostel (10% Flat off) ✅', 'XTSY Luxury (Premium Menu) ✅', 'XTSY Economy [MRP with GST] ✅'],
      'Shared Lounge': ['XTSY Travellers Hostel ✅', 'XTSY Luxury ✅', 'XTSY Economy ❗ Strictly NOT available'],
      'Games Room': ['XTSY Travellers Hostel ✅', 'XTSY Luxury ✅', 'XTSY Economy ❗ Strictly NOT available'],
      'Laundry': ['XTSY Travellers Hostel (20% Flat off) ✅', 'XTSY Luxury (Free) ✅', 'XTSY Economy ❗ Paid Service'],
      '24/7 Travellers Store': ['XTSY Travellers Hostel ✅', 'XTSY Luxury (Free) ✅', 'XTSY Economy ✅'],
      'Bonfire Nights': ['XTSY Travellers Hostel ✅', 'XTSY Luxury ✅', 'XTSY Economy ❗ Strictly NOT available'],
      'BBQ Experience': ['XTSY Travellers Hostel (Paid)✅', 'XTSY Luxury (Free) ✅', 'XTSY Economy ❗ Paid Service'],
      '24/7 Security': ['XTSY Travellers Hostel ✅', 'XTSY Luxury ✅', 'XTSY Economy ✅'],
      'Tour Assistance': ['XTSY Travellers Hostel (Free) ✅', 'XTSY Luxury (Free) ✅', 'XTSY Economy❗ Paid Service'],
      'Flexible Check-in': ['XTSY Travellers Hostel (Free) ✅', 'XTSY Luxury (Free) ✅', 'XTSY Economy❗ Paid Service'],
    };

    return amenityMatrix[serviceTitle] || ['XTSY Travellers Hostel ✅', 'XTSY Luxury ✅', 'XTSY Economy❗(Limited)'];
  };
  
    return accessRules[serviceTitle] || [];
  };

  const propertyTags = getPropertyTags(service.title);

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
