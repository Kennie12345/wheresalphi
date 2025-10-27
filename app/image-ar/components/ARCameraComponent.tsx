'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    Camera,
    RotateCcw,
    AlertCircle,
    Loader2,
    X,
    Sparkles,
    Shield
} from 'lucide-react';

interface ARCameraComponentProps {
    onPhotoCapture: (imageDataUrl: string) => void;
    onCancel?: () => void;
    theme?: 'default' | 'wheres-alphi';
    arOverlayImage?: string; // Path to AR overlay image (e.g., '/ar/alfie-overlay.png')
    showAROverlay?: boolean; // Toggle AR overlay on/off
}

interface CameraState {
    stream: MediaStream | null;
    isActive: boolean;
    facingMode: 'user' | 'environment';
    error: string | null;
    isLoading: boolean;
}

export default function ARCameraComponent({
    onPhotoCapture,
    onCancel,
    theme = 'wheres-alphi',
    arOverlayImage = '/ar/alfie-overlay.png',
    showAROverlay = true
}: ARCameraComponentProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const displayCanvasRef = useRef<HTMLCanvasElement>(null);
    const arImageRef = useRef<HTMLImageElement | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    const [cameraState, setCameraState] = useState<CameraState>({
        stream: null,
        isActive: false,
        facingMode: 'user',
        error: null,
        isLoading: false,
    });

    const [isHttps, setIsHttps] = useState(true);
    const [hasStarted, setHasStarted] = useState(false);
    const [isCapturing, setIsCapturing] = useState(false);
    const [arImageLoaded, setArImageLoaded] = useState(false);

    // Load AR image
    useEffect(() => {
        if (showAROverlay && arOverlayImage) {
            const img = new window.Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                arImageRef.current = img;
                setArImageLoaded(true);
            };
            img.onerror = () => {
                console.error('Failed to load AR overlay image');
                setArImageLoaded(false);
            };
            img.src = arOverlayImage;
        }
    }, [arOverlayImage, showAROverlay]);

    // AR compositing loop - draws video + AR image to canvas continuously
    useEffect(() => {
        if (!cameraState.isActive || !displayCanvasRef.current || !videoRef.current) {
            return;
        }

        const canvas = displayCanvasRef.current;
        const ctx = canvas.getContext('2d', { alpha: false });
        const video = videoRef.current;

        if (!ctx) return;

        const renderFrame = () => {
            // Wait for video to be ready
            if (!video.videoWidth || !video.videoHeight || video.readyState < 2) {
                animationFrameRef.current = requestAnimationFrame(renderFrame);
                return;
            }

            // Set canvas size to match video (only when needed)
            if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
            }

            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Save context state
            ctx.save();

            // Mirror for front camera
            if (cameraState.facingMode === 'user') {
                ctx.translate(canvas.width, 0);
                ctx.scale(-1, 1);
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            } else {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            }

            // Restore after video draw
            ctx.restore();

            // Draw AR image if loaded
            if (showAROverlay && arImageRef.current && arImageLoaded) {
                const arImage = arImageRef.current;

                // Calculate AR image size - responsive scaling based on canvas dimensions
                // Use smaller dimension to ensure it fits in both portrait and landscape
                const minDimension = Math.min(canvas.width, canvas.height);
                const baseScale = 0.225; // Start with 22.5% of the smaller dimension (50% bigger than original 15%)

                // Calculate dimensions maintaining aspect ratio
                let arWidth = minDimension * baseScale;
                let arHeight = (arImage.height / arImage.width) * arWidth;

                // Apply maximum size constraints to prevent oversized images
                const maxWidth = canvas.width * 0.25; // Never exceed 25% of canvas width
                const maxHeight = canvas.height * 0.25; // Never exceed 25% of canvas height

                if (arWidth > maxWidth) {
                    arWidth = maxWidth;
                    arHeight = (arImage.height / arImage.width) * arWidth;
                }

                if (arHeight > maxHeight) {
                    arHeight = maxHeight;
                    arWidth = (arImage.width / arImage.height) * arHeight;
                }

                // Responsive padding based on canvas size (3% of dimension with minimum)
                const paddingX = Math.max(canvas.width * 0.03, 15);
                const paddingY = Math.max(canvas.height * 0.03, 15);

                // Position in bottom right corner with responsive padding
                const arX = canvas.width - arWidth - paddingX;
                const arY = canvas.height - arHeight - paddingY;

                // Apply bounce animation
                const time = Date.now() / 1000;
                const bounceOffset = Math.sin(time * 2) * 5;

                // Draw AR image - preserve transparency
                ctx.save();

                // Use source-over to properly blend transparent PNGs
                ctx.globalCompositeOperation = 'source-over';
                ctx.globalAlpha = 1.0; // Full opacity - let PNG transparency show through

                // Add subtle drop shadow for depth
                ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
                ctx.shadowBlur = 15;
                ctx.shadowOffsetY = 5;

                ctx.drawImage(
                    arImage,
                    arX,
                    arY + bounceOffset,
                    arWidth,
                    arHeight
                );

                ctx.restore();
            }

            animationFrameRef.current = requestAnimationFrame(renderFrame);
        };

        renderFrame();

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [cameraState.isActive, cameraState.facingMode, showAROverlay, arImageLoaded]);

    // Check HTTPS requirement on mount
    useEffect(() => {
        const httpsCheck =
            typeof window !== 'undefined' &&
            (window.location.protocol === 'https:' ||
             window.location.hostname === 'localhost' ||
             window.location.hostname === '127.0.0.1');
        setIsHttps(httpsCheck);
    }, []);

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

            setHasStarted(true);

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
        // Use the display canvas if AR is enabled, otherwise use video directly
        const sourceCanvas = displayCanvasRef.current;
        const canvas = canvasRef.current;

        if (!canvas) return;

        setIsCapturing(true);

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // If we have the AR composite canvas, use that
        if (sourceCanvas && showAROverlay) {
            canvas.width = sourceCanvas.width;
            canvas.height = sourceCanvas.height;
            ctx.drawImage(sourceCanvas, 0, 0);
        } else if (videoRef.current) {
            // Fallback to video if no AR canvas
            const video = videoRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            // Mirror canvas for front camera
            if (cameraState.facingMode === 'user') {
                ctx.scale(-1, 1);
                ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
            } else {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            }
        } else {
            return;
        }

        // Convert to image
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);

        // Stop camera before transitioning
        stopCamera();

        // Trigger callback with captured image
        setTimeout(() => {
            onPhotoCapture(dataUrl);
        }, 300); // Small delay for smooth transition
    };

    // Handle cancel
    const handleCancel = () => {
        stopCamera();
        if (onCancel) {
            onCancel();
        }
    };

    // Cleanup resources
    useEffect(() => {
        return () => {
            if (cameraState.stream) {
                cameraState.stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [cameraState.stream]);

    // Theme colors
    const primaryColor = theme === 'wheres-alphi' ? 'red' : 'blue';
    const primaryClass = theme === 'wheres-alphi' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700';

    // HTTPS check screen
    if (!isHttps) {
        return (
            <div className="fixed inset-0 bg-red-600 flex items-center justify-center p-4 z-50 animate-in fade-in duration-500">
                <Card className="max-w-md p-6 bg-white border-2 border-black">
                    <div className="flex items-center gap-2 mb-4">
                        <Shield className="w-6 h-6 text-red-600" />
                        <h2 className="text-xl font-bold text-black">HTTPS Required</h2>
                    </div>
                    <div className="space-y-4">
                        <p className="text-black">
                            Camera access requires a secure connection (HTTPS) for security reasons.
                        </p>
                        <div className="bg-black p-3 rounded-lg border border-black">
                            <p className="text-sm text-white font-medium">
                                Current: {typeof window !== 'undefined' ? window.location.protocol : 'unknown'}
                            </p>
                        </div>
                        <p className="text-sm text-black">
                            Please access this page via HTTPS or use localhost for development.
                        </p>
                        {onCancel && (
                            <Button onClick={handleCancel} variant="outline" className="w-full border-black text-black hover:bg-black hover:text-white">
                                Go Back
                            </Button>
                        )}
                    </div>
                </Card>
            </div>
        );
    }

    // Permission/Start screen
    if (!hasStarted) {
        return (
            <div className="fixed inset-0 bg-red-600 flex items-center justify-center p-4 z-50 animate-in fade-in duration-500">
                <Card className="max-w-md p-6 bg-white border-2 border-black">
                    <div className="flex items-center gap-2 mb-4">
                        <Camera className="w-6 h-6 text-red-600" />
                        <h2 className="text-xl font-bold text-black">Find Alphi Camera</h2>
                    </div>
                    <div className="space-y-4">
                        <p className="text-black">
                            Use your camera to capture the location where Alphi is hiding!
                        </p>

                        <div className="bg-black p-4 rounded-lg border border-black">
                            <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                Camera Features:
                            </h4>
                            <ul className="text-sm text-white space-y-1">
                                <li>• Live camera preview</li>
                                <li>• Switch between front/back camera</li>
                                <li>• High-quality photo capture</li>
                                <li>• AR detection to find Alphi</li>
                            </ul>
                        </div>

                        {cameraState.error && (
                            <div className="bg-white p-3 rounded-lg border-2 border-black">
                                <p className="text-sm text-black">{cameraState.error}</p>
                            </div>
                        )}

                        <div className="flex gap-3">
                            {onCancel && (
                                <Button
                                    onClick={handleCancel}
                                    variant="outline"
                                    className="flex-1 bg-white border-2 border-black text-black hover:bg-black hover:text-white"
                                >
                                    Cancel
                                </Button>
                            )}
                            <Button
                                onClick={startCamera}
                                disabled={cameraState.isLoading}
                                className="flex-1 bg-white border-2 border-red-600 text-black hover:bg-red-600 hover:text-white"
                                size="lg"
                            >
                                {cameraState.isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Starting...
                                    </>
                                ) : (
                                    <>
                                        <Camera className="w-5 h-5 mr-2" />
                                        Start Camera
                                    </>
                                )}
                            </Button>
                        </div>

                        <p className="text-xs text-black text-center">
                            This will request camera permission. Please allow access for the best experience.
                        </p>
                    </div>
                </Card>
            </div>
        );
    }

    // Camera view
    return (
        <div className={`fixed inset-0 bg-black z-50 ${isCapturing ? 'animate-out fade-out duration-300' : 'animate-in fade-in duration-300'}`}>
            {/* Video display area */}
            <div className="absolute inset-0">
                {/* Hidden video element (feeds the AR canvas) - must be in DOM but invisible */}
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{ position: 'absolute', width: '1px', height: '1px', opacity: 0, pointerEvents: 'none' }}
                />

                {/* AR composite canvas - shows video + AR overlay */}
                <canvas
                    ref={displayCanvasRef}
                    className="w-full h-full object-cover"
                    style={{ display: 'block' }}
                />

                {/* Hidden canvas for photo capture */}
                <canvas ref={canvasRef} className="hidden" />
            </div>

            {/* Alphi branding overlay */}
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 via-black/30 to-transparent p-4 z-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-red-500" />
                        <span className="text-white font-bold text-lg">WHERE'S ALPHI?</span>
                    </div>
                    <Button
                        onClick={handleCancel}
                        variant="ghost"
                        size="sm"
                        className="bg-black/50 hover:bg-black/70 text-white"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            {/* Error display */}
            {cameraState.error && (
                <div className="absolute top-20 left-4 right-4 z-50 animate-in slide-in-from-top duration-300">
                    <Card className="p-4 bg-white border-2 border-black">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-red-600" />
                            <p className="text-black text-sm">{cameraState.error}</p>
                        </div>
                        <Button
                            onClick={() => {
                                setCameraState(prev => ({ ...prev, error: null }));
                                startCamera();
                            }}
                            className="mt-2 w-full bg-white border-2 border-red-600 text-black hover:bg-red-600 hover:text-white"
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
                        <p className="text-lg">Starting camera...</p>
                    </div>
                </div>
            )}

            {/* Camera status indicator */}
            {cameraState.isActive && (
                <div className="absolute top-20 left-4 z-50 animate-in slide-in-from-left duration-500">
                    <div className="bg-black/70 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm">
                        <span className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            {cameraState.facingMode === 'user' ? 'Front Camera' : 'Back Camera'}
                        </span>
                    </div>
                </div>
            )}

            {/* Camera guide overlay (optional - can be removed if not needed) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <div className="w-64 h-64 border-2 border-red-500 rounded-lg border-dashed opacity-30"></div>
            </div>

            {/* Control buttons */}
            <div className="absolute bottom-0 left-0 right-0 p-6 z-50 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                <div className="max-w-md mx-auto">
                    {cameraState.isActive && (
                        <div className="flex items-center justify-center gap-6">
                            {/* Flip camera button */}
                            <Button
                                onClick={flipCamera}
                                variant="outline"
                                size="lg"
                                className="w-16 h-16 rounded-full bg-white border-2 border-black text-black hover:bg-black hover:text-white"
                                disabled={cameraState.isLoading || isCapturing}
                            >
                                <RotateCcw className="w-6 h-6" />
                            </Button>

                            {/* Capture photo button */}
                            <Button
                                onClick={capturePhoto}
                                size="lg"
                                className="w-20 h-20 rounded-full bg-white border-2 border-red-600 text-black hover:bg-red-600 hover:text-white shadow-2xl hover:scale-110 transition-transform"
                                disabled={cameraState.isLoading || isCapturing}
                            >
                                {isCapturing ? (
                                    <Loader2 className="w-8 h-8 animate-spin" />
                                ) : (
                                    <Camera className="w-8 h-8" />
                                )}
                            </Button>

                            {/* Placeholder for symmetry */}
                            <div className="w-16 h-16"></div>
                        </div>
                    )}

                    {/* Instructions */}
                    <p className="text-white text-center text-sm mt-4 opacity-80">
                        {isCapturing ? 'Finding Alphi...' : 'Position the location within the frame and tap to capture'}
                    </p>
                </div>
            </div>
        </div>
    );
}
