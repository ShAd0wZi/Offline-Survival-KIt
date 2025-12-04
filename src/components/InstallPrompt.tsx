import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

/**
 * Install prompt for PWA
 * Shows when app can be installed
 */
export const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  if (!showPrompt) return null;

  return (
    <Card className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 p-4 shadow-lg z-40 border-2 border-primary/20">
      <button
        onClick={() => setShowPrompt(false)}
        className="absolute top-2 right-2 p-1 hover:bg-muted rounded"
      >
        <X className="h-4 w-4" />
      </button>
      
      <div className="flex gap-3 items-start pr-6">
        <Download className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-bold mb-1">Install Survival Guide</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Install this app for quick access during emergencies. Works offline!
          </p>
          <Button onClick={handleInstall} size="sm" className="w-full">
            Install App
          </Button>
        </div>
      </div>
    </Card>
  );
};
