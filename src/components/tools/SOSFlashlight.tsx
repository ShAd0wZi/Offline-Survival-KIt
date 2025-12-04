import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Flashlight, FlashlightOff } from 'lucide-react';

export const SOSFlashlight = () => {
  const [isActive, setIsActive] = useState(false);
  const [isWhite, setIsWhite] = useState(false);

  useEffect(() => {
    if (!isActive) return;

    // SOS pattern: ... --- ... (short short short long long long short short short)
    const shortDuration = 200;
    const longDuration = 600;
    const gapDuration = 200;
    const letterGap = 600;

    const pattern = [
      // S: ...
      shortDuration, gapDuration, shortDuration, gapDuration, shortDuration, letterGap,
      // O: ---
      longDuration, gapDuration, longDuration, gapDuration, longDuration, letterGap,
      // S: ...
      shortDuration, gapDuration, shortDuration, gapDuration, shortDuration, letterGap * 2
    ];

    let currentIndex = 0;
    let timeoutId: NodeJS.Timeout;

    const flash = () => {
      const duration = pattern[currentIndex];
      const isFlashOn = currentIndex % 2 === 0;
      
      setIsWhite(isFlashOn);
      
      timeoutId = setTimeout(() => {
        currentIndex = (currentIndex + 1) % pattern.length;
        flash();
      }, duration);
    };

    flash();

    return () => clearTimeout(timeoutId);
  }, [isActive]);

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <Flashlight className="h-6 w-6 text-primary" />
        <h3 className="text-xl font-bold">SOS Flashlight</h3>
      </div>
      
      <p className="text-sm text-muted-foreground mb-6">
        Automatic SOS morse code pattern (... --- ...) to signal for help
      </p>

      <div 
        className={`w-full h-48 rounded-lg mb-6 transition-colors duration-100 ${
          isWhite ? 'bg-white' : 'bg-muted'
        }`}
      />

      <Button
        onClick={() => setIsActive(!isActive)}
        variant={isActive ? 'destructive' : 'default'}
        className="w-full"
        size="lg"
      >
        {isActive ? (
          <>
            <FlashlightOff className="h-5 w-5 mr-2" />
            Stop SOS Signal
          </>
        ) : (
          <>
            <Flashlight className="h-5 w-5 mr-2" />
            Start SOS Signal
          </>
        )}
      </Button>
    </Card>
  );
};
