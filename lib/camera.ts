// Camera utilities for getUserMedia with front/back switching

export interface CameraConstraints {
    video: {
        facingMode: 'user' | 'environment';
        width?: { ideal: number };
        height?: { ideal: number };
    };
    audio: false;
}

export interface CameraState {
    stream: MediaStream | null;
    isActive: boolean;
    facingMode: 'user' | 'environment';
    error: string | null;
}

// Default constraints for mobile optimization
export const getDefaultConstraints = (facingMode: 'user' | 'environment' = 'environment'): CameraConstraints => ({
    video: {
        facingMode,
        width: { ideal: 1280 },
        height: { ideal: 720 },
    },
    audio: false,
});

// Start camera with specified constraints
export async function startCamera(constraints: CameraConstraints): Promise<MediaStream> {
    try {
        // Check if getUserMedia is supported
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error('Camera not supported by this browser');
        }

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        return stream;
    } catch (error) {
        if (error instanceof Error) {
            // Handle specific error types
            if (error.name === 'NotAllowedError') {
                throw new Error('Camera access denied. Please allow camera permission and try again.');
            } else if (error.name === 'NotFoundError') {
                throw new Error('No camera found on this device.');
            } else if (error.name === 'OverconstrainedError') {
                throw new Error('Camera constraints not supported. Trying with basic settings...');
            } else {
                throw new Error(`Camera error: ${error.message}`);
            }
        }
        throw new Error('Unknown camera error occurred');
    }
}

// Stop all tracks in a stream
export function stopCamera(stream: MediaStream | null): void {
    if (stream) {
        stream.getTracks().forEach(track => {
            track.stop();
        });
    }
}

// Flip camera between front and back
export async function flipCamera(currentFacingMode: 'user' | 'environment'): Promise<MediaStream> {
    const newFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';
    const constraints = getDefaultConstraints(newFacingMode);
    return startCamera(constraints);
}

// Check camera permissions
export async function checkCameraPermission(): Promise<PermissionState> {
    try {
        if (!navigator.permissions) {
            return 'prompt'; // Assume prompt if permissions API not available
        }

        const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
        return permission.state;
    } catch (error) {
        console.warn('Could not check camera permission:', error);
        return 'prompt';
    }
}

// Get available camera devices
export async function getCameraDevices(): Promise<MediaDeviceInfo[]> {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        return devices.filter(device => device.kind === 'videoinput');
    } catch (error) {
        console.warn('Could not enumerate camera devices:', error);
        return [];
    }
}

// Apply video element settings for mobile
export function setupVideoElement(video: HTMLVideoElement, stream: MediaStream, facingMode: 'user' | 'environment'): void {
    video.srcObject = stream;
    video.autoplay = true;
    video.playsInline = true; // Important for iOS
    video.muted = true; // Prevent audio feedback

    // Mirror selfie camera for natural preview
    if (facingMode === 'user') {
        video.style.transform = 'scaleX(-1)';
    } else {
        video.style.transform = 'scaleX(1)';
    }
}

// Capture frame from video to canvas
export function captureFrame(video: HTMLVideoElement, canvas: HTMLCanvasElement): string {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL('image/jpeg', 0.8);
}

// Resize image data URL to max dimensions while maintaining aspect ratio
export function resizeImage(dataUrl: string, maxWidth: number, maxHeight: number): Promise<string> {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d')!;

            // Calculate new dimensions
            let { width, height } = img;
            if (width > height) {
                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width *= maxHeight / height;
                    height = maxHeight;
                }
            }

            canvas.width = width;
            canvas.height = height;

            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
        img.src = dataUrl;
    });
}