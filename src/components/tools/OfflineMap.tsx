import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin, Navigation, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { db } from '@/db/database';

interface Coordinates {
  latitude: number;
  longitude: number;
  timestamp: Date;
  accuracy: number;
}

/**
 * Offline Map - Shows current location with offline coordinate storage
 * Displays static map tile when online, coordinates-only when offline
 */
export const OfflineMap = () => {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [mapImageUrl, setMapImageUrl] = useState<string | null>(null);

  // Load saved coordinates from IndexedDB on mount
  useEffect(() => {
    loadSavedCoordinates();
    
    // Listen for online/offline changes
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Fetch map image when coordinates change and online
  useEffect(() => {
    if (coordinates && isOnline) {
      fetchMapTile(coordinates.latitude, coordinates.longitude);
    }
  }, [coordinates, isOnline]);

  const loadSavedCoordinates = async () => {
    try {
      const settings = await db.settings.get('app-settings');
      if (settings?.lastKnownLocation) {
        setCoordinates(settings.lastKnownLocation);
      }
    } catch (err) {
      console.error('Error loading saved coordinates:', err);
    }
  };

  const saveCoordinates = async (coords: Coordinates) => {
    try {
      await db.settings.update('app-settings', {
        lastKnownLocation: coords
      });
    } catch (err) {
      console.error('Error saving coordinates:', err);
    }
  };

  const fetchMapTile = async (lat: number, lon: number) => {
    try {
      // Using OpenStreetMap static map tile (free, no API key required)
      const zoom = 14;
      const width = 600;
      const height = 400;
      
      // OpenStreetMap static map via StaticMap service
      const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lon-0.01},${lat-0.01},${lon+0.01},${lat+0.01}&layer=mapnik&marker=${lat},${lon}`;
      
      // For offline capability, we use a simpler approach with tile server
      const tileUrl = `https://tile.openstreetmap.org/${zoom}/${lon2tile(lon, zoom)}/${lat2tile(lat, zoom)}.png`;
      
      setMapImageUrl(tileUrl);
    } catch (err) {
      console.error('Error fetching map tile:', err);
      setMapImageUrl(null);
    }
  };

  // Convert longitude to tile X coordinate
  const lon2tile = (lon: number, zoom: number) => {
    return Math.floor((lon + 180) / 360 * Math.pow(2, zoom));
  };

  // Convert latitude to tile Y coordinate
  const lat2tile = (lat: number, zoom: number) => {
    return Math.floor(
      (1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom)
    );
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported on this device');
      toast({
        title: 'Location Error',
        description: 'Geolocation not supported on this device',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords: Coordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: new Date(position.timestamp),
          accuracy: position.coords.accuracy
        };

        setCoordinates(coords);
        await saveCoordinates(coords);
        setIsLoading(false);

        toast({
          title: 'Location Updated',
          description: `Coordinates saved: ${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`,
        });
      },
      (err) => {
        setIsLoading(false);
        let errorMessage = 'Failed to get location';
        
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please allow location access.';
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case err.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        
        setError(errorMessage);
        toast({
          title: 'Location Error',
          description: errorMessage,
          variant: 'destructive'
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const formatCoordinate = (value: number, isLat: boolean) => {
    const direction = isLat 
      ? (value >= 0 ? 'N' : 'S')
      : (value >= 0 ? 'E' : 'W');
    return `${Math.abs(value).toFixed(6)}° ${direction}`;
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <MapPin className="h-6 w-6 text-primary" />
        <h3 className="text-xl font-bold">Offline Map</h3>
      </div>
      
      <p className="text-sm text-muted-foreground mb-6">
        Get your current coordinates and save them for offline access
      </p>

      {/* Connection Status */}
      <div className="mb-4 flex items-center gap-2">
        <div className={`h-2 w-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
        <span className="text-xs text-muted-foreground">
          {isOnline ? 'Online - Map tiles available' : 'Offline - Coordinates only'}
        </span>
      </div>

      {/* Get Location Button */}
      <Button
        onClick={getCurrentLocation}
        disabled={isLoading}
        className="w-full mb-6"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Getting Location...
          </>
        ) : (
          <>
            <Navigation className="h-5 w-5 mr-2" />
            Get Current Location
          </>
        )}
      </Button>

      {/* Error Message */}
      {error && (
        <div className="p-4 mb-4 bg-destructive/10 text-destructive rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Coordinates Display */}
      {coordinates && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Latitude</p>
              <p className="font-mono font-bold">
                {formatCoordinate(coordinates.latitude, true)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Longitude</p>
              <p className="font-mono font-bold">
                {formatCoordinate(coordinates.longitude, false)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Accuracy</p>
              <p className="font-mono text-sm">±{Math.round(coordinates.accuracy)}m</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Last Updated</p>
              <p className="font-mono text-sm">
                {coordinates.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>

          {/* Map Tile or Offline Fallback */}
          <div className="w-full h-64 bg-muted rounded-lg overflow-hidden">
            {isOnline && mapImageUrl ? (
              <div className="relative w-full h-full">
                <img 
                  src={mapImageUrl} 
                  alt="Map"
                  className="w-full h-full object-cover"
                  onError={() => {
                    setMapImageUrl(null);
                    toast({
                      title: 'Map Load Error',
                      description: 'Failed to load map tile',
                      variant: 'destructive'
                    });
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <MapPin className="h-8 w-8 text-red-500 drop-shadow-lg" />
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                <MapPin className="h-12 w-12 mb-3" />
                <p className="text-sm font-medium">
                  {isOnline ? 'Loading map...' : 'Offline - Map unavailable'}
                </p>
                <p className="text-xs mt-1">
                  Coordinates saved for offline use
                </p>
              </div>
            )}
          </div>

          {/* Google Maps Link (only when online) */}
          {isOnline && (
            <a
              href={`https://www.google.com/maps?q=${coordinates.latitude},${coordinates.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full"
            >
              <Button variant="outline" className="w-full">
                Open in Google Maps
              </Button>
            </a>
          )}
        </div>
      )}

      {!coordinates && !error && !isLoading && (
        <div className="text-center py-8 text-muted-foreground">
          <MapPin className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No location data yet</p>
          <p className="text-xs mt-1">Tap the button above to get your coordinates</p>
        </div>
      )}
    </Card>
  );
};
