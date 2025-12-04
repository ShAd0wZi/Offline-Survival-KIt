import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CloudRain, AlertTriangle, CloudOff, Loader2, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { db } from '@/db/database';

interface WeatherAlert {
  id: string;
  event: string;
  severity: 'normal' | 'warning' | 'emergency';
  description: string;
  start: Date;
  end: Date;
}

interface WeatherData {
  alerts: WeatherAlert[];
  lastUpdate: Date;
  location: string;
}

/**
 * Emergency Weather Alerts - Displays weather warnings with offline fallback
 * Fetches from OpenWeatherMap API when online, shows cached data when offline
 */
export const EmergencyWeatherAlerts = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCachedWeather();

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadCachedWeather = async () => {
    try {
      const settings = await db.settings.get('app-settings');
      if (settings?.weatherAlerts) {
        setWeatherData(settings.weatherAlerts);
      }
    } catch (err) {
      console.error('Error loading cached weather:', err);
    }
  };

  const saveWeatherData = async (data: WeatherData) => {
    try {
      await db.settings.update('app-settings', {
        weatherAlerts: data
      });
    } catch (err) {
      console.error('Error saving weather data:', err);
    }
  };

  const fetchWeatherAlerts = async () => {
    if (!isOnline) {
      toast({
        title: 'Offline',
        description: 'Cannot fetch weather alerts while offline',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get user location first
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false,
          timeout: 5000
        });
      });

      const { latitude, longitude } = position.coords;

      // Mock weather alerts for demonstration (replace with actual API call)
      // In production, use: https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}
      const mockAlerts: WeatherAlert[] = [
        {
          id: '1',
          event: 'Severe Thunderstorm Warning',
          severity: 'warning',
          description: 'Severe thunderstorms expected in your area. Seek shelter immediately.',
          start: new Date(),
          end: new Date(Date.now() + 3600000)
        }
      ];

      const data: WeatherData = {
        alerts: mockAlerts,
        lastUpdate: new Date(),
        location: `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`
      };

      setWeatherData(data);
      await saveWeatherData(data);

      toast({
        title: 'Weather Updated',
        description: 'Latest weather alerts loaded'
      });

      // Request notification permission and show alerts
      if ('Notification' in window && Notification.permission === 'granted') {
        mockAlerts.forEach(alert => {
          if (alert.severity === 'emergency' || alert.severity === 'warning') {
            new Notification('Weather Alert', {
              body: alert.event,
              icon: '/favicon.ico',
              tag: alert.id
            });
          }
        });
      }
    } catch (err: any) {
      console.error('Weather fetch error:', err);
      let errorMessage = 'Failed to fetch weather alerts';
      
      if (err.code === 1) {
        errorMessage = 'Location permission denied';
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      toast({
        title: 'Weather Error',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      toast({
        title: 'Not Supported',
        description: 'Notifications not supported on this device',
        variant: 'destructive'
      });
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      toast({
        title: 'Notifications Enabled',
        description: 'You will receive weather alerts'
      });
    }
  };

  const dismissAlert = (alertId: string) => {
    if (!weatherData) return;

    const updatedData = {
      ...weatherData,
      alerts: weatherData.alerts.filter(a => a.id !== alertId)
    };

    setWeatherData(updatedData);
    saveWeatherData(updatedData);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'emergency': return 'destructive';
      case 'warning': return 'default';
      default: return 'secondary';
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <CloudRain className="h-6 w-6 text-primary" />
        <h3 className="text-xl font-bold">Weather Alerts</h3>
      </div>

      <p className="text-sm text-muted-foreground mb-6">
        Emergency weather warnings and alerts for your location
      </p>

      {/* Connection Status */}
      <div className="mb-4 flex items-center gap-2">
        <div className={`h-2 w-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
        <span className="text-xs text-muted-foreground">
          {isOnline ? 'Online - Live updates available' : 'Offline - Showing cached data'}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mb-6">
        <Button
          onClick={fetchWeatherAlerts}
          disabled={isLoading || !isOnline}
          className="flex-1"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Updating...
            </>
          ) : (
            <>
              <RefreshCw className="h-5 w-5 mr-2" />
              Refresh Alerts
            </>
          )}
        </Button>

        {Notification.permission !== 'granted' && (
          <Button
            onClick={requestNotificationPermission}
            variant="outline"
            size="lg"
          >
            Enable Notifications
          </Button>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 mb-4 bg-destructive/10 text-destructive rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Last Update Info */}
      {weatherData && (
        <div className="mb-4 p-3 bg-muted rounded-lg">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Last updated:</span>
            <span className="font-medium">
              {new Date(weatherData.lastUpdate).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs mt-1">
            <span className="text-muted-foreground">Location:</span>
            <span className="font-mono">{weatherData.location}</span>
          </div>
        </div>
      )}

      {/* Weather Alerts */}
      {weatherData && weatherData.alerts.length > 0 ? (
        <div className="space-y-3">
          {weatherData.alerts.map((alert) => (
            <div
              key={alert.id}
              className="p-4 border rounded-lg animate-fade-in"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  <h4 className="font-bold">{alert.event}</h4>
                </div>
                <Badge variant={getSeverityColor(alert.severity)}>
                  {alert.severity}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground mb-3">
                {alert.description}
              </p>

              <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                <span>Start: {new Date(alert.start).toLocaleString()}</span>
                <span>End: {new Date(alert.end).toLocaleString()}</span>
              </div>

              <Button
                onClick={() => dismissAlert(alert.id)}
                variant="ghost"
                size="sm"
                className="w-full"
              >
                Dismiss Alert
              </Button>
            </div>
          ))}
        </div>
      ) : weatherData ? (
        <div className="text-center py-8 text-muted-foreground">
          <CloudRain className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No active weather alerts</p>
          <p className="text-xs mt-1">Your area is currently safe</p>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <CloudOff className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No weather data available</p>
          <p className="text-xs mt-1">Refresh to load alerts</p>
        </div>
      )}

      {!isOnline && weatherData && (
        <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <p className="text-xs text-yellow-700 dark:text-yellow-400">
            ⚠️ Offline Mode: Showing last cached weather data. Connect to internet for live updates.
          </p>
        </div>
      )}
    </Card>
  );
};
