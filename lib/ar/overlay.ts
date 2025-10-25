// 2D overlay implementation for camera with draggable Alfie sticker

export interface OverlayState {
    video: HTMLVideoElement | null;
    canvas: HTMLCanvasElement | null;
    ctx: CanvasRenderingContext2D | null;
    overlay: HTMLImageElement | null;
    overlayPosition: { x: number; y: number };
    overlayScale: number;
    overlayRotation: number;
    isDragging: boolean;
    isCapturing: boolean;
}

export interface TouchState {
    touches: Touch[];
    lastDistance: number;
    lastAngle: number;
}

export class OverlayManager {
    private state: OverlayState = {
        video: null,
        canvas: null,
        ctx: null,
        overlay: null,
        overlayPosition: { x: 0.5, y: 0.5 }, // Normalized coordinates (0-1)
        overlayScale: 1,
        overlayRotation: 0,
        isDragging: false,
        isCapturing: false,
    };

    private touchState: TouchState = {
        touches: [],
        lastDistance: 0,
        lastAngle: 0,
    };

    private animationId: number | null = null;
    private onCaptureCallback: ((dataUrl: string) => void) | null = null;

    async init(container: HTMLElement, stream: MediaStream): Promise<void> {
        // Create video element
        this.state.video = document.createElement('video');
        this.state.video.srcObject = stream;
        this.state.video.autoplay = true;
        this.state.video.playsInline = true;
        this.state.video.muted = true;
        this.state.video.style.width = '100%';
        this.state.video.style.height = '100%';
        this.state.video.style.objectFit = 'cover';

        // Create canvas for overlay
        this.state.canvas = document.createElement('canvas');
        this.state.canvas.style.position = 'absolute';
        this.state.canvas.style.top = '0';
        this.state.canvas.style.left = '0';
        this.state.canvas.style.width = '100%';
        this.state.canvas.style.height = '100%';
        this.state.canvas.style.pointerEvents = 'none'; // Allow touch events to pass through to video

        this.state.ctx = this.state.canvas.getContext('2d');
        if (!this.state.ctx) {
            throw new Error('Could not get canvas context');
        }

        // Load Alfie overlay image
        await this.loadOverlayImage();

        // Setup container
        container.style.position = 'relative';
        container.style.width = '100%';
        container.style.height = '100%';
        container.appendChild(this.state.video);
        container.appendChild(this.state.canvas);

        // Setup event listeners
        this.setupEventListeners(container);

        // Start render loop
        this.startRenderLoop();

        // Wait for video to be ready
        return new Promise((resolve) => {
            this.state.video!.addEventListener('loadedmetadata', () => {
                this.updateCanvasSize();
                resolve();
            });
        });
    }

