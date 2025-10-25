"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Camera,
  X,
  MapPin,
  Navigation,
  Scan,
  Sparkles,
  ArrowLeft,
  Target,
  Compass,
} from "lucide-react";
import { GameState, Spot } from "@/lib/treasure-hunt/types";
import { loadProgress } from "@/lib/treasure-hunt/storage";
import { generateSpots } from "@/lib/treasure-hunt/spotGenerator";
import { REGIONS } from "@/lib/treasure-hunt/mockData";

interface DetectedSpot {
  spot: Spot;
  distance: number;
  direction: string;
  angle: number;
}

export default function ARPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [detectedSpot, setDetectedSpot] = useState<DetectedSpot | null>(null);
  const [nearbySpots, setNearbySpots] = useState<DetectedSpot[]>([]);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [deviceOrientation, setDeviceOrientation] = useState({ alpha: 0, beta: 0, gamma: 0 });
  const [scanProgress, setScanProgress] = useState(0);

  // Load game state
  useEffect(() => {
    const progress = loadProgress();
    if (progress) {
      const region = REGIONS.find((r) => r.key === progress.regionKey) || REGIONS[0];
      const spots = generateSpots(region, progress.seed);

      setGameState({
        spots,
        progress,
        collectibles: [],
        isCompleted: false,
      });
    }
  }, []);

  // Initialize camera
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment", width: { ideal: 1920 }, height: { ideal: 1080 } },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraActive(true);
          setScanning(true);
        }
      } catch (error) {
        console.error("Camera access error:", error);
        setCameraError("Unable to access camera. Please grant camera permissions.");
      }
    };

    startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Request device orientation (for mobile)
  useEffect(() => {
    const requestOrientation = async () => {
      if (typeof (DeviceOrientationEvent as any)?.requestPermission === "function") {
        try {
          const permission = await (DeviceOrientationEvent as any).requestPermission();
          if (permission === "granted") {
            window.addEventListener("deviceorientation", handleOrientation);
          }
        } catch (error) {
          console.log("Orientation permission denied");
        }
      } else {
        window.addEventListener("deviceorientation", handleOrientation);
      }
    };

    requestOrientation();

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  const handleOrientation = (event: DeviceOrientationEvent) => {
    setDeviceOrientation({
      alpha: event.alpha || 0,
      beta: event.beta || 0,
      gamma: event.gamma || 0,
    });
  };

  // Mock AR detection logic
  useEffect(() => {
    if (!gameState || !scanning) return;

    const interval = setInterval(() => {
      // Simulate scanning progress
      setScanProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + 10;
      });

      // Mock detection based on time and orientation
      const uncompleted = gameState.spots.filter(
        (spot) => !gameState.progress.completedSpotIds.includes(spot.id)
      );

      if (uncompleted.length === 0) return;

      // Create mock nearby spots with random distances and directions
      const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
      const mockNearby: DetectedSpot[] = uncompleted.slice(0, 3).map((spot, idx) => {
        const distance = Math.random() * 500 + 50; // 50-550m
        const angle = (deviceOrientation.alpha + idx * 45) % 360;
        const directionIndex = Math.floor(angle / 45);

        return {
          spot,
          distance,
          direction: directions[directionIndex],
          angle,
        };
      });

      setNearbySpots(mockNearby);

      // Simulate spot detection when "looking" in the right direction
      const currentAngle = deviceOrientation.alpha;
      const tolerance = 30; // degrees

      const detected = mockNearby.find((ns) => {
        const angleDiff = Math.abs(ns.angle - currentAngle);
        return angleDiff < tolerance || angleDiff > (360 - tolerance);
      });

      if (detected && Math.random() > 0.7) {
        setDetectedSpot(detected);
        setScanning(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState, scanning, deviceOrientation]);

  const handleRescan = () => {
    setDetectedSpot(null);
    setScanning(true);
    setScanProgress(0);
  };

  const handleViewSpot = () => {
    if (detectedSpot) {
      window.location.href = `/places?spotId=${detectedSpot.spot.id}`;
    }
  };

  const handleBack = () => {
    window.location.href = "/places";
  };

  if (!gameState) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white text-center">
          <Camera className="w-16 h-16 mx-auto mb-4 animate-pulse" />
          <p>Loading AR...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Camera Feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Camera Error Overlay */}
      {cameraError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50">
          <Card className="p-6 max-w-md mx-4">
            <div className="text-center">
              <Camera className="w-16 h-16 mx-auto mb-4 text-red-500" />
              <h2 className="text-xl font-bold mb-2">Camera Access Required</h2>
              <p className="text-gray-600 mb-4">{cameraError}</p>
              <Button onClick={handleBack} className="w-full">
                Return to Map
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* AR Overlay */}
      {cameraActive && !cameraError && (
        <>
          {/* Top UI Bar */}
          <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent z-40">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                className="text-white hover:bg-white/20"
              >
                <ArrowLeft className="w-6 h-6" />
              </Button>
              <div className="flex items-center gap-2 text-white">
                <Compass className="w-5 h-5" />
                <span className="text-sm font-mono">
                  {Math.round(deviceOrientation.alpha)}°
                </span>
              </div>
            </div>
          </div>

          {/* Center Scanning Reticle */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
            <div className="relative">
              {/* Scanning Animation */}
              {scanning && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-64 border-4 border-blue-500 rounded-full animate-ping opacity-50" />
                  <div className="absolute w-48 h-48 border-4 border-blue-400 rounded-full animate-pulse" />
                </div>
              )}

              {/* Center Crosshair */}
              <div className="relative w-32 h-32">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white" />

                {/* Center Dot */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Nearby Spots Indicators */}
          <div className="absolute inset-0 pointer-events-none z-20">
            {nearbySpots.map((ns, idx) => {
              // Position indicators around the screen based on angle
              const angleRad = (ns.angle * Math.PI) / 180;
              const radius = 35; // % from center
              const x = 50 + radius * Math.sin(angleRad);
              const y = 50 - radius * Math.cos(angleRad);

              return (
                <div
                  key={ns.spot.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                  }}
                >
                  <div className="flex flex-col items-center gap-1 animate-pulse">
                    <div className="bg-blue-500/80 backdrop-blur-sm p-2 rounded-full">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div className="bg-black/80 backdrop-blur-sm px-2 py-1 rounded text-white text-xs whitespace-nowrap">
                      {Math.round(ns.distance)}m {ns.direction}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Scanning Status */}
          {scanning && !detectedSpot && (
            <div className="absolute bottom-32 left-0 right-0 flex flex-col items-center z-40">
              <div className="bg-black/80 backdrop-blur-sm px-6 py-3 rounded-full text-white">
                <div className="flex items-center gap-3">
                  <Scan className="w-5 h-5 animate-spin" />
                  <span className="font-medium">Scanning for treasure spots...</span>
                </div>
              </div>
              <div className="mt-4 w-64 bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-500 h-full transition-all duration-300"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Detected Spot Card */}
          {detectedSpot && (
            <div className="absolute bottom-0 left-0 right-0 p-4 z-50 animate-in slide-in-from-bottom duration-500">
              <Card className="bg-black/90 backdrop-blur-sm border-green-500 border-2 text-white overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 animate-pulse" />

                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-green-500 p-3 rounded-full animate-bounce">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-1 text-green-400">
                        Treasure Spot Found!
                      </h3>
                      <p className="text-gray-300 text-sm">
                        You've discovered a hidden location
                      </p>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-semibold">{detectedSpot.spot.title}</h4>
                      <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500">
                        <Target className="w-3 h-3 mr-1" />
                        {Math.round(detectedSpot.distance)}m
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400">{detectedSpot.spot.verseRef}</p>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={handleViewSpot}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    <Button
                      onClick={handleRescan}
                      variant="outline"
                      className="flex-1 border-white/30 text-white hover:bg-white/10"
                    >
                      <Scan className="w-4 h-4 mr-2" />
                      Keep Scanning
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Bottom Info Bar */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-center gap-4 z-30">
            {!detectedSpot && nearbySpots.length > 0 && (
              <div className="bg-black/80 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm">
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-blue-400" />
                  <span>{nearbySpots.length} spots nearby</span>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
