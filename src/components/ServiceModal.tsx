
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white/98 backdrop-blur-xl border border-gray-200/50 shadow-2xl max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between mb-4">
            <div className="text-purple-600 flex-shrink-0 bg-purple-50 p-2 rounded-lg">
              {service.icon}
            </div>
            <Badge variant="outline" className="border-purple-300 text-purple-700 bg-purple-50/80 font-medium">
              {service.badge}
            </Badge>
          </div>
          <DialogTitle className="text-xl font-bold text-gray-900 text-left">
            {service.title}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-gray-800 leading-relaxed text-left text-base">
          {service.description}
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceModal;
