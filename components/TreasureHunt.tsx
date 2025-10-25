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

import RegionSelector from '@/app/treasure-hunt/components/RegionSelector';
import ProgressHUD from '@/app/treasure-hunt/components/ProgressHUD';
import NextStepPanel from '@/app/treasure-hunt/components/NextStepPanel';

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
    const [selectedRegion, setSelectedRegion] = useState<Region>(REGIONS[0]);
    const [seed, setSeed] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [hasStarted, setHasStarted] = useState(false);

    // Initialize game state
    useEffect(() => {
        const spotId = searchParams.get('spotId');
        const existingProgress = loadProgress();

        if (existingProgress) {
            // Load existing game
            const region = REGIONS.find(r => r.key === existingProgress.regionKey) || REGIONS[0];
            const spots = generateSpots(region, existingProgress.seed);

            setGameState({
                spots,
                progress: existingProgress,
                collectibles: COLLECTIBLES,
                isCompleted: isGameCompleted(existingProgress),
            });

            setSelectedRegion(region);
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
    }, [searchParams]);

    const generateDefaultSeed = () => {
        return `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    };

    const startNewGame = () => {
        const newProgress = initializeProgress(seed, selectedRegion.key);
        const spots = generateSpots(selectedRegion, seed);

        const newGameState: GameState = {
            spots,
            progress: newProgress,
            collectibles: COLLECTIBLES,
            isCompleted: false,
        };

        setGameState(newGameState);
        setHasStarted(true);
        saveProgress(newProgress);
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
        if (!gameState?.isCompleted && newGameState.isCompleted) {
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
                        <p className="text-gray-600">Discover 8 hidden spots and unlock spiritual treasures!</p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="w-5 h-5" />
                                Setup Your Hunt
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <RegionSelector
                                regions={REGIONS}
                                selectedRegion={selectedRegion}
                                onRegionChange={setSelectedRegion}
                            />

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
                                disabled={!seed.trim()}
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

    return (
        <div className="min-h-screen bg-gray-50">
            <ProgressHUD progress={gameState.progress} totalSpots={8} />

            <div className="h-[calc(100vh-80px)]">
                <TreasureMap
                    gameState={gameState}
                    onGameStateUpdate={updateGameState}
                    region={selectedRegion}
                />
            </div>

            {gameState.isCompleted && gameState.alphaVenue && (
                <NextStepPanel venue={gameState.alphaVenue} />
            )}
        </div>
    );
}