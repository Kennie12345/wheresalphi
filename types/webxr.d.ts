// WebXR type declarations

declare global {
    interface Navigator {
        xr?: XRSystem;
    }

    interface XRSystem {
        isSessionSupported(mode: XRSessionMode): Promise<boolean>;
        requestSession(mode: XRSessionMode, options?: XRSessionInit): Promise<XRSession>;
    }

    interface XRSession extends EventTarget {
        requestReferenceSpace(type: XRReferenceSpaceType): Promise<XRReferenceSpace>;
        requestHitTestSource?(options: XRHitTestOptionsInit): Promise<XRHitTestSource>;
        end(): Promise<void>;
    }

    interface XRFrame {
        getHitTestResults(hitTestSource: XRHitTestSource): XRHitTestResult[];
        getPose(space: XRSpace, baseSpace: XRSpace): XRPose | null;
    }

    interface XRHitTestSource {
        cancel(): void;
    }

    interface XRHitTestResult {
        getPose(baseSpace: XRSpace): XRPose | null;
    }

    interface XRPose {
        transform: XRRigidTransform;
    }

    interface XRRigidTransform {
        position: DOMPointReadOnly;
        orientation: DOMPointReadOnly;
        matrix: Float32Array;
    }

    interface XRSpace { }
    interface XRReferenceSpace extends XRSpace { }

    type XRSessionMode = 'immersive-vr' | 'immersive-ar' | 'inline';
    type XRReferenceSpaceType = 'viewer' | 'local' | 'local-floor' | 'bounded-floor' | 'unbounded';

    interface XRSessionInit {
        requiredFeatures?: string[];
        optionalFeatures?: string[];
    }

    interface XRHitTestOptionsInit {
        space: XRSpace;
        entityTypes?: string[];
    }
}

export { };