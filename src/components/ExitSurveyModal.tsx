import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { X, MessageCircle } from 'lucide-react';

interface ExitSurveyModalProps {
  onSubmit: (data: ExitSurveyData) => void;
  onDismiss: () => void;
}

export interface ExitSurveyData {
  exit_reason: string;
  feedback?: string;
  was_looking_for?: string;
  would_return: boolean;
}

const EXIT_REASONS = [
  { value: 'just_browsing', label: 'Just browsing' },
  { value: 'prices_too_high', label: 'Prices are too high' },
  { value: 'dates_not_available', label: 'My dates aren\'t available' },
  { value: 'comparing_options', label: 'Comparing with other options' },
  { value: 'booking_later', label: 'Planning to book later' },
  { value: 'technical_issues', label: 'Had technical issues' },
  { value: 'not_what_expected', label: 'Not what I expected' },
  { value: 'other', label: 'Other reason' },
];

export const ExitSurveyModal: React.FC<ExitSurveyModalProps> = ({ onSubmit, onDismiss }) => {
  const [exitReason, setExitReason] = useState('');
  const [feedback, setFeedback] = useState('');
  const [wouldReturn, setWouldReturn] = useState<boolean | null>(null);

  const handleSubmit = () => {
    if (!exitReason) return;
    
    onSubmit({
      exit_reason: exitReason,
      feedback: feedback || undefined,
      would_return: wouldReturn ?? true,
    });
  };

  return (
    <Dialog open={true} onOpenChange={() => onDismiss()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            Before you go...
          </DialogTitle>
          <DialogDescription>
            Help us improve! Why are you leaving today?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <RadioGroup value={exitReason} onValueChange={setExitReason}>
            {EXIT_REASONS.map((reason) => (
              <div key={reason.value} className="flex items-center space-x-2">
                <RadioGroupItem value={reason.value} id={reason.value} />
                <Label htmlFor={reason.value} className="cursor-pointer">
                  {reason.label}
                </Label>
              </div>
            ))}
          </RadioGroup>

          {exitReason === 'other' && (
            <Textarea
              placeholder="Please tell us more..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="mt-2"
              rows={3}
            />
          )}

          <div className="pt-2">
            <Label className="text-sm text-muted-foreground mb-2 block">
              Would you consider visiting XTSY in the future?
            </Label>
            <div className="flex gap-2">
              <Button
                variant={wouldReturn === true ? 'default' : 'outline'}
                size="sm"
                onClick={() => setWouldReturn(true)}
              >
                Yes, definitely!
              </Button>
              <Button
                variant={wouldReturn === false ? 'default' : 'outline'}
                size="sm"
                onClick={() => setWouldReturn(false)}
              >
                Maybe not
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="ghost" onClick={onDismiss}>
            Skip
          </Button>
          <Button onClick={handleSubmit} disabled={!exitReason}>
            Submit & Leave
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Hook to detect exit intent
export const useExitIntent = (onExitIntent: () => void) => {
  useEffect(() => {
    let hasTriggered = false;
    
    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger when mouse leaves from top of page
      if (e.clientY <= 0 && !hasTriggered) {
        hasTriggered = true;
        onExitIntent();
      }
    };

    // Mobile: detect back button / page visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && !hasTriggered) {
        hasTriggered = true;
        onExitIntent();
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [onExitIntent]);
};
