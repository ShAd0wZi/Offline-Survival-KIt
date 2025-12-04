import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Wrench } from 'lucide-react';
import { SOSFlashlight } from '@/components/tools/SOSFlashlight';
import { EmergencyFlashlight } from '@/components/tools/EmergencyFlashlight';
import { Compass } from '@/components/tools/Compass';
import { OfflineMap } from '@/components/tools/OfflineMap';
import { EmergencyContacts } from '@/components/tools/EmergencyContacts';
import { MorseCodeBeacon } from '@/components/tools/MorseCodeBeacon';
import { EmergencyWeatherAlerts } from '@/components/tools/EmergencyWeatherAlerts';
import { SurvivalChecklist } from '@/components/tools/SurvivalChecklist';
import { BatterySaver } from '@/components/tools/BatterySaver';

/**
 * Tools Page - Emergency survival toolkit
 * Includes SOS flashlight, emergency flashlight, compass, offline map, emergency contacts, and morse code beacon
 */
const Tools = () => {
  const navigate = useNavigate();

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
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Wrench className="h-8 w-8 text-primary" />
            Emergency Tools
          </h1>
          <p className="text-muted-foreground">
            Essential offline tools for survival situations
          </p>
        </div>

        <Tabs defaultValue="sos" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-9 gap-1">
            <TabsTrigger value="sos">SOS</TabsTrigger>
            <TabsTrigger value="flashlight">Torch</TabsTrigger>
            <TabsTrigger value="compass">Compass</TabsTrigger>
            <TabsTrigger value="map">Map</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="morse">Morse</TabsTrigger>
            <TabsTrigger value="weather">Weather</TabsTrigger>
            <TabsTrigger value="checklist">Checklist</TabsTrigger>
            <TabsTrigger value="battery">Battery</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sos" className="mt-6">
            <SOSFlashlight />
          </TabsContent>
          
          <TabsContent value="flashlight" className="mt-6">
            <EmergencyFlashlight />
          </TabsContent>
          
          <TabsContent value="compass" className="mt-6">
            <Compass />
          </TabsContent>
          
          <TabsContent value="map" className="mt-6">
            <OfflineMap />
          </TabsContent>
          
          <TabsContent value="contacts" className="mt-6">
            <EmergencyContacts />
          </TabsContent>
          
          <TabsContent value="morse" className="mt-6">
            <MorseCodeBeacon />
          </TabsContent>
          
          <TabsContent value="weather" className="mt-6">
            <EmergencyWeatherAlerts />
          </TabsContent>
          
          <TabsContent value="checklist" className="mt-6">
            <SurvivalChecklist />
          </TabsContent>
          
          <TabsContent value="battery" className="mt-6">
            <BatterySaver />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Tools;
