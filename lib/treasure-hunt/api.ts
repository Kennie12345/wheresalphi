import { MockApiResponse, Reflection, AlphaVenue } from './types';
import { ALPHA_VENUES } from './mockData';

// Mock network configuration
const MOCK_CONFIG = {
    latency: { min: 300, max: 1200 }, // ms
    failureRate: 0.1, // 10% failure rate
};

// Simulate network delay
function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Simulate network request with potential failure
async function mockRequest<T>(operation: () => T): Promise<MockApiResponse<T>> {
    const latency = Math.random() * (MOCK_CONFIG.latency.max - MOCK_CONFIG.latency.min) + MOCK_CONFIG.latency.min;
    await delay(latency);

    // Simulate random failures
    if (Math.random() < MOCK_CONFIG.failureRate) {
        return {
            success: false,
            error: 'Network error: Please check your connection and try again.',
        };
    }

    try {
        const data = operation();
        return {
            success: true,
            data,
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
        };
    }
}

// Mock API: Submit reflection
export async function submitReflection(reflection: Reflection): Promise<MockApiResponse<{ success: boolean }>> {
    return mockRequest(() => {
        // Validate reflection
        if (!reflection.text.trim()) {
            throw new Error('Reflection cannot be empty');
        }
        if (reflection.text.length < 10) {
            throw new Error('Reflection must be at least 10 characters long');
        }

        return { success: true };
    });
}

// Mock API: Get nearby Alpha venue
export async function getNearbyAlphaVenue(lat: number, lon: number): Promise<MockApiResponse<AlphaVenue>> {
    return mockRequest(() => {
        // Simple distance calculation to find nearest venue
        let nearestVenue = ALPHA_VENUES[0];
        let minDistance = Math.abs(lat - nearestVenue.lat) + Math.abs(lon - nearestVenue.lon);

        for (const venue of ALPHA_VENUES) {
            const distance = Math.abs(lat - venue.lat) + Math.abs(lon - venue.lon);
            if (distance < minDistance) {
                minDistance = distance;
                nearestVenue = venue;
            }
        }

        return nearestVenue;
    });
}

// Mock API: Validate user location (anti-spoof check)
export async function validateLocation(
    userLat: number,
    userLon: number,
    spotLat: number,
    spotLon: number
): Promise<MockApiResponse<{ valid: boolean; distance: number }>> {
    return mockRequest(() => {
        // Calculate distance between user and spot
        const R = 6371e3; // Earth's radius in meters
        const φ1 = userLat * Math.PI / 180;
        const φ2 = spotLat * Math.PI / 180;
        const Δφ = (spotLat - userLat) * Math.PI / 180;
        const Δλ = (spotLon - userLon) * Math.PI / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        // Allow within 100m for testing (in real app this would be configurable)
        const valid = distance <= 100;

        return { valid, distance };
    });
}

// Mock API: Get leaderboard or social features (placeholder)
export async function getLeaderboard(): Promise<MockApiResponse<any[]>> {
    return mockRequest(() => {
        return []; // Placeholder for future social features
    });
}