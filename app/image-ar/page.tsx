"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Camera, Upload, CheckCircle2, Sparkles, X, Share2 } from "lucide-react";
import Image from "next/image";
import ShareModal from "@/components/ShareModal";
import { useRouter } from "next/navigation";

// Dynamically import camera component (no SSR)
const ARCameraComponent = dynamic(() => import('./components/ARCameraComponent'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-lg">Loading Camera...</p>
      </div>
    </div>
  ),
});

export default function ImageARPage() {
  const router = useRouter();
  const [cameraMode, setCameraMode] = useState<'intro' | 'camera' | 'processing'>('intro');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [arComplete, setArComplete] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Simulate AR detection success after a delay
  useEffect(() => {
    if (capturedImage && isProcessing) {
      const timer = setTimeout(() => {
        setIsProcessing(false);
        setArComplete(true);
        // Auto-show share modal after AR completes (also shows manual share button)
        setTimeout(() => {
          setShowShareModal(true);
        }, 1500);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [capturedImage, isProcessing]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCapturedImage(e.target?.result as string);
        setIsProcessing(true);
        setCameraMode('processing');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUseCameraClick = () => {
    setCameraMode('camera');
  };

  const handleCameraCancel = () => {
    setCameraMode('intro');
  };

  const handlePhotoCapture = (imageDataUrl: string) => {
    setCapturedImage(imageDataUrl);
    setIsProcessing(true);
    setCameraMode('processing');
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setArComplete(false);
    setIsProcessing(false);
    setCameraMode('intro');
  };

  const handleShareModalClose = (open: boolean) => {
    setShowShareModal(open);
    // If modal is closed, navigate to history page
    if (!open) {
      setTimeout(() => {
        router.push("/history");
      }, 300);
    }
  };

  // Show camera component in full screen
  if (cameraMode === 'camera') {
    return (
      <ARCameraComponent
        onPhotoCapture={handlePhotoCapture}
        onCancel={handleCameraCancel}
        theme="wheres-alphi"
        arOverlayImage="/3dWheresAlphi.png"
        showAROverlay={true}
      />
    );
  }

  return (
    <div className="min-h-screen bg-red-600 p-4">
      <div className="max-w-2xl mx-auto pt-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 animate-in fade-in slide-in-from-top duration-500">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">
            FIND ALPHI!
          </h1>
          <p className="text-white text-lg">
            Take a photo of the location to find Alphi hiding in the scene
          </p>
        </div>

        {/* Main AR Card */}
        <Card className="animate-in fade-in slide-in-from-bottom duration-700 bg-white border-2 border-black">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-black">
              <Camera className="w-5 h-5 text-red-600" />
              AR Photo Finder
            </CardTitle>
            <CardDescription className="text-black">
              Capture the moment and we'll reveal where Alphi is hiding!
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Image Preview Area */}
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden border-2 border-dashed border-black">
              {capturedImage ? (
                <>
                  <Image
                    src={capturedImage}
                    alt="Captured location"
                    fill
                    className="object-cover"
                  />

                  {/* Processing Overlay */}
                  {isProcessing && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center animate-in fade-in duration-300">
                      <div className="text-center text-white">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-3"></div>
                        <p className="text-lg font-semibold">Finding Alphi...</p>
                      </div>
                    </div>
                  )}

                  {/* Success Overlay with Alphi Marker */}
                  {arComplete && (
                    <div className="absolute inset-0 animate-in fade-in zoom-in duration-500">
                      {/* Alphi marker - positioned randomly for demo */}
                      <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="relative animate-bounce">
                          <div className="absolute -inset-4 bg-red-500 rounded-full opacity-25 animate-ping"></div>
                          <div className="relative bg-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg">
                            <Sparkles className="w-6 h-6" />
                          </div>
                        </div>
                        <div className="mt-2 bg-white px-3 py-1 rounded-full shadow-lg">
                          <p className="text-sm font-bold text-red-600">Found Alphi!</p>
                        </div>
                      </div>

                      {/* Success Badge */}
                      <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-in slide-in-from-right duration-500">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="font-semibold">Success!</span>
                      </div>
                    </div>
                  )}

                  {/* Retake Button */}
                  {!isProcessing && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRetake}
                      className="absolute top-2 left-2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Retake
                    </Button>
                  )}
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <Camera className="w-16 h-16 mb-2" />
                  <p className="text-sm">No image captured yet</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {!capturedImage && cameraMode === 'intro' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-in fade-in slide-in-from-bottom duration-700 delay-200">
                <Button
                  size="lg"
                  onClick={handleUseCameraClick}
                  className="w-full bg-white border-2 border-red-600 text-black hover:bg-red-600 hover:text-white hover:scale-105 transition-all duration-200"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Use Camera
                </Button>

                <label htmlFor="file-upload" className="w-full">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full bg-white border-2 border-black text-black hover:bg-black hover:text-white hover:scale-105 transition-all duration-200"
                    asChild
                  >
                    <div>
                      <Upload className="w-5 h-5 mr-2" />
                      Upload Photo
                    </div>
                  </Button>
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>
            )}

            {/* Success Message & Actions */}
            {arComplete && (
              <div className="space-y-3">
                <div className="bg-white border-2 border-black rounded-lg p-4 animate-in fade-in slide-in-from-bottom duration-500">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-black mb-1">
                        You Found Alphi!
                      </h3>
                      <p className="text-sm text-black">
                        Great job! Alphi was hiding in this location. Share your discovery with friends!
                      </p>
                    </div>
                  </div>
                </div>

                {/* Share Button */}
                <Button
                  size="lg"
                  onClick={() => setShowShareModal(true)}
                  className="w-full bg-white border-2 border-red-600 text-black hover:bg-red-600 hover:text-white hover:scale-105 transition-all delay-200"
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  Share Your Discovery
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions Card */}
        {!capturedImage && cameraMode === 'intro' && (
          <Card className="animate-in fade-in slide-in-from-bottom duration-700 delay-300 bg-white border-2 border-black">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-black">
                <Sparkles className="w-5 h-5 text-red-600" />
                How it works
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-7 h-7 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md">
                    1
                  </span>
                  <div>
                    <p className="font-semibold text-black">Capture or Upload</p>
                    <p className="text-black">Take a photo with your camera or upload an existing photo of the location</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-7 h-7 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md">
                    2
                  </span>
                  <div>
                    <p className="font-semibold text-black">AR Detection</p>
                    <p className="text-black">Our AR technology will analyze the image to find where Alphi is hiding</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-7 h-7 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md">
                    3
                  </span>
                  <div>
                    <p className="font-semibold text-black">Share & Celebrate</p>
                    <p className="text-black">Share your discovery with friends and view your complete journey history!</p>
                  </div>
                </li>
              </ol>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Share Modal */}
      <ShareModal open={showShareModal} onOpenChange={handleShareModalClose} />
    </div>
  );
}
