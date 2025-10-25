// AR support detection and capability checking

export type ARMode = 'webxr' | 'image-tracking' | 'overlay' | 'unsupported';

export interface ARCapabilities {
    webxr: boolean;
    imageTracking: boolean;
    camera: boolean;
    canvas: boolean;
}

// Detect WebXR support
export async function checkWebXRSupport(): Promise<boolean> {
    try {
        if (!('xr' in navigator) || !navigator.xr) {
            return false;
        }

        // Check for immersive-ar session support
        const supported = await navigator.xr.isSessionSupported('immersive-ar');
        return supported;
    } catch (error) {
        console.warn('WebXR check failed:', error);
        return false;
    }
}

// Check if camera is available
export function checkCameraSupport(): boolean {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

// Check canvas support for 2D fallback
export function checkCanvasSupport(): boolean {
    try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        return !!(ctx && typeof ctx.drawImage === 'function');
    } catch (error) {
        return false;
    }
}

// Check mind-ar.js image tracking support
export function checkImageTrackingSupport(): boolean {
    try {
        // Basic checks for required APIs
        const hasRequiredAPIs = !!(
            typeof WebAssembly !== 'undefined' &&
            checkCameraSupport() &&
            checkCanvasSupport()
        );

        // Don't check for mind-ar specifically since we load it dynamically
        return hasRequiredAPIs;
    } catch (error) {
        return false;
    }
}

// Get all AR capabilities
export async function getARCapabilities(): Promise<ARCapabilities> {
    const [webxr] = await Promise.all([
        checkWebXRSupport(),
    ]);

    return {
        webxr,
        imageTracking: checkImageTrackingSupport(),
        camera: checkCameraSupport(),
        canvas: checkCanvasSupport(),
    };
}

// Determine best AR mode based on capabilities and user agent
export async function getBestARMode(): Promise<ARMode> {
    const capabilities = await getARCapabilities();

    // No camera support = no AR
    if (!capabilities.camera) {
        return 'unsupported';
    }

    // WebXR is preferred on supported devices (mainly Android Chrome)
    if (capabilities.webxr) {
        return 'webxr';
    }

    // Image tracking for devices with camera but no WebXR (iOS Safari)
    if (capabilities.imageTracking) {
        return 'image-tracking';
    }

    // 2D overlay fallback if camera is available
    if (capabilities.canvas) {
        return 'overlay';
    }

    return 'unsupported';
}

// Check if device likely supports WebXR (without async check)
export function isLikelyWebXRDevice(): boolean {
    const userAgent = navigator.userAgent.toLowerCase();

    // Android Chrome typically supports WebXR
    return (
        userAgent.includes('android') &&
        userAgent.includes('chrome') &&
        !userAgent.includes('firefox')
    );
}

// Check if device is iOS
export function isIOSDevice(): boolean {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

// Get device type for AR mode hints
export function getDeviceType(): 'android' | 'ios' | 'desktop' | 'unknown' {
    const userAgent = navigator.userAgent.toLowerCase();

    if (userAgent.includes('android')) {
        return 'android';
    } else if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        return 'ios';
    } else if (userAgent.includes('windows') || userAgent.includes('mac') || userAgent.includes('linux')) {
        return 'desktop';
    }

    return 'unknown';
}

// Check for required permissions
export async function checkRequiredPermissions(): Promise<{ camera: PermissionState }> {
    try {
        const camera = await navigator.permissions?.query({ name: 'camera' as PermissionName });
        return {
            camera: camera?.state || 'prompt',
        };
    } catch (error) {
        return { camera: 'prompt' };
    }
}

// Get AR mode display name
export function getARModeDisplayName(mode: ARMode): string {
    switch (mode) {
        case 'webxr':
            return 'WebXR (3D Placement)';
        case 'image-tracking':
            return 'Image Tracking';
        case 'overlay':
            return '2D Overlay';
        case 'unsupported':
            return 'Not Supported';
        default:
            return 'Unknown';
    }
}

// Get helpful tips for each AR mode
export function getARModeTips(mode: ARMode): string[] {
    switch (mode) {
        case 'webxr':
            return [
                'Move your device slowly to detect surfaces',
                'Tap on a detected plane to place Alfie',
                'Use pinch gestures to scale the object',
            ];
        case 'image-tracking':
            return [
                'Point your camera at the marker image',
                'Keep the marker fully visible and well-lit',
                'Hold steady for best tracking',
            ];
        case 'overlay':
            return [
                'Drag the Alfie sticker to position it',
                'Use pinch gestures to resize',
                'Tap Capture to save your photo',
            ];
        case 'unsupported':
            return [
                'This device doesn\'t support AR features',
                'Try using a mobile device with camera access',
            ];
        default:
            return [];
    }
}