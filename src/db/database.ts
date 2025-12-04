// IndexedDB setup using Dexie.js for offline-first storage
import Dexie, { Table } from 'dexie';

export interface Guide {
  id: string;
  title: string;
  category: string;
  description: string;
  steps: GuideStep[];
  priority: 'critical' | 'important' | 'useful';
  icon: string;
  lastUpdated: Date;
}

export interface GuideStep {
  stepNumber: number;
  title: string;
  content: string;
  warning?: string;
  tips?: string[];
}

export interface AppSettings {
  id: string;
  offlineContentDownloaded?: boolean;
  lastSync?: Date;
  lastKnownLocation?: {
    latitude: number;
    longitude: number;
    timestamp: Date;
    accuracy: number;
  };
  weatherAlerts?: {
    alerts: Array<{
      id: string;
      event: string;
      severity: 'normal' | 'warning' | 'emergency';
      description: string;
      start: Date;
      end: Date;
    }>;
    lastUpdate: Date;
    location: string;
  };
  survivalChecklists?: Array<{
    scenario: string;
    items: Array<{
      id: string;
      text: string;
      completed: boolean;
    }>;
  }>;
  powerSaverEnabled?: boolean;
}

export interface FavoriteGuide {
  id: string;
  guideId: string;
  createdAt: Date;
}

export interface CompletedGuide {
  id: string;
  guideId: string;
  completedAt: Date;
}

export interface ChatConversation {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Define the database schema
export class SurvivalDB extends Dexie {
  guides!: Table<Guide, string>;
  settings!: Table<AppSettings, string>;
  favorites!: Table<FavoriteGuide, string>;
  completed!: Table<CompletedGuide, string>;
  conversations!: Table<ChatConversation, string>;
  messages!: Table<ChatMessage, string>;

  constructor() {
    super('SurvivalDB');
    
    // Define schema version 1
    this.version(1).stores({
      guides: 'id, category, priority',
      settings: 'id'
    });

    // Define schema version 2 - add favorites and completed
    this.version(2).stores({
      guides: 'id, category, priority',
      settings: 'id',
      favorites: 'id, guideId',
      completed: 'id, guideId'
    });

    // Define schema version 3 - add chat history
    this.version(3).stores({
      guides: 'id, category, priority',
      settings: 'id',
      favorites: 'id, guideId',
      completed: 'id, guideId',
      conversations: 'id, updatedAt',
      messages: 'id, conversationId, timestamp'
    });
  }
}

// Export a singleton instance
export const db = new SurvivalDB();

// Initialize default settings
export const initializeDefaultSettings = async () => {
  const existing = await db.settings.get('app-settings');
  if (!existing) {
    await db.settings.add({
      id: 'app-settings',
      offlineContentDownloaded: false,
      lastSync: new Date()
    });
  }
};
