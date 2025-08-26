
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
      <DialogContent className="glass-card bg-white/95 backdrop-blur-md border border-white/30 max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between mb-4">
            <div className="text-purple-600 flex-shrink-0">
              {service.icon}
            </div>
            <Badge variant="outline" className="border-purple-300/50 text-purple-700 bg-white/20 backdrop-blur-sm">
              {service.badge}
            </Badge>
          </div>
          <DialogTitle className="text-xl font-bold text-gray-900 text-left">
            {service.title}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-gray-700 leading-relaxed text-left">
          {service.description}
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceModal;
