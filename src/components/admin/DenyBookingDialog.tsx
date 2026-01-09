/**
 * Deny Booking Confirmation Dialog
 * Shows confirmation with custom denial reason options before denying a booking
 */

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { X, AlertTriangle } from 'lucide-react';

interface DenyBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingGuestName: string;
  bookingDates: string;
  onConfirm: (reason: string) => void;
  loading?: boolean;
}

const DENIAL_REASONS = [
  { id: 'unavailable', label: 'Room unavailable for selected dates', message: 'Unfortunately, the room you requested is not available for your selected dates.' },
  { id: 'fully_booked', label: 'Property fully booked', message: 'We regret to inform you that our property is fully booked during your requested dates.' },
  { id: 'maintenance', label: 'Scheduled maintenance', message: 'The property is undergoing maintenance during your requested dates and cannot accept bookings.' },
  { id: 'policy', label: 'Does not meet booking policy', message: 'Unfortunately, your booking request does not meet our current booking policy requirements.' },
  { id: 'custom', label: 'Custom reason', message: '' },
];

export function DenyBookingDialog({
  open,
  onOpenChange,
  bookingGuestName,
  bookingDates,
  onConfirm,
  loading = false,
}: DenyBookingDialogProps) {
  const [selectedReason, setSelectedReason] = useState('unavailable');
  const [customReason, setCustomReason] = useState('');

  const handleConfirm = () => {
    const reason = selectedReason === 'custom'
      ? customReason.trim() || 'Your booking request has been declined.'
      : DENIAL_REASONS.find(r => r.id === selectedReason)?.message || 'Your booking request has been declined.';
    
    onConfirm(reason);
    // Reset state after confirm
    setSelectedReason('unavailable');
    setCustomReason('');
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      // Reset state when closing
      setSelectedReason('unavailable');
      setCustomReason('');
    }
    onOpenChange(isOpen);
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            Deny Booking Request
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3">
              <p>
                Are you sure you want to deny this booking? The guest will be notified with your selected reason.
              </p>
              <div className="bg-muted p-3 rounded-lg text-sm">
                <p className="font-medium text-foreground">{bookingGuestName}</p>
                <p className="text-muted-foreground">{bookingDates}</p>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-4 space-y-4">
          <Label className="text-sm font-medium">Select denial reason:</Label>
          <RadioGroup
            value={selectedReason}
            onValueChange={setSelectedReason}
            className="space-y-2"
          >
            {DENIAL_REASONS.map((reason) => (
              <div key={reason.id} className="flex items-center space-x-2">
                <RadioGroupItem value={reason.id} id={reason.id} />
                <Label
                  htmlFor={reason.id}
                  className="text-sm font-normal cursor-pointer"
                >
                  {reason.label}
                </Label>
              </div>
            ))}
          </RadioGroup>

          {selectedReason === 'custom' && (
            <Textarea
              placeholder="Enter custom reason for denial..."
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              className="min-h-[80px]"
            />
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={loading || (selectedReason === 'custom' && !customReason.trim())}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            <X className="w-4 h-4 mr-1" />
            {loading ? 'Denying...' : 'Deny Booking'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
