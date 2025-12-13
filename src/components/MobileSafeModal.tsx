import * as React from 'react';
import { useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useMobileUIDebug } from '@/hooks/useMobileUIDebug';
import { cn } from '@/lib/utils';

interface MobileSafeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  hideDescription?: boolean;
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  debugName?: string;
}

const maxWidthClasses = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-xl',
  '2xl': 'sm:max-w-2xl',
};

/**
 * A mobile-safe modal wrapper that ensures proper sizing on all devices
 * and automatically reports layout issues to Supabase for debugging.
 */
const MobileSafeModal: React.FC<MobileSafeModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  hideDescription = false,
  children,
  className,
  maxWidth = 'md',
  debugName,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const { reportModalOpen, isMobile } = useMobileUIDebug({
    componentName: debugName || `MobileSafeModal-${title.replace(/\s+/g, '_')}`,
    enabled: true,
  });

  // Report modal dimensions when opened
  useEffect(() => {
    if (isOpen && contentRef.current && isMobile) {
      // Wait for animation to complete
      const timer = setTimeout(() => {
        reportModalOpen(contentRef.current);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isMobile, reportModalOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        ref={contentRef}
        className={cn(
          // Mobile-first width with safe margins
          '!w-[calc(100vw-2rem)]',
          // Max width based on prop
          maxWidthClasses[maxWidth],
          // Ensure proper box model
          'box-border overflow-hidden',
          // Touch-friendly
          'touch-manipulation',
          className
        )}
        style={{
          // Explicit inline styles for maximum mobile compatibility
          width: 'calc(100vw - 2rem)',
          maxWidth: maxWidth === 'sm' ? '24rem' : 
                   maxWidth === 'md' ? '28rem' : 
                   maxWidth === 'lg' ? '32rem' : 
                   maxWidth === 'xl' ? '36rem' : '42rem',
          boxSizing: 'border-box',
          // Ensure centering transform is applied
          transform: 'translate(-50%, -50%)',
          left: '50%',
          top: '50%',
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-foreground">{title}</DialogTitle>
          {hideDescription ? (
            <VisuallyHidden>
              <DialogDescription>
                {description || title}
              </DialogDescription>
            </VisuallyHidden>
          ) : description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : (
            <VisuallyHidden>
              <DialogDescription>{title}</DialogDescription>
            </VisuallyHidden>
          )}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default MobileSafeModal;
