// WebXR implementation for 3D object placement

import * as THREE from 'three';

export interface WebXRState {
    scene: THREE.Scene | null;
    camera: THREE.Camera | null;
    renderer: THREE.WebGLRenderer | null;
    session: XRSession | null;
    placedObject: THREE.Object3D | null;
    hitTestSource: XRHitTestSource | null;
}

export class WebXRManager {
    private state: WebXRState = {
        scene: null,
        camera: null,
        renderer: null,
        session: null,
        placedObject: null,
        hitTestSource: null,
    };

    private onSelect: (() => void) | null = null;

    async init(container: HTMLElement): Promise<void> {
        // Create scene
        this.state.scene = new THREE.Scene();

        // Create camera (will be controlled by WebXR)
        this.state.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);

        // Create renderer with WebXR support
        this.state.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            preserveDrawingBuffer: true,
        });
        this.state.renderer.setPixelRatio(window.devicePixelRatio);
        this.state.renderer.setSize(window.innerWidth, window.innerHeight);
        this.state.renderer.xr.enabled = true;
        this.state.renderer.shadowMap.enabled = true;
        this.state.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        container.appendChild(this.state.renderer.domElement);

        // Add lighting
        this.setupLighting();

        // Setup event listeners
        this.setupEventListeners();
    }

    private setupLighting(): void {
        if (!this.state.scene) return;

        // Ambient light for general illumination
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.state.scene.add(ambientLight);

        // Directional light for shadows
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(0, 1, 0);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        this.state.scene.add(directionalLight);
    }

    private setupEventListeners(): void {
        if (!this.state.renderer) return;

        // Handle controller input
        const controller = this.state.renderer.xr.getController(0);
        controller.addEventListener('select', () => {
            if (this.onSelect) {
                this.onSelect();
            }
        });

        if (this.state.scene) {
            this.state.scene.add(controller);
        }
    }

    async startAR(): Promise<void> {
        try {
            if (!navigator.xr) {
                throw new Error('WebXR not supported');
            }

            // Request AR session
            this.state.session = await navigator.xr.requestSession('immersive-ar', {
                requiredFeatures: ['local', 'hit-test'],
            });

            if (!this.state.renderer || !this.state.session) {
                throw new Error('Failed to initialize WebXR session');
            }

            // Set up session
            await this.state.renderer.xr.setSession(this.state.session);

            // Request hit test source
            const referenceSpace = await this.state.session.requestReferenceSpace('viewer');
            if (this.state.session.requestHitTestSource) {
                this.state.hitTestSource = await this.state.session.requestHitTestSource({ space: referenceSpace }) || null;
            }

            // Start render loop
            this.state.renderer.setAnimationLoop(this.render.bind(this));

        } catch (error) {
            console.error('Failed to start AR session:', error);
            throw error;
        }
    }

    private render(timestamp: number, frame?: XRFrame): void {
        if (!this.state.renderer || !this.state.scene || !this.state.camera) return;

        if (frame && this.state.hitTestSource) {
            // Perform hit testing
            const referenceSpace = this.state.renderer.xr.getReferenceSpace();
            if (referenceSpace) {
                const hitTestResults = frame.getHitTestResults(this.state.hitTestSource);

                if (hitTestResults.length > 0) {
                    // Show hit test indicator or handle placement
                    const hit = hitTestResults[0];
                    const pose = hit.getPose(referenceSpace);

                    if (pose) {
                        // You could show a placement indicator here
                        // For now, we'll handle placement on select event
                    }
                }
            }
        }

        this.state.renderer.render(this.state.scene, this.state.camera);
    }

    placeObject(position?: THREE.Vector3): void {
        if (!this.state.scene) return;

        // Remove existing object
        if (this.state.placedObject) {
            this.state.scene.remove(this.state.placedObject);
        }

        // Create Alfie placeholder (simple cube for now)
        const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
        const material = new THREE.MeshPhongMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: 0.8,
        });

        this.state.placedObject = new THREE.Mesh(geometry, material);
        this.state.placedObject.castShadow = true;
        this.state.placedObject.receiveShadow = true;

        // Position the object
        if (position) {
            this.state.placedObject.position.copy(position);
        } else {
            // Place in front of camera
            this.state.placedObject.position.set(0, 0, -0.5);
        }

        this.state.scene.add(this.state.placedObject);
    }

    setOnSelect(callback: () => void): void {
        this.onSelect = callback;
    }

    scaleObject(scale: number): void {
        if (this.state.placedObject) {
            this.state.placedObject.scale.setScalar(Math.max(0.1, Math.min(3, scale)));
        }
    }

    rotateObject(rotation: THREE.Euler): void {
        if (this.state.placedObject) {
            this.state.placedObject.rotation.copy(rotation);
        }
    }

    resetObject(): void {
        if (this.state.placedObject && this.state.scene) {
            this.state.scene.remove(this.state.placedObject);
            this.state.placedObject = null;
        }
    }

    async captureFrame(): Promise<string> {
        return new Promise((resolve) => {
            if (!this.state.renderer) {
                resolve('');
                return;
            }

            // Render current frame to data URL
            this.state.renderer.domElement.toBlob((blob: Blob | null) => {
                if (blob) {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result as string);
                    reader.readAsDataURL(blob);
                } else {
                    resolve('');
                }
            }, 'image/jpeg', 0.8);
        });
    }

    async stopAR(): Promise<void> {
        if (this.state.session) {
            await this.state.session.end();
            this.state.session = null;
        }

        if (this.state.renderer) {
            this.state.renderer.setAnimationLoop(null);
        }

        if (this.state.hitTestSource) {
            this.state.hitTestSource.cancel();
            this.state.hitTestSource = null;
        }
    }

    cleanup(): void {
        this.stopAR();

        if (this.state.renderer) {
            this.state.renderer.dispose();
            if (this.state.renderer.domElement.parentNode) {
                this.state.renderer.domElement.parentNode.removeChild(this.state.renderer.domElement);
            }
        }

        this.state = {
            scene: null,
            camera: null,
            renderer: null,
            session: null,
            placedObject: null,
            hitTestSource: null,
        };
    }
}