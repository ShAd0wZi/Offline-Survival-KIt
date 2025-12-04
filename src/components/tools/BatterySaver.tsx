import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Battery, BatteryLow, BatteryWarning, Zap } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { db } from '@/db/database';

interface BatteryStatus {
  level: number;
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
}

/**
 * Battery Saver Mode - Monitor battery and enable power saving
 * Reduces animations and update rates when battery is low
 */
export const BatterySaver = () => {
  const [battery, setBattery] = useState<BatteryStatus | null>(null);
  const [powerSaverEnabled, setPowerSaverEnabled] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [lowBatteryWarned, setLowBatteryWarned] = useState(false);

  useEffect(() => {
    loadPowerSaverPreference();
    initBatteryMonitoring();
  }, []);

  useEffect(() => {
    if (battery && battery.level < 0.2 && !battery.charging && !lowBatteryWarned) {
      showLowBatteryWarning();
      setLowBatteryWarned(true);
    } else if (battery && battery.level >= 0.2) {
      setLowBatteryWarned(false);
    }
  }, [battery, lowBatteryWarned]);

  useEffect(() => {
    // Apply power saver mode to document
    if (powerSaverEnabled) {
      document.documentElement.classList.add('power-saver-mode');
    } else {
      document.documentElement.classList.remove('power-saver-mode');
    }
  }, [powerSaverEnabled]);

  const loadPowerSaverPreference = async () => {
    try {
      const settings = await db.settings.get('app-settings');
      if (settings?.powerSaverEnabled !== undefined) {
        setPowerSaverEnabled(settings.powerSaverEnabled);
      }
    } catch (err) {
      console.error('Error loading power saver preference:', err);
    }
  };

  const savePowerSaverPreference = async (enabled: boolean) => {
    try {
      await db.settings.update('app-settings', {
        powerSaverEnabled: enabled
      });
    } catch (err) {
      console.error('Error saving power saver preference:', err);
    }
  };

  const initBatteryMonitoring = async () => {
    if (!('getBattery' in navigator)) {
      setIsSupported(false);
      return;
    }

    try {
      const batteryManager = await (navigator as any).getBattery();
      
      const updateBatteryStatus = () => {
        setBattery({
          level: batteryManager.level,
          charging: batteryManager.charging,
          chargingTime: batteryManager.chargingTime,
          dischargingTime: batteryManager.dischargingTime
        });
      };

      updateBatteryStatus();

      batteryManager.addEventListener('levelchange', updateBatteryStatus);
      batteryManager.addEventListener('chargingchange', updateBatteryStatus);

      return () => {
        batteryManager.removeEventListener('levelchange', updateBatteryStatus);
        batteryManager.removeEventListener('chargingchange', updateBatteryStatus);
      };
    } catch (err) {
      console.error('Battery API error:', err);
      setIsSupported(false);
    }
  };

  const showLowBatteryWarning = () => {
    toast({
      title: 'Low Battery Warning',
      description: 'Battery is below 20%. Consider enabling Power Saver Mode.',
      variant: 'destructive'
    });

    // Show browser notification if permission granted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Low Battery', {
        body: 'Battery is below 20%. Enable Power Saver Mode to extend battery life.',
        icon: '/favicon.ico',
        tag: 'low-battery'
      });
    }
  };

  const togglePowerSaver = (enabled: boolean) => {
    setPowerSaverEnabled(enabled);
    savePowerSaverPreference(enabled);

    toast({
      title: enabled ? 'Power Saver Enabled' : 'Power Saver Disabled',
      description: enabled 
        ? 'Animations reduced, update rates lowered'
        : 'Normal performance restored'
    });
  };

  const getBatteryIcon = () => {
    if (!battery) return <Battery className="h-6 w-6 text-primary" />;
    
    if (battery.level < 0.2) {
      return <BatteryLow className="h-6 w-6 text-destructive" />;
    } else if (battery.level < 0.5) {
      return <BatteryWarning className="h-6 w-6 text-yellow-500" />;
    } else {
      return <Battery className="h-6 w-6 text-green-500" />;
    }
  };

  const getBatteryColor = () => {
    if (!battery) return 'bg-muted';
    
    if (battery.level < 0.2) return 'bg-destructive';
    if (battery.level < 0.5) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const formatTime = (seconds: number) => {
    if (seconds === Infinity || isNaN(seconds)) return 'calculating...';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (!isSupported) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Battery className="h-6 w-6 text-primary" />
          <h3 className="text-xl font-bold">Battery Saver</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Battery monitoring not supported on this device. Try on a laptop or mobile device.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        {getBatteryIcon()}
        <h3 className="text-xl font-bold">Battery Saver</h3>
      </div>

      <p className="text-sm text-muted-foreground mb-6">
        Monitor battery level and enable power saving mode
      </p>

      {battery && (
        <>
          {/* Battery Level Display */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Battery Level</span>
              <div className="flex items-center gap-2">
                {battery.charging && <Zap className="h-4 w-4 text-yellow-500" />}
                <span className="text-2xl font-bold">
                  {Math.round(battery.level * 100)}%
                </span>
              </div>
            </div>

            {/* Battery Bar */}
            <div className="relative w-full h-8 bg-muted rounded-lg overflow-hidden border-2">
              <div
                className={`h-full ${getBatteryColor()} transition-all duration-300`}
                style={{ width: `${battery.level * 100}%` }}
              />
              {battery.charging && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-white drop-shadow-lg animate-pulse" />
                </div>
              )}
            </div>
          </div>

          {/* Battery Stats */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg mb-6">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Status</p>
              <p className="font-medium">
                {battery.charging ? 'Charging' : 'Discharging'}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">
                {battery.charging ? 'Full in' : 'Empty in'}
              </p>
              <p className="font-medium">
                {battery.charging 
                  ? formatTime(battery.chargingTime)
                  : formatTime(battery.dischargingTime)
                }
              </p>
            </div>
          </div>

          {/* Low Battery Warning */}
          {battery.level < 0.2 && !battery.charging && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg animate-fade-in">
              <div className="flex items-start gap-3">
                <BatteryLow className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-destructive mb-1">
                    Low Battery Alert
                  </p>
                  <p className="text-xs text-destructive/80">
                    Battery is below 20%. Enable Power Saver Mode to extend battery life.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Power Saver Toggle */}
          <div className="flex items-center justify-between p-4 border rounded-lg mb-6">
            <div className="flex-1">
              <Label htmlFor="power-saver" className="text-base font-medium cursor-pointer">
                Power Saver Mode
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                Reduces animations and update rates
              </p>
            </div>
            <Switch
              id="power-saver"
              checked={powerSaverEnabled}
              onCheckedChange={togglePowerSaver}
            />
          </div>

          {/* Power Saver Info */}
          {powerSaverEnabled && (
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg animate-fade-in">
              <p className="text-sm font-medium mb-2">Power Saver Active</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Animations reduced</li>
                <li>• Update rates lowered</li>
                <li>• Background tasks minimized</li>
              </ul>
            </div>
          )}
        </>
      )}

      {!battery && (
        <div className="text-center py-8 text-muted-foreground">
          <Battery className="h-12 w-12 mx-auto mb-3 opacity-50 animate-pulse" />
          <p className="text-sm">Loading battery information...</p>
        </div>
      )}
    </Card>
  );
};
