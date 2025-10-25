'use client';

import { Trophy, Target, Star } from 'lucide-react';
import { UserProgress } from '@/lib/treasure-hunt/types';

interface ProgressHUDProps {
    progress: UserProgress;
    totalSpots: number;
}

export default function ProgressHUD({ progress, totalSpots }: ProgressHUDProps) {
    const completedCount = progress.completedSpotIds.length;
    const percentage = (completedCount / totalSpots) * 100;

    return (
        <div className="bg-white shadow-lg border-b border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
                {/* Progress Info */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold text-lg">
                            {completedCount}/{totalSpots}
                        </span>
                        <span className="text-gray-600">spots found</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="hidden sm:block w-32 bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                </div>

                {/* Collectibles */}
                <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium">
                        {progress.collectibles.length} treasures
                    </span>

                    {/* Trophy for completion */}
                    {completedCount === totalSpots && (
                        <div className="flex items-center gap-1 ml-2 px-2 py-1 bg-yellow-100 rounded-full">
                            <Trophy className="w-4 h-4 text-yellow-600" />
                            <span className="text-xs font-semibold text-yellow-700">Complete!</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Progress Bar */}
            <div className="sm:hidden mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>
        </div>
    );
}