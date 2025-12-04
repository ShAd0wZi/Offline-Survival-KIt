import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  variant?: 'default' | 'danger' | 'success';
  className?: string;
}

/**
 * Large, touch-friendly action card for emergency UI
 * Used on home dashboard for primary actions
 */
export const QuickActionCard = ({
  title,
  description,
  icon: Icon,
  onClick,
  variant = 'default',
  className
}: QuickActionCardProps) => {
  const variants = {
    default: 'hover:border-primary/50 hover:bg-card/80',
    danger: 'border-destructive/20 hover:border-destructive/50 hover:bg-destructive/5',
    success: 'border-success/20 hover:border-success/50 hover:bg-success/5'
  };

  return (
    <Card
      onClick={onClick}
      className={cn(
        'p-6 cursor-pointer transition-all duration-200 border-2',
        'active:scale-95 min-h-[140px] flex flex-col items-start justify-between',
        variants[variant],
        className
      )}
    >
      <div className="flex items-start gap-4 w-full">
        <div className={cn(
          'p-3 rounded-lg',
          variant === 'danger' && 'bg-destructive/10',
          variant === 'success' && 'bg-success/10',
          variant === 'default' && 'bg-primary/10'
        )}>
          <Icon className={cn(
            'h-8 w-8',
            variant === 'danger' && 'text-destructive',
            variant === 'success' && 'text-success',
            variant === 'default' && 'text-primary'
          )} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </Card>
  );
};
