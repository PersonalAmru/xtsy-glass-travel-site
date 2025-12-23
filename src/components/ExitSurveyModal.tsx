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
      <DialogContent 
        className="sm:max-w-md border-2 border-primary/30 bg-card shadow-2xl shadow-primary/20"
        style={{ zIndex: 100 }}
      >
        {/* Accent gradient bar at top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/80 to-primary rounded-t-lg" />
        
        <DialogHeader className="pt-2">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-foreground">
            <div className="p-2 rounded-full bg-primary/20">
              <MessageCircle className="h-5 w-5 text-primary" />
            </div>
            Before you go...
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-base">
            Help us improve! Why are you leaving today?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <RadioGroup value={exitReason} onValueChange={setExitReason} className="space-y-2">
            {EXIT_REASONS.map((reason) => (
              <div 
                key={reason.value} 
                className={`flex items-center space-x-3 p-3 rounded-lg border transition-all cursor-pointer hover:bg-accent/50 ${
                  exitReason === reason.value 
                    ? 'border-primary bg-primary/10 shadow-sm' 
                    : 'border-border/50 bg-background/50'
                }`}
                onClick={() => setExitReason(reason.value)}
              >
                <RadioGroupItem value={reason.value} id={reason.value} className="border-primary" />
                <Label htmlFor={reason.value} className="cursor-pointer text-foreground font-medium flex-1">
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
              className="mt-2 border-primary/30 focus:border-primary bg-background"
              rows={3}
            />
          )}

          <div className="pt-3 p-4 rounded-lg bg-accent/30 border border-border/50">
            <Label className="text-sm text-foreground font-medium mb-3 block">
              Would you consider visiting XTSY in the future?
            </Label>
            <div className="flex gap-3">
              <Button
                variant={wouldReturn === true ? 'default' : 'outline'}
                size="sm"
                onClick={() => setWouldReturn(true)}
                className={wouldReturn === true ? 'bg-primary hover:bg-primary/90' : 'border-primary/50 hover:bg-primary/10'}
              >
                Yes, definitely!
              </Button>
              <Button
                variant={wouldReturn === false ? 'default' : 'outline'}
                size="sm"
                onClick={() => setWouldReturn(false)}
                className={wouldReturn === false ? 'bg-destructive hover:bg-destructive/90' : 'border-border hover:bg-accent'}
              >
                Maybe not
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-2 border-t border-border/50">
          <Button variant="ghost" onClick={onDismiss} className="text-muted-foreground hover:text-foreground">
            Skip
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!exitReason}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 shadow-lg shadow-primary/30"
          >
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
