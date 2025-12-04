import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Compass as CompassIcon } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const Compass = () => {
  const [heading, setHeading] = useState<number | null>(null);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if (!('DeviceOrientationEvent' in window)) {
      setIsSupported(false);
      return;
    }

    const handleOrientation = (event: DeviceOrientationEvent) => {
      // iOS provides webkitCompassHeading, others use alpha
      let compassHeading: number | null = null;
      
      if ((event as any).webkitCompassHeading !== undefined) {
        // iOS: webkitCompassHeading gives true compass heading
        compassHeading = (event as any).webkitCompassHeading;
      } else if (event.alpha !== null) {
        // Android/others: use alpha (0-360 degrees)
        compassHeading = event.alpha;
      }
      
      if (compassHeading !== null) {
        setHeading(compassHeading);
      }
    };

    // Request permission for iOS 13+
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      (DeviceOrientationEvent as any).requestPermission()
        .then((permissionState: string) => {
          if (permissionState === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation);
          } else {
            toast({
              title: 'Permission Denied',
              description: 'Compass requires device orientation permission',
              variant: 'destructive'
            });
            setIsSupported(false);
          }
        })
        .catch(() => {
          setIsSupported(false);
        });
    } else {
      window.addEventListener('deviceorientation', handleOrientation);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  const getDirection = (deg: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(deg / 45) % 8;
    return directions[index];
  };

  if (!isSupported) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <CompassIcon className="h-6 w-6 text-primary" />
          <h3 className="text-xl font-bold">Compass</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Compass not supported on this device. Try on a mobile device with orientation sensors.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <CompassIcon className="h-6 w-6 text-primary" />
        <h3 className="text-xl font-bold">Compass</h3>
      </div>
      
      <p className="text-sm text-muted-foreground mb-6">
        Digital compass using device orientation sensor
      </p>

      <div className="relative w-64 h-64 mx-auto mb-6">
        <div 
          className="absolute inset-0 rounded-full border-4 border-primary bg-card flex items-center justify-center"
          style={{
            transform: heading !== null ? `rotate(${-heading}deg)` : 'rotate(0deg)',
            transition: 'transform 0.3s ease-out'
          }}
        >
          <div className="absolute top-2 text-2xl font-bold text-destructive">N</div>
          <div className="absolute right-2 text-lg text-muted-foreground">E</div>
          <div className="absolute bottom-2 text-lg text-muted-foreground">S</div>
          <div className="absolute left-2 text-lg text-muted-foreground">W</div>
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-16 bg-destructive rounded-full" style={{ clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)' }} />
        </div>
      </div>

      <div className="text-center">
        <div className="text-5xl font-bold mb-2">
          {heading !== null ? Math.round(heading) : '--'}°
        </div>
        <div className="text-2xl text-muted-foreground">
          {heading !== null ? getDirection(heading) : '--'}
        </div>
      </div>
    </Card>
  );
};
