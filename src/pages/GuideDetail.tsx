import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, AlertTriangle, Lightbulb, CheckCircle2, Star, Check } from 'lucide-react';
import { Guide } from '@/db/database';
import { getGuideById } from '@/services/offlineService';
import { Skeleton } from '@/components/ui/skeleton';
import { toggleFavorite, isFavorited, toggleCompleted, isCompleted } from '@/services/guideService';
import { toast } from '@/hooks/use-toast';

/**
 * Guide Detail Page
 * Shows step-by-step instructions for a specific survival guide
 */
const GuideDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [guide, setGuide] = useState<Guide | null>(null);
  const [loading, setLoading] = useState(true);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isFav, setIsFav] = useState(false);
  const [isComp, setIsComp] = useState(false);

  useEffect(() => {
    const loadGuide = async () => {
      if (!id) return;
      
      try {
        const [data, favStatus, compStatus] = await Promise.all([
          getGuideById(id),
          isFavorited(id),
          isCompleted(id)
        ]);
        setGuide(data || null);
        setIsFav(favStatus);
        setIsComp(compStatus);
      } catch (error) {
        console.error('Error loading guide:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGuide();
  }, [id]);

  const toggleStep = (stepNumber: number) => {
    setCompletedSteps(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stepNumber)) {
        newSet.delete(stepNumber);
      } else {
        newSet.add(stepNumber);
      }
      return newSet;
    });
  };

  const handleToggleFavorite = async () => {
    if (!id) return;
    const newStatus = await toggleFavorite(id);
    setIsFav(newStatus);
    toast({
      title: newStatus ? 'Added to Favorites' : 'Removed from Favorites',
      description: newStatus ? 'Guide saved for quick access' : 'Guide removed from favorites'
    });
  };

  const handleToggleCompleted = async () => {
    if (!id) return;
    const newStatus = await toggleCompleted(id);
    setIsComp(newStatus);
    toast({
      title: newStatus ? 'Marked as Completed' : 'Marked as Incomplete',
      description: newStatus ? 'Great job learning this guide!' : 'Guide marked incomplete'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-3xl mx-auto space-y-4">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-3xl mx-auto text-center py-12">
          <p className="text-muted-foreground mb-4">Guide not found</p>
          <Button onClick={() => navigate('/guides')}>
            Back to Guides
          </Button>
        </div>
      </div>
    );
  }

  const priorityColors = {
    critical: 'bg-destructive/10 text-destructive border-destructive/20',
    important: 'bg-warning/10 text-warning-foreground border-warning/20',
    useful: 'bg-primary/10 text-primary border-primary/20'
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 pb-20">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <Button
          variant="ghost"
          onClick={() => navigate('/guides')}
          className="mb-4 -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Guides
        </Button>

        {/* Guide Info */}
        <div className="mb-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="text-5xl">{guide.icon}</div>
            <div className="flex-1">
              <div className="flex items-start gap-2 mb-2">
                <h1 className="text-3xl font-bold flex-1">{guide.title}</h1>
                <Badge variant="outline" className={priorityColors[guide.priority]}>
                  {guide.priority}
                </Badge>
              </div>
              <p className="text-muted-foreground">{guide.description}</p>
              <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                <span className="px-2 py-1 bg-muted rounded">{guide.category}</span>
                <span>{guide.steps.length} steps</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={handleToggleFavorite}
              variant={isFav ? 'default' : 'outline'}
              size="sm"
            >
              <Star className={`h-4 w-4 mr-2 ${isFav ? 'fill-current' : ''}`} />
              {isFav ? 'Favorited' : 'Add to Favorites'}
            </Button>
            <Button
              onClick={handleToggleCompleted}
              variant={isComp ? 'default' : 'outline'}
              size="sm"
            >
              <Check className="h-4 w-4 mr-2" />
              {isComp ? 'Completed' : 'Mark Complete'}
            </Button>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {guide.steps.map((step) => (
            <Card key={step.stepNumber} className="p-5">
              <div className="flex items-start gap-4">
                <button
                  onClick={() => toggleStep(step.stepNumber)}
                  className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                    completedSteps.has(step.stepNumber)
                      ? 'bg-success border-success text-success-foreground'
                      : 'border-muted-foreground/30 hover:border-primary'
                  }`}
                >
                  {completedSteps.has(step.stepNumber) ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-bold">{step.stepNumber}</span>
                  )}
                </button>
                
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground mb-3 leading-relaxed">
                    {step.content}
                  </p>

                  {/* Warning */}
                  {step.warning && (
                    <div className="mb-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex gap-2">
                      <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-destructive font-medium">
                        {step.warning}
                      </p>
                    </div>
                  )}

                  {/* Tips */}
                  {step.tips && step.tips.length > 0 && (
                    <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                      <div className="flex gap-2 mb-2">
                        <Lightbulb className="h-5 w-5 text-primary flex-shrink-0" />
                        <span className="text-sm font-semibold text-primary">Tips:</span>
                      </div>
                      <ul className="space-y-1 ml-7">
                        {step.tips.map((tip, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground">
                            • {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Completion Status */}
        <div className="mt-6 p-4 bg-card border border-border rounded-lg text-center">
          <p className="text-sm text-muted-foreground">
            {completedSteps.size} of {guide.steps.length} steps completed
          </p>
        </div>
      </div>
    </div>
  );
};

export default GuideDetail;
