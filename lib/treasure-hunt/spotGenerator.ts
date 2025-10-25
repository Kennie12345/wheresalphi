import { Spot, Region } from './types';
import { VERSES, REFLECTION_PROMPTS, SPOT_THEMES, SPOT_HISTORIES } from './mockData';

// Seeded random number generator for deterministic results
class SeededRandom {
    private seed: number;

    constructor(seed: string) {
        this.seed = this.stringToSeed(seed);
    }

    private stringToSeed(str: string): number {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash);
    }

    // Linear congruential generator
    next(): number {
        this.seed = (this.seed * 1664525 + 1013904223) % Math.pow(2, 32);
        return this.seed / Math.pow(2, 32);
    }

    // Generate random number in range [min, max)
    range(min: number, max: number): number {
        return min + this.next() * (max - min);
    }

    // Generate random integer in range [min, max]
    int(min: number, max: number): number {
        return Math.floor(this.range(min, max + 1));
    }
}

// Calculate distance between two points in meters
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

// Generate a random point within a circle
function generateRandomPointInCircle(
    centerLat: number,
    centerLon: number,
    radiusM: number,
    rng: SeededRandom
): { lat: number; lon: number } {
    // Generate random distance and angle
    const distance = Math.sqrt(rng.next()) * radiusM;
    const angle = rng.next() * 2 * Math.PI;

    // Convert to lat/lon offset
    const deltaLat = distance * Math.cos(angle) / 111320; // meters to degrees lat
    const deltaLon = distance * Math.sin(angle) / (111320 * Math.cos(centerLat * Math.PI / 180)); // meters to degrees lon

    return {
        lat: centerLat + deltaLat,
        lon: centerLon + deltaLon,
    };
}

// Check if a point is valid (minimum distance from existing points)
function isValidSpot(
    newSpot: { lat: number; lon: number },
    existingSpots: { lat: number; lon: number }[],
    minDistanceM: number = 250
): boolean {
    return existingSpots.every(spot =>
        calculateDistance(newSpot.lat, newSpot.lon, spot.lat, spot.lon) >= minDistanceM
    );
}

// Generate exactly 8 spots with minimum spacing
export function generateSpots(region: Region, seed: string): Spot[] {
    const rng = new SeededRandom(seed + region.key);
    const spots: { lat: number; lon: number }[] = [];
    const maxAttempts = 1000;
    let attempts = 0;

    // Generate 8 valid spots
    while (spots.length < 8 && attempts < maxAttempts) {
        const candidate = generateRandomPointInCircle(
            region.center.lat,
            region.center.lon,
            region.radiusM,
            rng
        );

        if (isValidSpot(candidate, spots)) {
            spots.push(candidate);
        }
        attempts++;
    }

    // If we couldn't generate 8 spots with minimum spacing, fill remaining with best effort
    while (spots.length < 8) {
        const candidate = generateRandomPointInCircle(
            region.center.lat,
            region.center.lon,
            region.radiusM,
            rng
        );
        spots.push(candidate);
    }

    // Convert to Spot objects with content
    return spots.map((spot, index) => {
        const verseIndex = rng.int(0, VERSES.length - 1);
        const verse = VERSES[verseIndex];

        const prompt1Index = rng.int(0, REFLECTION_PROMPTS.length - 1);
        let prompt2Index = rng.int(0, REFLECTION_PROMPTS.length - 1);
        while (prompt2Index === prompt1Index) {
            prompt2Index = rng.int(0, REFLECTION_PROMPTS.length - 1);
        }

        const spotTheme = SPOT_THEMES[index] || `Discovery Point ${index + 1}`;
        const spotHistory = SPOT_HISTORIES[index];

        return {
            id: `spot-${index + 1}`,
            lat: spot.lat,
            lon: spot.lon,
            title: spotTheme,
            verseRef: verse.ref,
            verse: verse.text,
            tasterVideoUrl: '/placeholder-video.mp4',
            reflectionPrompts: [
                REFLECTION_PROMPTS[prompt1Index],
                REFLECTION_PROMPTS[prompt2Index],
            ],
            history: spotHistory,
        };
    });
}

// Validate that spots meet minimum distance requirements
export function validateSpotSpacing(spots: Spot[], minDistanceM: number = 250): boolean {
    for (let i = 0; i < spots.length; i++) {
        for (let j = i + 1; j < spots.length; j++) {
            const distance = calculateDistance(
                spots[i].lat,
                spots[i].lon,
                spots[j].lat,
                spots[j].lon
            );
            if (distance < minDistanceM) {
                return false;
            }
        }
    }
    return true;
}