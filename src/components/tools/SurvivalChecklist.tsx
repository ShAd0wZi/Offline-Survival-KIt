import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ClipboardList, RotateCcw, CheckCircle2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { db } from '@/db/database';

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

interface ScenarioChecklist {
  scenario: string;
  items: ChecklistItem[];
}

// Pre-built checklists for common survival scenarios
const DEFAULT_CHECKLISTS: ScenarioChecklist[] = [
  {
    scenario: 'fire',
    items: [
      { id: 'fire-1', text: 'Call emergency services (911)', completed: false },
      { id: 'fire-2', text: 'Alert everyone in the building', completed: false },
      { id: 'fire-3', text: 'Evacuate immediately', completed: false },
      { id: 'fire-4', text: 'Stay low to avoid smoke', completed: false },
      { id: 'fire-5', text: 'Feel doors before opening', completed: false },
      { id: 'fire-6', text: 'Use stairs, not elevators', completed: false },
      { id: 'fire-7', text: 'Meet at designated assembly point', completed: false },
      { id: 'fire-8', text: 'Account for all occupants', completed: false }
    ]
  },
  {
    scenario: 'flood',
    items: [
      { id: 'flood-1', text: 'Move to higher ground immediately', completed: false },
      { id: 'flood-2', text: 'Avoid walking through moving water', completed: false },
      { id: 'flood-3', text: 'Turn off utilities if safe to do so', completed: false },
      { id: 'flood-4', text: 'Gather emergency supplies', completed: false },
      { id: 'flood-5', text: 'Stay informed via radio/alerts', completed: false },
      { id: 'flood-6', text: 'Do not drive through flooded areas', completed: false },
      { id: 'flood-7', text: 'Keep phone charged', completed: false },
      { id: 'flood-8', text: 'Document damage with photos', completed: false }
    ]
  },
  {
    scenario: 'earthquake',
    items: [
      { id: 'quake-1', text: 'Drop, Cover, and Hold On', completed: false },
      { id: 'quake-2', text: 'Stay away from windows', completed: false },
      { id: 'quake-3', text: 'If outdoors, move to open area', completed: false },
      { id: 'quake-4', text: 'Stay put until shaking stops', completed: false },
      { id: 'quake-5', text: 'Check for injuries', completed: false },
      { id: 'quake-6', text: 'Inspect home for damage', completed: false },
      { id: 'quake-7', text: 'Be prepared for aftershocks', completed: false },
      { id: 'quake-8', text: 'Listen for emergency information', completed: false }
    ]
  },
  {
    scenario: 'general',
    items: [
      { id: 'gen-1', text: 'Remain calm and assess situation', completed: false },
      { id: 'gen-2', text: 'Call for help if needed', completed: false },
      { id: 'gen-3', text: 'Gather emergency kit', completed: false },
      { id: 'gen-4', text: 'Check on family members', completed: false },
      { id: 'gen-5', text: 'Follow evacuation orders', completed: false },
      { id: 'gen-6', text: 'Stay informed via official sources', completed: false },
      { id: 'gen-7', text: 'Conserve phone battery', completed: false },
      { id: 'gen-8', text: 'Help others if safe to do so', completed: false }
    ]
  }
];

/**
 * Survival Checklist - Pre-built checklists for emergency scenarios
 * Stores progress offline in IndexedDB
 */
export const SurvivalChecklist = () => {
  const [checklists, setChecklists] = useState<ScenarioChecklist[]>(DEFAULT_CHECKLISTS);
  const [activeScenario, setActiveScenario] = useState<string>('fire');

  useEffect(() => {
    loadChecklists();
  }, []);

  const loadChecklists = async () => {
    try {
      const settings = await db.settings.get('app-settings');
      if (settings?.survivalChecklists) {
        setChecklists(settings.survivalChecklists);
      }
    } catch (err) {
      console.error('Error loading checklists:', err);
    }
  };

  const saveChecklists = async (updatedChecklists: ScenarioChecklist[]) => {
    try {
      await db.settings.update('app-settings', {
        survivalChecklists: updatedChecklists
      });
      setChecklists(updatedChecklists);
    } catch (err) {
      console.error('Error saving checklists:', err);
    }
  };

  const toggleItem = (scenario: string, itemId: string) => {
    const updated = checklists.map(checklist => {
      if (checklist.scenario === scenario) {
        return {
          ...checklist,
          items: checklist.items.map(item =>
            item.id === itemId ? { ...item, completed: !item.completed } : item
          )
        };
      }
      return checklist;
    });

    saveChecklists(updated);
  };

  const resetChecklist = (scenario: string) => {
    const updated = checklists.map(checklist => {
      if (checklist.scenario === scenario) {
        return {
          ...checklist,
          items: checklist.items.map(item => ({ ...item, completed: false }))
        };
      }
      return checklist;
    });

    saveChecklists(updated);
    toast({
      title: 'Checklist Reset',
      description: `${scenario.charAt(0).toUpperCase() + scenario.slice(1)} checklist has been reset`
    });
  };

  const getProgress = (scenario: string) => {
    const checklist = checklists.find(c => c.scenario === scenario);
    if (!checklist) return { completed: 0, total: 0, percentage: 0 };

    const completed = checklist.items.filter(item => item.completed).length;
    const total = checklist.items.length;
    const percentage = Math.round((completed / total) * 100);

    return { completed, total, percentage };
  };

  const currentChecklist = checklists.find(c => c.scenario === activeScenario);
  const progress = getProgress(activeScenario);

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <ClipboardList className="h-6 w-6 text-primary" />
        <h3 className="text-xl font-bold">Survival Checklist</h3>
      </div>

      <p className="text-sm text-muted-foreground mb-6">
        Essential steps for emergency scenarios - works offline
      </p>

      <Tabs value={activeScenario} onValueChange={setActiveScenario}>
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="fire">Fire</TabsTrigger>
          <TabsTrigger value="flood">Flood</TabsTrigger>
          <TabsTrigger value="earthquake">Quake</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
        </TabsList>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progress</span>
            <div className="flex items-center gap-2">
              <Badge variant={progress.percentage === 100 ? 'default' : 'secondary'}>
                {progress.completed}/{progress.total}
              </Badge>
              <span className="text-sm font-bold">{progress.percentage}%</span>
            </div>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        </div>

        {checklists.map((checklist) => (
          <TabsContent key={checklist.scenario} value={checklist.scenario}>
            <div className="space-y-3 mb-6">
              {checklist.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <Checkbox
                    id={item.id}
                    checked={item.completed}
                    onCheckedChange={() => toggleItem(checklist.scenario, item.id)}
                    className="mt-0.5"
                  />
                  <label
                    htmlFor={item.id}
                    className={`flex-1 text-sm cursor-pointer select-none ${
                      item.completed ? 'line-through text-muted-foreground' : ''
                    }`}
                  >
                    {item.text}
                  </label>
                  {item.completed && (
                    <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>

            <Button
              onClick={() => resetChecklist(checklist.scenario)}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <RotateCcw className="h-5 w-5 mr-2" />
              Reset Checklist
            </Button>

            {progress.percentage === 100 && (
              <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg animate-fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <p className="text-sm font-medium text-green-700 dark:text-green-400">
                    Checklist Complete! Stay safe.
                  </p>
                </div>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      <div className="mt-4 p-3 bg-muted rounded-lg">
        <p className="text-xs text-muted-foreground">
          💾 Your progress is automatically saved and works offline
        </p>
      </div>
    </Card>
  );
};
