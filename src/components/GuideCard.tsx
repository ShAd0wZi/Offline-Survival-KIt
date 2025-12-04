import { Guide } from '@/db/database';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight } from 'lucide-react';

interface GuideCardProps {
  guide: Guide;
  onClick: () => void;
}

/**
 * Card component for displaying guide in list
 */
export const GuideCard = ({ guide, onClick }: GuideCardProps) => {
  const priorityColors = {
    critical: 'bg-destructive/10 text-destructive border-destructive/20',
    important: 'bg-warning/10 text-warning-foreground border-warning/20',
    useful: 'bg-primary/10 text-primary border-primary/20'
  };

  return (
    <Card
      onClick={onClick}
      className="p-4 cursor-pointer hover:border-primary/50 transition-all duration-200 active:scale-98 flex items-center gap-4"
    >
      <div className="text-4xl flex-shrink-0">
        {guide.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-bold text-base">{guide.title}</h3>
          <Badge variant="outline" className={priorityColors[guide.priority]}>
            {guide.priority}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
          {guide.description}
        </p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{guide.steps.length} steps</span>
          <span className="px-2 py-1 bg-muted rounded">{guide.category}</span>
        </div>
      </div>
      <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
    </Card>
  );
};