    private async loadOverlayImage(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.state.overlay = new Image();
            this.state.overlay.crossOrigin = 'anonymous';
            this.state.overlay.onload = () => resolve();
            this.state.overlay.onerror = () => reject(new Error('Failed to load overlay image'));
            this.state.overlay.src = '/ar/alfie-overlay.png';
        });
    }

    private setupEventListeners(container: HTMLElement): void {
        // Touch events for mobile
        container.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
        container.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        container.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });

        // Mouse events for desktop testing
        container.addEventListener('mousedown', this.handleMouseDown.bind(this));
        container.addEventListener('mousemove', this.handleMouseMove.bind(this));
        container.addEventListener('mouseup', this.handleMouseUp.bind(this));

        // Resize handler
        window.addEventListener('resize', this.updateCanvasSize.bind(this));
    }

    private updateCanvasSize(): void {
        if (!this.state.canvas || !this.state.video) return;

        const rect = this.state.video.getBoundingClientRect();
        this.state.canvas.width = rect.width * window.devicePixelRatio;
        this.state.canvas.height = rect.height * window.devicePixelRatio;
        this.state.canvas.style.width = `${rect.width}px`;
        this.state.canvas.style.height = `${rect.height}px`;

        if (this.state.ctx) {
            this.state.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        }
    }

    private handleTouchStart(event: TouchEvent): void {
        event.preventDefault();
        this.touchState.touches = Array.from(event.touches);

        if (this.touchState.touches.length === 1) {
            // Single touch - start dragging
            const touch = this.touchState.touches[0];
            const rect = (event.target as HTMLElement).getBoundingClientRect();
            const x = (touch.clientX - rect.left) / rect.width;
            const y = (touch.clientY - rect.top) / rect.height;

            // Check if touch is near overlay
            const dx = x - this.state.overlayPosition.x;
            const dy = y - this.state.overlayPosition.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 0.1) { // Within 10% of screen
                this.state.isDragging = true;
            }
        } else if (this.touchState.touches.length === 2) {
            // Two fingers - setup for pinch/rotate
            const [touch1, touch2] = this.touchState.touches;
            this.touchState.lastDistance = this.getTouchDistance(touch1, touch2);
            this.touchState.lastAngle = this.getTouchAngle(touch1, touch2);
        }
    }

    private handleTouchMove(event: TouchEvent): void {
        event.preventDefault();
        this.touchState.touches = Array.from(event.touches);

        if (this.touchState.touches.length === 1 && this.state.isDragging) {
            // Single touch drag
            const touch = this.touchState.touches[0];
            const rect = (event.target as HTMLElement).getBoundingClientRect();
            this.state.overlayPosition.x = (touch.clientX - rect.left) / rect.width;
            this.state.overlayPosition.y = (touch.clientY - rect.top) / rect.height;
        } else if (this.touchState.touches.length === 2) {
            // Two finger pinch/rotate
            const [touch1, touch2] = this.touchState.touches;
            const currentDistance = this.getTouchDistance(touch1, touch2);
            const currentAngle = this.getTouchAngle(touch1, touch2);

            // Scale
            const scaleChange = currentDistance / this.touchState.lastDistance;
            this.state.overlayScale = Math.max(0.3, Math.min(3, this.state.overlayScale * scaleChange));

            // Rotate
            const angleChange = currentAngle - this.touchState.lastAngle;
            this.state.overlayRotation += angleChange;

            this.touchState.lastDistance = currentDistance;
            this.touchState.lastAngle = currentAngle;
        }
    }

    private handleTouchEnd(event: TouchEvent): void {
        this.touchState.touches = Array.from(event.touches);

        if (this.touchState.touches.length === 0) {
            this.state.isDragging = false;
        }
    }

    private handleMouseDown(event: MouseEvent): void {
        const rect = (event.target as HTMLElement).getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;

        const dx = x - this.state.overlayPosition.x;
        const dy = y - this.state.overlayPosition.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 0.1) {
            this.state.isDragging = true;
        }
    }

    private handleMouseMove(event: MouseEvent): void {
        if (this.state.isDragging) {
            const rect = (event.target as HTMLElement).getBoundingClientRect();
            this.state.overlayPosition.x = (event.clientX - rect.left) / rect.width;
            this.state.overlayPosition.y = (event.clientY - rect.top) / rect.height;
        }
    }

    private handleMouseUp(): void {
        this.state.isDragging = false;
    }

    private getTouchDistance(touch1: Touch, touch2: Touch): number {
        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    private getTouchAngle(touch1: Touch, touch2: Touch): number {
        return Math.atan2(touch2.clientY - touch1.clientY, touch2.clientX - touch1.clientX);
    }

    private startRenderLoop(): void {
        const render = () => {
            this.renderOverlay();
            this.animationId = requestAnimationFrame(render);
        };
        render();
    }

    private renderOverlay(): void {
        if (!this.state.ctx || !this.state.canvas || !this.state.overlay) return;

        // Clear canvas
        this.state.ctx.clearRect(0, 0, this.state.canvas.width / window.devicePixelRatio, this.state.canvas.height / window.devicePixelRatio);

        // Calculate overlay position and size
        const canvasWidth = this.state.canvas.width / window.devicePixelRatio;
        const canvasHeight = this.state.canvas.height / window.devicePixelRatio;
        const overlaySize = 80 * this.state.overlayScale; // Base size in pixels

        const x = this.state.overlayPosition.x * canvasWidth;
        const y = this.state.overlayPosition.y * canvasHeight;

        // Save context and apply transformations
        this.state.ctx.save();
        this.state.ctx.translate(x, y);
        this.state.ctx.rotate(this.state.overlayRotation);
        this.state.ctx.globalAlpha = this.state.isDragging ? 0.8 : 1.0;

        // Draw overlay image
        this.state.ctx.drawImage(
            this.state.overlay,
            -overlaySize / 2,
            -overlaySize / 2,
            overlaySize,
            overlaySize
        );

        this.state.ctx.restore();

        // Draw selection indicator when dragging
        if (this.state.isDragging) {
            this.state.ctx.strokeStyle = '#00ff00';
            this.state.ctx.lineWidth = 2;
            this.state.ctx.beginPath();
            this.state.ctx.arc(x, y, overlaySize / 2 + 5, 0, 2 * Math.PI);
            this.state.ctx.stroke();
        }
    }

    setOverlayPosition(x: number, y: number): void {
        this.state.overlayPosition.x = Math.max(0, Math.min(1, x));
        this.state.overlayPosition.y = Math.max(0, Math.min(1, y));
    }

    setOverlayScale(scale: number): void {
        this.state.overlayScale = Math.max(0.3, Math.min(3, scale));
    }

    resetOverlay(): void {
        this.state.overlayPosition = { x: 0.5, y: 0.5 };
        this.state.overlayScale = 1;
        this.state.overlayRotation = 0;
    }

    async captureComposite(): Promise<string> {
        if (!this.state.video || !this.state.canvas || !this.state.ctx) {
            return '';
        }

        this.state.isCapturing = true;

        // Create capture canvas
        const captureCanvas = document.createElement('canvas');
        const captureCtx = captureCanvas.getContext('2d');
        if (!captureCtx) return '';

        // Set capture canvas size to video resolution
        captureCanvas.width = this.state.video.videoWidth;
        captureCanvas.height = this.state.video.videoHeight;

        // Draw video frame
        captureCtx.drawImage(this.state.video, 0, 0);

        // Draw overlay at correct scale
        if (this.state.overlay) {
            const overlaySize = (80 * this.state.overlayScale * captureCanvas.width) / (this.state.canvas.width / window.devicePixelRatio);
            const x = this.state.overlayPosition.x * captureCanvas.width;
            const y = this.state.overlayPosition.y * captureCanvas.height;

            captureCtx.save();
            captureCtx.translate(x, y);
            captureCtx.rotate(this.state.overlayRotation);
            captureCtx.drawImage(
                this.state.overlay,
                -overlaySize / 2,
                -overlaySize / 2,
                overlaySize,
                overlaySize
            );
            captureCtx.restore();
        }

        this.state.isCapturing = false;

        // Return data URL
        return captureCanvas.toDataURL('image/jpeg', 0.8);
    }

    onCapture(callback: (dataUrl: string) => void): void {
        this.onCaptureCallback = callback;
    }

    async capture(): Promise<string> {
        const dataUrl = await this.captureComposite();
        if (this.onCaptureCallback) {
            this.onCaptureCallback(dataUrl);
        }
        return dataUrl;
    }

    cleanup(): void {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }

        // Remove event listeners would go here if we stored references

        this.state = {
            video: null,
            canvas: null,
            ctx: null,
            overlay: null,
            overlayPosition: { x: 0.5, y: 0.5 },
            overlayScale: 1,
            overlayRotation: 0,
            isDragging: false,
            isCapturing: false,
        };
    }
}