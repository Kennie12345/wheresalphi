'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, MapPin, Clock, Loader2, Heart, Brain, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import ReflectionsDialog from '@/components/ReflectionsDialog';
import VideoIntroModal from './VideoIntroModal';
import { useRouter } from 'next/navigation';

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

    const router = useRouter();

    // Initialize form data dynamically based on number of reflection prompts
    const initialFormData: Record<string, string> = {};
    spot.reflectionPrompts.forEach((_, index) => {
        initialFormData[`reflection${index}`] = '';
    });

    const [formData, setFormData] = useState(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isReflectionDialogOpen, setIsReflectionDialogOpen] = useState(false);
    const [showVideoIntro, setShowVideoIntro] = useState(!gameState.progress.completedSpotIds.includes(spot.id));

    const isCompleted = gameState.progress.completedSpotIds.includes(spot.id);
    const spotIndex = gameState.spots.findIndex(s => s.id === spot.id);
    const collectible = COLLECTIBLES[spotIndex] || COLLECTIBLES[0];

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmitReflection = async () => {
        // Validate all required fields
        const allFilled = Object.values(formData).every(value => value.trim().length > 0);
        if (!allFilled) {
            setError('Please complete all reflection questions before submitting.');
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

            // Combine all reflections into one text
            const reflectionEntries = spot.reflectionPrompts.map((prompt, index) => {
                return `${prompt}\n${formData[`reflection${index}`]}`;
            }).join('\n\n');

            const combinedReflection = reflectionEntries.trim();

            // Submit reflection
            const reflection = {
                spotId: spot.id,
                text: combinedReflection,
                createdAt: new Date().toISOString(),
            };

            const response = await submitReflection(reflection);

            if (!response.success) {
                throw new Error(response.error || 'Failed to submit reflection');
            }

            // Update game state
            const updatedProgress = completeSpot(gameState.progress, spot.id, combinedReflection, collectible.id);
            const updatedGameState = {
                ...gameState,
                progress: updatedProgress,
                isCompleted: updatedProgress.completedSpotIds.length >= 8,
            };

            onGameStateUpdate(updatedGameState);
            onClose();

            // Navigate to AR experience
            setTimeout(() => {
                router.push('/image-ar');
            }, 300);
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
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-[1000]">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white border-2 border-red-600">
                <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white">
                    <div className="flex items-start justify-between">
                        <div>
                            <CardTitle className="text-3xl mb-3 font-bold flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                                    <span className="text-red-600 text-2xl font-bold">?</span>
                                </div>
                                {spot.title}
                            </CardTitle>
                            <CardDescription className="text-red-50 text-base leading-relaxed">
                                {spot.history ? (
                                    <>
                                        <strong className="block mb-2 text-white">{spot.history.theme} - A Place of Reflection</strong>
                                        {spot.history.culturalSignificance}
                                    </>
                                ) : (
                                    "Pause here and reflect. There are no right or wrong answers—just honest thoughts."
                                )}
                            </CardDescription>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="h-8 w-8 p-0 -mt-2 hover:bg-red-800 text-white"
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="pt-6">
                    {isCompleted ? (
                        <div className="text-center py-4">
                            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center border-4 border-red-600">
                                <span className="text-4xl text-red-600">✓</span>
                            </div>
                            <h3 className="text-2xl font-bold text-red-700 mb-2">Reflection Complete!</h3>
                            <p className="text-base text-gray-600 mb-4">You've already reflected at this location.</p>
                            <div className="mt-6 p-4 bg-red-50 rounded-lg border-2 border-red-200">
                                <h4 className="font-bold text-base mb-2 text-red-900">Collectible Earned:</h4>
                                <div className="flex items-center justify-center gap-3">
                                    <div
                                        className="w-10 h-10 rounded-full border-2 border-gray-800"
                                        style={{ backgroundColor: collectible.color }}
                                    />
                                    <div className="text-left">
                                        <span className="text-base font-bold block">{collectible.name}</span>
                                        <p className="text-sm text-gray-700">{collectible.description}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                {spot.tasterVideoUrl && (
                                    <Button
                                        onClick={() => setShowVideoIntro(true)}
                                        variant="outline"
                                        className="w-full border-2 border-red-600 text-red-600 hover:bg-red-50 font-semibold py-6"
                                    >
                                        <ArrowRight className="w-5 h-5 mr-2" />
                                        Replay "{spot.title}" Video
                                    </Button>
                                )}
                                <Button
                                    onClick={() => router.push('/image-ar')}
                                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-6"
                                >
                                    <ArrowRight className="w-5 h-5 mr-2" />
                                    Continue to AR Experience
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSubmitReflection(); }}>
                            {/* Reflection Section Header */}
                            <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-r-lg">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0 mt-1">
                                        <span className="text-white text-lg font-bold">?</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900 mb-1">
                                            {spot.history?.theme || spot.title} - Reflection Questions
                                        </h3>
                                        <p className="text-sm text-gray-700">
                                            Take your time with these questions. Your thoughts matter. There are no right or wrong answers.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Dynamic Reflection Questions */}
                            {spot.reflectionPrompts.map((prompt, index) => {
                                const icons = [Brain, Heart, Users, Brain]; // Cycle through icons
                                const Icon = icons[index % icons.length];
                                return (
                                    <div key={index} className="space-y-2">
                                        <Label
                                            htmlFor={`reflection${index}`}
                                            className="text-base font-semibold text-gray-900 flex items-center gap-2"
                                        >
                                            <Icon className="w-5 h-5 text-red-600" />
                                            {prompt}
                                        </Label>
                                        <Textarea
                                            id={`reflection${index}`}
                                            placeholder="Share your honest thoughts here..."
                                            value={formData[`reflection${index}`] || ''}
                                            onChange={(e) => handleInputChange(`reflection${index}`, e.target.value)}
                                            rows={4}
                                            className="resize-none border-2 focus:border-red-500 focus:ring-red-500 text-gray-900 placeholder:text-gray-400"
                                            required
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                );
                            })}

                            {/* Collectible Preview */}
                            <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200">
                                <h4 className="font-bold text-base text-red-900 mb-3">Complete this reflection to unlock:</h4>
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-10 h-10 rounded-full border-2 border-gray-800"
                                        style={{ backgroundColor: collectible.color }}
                                    />
                                    <div>
                                        <span className="text-base font-bold block">{collectible.name}</span>
                                        <p className="text-sm text-gray-700">{collectible.description}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Alpha Call-to-Action */}
                            <div className="p-5 bg-gradient-to-br from-red-600 to-red-700 rounded-lg text-white">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                                        <span className="text-red-600 text-xl font-bold">?</span>
                                    </div>
                                    <h4 className="font-bold text-lg">Want to Explore These Questions Deeper?</h4>
                                </div>
                                <p className="text-sm text-white mb-3">
                                    These questions are part of <strong>Alpha Life Essentials</strong>—a safe space where young people like you explore life's biggest questions: purpose, identity, faith, relationships, and more.
                                </p>
                                <p className="text-sm text-white mb-4">
                                    No pressure. No judgment. Just honest conversations over food with people your age who get it.
                                </p>
                                <Button
                                    type="button"
                                    onClick={() => window.open('https://www.alpha.org.au/', '_blank')}
                                    className="w-full bg-white text-red-600 hover:bg-red-50 font-bold py-6 text-base"
                                >
                                    <Users className="w-5 h-5 mr-2" />
                                    Find an Alpha Group Near You
                                </Button>
                            </div>

                            {/* Error Display */}
                            {error && (
                                <div className="p-4 bg-red-100 border-2 border-red-300 rounded-lg">
                                    <p className="text-sm text-red-800 font-semibold mb-2">{error}</p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleRetry}
                                        disabled={isSubmitting}
                                        className="border-red-600 text-red-600 hover:bg-red-50"
                                    >
                                        Try Again
                                    </Button>
                                </div>
                            )}

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={isSubmitting || !Object.values(formData).every(value => value.trim().length > 0)}
                                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-base py-6"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Submitting Reflection...
                                    </>
                                ) : (
                                    <>
                                        <ArrowRight className="w-5 h-5 mr-2" />
                                        Submit & Continue to AR
                                    </>
                                )}
                            </Button>

                            {/* Location Info */}
                            <div className="space-y-2">
                                {userLocation && (
                                    <div className="flex items-center gap-2 text-xs text-gray-600">
                                        <MapPin className="w-4 h-4 text-red-600" />
                                        <span>Location verified for this spot</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <Clock className="w-4 h-4 text-red-600" />
                                    <span>Take your time to reflect—there's no rush!</span>
                                </div>
                            </div>
                        </form>
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

            {/* Video intro modal - shows before spot content for uncompleted spots */}
            {showVideoIntro && (
                <VideoIntroModal
                    onComplete={() => setShowVideoIntro(false)}
                    videoUrl={spot.tasterVideoUrl || "https://youtube.com/shorts/rDXpvS4klAU?si=7x7cmvI06pdyBKnG"}
                    showTimer={false}
                />
            )}
        </div>
    );

    // Render modal in a portal to avoid z-index and overflow issues
    return typeof document !== 'undefined'
        ? createPortal(modalContent, document.body)
        : null;
}
