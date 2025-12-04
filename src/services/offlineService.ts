// Service for managing offline content and caching
import { db } from '@/db/database';
import { SURVIVAL_GUIDES } from '@/db/seedData';

/**
 * Downloads and caches all offline content
 * This includes survival guides and essential app resources
 */
export const downloadOfflineContent = async (): Promise<void> => {
  try {
    // Store all survival guides in IndexedDB
    await db.guides.bulkPut(SURVIVAL_GUIDES);
    
    // Update settings to mark content as downloaded
    await db.settings.update('app-settings', {
      offlineContentDownloaded: true,
      lastSync: new Date()
    });

    // If service worker is available, trigger cache of assets
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'CACHE_ASSETS'
      });
    }

    console.log('✅ Offline content downloaded successfully');
  } catch (error) {
    console.error('❌ Error downloading offline content:', error);
    throw error;
  }
};

/**
 * Checks if offline content is already downloaded
 */
export const isOfflineContentDownloaded = async (): Promise<boolean> => {
  try {
    const settings = await db.settings.get('app-settings');
    return settings?.offlineContentDownloaded ?? false;
  } catch (error) {
    console.error('Error checking offline content status:', error);
    return false;
  }
};

/**
 * Gets all guides from IndexedDB
 */
export const getGuides = async () => {
  return await db.guides.toArray();
};

/**
 * Gets a specific guide by ID
 */
export const getGuideById = async (id: string) => {
  return await db.guides.get(id);
};

/**
 * Gets guides filtered by category
 */
export const getGuidesByCategory = async (category: string) => {
  return await db.guides.where('category').equals(category).toArray();
};
