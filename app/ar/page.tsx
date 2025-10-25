'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Shield, Smartphone } from 'lucide-react';

// Simple camera component - no complex AR for now
const SimpleCamera = dynamic(() => import('./components/SimpleCamera'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p>Loading Camera...</p>
      </div>
    </div>
  ),
});

export default function ARPage() {
  const [isStarted, setIsStarted] = useState(false);
  const [isHttps, setIsHttps] = useState(false);

  // Check HTTPS requirement on mount
  useState(() => {
    setIsHttps(
      typeof window !== 'undefined' &&
      (window.location.protocol === 'https:' || window.location.hostname === 'localhost')
    );
  });

  if (!isHttps) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-4 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <Shield className="w-5 h-5" />
              HTTPS Required
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              Camera access requires a secure connection (HTTPS) for security reasons.
            </p>
            <div className="bg-red-50 p-3 rounded-lg">
              <p className="text-sm text-red-700 font-medium">
                Current: {typeof window !== 'undefined' ? window.location.protocol : 'unknown'}
              </p>
            </div>
            <p className="text-sm text-gray-600">
              Please access this page via HTTPS or use localhost for development.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Alfie AR Camera
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              Experience Alfie through your camera! This will:
            </p>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Smartphone className="w-4 h-4 text-blue-600" />
                <span>Access your device camera</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="w-4 h-4 text-center">📸</span>
                <span>Capture photos with Alfie</span>
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-1">Simple camera mode:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Live camera preview</li>
                <li>• Switch between front/back camera</li>
                <li>• Take photos</li>
              </ul>
            </div>

            <Button
              onClick={() => setIsStarted(true)}
              className="w-full"
              size="lg"
            >
              <Camera className="w-4 h-4 mr-2" />
              Start Camera
            </Button>

            <p className="text-xs text-gray-500 text-center">
              This will request camera permission. Make sure to allow access for the best experience.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <SimpleCamera />;
}