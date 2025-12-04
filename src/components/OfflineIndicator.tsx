import { useOfflineStatus } from '@/hooks/useOfflineStatus';
import { WifiOff, Wifi } from 'lucide-react';

/**
 * Offline indicator banner that shows at top of screen when offline
 */
export const OfflineIndicator = () => {
  const isOffline = useOfflineStatus();

  if (!isOffline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-warning text-warning-foreground px-4 py-2 flex items-center justify-center gap-2 text-sm font-semibold">
      <WifiOff className="h-4 w-4" />
      <span>OFFLINE MODE - Working from local storage</span>
    </div>
  );
};

/**
 * Small inline status indicator
 */
export const StatusDot = () => {
  const isOffline = useOfflineStatus();

  return (
    <div className="flex items-center gap-2 text-xs">
      {isOffline ? (
        <>
          <WifiOff className="h-3 w-3 text-warning" />
          <span className="text-muted-foreground">Offline</span>
        </>
      ) : (
        <>
          <Wifi className="h-3 w-3 text-success" />
          <span className="text-muted-foreground">Online</span>
        </>
      )}
    </div>
  );
};
