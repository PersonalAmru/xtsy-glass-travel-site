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
        className="sm:max-w-md border-2 border-primary bg-white dark:bg-slate-900 shadow-2xl shadow-primary/30"
        style={{ zIndex: 100 }}
      >
        {/* Accent gradient bar at top */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-blue-500 to-primary rounded-t-lg" />
        
        <DialogHeader className="pt-4">
          <DialogTitle className="flex items-center gap-3 text-xl font-bold text-slate-900 dark:text-white">
            <div className="p-2.5 rounded-full bg-primary/20 border border-primary/30">
              <MessageCircle className="h-5 w-5 text-primary" />
            </div>
            Before you go...
          </DialogTitle>
          <DialogDescription className="text-slate-600 dark:text-slate-300 text-base mt-1">
            Help us improve! Why are you leaving today?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          <RadioGroup value={exitReason} onValueChange={setExitReason} className="space-y-2">
            {EXIT_REASONS.map((reason) => (
              <div 
                key={reason.value} 
                className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-all cursor-pointer ${
                  exitReason === reason.value 
                    ? 'border-primary bg-primary/10 shadow-md' 
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-primary/50 hover:bg-primary/5'
                }`}
                onClick={() => setExitReason(reason.value)}
              >
                <RadioGroupItem value={reason.value} id={reason.value} className="border-primary text-primary" />
                <Label htmlFor={reason.value} className="cursor-pointer text-slate-800 dark:text-slate-100 font-medium flex-1">
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
              className="mt-2 border-2 border-primary/40 focus:border-primary bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400"
              rows={3}
            />
          )}

          <div className="pt-3 p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700">
            <Label className="text-sm text-slate-800 dark:text-slate-100 font-semibold mb-3 block">
              Would you consider visiting XTSY in the future?
            </Label>
            <div className="flex gap-3">
              <Button
                variant={wouldReturn === true ? 'default' : 'outline'}
                size="sm"
                onClick={() => setWouldReturn(true)}
                className={wouldReturn === true 
                  ? 'bg-green-600 hover:bg-green-700 text-white border-0' 
                  : 'border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-500'}
              >
                Yes, definitely!
              </Button>
              <Button
                variant={wouldReturn === false ? 'default' : 'outline'}
                size="sm"
                onClick={() => setWouldReturn(false)}
                className={wouldReturn === false 
                  ? 'bg-red-600 hover:bg-red-700 text-white border-0' 
                  : 'border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-500'}
              >
                Maybe not
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-4 border-t-2 border-slate-200 dark:border-slate-700">
          <Button variant="ghost" onClick={onDismiss} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
            Skip
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!exitReason}
            className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 shadow-lg shadow-primary/40 disabled:opacity-50"
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
