import { UserProgress, GameState, Reflection } from './types';

const STORAGE_KEY = 'alfie-treasure-hunt';

// Load user progress from localStorage
export function loadProgress(): UserProgress | null {
    if (typeof window === 'undefined') return null;

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : null;
    } catch (error) {
        console.error('Error loading progress:', error);
        return null;
    }
}

// Save user progress to localStorage
export function saveProgress(progress: UserProgress): void {
    if (typeof window === 'undefined') return;

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
        console.error('Error saving progress:', error);
    }
}

// Initialize new progress
export function initializeProgress(seed: string, regionKey: string): UserProgress {
    return {
        seed,
        regionKey,
        completedSpotIds: [],
        collectibles: [],
        reflections: [],
        startedAt: new Date().toISOString(),
    };
}

// Add reflection and mark spot as completed
export function completeSpot(progress: UserProgress, spotId: string, reflectionText: string, collectibleId: string): UserProgress {
    const reflection: Reflection = {
        spotId,
        text: reflectionText,
        createdAt: new Date().toISOString(),
    };

    const updatedProgress = {
        ...progress,
        completedSpotIds: [...progress.completedSpotIds, spotId],
        collectibles: [...progress.collectibles, collectibleId],
        reflections: [...progress.reflections, reflection],
    };

    saveProgress(updatedProgress);
    return updatedProgress;
}

// Check if game is completed
export function isGameCompleted(progress: UserProgress): boolean {
    return progress.completedSpotIds.length >= 8;
}

// Clear all progress (for testing/reset)
export function clearProgress(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
}