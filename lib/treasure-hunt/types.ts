// Core data types for the treasure hunt game

export interface Region {
    key: string;
    name: string;
    center: { lat: number; lon: number };
    radiusM: number;
}

export interface SpotHistory {
    theme: string;
    title: string;
    history: string;
    culturalSignificance: string;
    interestingFact: string;
    connections: string;
}

export interface Spot {
    id: string;
    lat: number;
    lon: number;
    title: string;
    verseRef: string;
    tasterVideoUrl?: string;
    verse: string;
    reflectionPrompts: string[];
    history?: SpotHistory;
}

export interface UserProgress {
    huntCode: string;
    regionKey: string;
    completedSpotIds: string[];
    collectibles: string[];
    reflections: Reflection[];
    startedAt: string;
}

export interface Reflection {
    spotId: string;
    text: string;
    createdAt: string;
}

export interface Collectible {
    id: string;
    name: string;
    color: string;
    thumbUrl: string;
    description: string;
}

export interface AlphaVenue {
    id: string;
    name: string;
    lat: number;
    lon: number;
    address: string;
    startTimes: string[];
    description: string;
}

export interface GameState {
    spots: Spot[];
    progress: UserProgress;
    collectibles: Collectible[];
    alphaVenue?: AlphaVenue;
    isCompleted: boolean;
}

export interface MockApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}