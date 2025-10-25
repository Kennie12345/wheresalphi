// Image tracking implementation using mind-ar-js

export interface ImageTrackingState {
    mindarThree: any;
    scene: any;
    camera: any;
    renderer: any;
    anchor: any;
    placedObject: any;
    isTracking: boolean;
}

export class ImageTrackingManager {
    private state: ImageTrackingState = {
        mindarThree: null,
        scene: null,
        camera: null,
        renderer: null,
        anchor: null,
        placedObject: null,
        isTracking: false,
    };

    private container: HTMLElement | null = null;

    async init(container: HTMLElement): Promise<void> {
        this.container = container;

        try {
            // Check if we're in browser environment
            if (typeof window === 'undefined') {
                throw new Error('Image tracking only works in browser environment');
            }

            // Load mind-ar script dynamically to avoid SSR issues
            await this.loadMindARScript();

            // Wait for MindARThree to be available on window
            const MindARThree = (window as any).MINDAR?.IMAGE?.MindARThree;
            if (!MindARThree) {
                throw new Error('MindARThree not loaded properly');
            }

            // Initialize MindAR with marker
            this.state.mindarThree = new MindARThree({
                container: container,
                imageTargetSrc: '/ar/marker.mind', // Compiled marker file
                maxTrack: 1,
                warmupTolerance: 2,
                missTolerance: 5,
            });

            const { renderer, scene, camera } = this.state.mindarThree;
            this.state.renderer = renderer;
            this.state.scene = scene;
            this.state.camera = camera;

            // Add lighting
            this.setupLighting();

            // Setup tracking events
            this.setupTrackingEvents();

        } catch (error) {
            console.error('Failed to initialize image tracking:', error);
            throw new Error('Image tracking not supported or failed to load');
        }
    }

    private async loadMindARScript(): Promise<void> {
        return new Promise((resolve, reject) => {
            // Check if already loaded
            if ((window as any).MINDAR) {
                resolve();
                return;
            }

            // Create script element
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-three.prod.js';
            script.async = true;
            script.onload = () => {
                // Give it a moment to initialize
                setTimeout(resolve, 100);
            };
            script.onerror = () => {
                reject(new Error('Failed to load mind-ar script'));
            };

            document.head.appendChild(script);
        });
    }

    private setupLighting(): void {
        if (!this.state.scene) return;

        // Import THREE from mind-ar context
        const THREE = (window as any).THREE;
        if (!THREE) return;

        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.state.scene.add(ambientLight);

        // Directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1);
        this.state.scene.add(directionalLight);
    }

    private setupTrackingEvents(): void {
        if (!this.state.mindarThree) return;

        // Create anchor for tracked object
        this.state.anchor = this.state.mindarThree.addAnchor(0);

        // Track found/lost events
        this.state.anchor.onTargetFound = () => {
            this.state.isTracking = true;
            console.log('Image target found');
        };

        this.state.anchor.onTargetLost = () => {
            this.state.isTracking = false;
            console.log('Image target lost');
        };
    }

    async start(): Promise<void> {
        try {
            if (!this.state.mindarThree) {
                throw new Error('Image tracking not initialized');
            }

            await this.state.mindarThree.start();
            console.log('Image tracking started');
        } catch (error) {
            console.error('Failed to start image tracking:', error);
            throw error;
        }
    }

    placeObject(): void {
        if (!this.state.anchor || this.state.placedObject) return;

        const THREE = (window as any).THREE;
        if (!THREE) return;

        // Create simple Alfie placeholder
        const geometry = new THREE.SphereGeometry(0.1, 16, 16);
        const material = new THREE.MeshPhongMaterial({
            color: 0xff6600,
            transparent: true,
            opacity: 0.9,
        });

        this.state.placedObject = new THREE.Mesh(geometry, material);
        this.state.placedObject.position.set(0, 0.1, 0);
        this.state.placedObject.scale.setScalar(1);

        this.state.anchor.group.add(this.state.placedObject);
    }

    scaleObject(scale: number): void {
        if (this.state.placedObject) {
            const clampedScale = Math.max(0.5, Math.min(3, scale));
            this.state.placedObject.scale.setScalar(clampedScale);
        }
    }

    resetObject(): void {
        if (this.state.placedObject && this.state.anchor) {
            this.state.anchor.group.remove(this.state.placedObject);
            this.state.placedObject = null;
        }
    }

    isTrackingActive(): boolean {
        return this.state.isTracking;
    }

    async captureFrame(): Promise<string> {
        return new Promise((resolve) => {
            if (!this.state.renderer) {
                resolve('');
                return;
            }

            try {
                // Get renderer canvas and convert to data URL
                const canvas = this.state.renderer.domElement;
                const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                resolve(dataUrl);
            } catch (error) {
                console.error('Failed to capture frame:', error);
                resolve('');
            }
        });
    }

    async stop(): Promise<void> {
        try {
            if (this.state.mindarThree) {
                await this.state.mindarThree.stop();
            }
        } catch (error) {
            console.error('Error stopping image tracking:', error);
        }
    }

    cleanup(): void {
        this.stop();

        // Clean up objects
        this.resetObject();

        // Reset state
        this.state = {
            mindarThree: null,
            scene: null,
            camera: null,
            renderer: null,
            anchor: null,
            placedObject: null,
            isTracking: false,
        };
    }
}

// Generate mind file content for the marker
export function generateMindFile(): string {
    // This is a minimal mind file for a simple marker
    // In a real implementation, you'd use the mind-ar compiler tools
    return JSON.stringify({
        images: [
            {
                image: '/ar/marker.png',
                targetIndex: 0,
            }
        ]
    });
}