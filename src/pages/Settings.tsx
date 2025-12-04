import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Download, CheckCircle, Loader2, Moon, Sun, Trash2 } from 'lucide-react';
import { downloadOfflineContent, isOfflineContentDownloaded } from '@/services/offlineService';
import { chatHistoryService } from '@/services/chatHistoryService';
import { useToast } from '@/hooks/use-toast';
import { StatusDot } from '@/components/OfflineIndicator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

/**
 * Settings Page
 * Includes offline content, theme, and data management
 */
const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const checkStatus = async () => {
      const downloaded = await isOfflineContentDownloaded();
      setIsDownloaded(downloaded);
      setCheckingStatus(false);
    };

    checkStatus();
  }, []);

  const handleDownload = async () => {
    setIsDownloading(true);
    
    try {
      await downloadOfflineContent();
      setIsDownloaded(true);
      
      toast({
        title: '✅ Download Complete',
        description: 'All offline content is now available. The app will work without internet.',
        duration: 5000,
      });
    } catch (error) {
      toast({
        title: '❌ Download Failed',
        description: 'Could not download offline content. Please try again.',
        variant: 'destructive',
        duration: 5000,
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleClearChatHistory = async () => {
    await chatHistoryService.clearAllHistory();
    toast({
      title: '🗑️ Chat History Cleared',
      description: 'All conversations have been deleted.',
    });
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-4 -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Configure app preferences and manage offline content
          </p>
        </div>

        {/* Connection Status */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold mb-1">Connection Status</h3>
              <p className="text-sm text-muted-foreground">
                Current network connection state
              </p>
            </div>
            <StatusDot />
          </div>
        </Card>

        {/* Appearance */}
        <Card className="p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              {theme === 'dark' ? (
                <Moon className="h-6 w-6 text-primary" />
              ) : (
                <Sun className="h-6 w-6 text-primary" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-bold mb-2">Appearance</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Choose between light and dark mode
              </p>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="theme-toggle" className="cursor-pointer">
                  <span className="font-medium">Dark Mode</span>
                  <p className="text-sm text-muted-foreground">
                    Currently: {theme === 'dark' ? 'Dark' : 'Light'}
                  </p>
                </Label>
                <Switch
                  id="theme-toggle"
                  checked={theme === 'dark'}
                  onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Download Offline Content */}
        <Card className="p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Download className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold mb-2">Download Offline Content</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Download all survival guides and essential resources to use the app 
                completely offline during emergencies.
              </p>

              {checkingStatus ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Checking status...
                </div>
              ) : isDownloaded ? (
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span className="text-sm font-semibold text-success">
                    Offline content downloaded
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 mb-4 text-warning">
                  <Download className="h-5 w-5" />
                  <span className="text-sm font-semibold">
                    Offline content not downloaded
                  </span>
                </div>
              )}

              <Button
                onClick={handleDownload}
                disabled={isDownloading || isDownloaded}
                className="w-full sm:w-auto"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Downloading...
                  </>
                ) : isDownloaded ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Downloaded
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Download Now
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>

        {/* Data Management */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-destructive/10">
              <Trash2 className="h-6 w-6 text-destructive" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold mb-2">Data Management</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Clear stored data from your device
              </p>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full sm:w-auto">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All Chat History
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete all your saved conversations. 
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClearChatHistory}>
                      Delete All
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </Card>

        {/* App Info */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Emergency Survival Guide v1.0</p>
          <p className="mt-1">Built for offline-first emergency preparedness</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
