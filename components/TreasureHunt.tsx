'use client';

import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, MapPin, RefreshCw } from 'lucide-react';

import { GameState, Region, UserProgress } from '@/lib/treasure-hunt/types';
import { REGIONS, COLLECTIBLES } from '@/lib/treasure-hunt/mockData';
import { generateSpots } from '@/lib/treasure-hunt/spotGenerator';
import { loadProgress, saveProgress, initializeProgress, isGameCompleted } from '@/lib/treasure-hunt/storage';
import { getNearbyAlphaVenue } from '@/lib/treasure-hunt/api';

import ProgressHUD from '@/app/treasure-hunt/components/ProgressHUD';
import NextStepPanel from '@/app/treasure-hunt/components/NextStepPanel';
import VideoIntroModal from '@/app/treasure-hunt/components/VideoIntroModal';

// Dynamically import map component to avoid SSR issues
const TreasureMap = dynamic(() => import('@/app/treasure-hunt/components/TreasureMap'), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
            <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-8 h-8 animate-spin" />
                <p className="text-sm text-gray-600">Loading map...</p>
            </div>
        </div>
    ),
});

export default function TreasureHuntPage() {
    const searchParams = useSearchParams();
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
    const [seed, setSeed] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [hasStarted, setHasStarted] = useState(false);
    const [showVideoIntro, setShowVideoIntro] = useState(false);
    const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
    const [locationError, setLocationError] = useState<string | null>(null);

    // Get user location on mount
    useEffect(() => {
        if (!('geolocation' in navigator)) {
            setLocationError('Geolocation is not supported by your browser');
            setIsLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const location = {
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                };
                setUserLocation(location);

                // Create a region centered on user's location
                const userRegion: Region = {
                    key: 'user-location',
                    name: 'Your Area',
                    center: location,
                    radiusM: 500, // 500m radius around user
                };
                setSelectedRegion(userRegion);
            },
            (error) => {
                console.error('Error getting location:', error);
                setLocationError('Unable to get your location. Please enable location access.');
                // Fallback to default region
                setSelectedRegion(REGIONS[0]);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 30000,
            }
        );
    }, []);

    // Initialize game state
    useEffect(() => {
        // Wait for region to be set before initializing
        if (!selectedRegion) return;

        const spotId = searchParams.get('spotId');
        const existingProgress = loadProgress();

        if (existingProgress) {
            // Load existing game - use user location if available
            const region = selectedRegion;
            const spots = generateSpots(region, existingProgress.seed, userLocation || undefined);

            setGameState({
                spots,
                progress: existingProgress,
                collectibles: COLLECTIBLES,
                isCompleted: isGameCompleted(existingProgress),
            });

            setSeed(existingProgress.seed);
            setHasStarted(true);

            // Load Alpha venue if completed
            if (isGameCompleted(existingProgress)) {
                loadAlphaVenue(region.center.lat, region.center.lon);
            }

            // Handle deep link
            if (spotId) {
                // This will be handled by the map component
                console.log('Deep link to spot:', spotId);
            }
        } else {
            // Generate default seed
            setSeed(generateDefaultSeed());
        }

        setIsLoading(false);
    }, [searchParams, selectedRegion, userLocation]);

    const generateDefaultSeed = () => {
        return `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    };

    const startNewGame = () => {
        if (!selectedRegion) return;

        const newProgress = initializeProgress(seed, selectedRegion.key);
        const spots = generateSpots(selectedRegion, seed, userLocation || undefined);

        const newGameState: GameState = {
            spots,
            progress: newProgress,
            collectibles: COLLECTIBLES,
            isCompleted: false,
        };

        setGameState(newGameState);
        setHasStarted(true);
        setShowVideoIntro(true); // Show video intro when starting
        saveProgress(newProgress);
    };

    const handleVideoComplete = () => {
        setShowVideoIntro(false);
    };

    const regenerateSeed = () => {
        setSeed(generateDefaultSeed());
    };

    const loadAlphaVenue = async (lat: number, lon: number) => {
        try {
            const response = await getNearbyAlphaVenue(lat, lon);
            if (response.success && response.data && gameState) {
                setGameState({
                    ...gameState,
                    alphaVenue: response.data,
                });
            }
        } catch (error) {
            console.error('Failed to load Alpha venue:', error);
        }
    };

    const updateGameState = (newGameState: GameState) => {
        setGameState(newGameState);

        // Check if game was just completed
        if (!gameState?.isCompleted && newGameState.isCompleted && selectedRegion) {
            loadAlphaVenue(selectedRegion.center.lat, selectedRegion.center.lon);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
                    <p className="text-lg">Loading Alfie's Treasure Hunt...</p>
                </div>
            </div>
        );
    }

    if (!hasStarted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
                <div className="max-w-md mx-auto space-y-6 pt-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Alfie's Treasure Hunt</h1>
                        <p className="text-gray-600">Discover 8 hidden spots near you and unlock spiritual treasures!</p>
                    </div>

                    {locationError && (
                        <Card className="border-red-300 bg-red-50">
                            <CardContent className="pt-6">
                                <p className="text-red-600 text-sm">{locationError}</p>
                                <p className="text-xs text-red-500 mt-2">
                                    Please enable location access to start the treasure hunt.
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="w-5 h-5" />
                                Setup Your Hunt
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {selectedRegion && (
                                <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
                                    <p className="text-sm font-medium text-blue-900">
                                        Treasure hunt area: {selectedRegion.name}
                                    </p>
                                    <p className="text-xs text-blue-700 mt-1">
                                        8 spots within 500m of your location
                                    </p>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Seed (determines spot locations)
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={seed}
                                        onChange={(e) => setSeed(e.target.value)}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter custom seed or use generated"
                                    />
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={regenerateSeed}
                                        className="px-3"
                                    >
                                        <RefreshCw className="w-4 h-4" />
                                    </Button>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Share the same seed with friends to hunt the same spots!
                                </p>
                            </div>

                            <Button
                                onClick={startNewGame}
                                className="w-full"
                                disabled={!seed.trim() || !selectedRegion}
                            >
                                Start Treasure Hunt
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    if (!gameState) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg text-red-600">Error loading game state</p>
            </div>
        );
    }

    if (!selectedRegion) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
                    <p className="text-lg">Loading region...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 relative">
            {/* Full-screen map */}
            <div className="h-screen">
                <TreasureMap
                    gameState={gameState}
                    onGameStateUpdate={updateGameState}
                    region={selectedRegion}
                />
            </div>

            {/* Floating scoreboard overlay */}
            <ProgressHUD progress={gameState.progress} totalSpots={8} />

            {gameState.isCompleted && gameState.alphaVenue && (
                <NextStepPanel venue={gameState.alphaVenue} />
            )}

            {/* Video intro modal */}
            {showVideoIntro && (
                <VideoIntroModal
                    onComplete={handleVideoComplete}
                    videoUrl="https://youtu.be/6EzPs9BcwPM?si=sTvygRnMSqXkPc7j"
                    showTimer={false}
                />
            )}
        </div>
    );
}