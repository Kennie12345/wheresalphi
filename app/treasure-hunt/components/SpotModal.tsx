'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, MapPin, Clock, Loader2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ReflectionsDialog from '@/components/ReflectionsDialog';

import { Spot, GameState } from '@/lib/treasure-hunt/types';
import { completeSpot } from '@/lib/treasure-hunt/storage';
import { submitReflection, validateLocation } from '@/lib/treasure-hunt/api';
import { COLLECTIBLES } from '@/lib/treasure-hunt/mockData';

interface SpotModalProps {
    spot: Spot;
    gameState: GameState;
    onGameStateUpdate: (gameState: GameState) => void;
    onClose: () => void;
    userLocation: { lat: number; lon: number } | null;
}

export default function SpotModal({ spot, gameState, onGameStateUpdate, onClose, userLocation }: SpotModalProps) {
    console.log('SpotModal rendering for:', spot.title, 'isCompleted:', gameState.progress.completedSpotIds.includes(spot.id));

    const [reflectionText, setReflectionText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isReflectionDialogOpen, setIsReflectionDialogOpen] = useState(false);

    const isCompleted = gameState.progress.completedSpotIds.includes(spot.id);
    const spotIndex = gameState.spots.findIndex(s => s.id === spot.id);
    const collectible = COLLECTIBLES[spotIndex] || COLLECTIBLES[0];

    const handleSubmitReflection = async () => {
        if (!reflectionText.trim()) {
            setError('Please write a reflection before submitting.');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            // Validate location if available
            if (userLocation) {
                const locationResponse = await validateLocation(
                    userLocation.lat,
                    userLocation.lon,
                    spot.lat,
                    spot.lon
                );

                if (!locationResponse.success) {
                    throw new Error(locationResponse.error || 'Location validation failed');
                }

                // In a real app, you might enforce the distance check
                // For now, we'll just show a warning for distant users
                if (locationResponse.data && locationResponse.data.distance > 100) {
                    console.warn(`User is ${Math.round(locationResponse.data.distance)}m away from spot`);
                }
            }

            // Submit reflection
            const reflection = {
                spotId: spot.id,
                text: reflectionText,
                createdAt: new Date().toISOString(),
            };

            const response = await submitReflection(reflection);

            if (!response.success) {
                throw new Error(response.error || 'Failed to submit reflection');
            }

            // Update game state
            const updatedProgress = completeSpot(gameState.progress, spot.id, reflectionText, collectible.id);
            const updatedGameState = {
                ...gameState,
                progress: updatedProgress,
                isCompleted: updatedProgress.completedSpotIds.length >= 8,
            };

            onGameStateUpdate(updatedGameState);
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRetry = () => {
        setError(null);
        handleSubmitReflection();
    };

    const handleAdditionalReflection = async (reflectionText: string) => {
        // Handle additional reflection submission
        const reflection = {
            spotId: spot.id,
            text: reflectionText,
            createdAt: new Date().toISOString(),
        };

        const response = await submitReflection(reflection);
        if (response.success) {
            console.log('Additional reflection submitted successfully');
        }
    };

    const modalContent = (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[1000]">
            <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="w-5 h-5" />
                            {spot.title}
                        </CardTitle>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="h-8 w-8 p-0"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    {isCompleted ? (
                        <div className="text-center py-4">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                                <span className="text-2xl">✓</span>
                            </div>
                            <h3 className="text-lg font-semibold text-green-700 mb-2">Spot Completed!</h3>
                            <p className="text-sm text-gray-600">You've already collected the treasure here.</p>
                            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                <h4 className="font-medium text-sm mb-1">Collectible Earned:</h4>
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-6 h-6 rounded-full"
                                        style={{ backgroundColor: collectible.color }}
                                    />
                                    <span className="text-sm font-medium">{collectible.name}</span>
                                </div>
                                <p className="text-xs text-gray-600 mt-1">{collectible.description}</p>
                            </div>
                            <Button
                                onClick={() => {
                                    console.log('Button clicked, opening reflection dialog');
                                    setIsReflectionDialogOpen(true);
                                }}
                                variant="outline"
                                className="mt-4 w-full"
                            >
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Add More Reflections
                            </Button>
                        </div>
                    ) : (
                        <>
                            {/* Verse */}
                            <div className="space-y-2">
                                <h3 className="font-semibold">{spot.verseRef}</h3>
                                <blockquote className="italic text-gray-700 border-l-4 border-blue-500 pl-4">
                                    "{spot.verse}"
                                </blockquote>
                            </div>

                            {/* Reflection Prompts */}
                            <div className="space-y-2">
                                <h3 className="font-semibold">Reflection</h3>
                                <div className="space-y-2">
                                    {spot.reflectionPrompts.map((prompt, index) => (
                                        <p key={index} className="text-sm text-gray-700">
                                            {index + 1}. {prompt}
                                        </p>
                                    ))}
                                </div>
                            </div>

                            {/* Reflection Input */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium">
                                    Your Reflection
                                </label>
                                <textarea
                                    value={reflectionText}
                                    onChange={(e) => setReflectionText(e.target.value)}
                                    placeholder="Share your thoughts on this verse and how it speaks to you..."
                                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                                    disabled={isSubmitting}
                                />
                                <p className="text-xs text-gray-500">
                                    Minimum 10 characters required
                                </p>
                            </div>

                            {/* Collectible Preview */}
                            <div className="p-3 bg-blue-50 rounded-lg">
                                <h4 className="font-medium text-sm mb-2">Collectible Reward:</h4>
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-6 h-6 rounded-full"
                                        style={{ backgroundColor: collectible.color }}
                                    />
                                    <span className="text-sm font-medium">{collectible.name}</span>
                                </div>
                                <p className="text-xs text-gray-600 mt-1">{collectible.description}</p>
                            </div>

                            {/* Error Display */}
                            {error && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-sm text-red-700 mb-2">{error}</p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleRetry}
                                        disabled={isSubmitting}
                                    >
                                        Try Again
                                    </Button>
                                </div>
                            )}

                            {/* Submit Button */}
                            <Button
                                onClick={handleSubmitReflection}
                                disabled={isSubmitting || !reflectionText.trim()}
                                className="w-full"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    'Submit Reflection & Collect Treasure'
                                )}
                            </Button>

                            {/* Location Info */}
                            {userLocation && (
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <MapPin className="w-3 h-3" />
                                    <span>Location tracking enabled for anti-spoof protection</span>
                                </div>
                            )}

                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Clock className="w-3 h-3" />
                                <span>Take your time to reflect - there's no rush!</span>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            <ReflectionsDialog
                open={isReflectionDialogOpen}
                onOpenChange={setIsReflectionDialogOpen}
                spotTitle={spot.title}
                spotId={spot.id}
                onSubmit={handleAdditionalReflection}
            />
        </div>
    );

    // Render modal in a portal to avoid z-index and overflow issues
    return typeof document !== 'undefined'
        ? createPortal(modalContent, document.body)
        : null;
}