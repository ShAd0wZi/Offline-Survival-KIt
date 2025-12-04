import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Flashlight, FlashlightOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

/**
 * Emergency Flashlight - Uses device camera torch
 * Provides ON/OFF toggle for camera flash without showing camera feed
 */
export const EmergencyFlashlight = () => {
  const [isOn, setIsOn] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const trackRef = useRef<MediaStreamTrack | null>(null);

  useEffect(() => {
    // Check if torch is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setIsSupported(false);
      setError('Camera access not supported on this device');
    }
    
    return () => {
      // Cleanup on unmount
      if (trackRef.current) {
        trackRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const toggleTorch = async () => {
    try {
      if (!isOn) {
        // Turn torch ON
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
            // @ts-ignore - advanced constraints for torch
            advanced: [{ torch: true }]
          }
        });
        
        streamRef.current = stream;
        const track = stream.getVideoTracks()[0];
        trackRef.current = track;

        // Check if torch capability exists
        const capabilities = track.getCapabilities() as any;
        if (!capabilities.torch) {
          throw new Error('Torch not supported on this device');
        }

        // Apply torch constraint
        await track.applyConstraints({
          // @ts-ignore - torch constraint
          advanced: [{ torch: true }]
        });

        setIsOn(true);
        toast({
          title: 'Flashlight ON',
          description: 'Emergency flashlight activated',
        });
      } else {
        // Turn torch OFF
        if (trackRef.current) {
          await trackRef.current.applyConstraints({
            // @ts-ignore - torch constraint
            advanced: [{ torch: false }]
          });
          trackRef.current.stop();
          trackRef.current = null;
        }
        
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }

        setIsOn(false);
        toast({
          title: 'Flashlight OFF',
          description: 'Emergency flashlight deactivated',
        });
      }
    } catch (err: any) {
      console.error('Torch error:', err);
      setIsSupported(false);
      
      let errorMessage = 'Failed to access flashlight';
      if (err.name === 'NotAllowedError') {
        errorMessage = 'Camera permission denied. Please allow camera access in settings.';
      } else if (err.name === 'NotFoundError') {
        errorMessage = 'No camera found on this device';
      } else if (err.message.includes('Torch not supported')) {
        errorMessage = 'Torch/flashlight not available on this device';
      }
      
      setError(errorMessage);
      toast({
        title: 'Flashlight Error',
        description: errorMessage,
        variant: 'destructive'
      });
    }
  };

  if (!isSupported || error) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Flashlight className="h-6 w-6 text-primary" />
          <h3 className="text-xl font-bold">Emergency Flashlight</h3>
        </div>
        <p className="text-sm text-destructive">
          {error || 'Flashlight not supported on this device. Try on a mobile device with camera flash.'}
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <Flashlight className="h-6 w-6 text-primary" />
        <h3 className="text-xl font-bold">Emergency Flashlight</h3>
      </div>
      
      <p className="text-sm text-muted-foreground mb-6">
        Use your device's camera flash as an emergency flashlight
      </p>

      <div 
        className={`w-full h-48 rounded-lg mb-6 flex items-center justify-center transition-all duration-200 ${
          isOn ? 'bg-yellow-400/20 border-2 border-yellow-400' : 'bg-muted'
        }`}
      >
        <div className="text-center">
          {isOn ? (
            <Flashlight className="h-16 w-16 text-yellow-400 animate-pulse" />
          ) : (
            <FlashlightOff className="h-16 w-16 text-muted-foreground" />
          )}
          <p className="mt-4 text-sm font-medium">
            {isOn ? 'Flashlight is ON' : 'Flashlight is OFF'}
          </p>
        </div>
      </div>

      <Button
        onClick={toggleTorch}
        variant={isOn ? 'destructive' : 'default'}
        className="w-full"
        size="lg"
      >
        {isOn ? (
          <>
            <FlashlightOff className="h-5 w-5 mr-2" />
            Turn OFF
          </>
        ) : (
          <>
            <Flashlight className="h-5 w-5 mr-2" />
            Turn ON
          </>
        )}
      </Button>

      <p className="text-xs text-muted-foreground mt-4 text-center">
        Note: This uses your camera flash. No video feed is displayed or recorded.
      </p>
    </Card>
  );
};
