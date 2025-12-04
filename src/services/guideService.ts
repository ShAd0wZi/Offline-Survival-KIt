import { db } from '@/db/database';

/**
 * Toggle favorite status for a guide
 */
export const toggleFavorite = async (guideId: string): Promise<boolean> => {
  const existing = await db.favorites.where('guideId').equals(guideId).first();
  
  if (existing) {
    await db.favorites.delete(existing.id);
    return false;
  } else {
    await db.favorites.add({
      id: `fav-${Date.now()}`,
      guideId,
      createdAt: new Date()
    });
    return true;
  }
};

/**
 * Check if guide is favorited
 */
export const isFavorited = async (guideId: string): Promise<boolean> => {
  const existing = await db.favorites.where('guideId').equals(guideId).first();
  return !!existing;
};

/**
 * Get all favorite guide IDs
 */
export const getFavoriteGuideIds = async (): Promise<string[]> => {
  const favorites = await db.favorites.toArray();
  return favorites.map(f => f.guideId);
};

/**
 * Toggle completed status for a guide
 */
export const toggleCompleted = async (guideId: string): Promise<boolean> => {
  const existing = await db.completed.where('guideId').equals(guideId).first();
  
  if (existing) {
    await db.completed.delete(existing.id);
    return false;
  } else {
    await db.completed.add({
      id: `comp-${Date.now()}`,
      guideId,
      completedAt: new Date()
    });
    return true;
  }
};

/**
 * Check if guide is completed
 */
export const isCompleted = async (guideId: string): Promise<boolean> => {
  const existing = await db.completed.where('guideId').equals(guideId).first();
  return !!existing;
};

/**
 * Get all completed guide IDs
 */
export const getCompletedGuideIds = async (): Promise<string[]> => {
  const completed = await db.completed.toArray();
  return completed.map(c => c.guideId);
};
