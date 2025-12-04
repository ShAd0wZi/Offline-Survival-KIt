import { useNavigate } from 'react-router-dom';
import { QuickActionCard } from '@/components/QuickActionCard';
import { StatusDot } from '@/components/OfflineIndicator';
import { Book, Wrench, Settings, ShieldAlert, Sparkles } from 'lucide-react';

/**
 * Home Dashboard - Primary landing page with quick actions
 * Designed for emergency use with large, clear buttons
 */
const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl md:text-4xl font-bold text-primary flex items-center gap-3">
              <ShieldAlert className="h-8 w-8 md:h-10 md:w-10" />
              Survival Guide
            </h1>
            <StatusDot />
          </div>
          <p className="text-muted-foreground">
            Offline-ready emergency information and tools
          </p>
        </div>

        {/* Quick Action Cards */}
        <div className="grid gap-4 md:grid-cols-2">
          <QuickActionCard
            title="AI Survival Assistant"
            description="Get instant AI-powered emergency guidance"
            icon={Sparkles}
            onClick={() => navigate('/ai-assistant')}
            variant="default"
          />
          
          <QuickActionCard
            title="Survival Guides"
            description="Essential emergency procedures and safety information"
            icon={Book}
            onClick={() => navigate('/guides')}
            variant="default"
          />

          <QuickActionCard
            title="Emergency Tools"
            description="Utilities and calculators for survival situations"
            icon={Wrench}
            onClick={() => navigate('/tools')}
          />

          <QuickActionCard
            title="Settings"
            description="Download offline content and configure app"
            icon={Settings}
            onClick={() => navigate('/settings')}
          />
        </div>

        {/* Info Section */}
        <div className="mt-8 p-6 bg-card border border-border rounded-lg">
          <h2 className="text-lg font-bold mb-3 text-primary">
            🔒 Works Completely Offline
          </h2>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              ✓ All survival guides stored locally on your device
            </p>
            <p>
              ✓ No internet connection required after initial download
            </p>
            <p>
              ✓ Install this app to your home screen for quick access
            </p>
            <p className="mt-4 text-warning font-semibold">
              ⚠️ Go to Settings to download all offline content now
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
