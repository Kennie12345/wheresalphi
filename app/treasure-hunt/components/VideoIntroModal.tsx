'use client';

import { useEffect, useState, useRef } from 'react';
import { Card } from '@/components/ui/card';

interface VideoIntroModalProps {
    onComplete: () => void;
    videoUrl?: string;
    durationSeconds?: number;
}

export default function VideoIntroModal({
    onComplete,
    videoUrl = 'https://youtube.com/shorts/rDXpvS4klAU?si=7x7cmvI06pdyBKnG',
    durationSeconds = 30
}: VideoIntroModalProps) {
    const [timeRemaining, setTimeRemaining] = useState(durationSeconds);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Extract YouTube video ID from URL
    const getYouTubeEmbedUrl = (url: string): string => {
        // Handle youtube.com/shorts/ format
        const shortsMatch = url.match(/youtube\.com\/shorts\/([^?]+)/);
        if (shortsMatch) {
            return `https://www.youtube.com/embed/${shortsMatch[1]}?autoplay=1&mute=0&controls=1&rel=0`;
        }

        // Handle regular youtube.com/watch?v= format
        const watchMatch = url.match(/[?&]v=([^&]+)/);
        if (watchMatch) {
            return `https://www.youtube.com/embed/${watchMatch[1]}?autoplay=1&mute=0&controls=1&rel=0`;
        }

        // Handle youtu.be format
        const youtubeMatch = url.match(/youtu\.be\/([^?]+)/);
        if (youtubeMatch) {
            return `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1&mute=0&controls=1&rel=0`;
        }

        return url;
    };

    useEffect(() => {
        // Start countdown timer
        timerRef.current = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) {
                    // Timer finished, trigger completion
                    if (timerRef.current) {
                        clearInterval(timerRef.current);
                    }
                    onComplete();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        // Cleanup on unmount
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [onComplete]);

    const embedUrl = getYouTubeEmbedUrl(videoUrl);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-[9999]">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden bg-black border-gray-700 relative">
                <div className="relative w-full" style={{ paddingBottom: '177.78%', maxHeight: '90vh' }}>
                    {/* YouTube embed - Shorts aspect ratio is 9:16 (177.78%) */}
                    <iframe
                        className="absolute top-0 left-0 w-full h-full"
                        src={embedUrl}
                        title="Alpha Introduction Video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>

                {/* Timer overlay */}
                <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {timeRemaining}s
                </div>

                {/* Progress bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                    <div
                        className="h-full bg-blue-500 transition-all duration-1000 ease-linear"
                        style={{ width: `${((durationSeconds - timeRemaining) / durationSeconds) * 100}%` }}
                    />
                </div>
            </Card>
        </div>
    );
}
