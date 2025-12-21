/**
 * Apple-style Glassmorphism Card Component
 * Premium UI component with smooth animations and hover effects
 */

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface AppleCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'elevated' | 'inset';
  onClick?: () => void;
}

const paddingClasses = {
  none: '',
  sm: 'p-3 sm:p-4',
  md: 'p-4 sm:p-6',
  lg: 'p-6 sm:p-8',
};

const variantClasses = {
  default: 'bg-card/60 backdrop-blur-xl border border-border/50',
  elevated: 'bg-card/80 backdrop-blur-2xl border border-border/30 shadow-lg shadow-black/5',
  inset: 'bg-background/50 backdrop-blur-sm border border-border/20',
};

export function AppleCard({
  children,
  className,
  hover = false,
  padding = 'md',
  variant = 'default',
  onClick,
}: AppleCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-2xl transition-all duration-300',
        variantClasses[variant],
        paddingClasses[padding],
        hover && 'cursor-pointer hover:scale-[1.02] hover:shadow-xl hover:border-border/70',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * Apple-style Metric Card with icon and trend indicator
 */
interface AppleMetricCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
  accentColor?: 'primary' | 'success' | 'warning' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
}

const accentColors = {
  primary: 'bg-primary/10 text-primary',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  destructive: 'bg-destructive/10 text-destructive',
};

const sizeClasses = {
  sm: { title: 'text-xs', value: 'text-lg', icon: 'p-2', iconSize: 'w-4 h-4' },
  md: { title: 'text-sm', value: 'text-2xl', icon: 'p-3', iconSize: 'w-5 h-5' },
  lg: { title: 'text-base', value: 'text-3xl', icon: 'p-4', iconSize: 'w-6 h-6' },
};

export function AppleMetricCard({
  title,
  value,
  icon,
  trend,
  subtitle,
  accentColor = 'primary',
  size = 'md',
}: AppleMetricCardProps) {
  const sizes = sizeClasses[size];

  return (
    <AppleCard variant="elevated" hover>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className={cn('font-medium text-muted-foreground truncate', sizes.title)}>
            {title}
          </p>
          <h3 className={cn('font-bold mt-1 tracking-tight', sizes.value)}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </h3>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1 truncate">{subtitle}</p>
          )}
          {trend && (
            <div
              className={cn(
                'flex items-center gap-1 text-xs font-medium mt-2',
                trend.isPositive ? 'text-success' : 'text-destructive'
              )}
            >
              <svg
                className={cn('w-3 h-3', !trend.isPositive && 'rotate-180')}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        <div className={cn('rounded-xl flex-shrink-0', accentColors[accentColor], sizes.icon)}>
          {icon}
        </div>
      </div>
    </AppleCard>
  );
}

/**
 * Apple-style Section Header
 */
interface AppleSectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function AppleSectionHeader({ title, subtitle, action }: AppleSectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

/**
 * Apple-style Live Indicator
 */
interface AppleLiveIndicatorProps {
  count: number;
  label?: string;
}

export function AppleLiveIndicator({ count, label = 'Active Now' }: AppleLiveIndicatorProps) {
  return (
    <AppleCard 
      variant="elevated" 
      className="bg-gradient-to-r from-success/10 via-success/5 to-transparent border-success/20"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-3 h-3 bg-success rounded-full" />
            <div className="absolute inset-0 w-3 h-3 bg-success rounded-full animate-ping opacity-75" />
          </div>
          <span className="font-medium">{label}</span>
        </div>
        <span className="text-2xl font-bold">{count}</span>
      </div>
    </AppleCard>
  );
}

/**
 * Apple-style Status Badge
 */
interface AppleStatusBadgeProps {
  status: 'available' | 'limited' | 'sold_out' | 'maintenance';
  size?: 'sm' | 'md';
}

const statusStyles = {
  available: 'bg-success/15 text-success border-success/30',
  limited: 'bg-warning/15 text-warning border-warning/30',
  sold_out: 'bg-destructive/15 text-destructive border-destructive/30',
  maintenance: 'bg-muted text-muted-foreground border-muted-foreground/30',
};

const statusLabels = {
  available: 'Available',
  limited: 'Limited',
  sold_out: 'Sold Out',
  maintenance: 'Maintenance',
};

export function AppleStatusBadge({ status, size = 'md' }: AppleStatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-medium',
        statusStyles[status],
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'
      )}
    >
      <span className={cn('rounded-full mr-1.5', status === 'available' ? 'w-1.5 h-1.5 bg-current' : 'w-1.5 h-1.5 bg-current')} />
      {statusLabels[status]}
    </span>
  );
}
