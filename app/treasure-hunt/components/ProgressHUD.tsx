'use client';

import { Trophy, Target, Star, CheckCircle2 } from 'lucide-react';
import { UserProgress } from '@/lib/treasure-hunt/types';

interface ProgressHUDProps {
    progress: UserProgress;
    totalSpots: number;
}

export default function ProgressHUD({ progress, totalSpots }: ProgressHUDProps) {
    const completedCount = progress.completedSpotIds.length;
    const percentage = (completedCount / totalSpots) * 100;
    const isComplete = completedCount === totalSpots;

    return (
        <div className="relative">
            {/* Main scoreboard - floating card style */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] w-[90%] max-w-md">
                <div className={`
                    bg-white rounded-2xl shadow-2xl border-2
                    ${isComplete ? 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-white' : 'border-blue-400'}
                    transition-all duration-500 ease-out
                    ${isComplete ? 'animate-pulse' : ''}
                `}>
                    <div className="px-6 py-4">
                        {/* Main score display */}
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                {isComplete ? (
                                    <Trophy className="w-8 h-8 text-yellow-500 animate-bounce" />
                                ) : (
                                    <Target className="w-8 h-8 text-blue-600" />
                                )}
                                <div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                            {completedCount}
                                        </span>
                                        <span className="text-2xl font-semibold text-gray-400">
                                            /{totalSpots}
                                        </span>
                                    </div>
                                    <div className="text-sm font-medium text-gray-600 mt-0.5">
                                        Spots Found
                                    </div>
                                </div>
                            </div>

                            {/* Completion badge */}
                            {isComplete && (
                                <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-4 py-2 rounded-full shadow-lg">
                                    <div className="flex items-center gap-1.5">
                                        <Trophy className="w-4 h-4" />
                                        <span className="text-sm font-bold">COMPLETE!</span>
                                    </div>
                                </div>
                            )}

                            {/* Treasures collected */}
                            {!isComplete && progress.collectibles.length > 0 && (
                                <div className="flex items-center gap-1.5 bg-yellow-50 px-3 py-2 rounded-full border border-yellow-200">
                                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                    <span className="text-sm font-bold text-yellow-700">
                                        {progress.collectibles.length}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Progress bar with checkmarks */}
                        <div className="space-y-2">
                            <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                <div
                                    className={`
                                        h-3 rounded-full transition-all duration-500 ease-out
                                        ${isComplete
                                            ? 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600'
                                            : 'bg-gradient-to-r from-blue-500 to-purple-600'
                                        }
                                    `}
                                    style={{ width: `${percentage}%` }}
                                />
                                {/* Animated shimmer effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"
                                     style={{
                                         backgroundSize: '200% 100%',
                                         animation: 'shimmer 2s infinite'
                                     }}
                                />
                            </div>

                            {/* Individual spot indicators */}
                            <div className="flex justify-between items-center px-1">
                                {Array.from({ length: totalSpots }).map((_, index) => {
                                    const isSpotCompleted = index < completedCount;
                                    return (
                                        <div
                                            key={index}
                                            className={`
                                                transition-all duration-300 ease-out
                                                ${isSpotCompleted ? 'scale-110' : 'scale-100 opacity-40'}
                                            `}
                                        >
                                            {isSpotCompleted ? (
                                                <CheckCircle2
                                                    className="w-5 h-5 text-green-500 fill-green-500 drop-shadow-lg"
                                                    strokeWidth={2.5}
                                                />
                                            ) : (
                                                <div className="w-5 h-5 rounded-full border-2 border-gray-300 bg-white" />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Motivational text */}
                        {!isComplete && completedCount > 0 && (
                            <div className="mt-3 text-center">
                                <p className="text-xs font-medium text-gray-500">
                                    {completedCount === totalSpots - 1
                                        ? '🎯 One more to go!'
                                        : completedCount >= totalSpots / 2
                                        ? '🔥 Halfway there! Keep going!'
                                        : '🚀 Great start! Keep exploring!'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add shimmer animation to global styles */}
            <style jsx global>{`
                @keyframes shimmer {
                    0% {
                        background-position: -200% 0;
                    }
                    100% {
                        background-position: 200% 0;
                    }
                }
                .animate-shimmer {
                    animation: shimmer 2s infinite;
                }
            `}</style>
        </div>
    );
}