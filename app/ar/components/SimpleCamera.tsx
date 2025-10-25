'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    Camera,
    RotateCcw,
    Download,
    AlertCircle,
    Loader2,
    StopCircle,
    Play
} from 'lucide-react';

interface CameraState {
    stream: MediaStream | null;
    isActive: boolean;
    facingMode: 'user' | 'environment';
    error: string | null;
    isLoading: boolean;
}

export default function SimpleCamera() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [cameraState, setCameraState] = useState<CameraState>({
        stream: null,
        isActive: false,
        facingMode: 'environment',
        error: null,
        isLoading: false,
    });

    const [capturedImage, setCapturedImage] = useState<string | null>(null);

    // Start camera function
    const startCamera = async () => {
        try {
            setCameraState(prev => ({ ...prev, isLoading: true, error: null }));

            // Check browser support
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error('This browser does not support camera access');
            }

            // Request camera permissions
            const constraints = {
                video: {
                    facingMode: cameraState.facingMode,
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                },
                audio: false,
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);

            // Set video stream
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.playsInline = true; // Important: iOS compatibility
                videoRef.current.muted = true;

                // Mirror front camera display
                if (cameraState.facingMode === 'user') {
                    videoRef.current.style.transform = 'scaleX(-1)';
                } else {
                    videoRef.current.style.transform = 'scaleX(1)';
                }
            }

            setCameraState(prev => ({
                ...prev,
                stream,
                isActive: true,
                isLoading: false,
            }));

        } catch (error) {
            let errorMessage = 'Failed to start camera';

            if (error instanceof Error) {
                if (error.name === 'NotAllowedError') {
                    errorMessage = 'Camera access denied. Please allow camera permissions and try again.';
                } else if (error.name === 'NotFoundError') {
                    errorMessage = 'No camera device found.';
                } else if (error.name === 'OverconstrainedError') {
                    errorMessage = 'Camera settings not supported.';
                } else {
                    errorMessage = `Camera error: ${error.message}`;
                }
            }

            setCameraState(prev => ({
                ...prev,
                error: errorMessage,
                isLoading: false,
            }));
        }
    };

    // Stop camera function
    const stopCamera = () => {
        if (cameraState.stream) {
            cameraState.stream.getTracks().forEach(track => track.stop());
        }

        setCameraState(prev => ({
            ...prev,
            stream: null,
            isActive: false,
        }));
    };

    // Switch between front/back camera
    const flipCamera = async () => {
        try {
            setCameraState(prev => ({ ...prev, isLoading: true }));

            // Stop current stream
            if (cameraState.stream) {
                cameraState.stream.getTracks().forEach(track => track.stop());
            }

            // Switch camera direction
            const newFacingMode = cameraState.facingMode === 'user' ? 'environment' : 'user';

            const constraints = {
                video: {
                    facingMode: newFacingMode,
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                },
                audio: false,
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);

            if (videoRef.current) {
                videoRef.current.srcObject = stream;

                // Mirror front camera
                if (newFacingMode === 'user') {
                    videoRef.current.style.transform = 'scaleX(-1)';
                } else {
                    videoRef.current.style.transform = 'scaleX(1)';
                }
            }

            setCameraState(prev => ({
                ...prev,
                stream,
                facingMode: newFacingMode,
                isLoading: false,
            }));

        } catch (error) {
            setCameraState(prev => ({
                ...prev,
                error: error instanceof Error ? error.message : 'Failed to switch camera',
                isLoading: false,
            }));
        }
    };

    // Take photo function
    const capturePhoto = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (!ctx) return;

        // Set canvas size
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Mirror canvas for front camera
        if (cameraState.facingMode === 'user') {
            ctx.scale(-1, 1);
            ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
        } else {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        }

        // Convert to image
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(dataUrl);
    };

    // Download photo function
    const downloadPhoto = () => {
        if (!capturedImage) return;

        const link = document.createElement('a');
        link.href = capturedImage;
        link.download = `alphi-photo-${Date.now()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Cleanup resources
    useEffect(() => {
        return () => {
            if (cameraState.stream) {
                cameraState.stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    // Photo preview mode
    if (capturedImage) {
        return (
            <div className="min-h-screen bg-black flex flex-col">
                <div className="flex-1 flex items-center justify-center p-4">
                    <img
                        src={capturedImage}
                        alt="Captured photo"
                        className="max-w-full max-h-full object-contain rounded-lg"
                    />
                </div>

                <div className="p-4 space-y-4">
                    <div className="flex gap-2">
                        <Button onClick={downloadPhoto} className="flex-1">
                            <Download className="w-4 h-4 mr-2" />
                            Download Photo
                        </Button>
                        <Button
                            onClick={() => setCapturedImage(null)}
                            variant="outline"
                            className="flex-1"
                        >
                            Take Another
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black relative overflow-hidden">
            {/* Video display area */}
            <div className="absolute inset-0">
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                />

                {/* Hidden canvas for photo capture */}
                <canvas ref={canvasRef} className="hidden" />
            </div>

            {/* Error display */}
            {cameraState.error && (
                <div className="absolute top-4 left-4 right-4 z-50">
                    <Card className="p-4 bg-red-50 border-red-200">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-red-600" />
                            <p className="text-red-700 text-sm">{cameraState.error}</p>
                        </div>
                        <Button
                            onClick={() => setCameraState(prev => ({ ...prev, error: null }))}
                            className="mt-2 w-full"
                            size="sm"
                        >
                            Retry
                        </Button>
                    </Card>
                </div>
            )}

            {/* Loading indicator */}
            {cameraState.isLoading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-40">
                    <div className="text-white text-center">
                        <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
                        <p>Starting camera...</p>
                    </div>
                </div>
            )}

            {/* Camera status indicator */}
            <div className="absolute top-4 left-4 z-50">
                <div className="bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                    {cameraState.isActive ? (
                        <span className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            {cameraState.facingMode === 'user' ? 'Front Camera' : 'Back Camera'}
                        </span>
                    ) : (
                        'Camera Inactive'
                    )}
                </div>
            </div>

            {/* Control buttons */}
            <div className="absolute bottom-0 left-0 right-0 p-4 z-50">
                <div className="bg-black/80 rounded-2xl p-4">
                    {!cameraState.isActive ? (
                        // Start camera button
                        <div className="flex justify-center">
                            <Button
                                onClick={startCamera}
                                disabled={cameraState.isLoading}
                                size="lg"
                                className="px-8"
                            >
                                {cameraState.isLoading ? (
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                ) : (
                                    <Play className="w-5 h-5 mr-2" />
                                )}
                                Start Camera
                            </Button>
                        </div>
                    ) : (
                        // Camera control buttons
                        <div className="grid grid-cols-3 gap-3">
                            {/* Stop camera */}
                            <Button
                                onClick={stopCamera}
                                variant="outline"
                                size="sm"
                                className="aspect-square p-0 bg-red-500/20 border-red-500 text-red-400 hover:bg-red-500/30"
                                disabled={cameraState.isLoading}
                            >
                                <StopCircle className="w-4 h-4" />
                            </Button>

                            {/* Switch camera */}
                            <Button
                                onClick={flipCamera}
                                variant="outline"
                                size="sm"
                                className="aspect-square p-0 bg-white/20 border-white/30 text-white hover:bg-white/30"
                                disabled={cameraState.isLoading}
                            >
                                <RotateCcw className="w-4 h-4" />
                            </Button>

                            {/* Take photo */}
                            <Button
                                onClick={capturePhoto}
                                variant="outline"
                                size="sm"
                                className="aspect-square p-0 bg-blue-500/20 border-blue-500 text-blue-400 hover:bg-blue-500/30"
                                disabled={cameraState.isLoading}
                            >
                                <Camera className="w-4 h-4" />
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}