'use client';

import { useEffect, useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface VideoIntroModalProps {
    onComplete: () => void;
    videoUrl?: string;
    showTimer?: boolean;
    durationSeconds?: number;
    spotTheme?: string;
}

export default function VideoIntroModal({
    onComplete,
    videoUrl = 'https://youtube.com/shorts/rDXpvS4klAU?si=7x7cmvI06pdyBKnG',
    showTimer = false,
    durationSeconds = 30,
    spotTheme
}: VideoIntroModalProps) {
    const [timeRemaining, setTimeRemaining] = useState(durationSeconds);
    const [shouldLoadIframe, setShouldLoadIframe] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Extract video ID from URL and generate embed URL (supports YouTube and Vimeo)
    const getVideoEmbedUrl = (url: string): string => {
        // Handle Vimeo URLs
        const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
        if (vimeoMatch) {
            return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&muted=0&controls=1`;
        }

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

        // Handle youtu.be format (including query params)
        const youtubeMatch = url.match(/youtu\.be\/([^?&]+)/);
        if (youtubeMatch) {
            return `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1&mute=0&controls=1&rel=0`;
        }

        return url;
    };

    useEffect(() => {
        // Load iframe immediately when modal appears
        setShouldLoadIframe(true);

        // Only start countdown timer if showTimer is true
        if (showTimer) {
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
        }

        // Cleanup on unmount
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [onComplete, showTimer]);

    const embedUrl = getVideoEmbedUrl(videoUrl);

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-[10000]"
            onClick={onComplete}
        >
            <Card
                className="w-full max-w-2xl max-h-[90vh] overflow-hidden bg-black border-gray-700 relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button - always visible */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onComplete}
                    className="absolute top-4 right-4 h-10 w-10 p-0 bg-black bg-opacity-70 text-white hover:bg-opacity-90 z-50 pointer-events-auto rounded-full"
                >
                    <X className="w-5 h-5" />
                </Button>

                <div className="relative w-full" style={{ paddingBottom: '56.25%', maxHeight: '90vh' }}>
                    {/* Video embed - Standard aspect ratio is 16:9 (56.25%) */}
                    {shouldLoadIframe ? (
                        <iframe
                            className="absolute top-0 left-0 w-full h-full"
                            src={embedUrl}
                            title="Alpha Introduction Video"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    ) : (
                        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900">
                            <div className="text-white text-center">
                                <div className="animate-pulse">Loading video...</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Timer overlay - only show if showTimer is true */}
                {showTimer && (
                    <>
                        <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm font-medium">
                            {timeRemaining}s
                        </div>

                        {/* Progress bar */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                            <div
                                className="h-full bg-blue-500 transition-all duration-1000 ease-linear"
                                style={{ width: `${((durationSeconds - timeRemaining) / durationSeconds) * 100}%` }}
                            />
                        </div>
                    </>
                )}

                {/* Topic Label - bottom right corner */}
                {spotTheme && (
                    <div className="absolute bottom-2 right-2 bg-red-600 bg-opacity-90 text-white px-3 py-1.5 rounded-lg text-xs font-bold font-mono shadow-lg flex items-center gap-1 uppercase">
                        <div className="w-4 h-4 rounded-full border border-white flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs leading-none">?</span>
                        </div>
                        {spotTheme}
                    </div>
                )}
            </Card>
        </div>
    );
}
