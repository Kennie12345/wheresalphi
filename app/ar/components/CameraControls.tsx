'use client';

import { Button } from '@/components/ui/button';
import {
    Camera,
    RotateCcw,
    Download,
    RefreshCw,
    Square,
    Play,
    StopCircle,
    Loader2
} from 'lucide-react';

interface CameraControlsProps {
    isActive: boolean;
    facingMode: 'user' | 'environment';
    onStart: () => void;
    onStop: () => void;
    onFlip: () => void;
    onPlace: () => void;
    onReset: () => void;
    onCapture: () => void;
    isLoading: boolean;
    canPlace: boolean;
    isPlaced: boolean;
}

export default function CameraControls({
    isActive,
    facingMode,
    onStart,
    onStop,
    onFlip,
    onPlace,
    onReset,
    onCapture,
    isLoading,
    canPlace,
    isPlaced,
}: CameraControlsProps) {
    return (
        <div className="absolute bottom-0 left-0 right-0 p-4 z-50">
            <div className="bg-black/80 rounded-2xl p-4">
                {!isActive ? (
                    // Start camera button
                    <div className="flex justify-center">
                        <Button
                            onClick={onStart}
                            disabled={isLoading}
                            size="lg"
                            className="px-8"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            ) : (
                                <Play className="w-5 h-5 mr-2" />
                            )}
                            Start Camera
                        </Button>
                    </div>
                ) : (
                    // Active camera controls
                    <div className="grid grid-cols-4 gap-3">
                        {/* Stop Camera */}
                        <Button
                            onClick={onStop}
                            variant="outline"
                            size="sm"
                            className="aspect-square p-0 bg-red-500/20 border-red-500 text-red-400 hover:bg-red-500/30"
                            disabled={isLoading}
                        >
                            <StopCircle className="w-4 h-4" />
                        </Button>

                        {/* Flip Camera */}
                        <Button
                            onClick={onFlip}
                            variant="outline"
                            size="sm"
                            className="aspect-square p-0 bg-white/20 border-white/30 text-white hover:bg-white/30"
                            disabled={isLoading}
                        >
                            <RotateCcw className="w-4 h-4" />
                        </Button>

                        {/* Place/Reset Object */}
                        {canPlace && (
                            <Button
                                onClick={isPlaced ? onReset : onPlace}
                                variant="outline"
                                size="sm"
                                className="aspect-square p-0 bg-blue-500/20 border-blue-500 text-blue-400 hover:bg-blue-500/30"
                                disabled={isLoading}
                            >
                                {isPlaced ? (
                                    <RefreshCw className="w-4 h-4" />
                                ) : (
                                    <Square className="w-4 h-4" />
                                )}
                            </Button>
                        )}

                        {/* Capture */}
                        <Button
                            onClick={onCapture}
                            variant="outline"
                            size="sm"
                            className="aspect-square p-0 bg-green-500/20 border-green-500 text-green-400 hover:bg-green-500/30"
                            disabled={isLoading}
                        >
                            <Camera className="w-4 h-4" />
                        </Button>
                    </div>
                )}

                {/* Camera mode indicator */}
                {isActive && (
                    <div className="mt-3 text-center">
                        <span className="text-white/70 text-xs">
                            {facingMode === 'user' ? 'Front Camera' : 'Back Camera'}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}