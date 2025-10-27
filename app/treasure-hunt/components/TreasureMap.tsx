'use client';

import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Locate, AlertCircle, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { GameState, Spot, Region } from '@/lib/treasure-hunt/types';
import SpotModal from './SpotModal';

// Custom Alphi marker icon - using WheresAlphi.png with red background
const defaultIcon = new Icon({
    iconUrl: '/WheresAlphi.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
    className: 'alphi-marker-red',
});

// Completed marker - using WheresAlphi.png with black background
const completedIcon = new Icon({
    iconUrl: '/WheresAlphi.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
    className: 'alphi-marker-black',
});

type LocationPermissionState = 'prompt' | 'granted' | 'denied' | 'unavailable';
type LocationStatus = 'idle' | 'requesting' | 'tracking' | 'error';

interface UserLocation {
    lat: number;
    lon: number;
    accuracy?: number;
    heading?: number | null;
}

interface TreasureMapProps {
    gameState: GameState;
    onGameStateUpdate: (gameState: GameState) => void;
    region: Region;
}

// Helper component to recenter map
function RecenterButton({ position, onClick }: { position: [number, number]; onClick: () => void }) {
    const map = useMap();

    const handleRecenter = () => {
        map.flyTo(position, 15, { duration: 1 });
        onClick();
    };

    return (
        <Button
            onClick={handleRecenter}
            size="sm"
            className="absolute bottom-24 right-4 z-[1000] bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
            title="Center on my location"
        >
            <Navigation className="w-4 h-4 mr-2" />
            My Location
        </Button>
    );
}

// Calculate distance between two points in meters using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

export default function TreasureMap({ gameState, onGameStateUpdate, region }: TreasureMapProps) {
    const searchParams = useSearchParams();
    const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
    const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
    const [locationStatus, setLocationStatus] = useState<LocationStatus>('idle');
    const [permissionState, setPermissionState] = useState<LocationPermissionState>('prompt');
    const [locationError, setLocationError] = useState<string | null>(null);
    const watchIdRef = useRef<number | null>(null);

    // Handle deep linking
    useEffect(() => {
        const spotId = searchParams.get('spotId');
        if (spotId) {
            const spot = gameState.spots.find(s => s.id === spotId);
            if (spot) {
                setSelectedSpot(spot);
            }
        }
    }, [searchParams, gameState.spots]);

    // Get user location with continuous tracking
    useEffect(() => {
        if (!('geolocation' in navigator)) {
            setPermissionState('unavailable');
            setLocationError('Geolocation is not supported by your browser');
            return;
        }

        setLocationStatus('requesting');

        // Success callback
        const onSuccess = (position: GeolocationPosition) => {
            setUserLocation({
                lat: position.coords.latitude,
                lon: position.coords.longitude,
                accuracy: position.coords.accuracy,
                heading: position.coords.heading,
            });
            setLocationStatus('tracking');
            setPermissionState('granted');
            setLocationError(null);
        };

        // Error callback
        const onError = (error: GeolocationPositionError) => {
            setLocationStatus('error');

            switch (error.code) {
                case error.PERMISSION_DENIED:
                    setPermissionState('denied');
                    setLocationError('Location permission denied. Please enable location access in your browser settings.');
                    break;
                case error.POSITION_UNAVAILABLE:
                    setLocationError('Location information unavailable. Please check your device settings.');
                    break;
                case error.TIMEOUT:
                    setLocationError('Location request timed out. Please try again.');
                    break;
                default:
                    setLocationError('An unknown error occurred while getting your location.');
            }
        };

        // Watch position for continuous updates
        const watchId = navigator.geolocation.watchPosition(
            onSuccess,
            onError,
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 30000
            }
        );

        watchIdRef.current = watchId;

        // Cleanup function
        return () => {
            if (watchIdRef.current !== null) {
                navigator.geolocation.clearWatch(watchIdRef.current);
            }
        };
    }, []);

    // Retry location access
    const retryLocationAccess = () => {
        setLocationError(null);
        setLocationStatus('requesting');

        if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current);
        }

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                setUserLocation({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    heading: position.coords.heading,
                });
                setLocationStatus('tracking');
                setPermissionState('granted');
                setLocationError(null);
            },
            (error) => {
                setLocationStatus('error');
                setLocationError('Unable to access location. Please check your settings.');
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 30000
            }
        );

        watchIdRef.current = watchId;
    };

    const isSpotCompleted = (spotId: string) => {
        return gameState.progress.completedSpotIds.includes(spotId);
    };

    const handleSpotClick = (spot: Spot) => {
        console.log('Spot clicked:', spot.title);
        setSelectedSpot(spot);
    };

    const handleModalClose = () => {
        setSelectedSpot(null);
    };

    console.log('TreasureMap render - selectedSpot:', selectedSpot?.title || 'none');

    return (
        <>
            {/* Location status banner */}
            {locationStatus === 'requesting' && (
                <div className="absolute top-0 left-0 right-0 bg-blue-600 text-white px-4 py-2 z-[1000] flex items-center justify-center gap-2">
                    <Locate className="w-4 h-4 animate-pulse" />
                    <span className="text-sm font-medium">Requesting location access...</span>
                </div>
            )}

            {locationError && permissionState !== 'granted' && (
                <div className="absolute top-0 left-0 right-0 bg-red-600 text-white px-4 py-3 z-[1000]">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-sm font-medium">{locationError}</p>
                            {permissionState === 'denied' && (
                                <p className="text-xs mt-1 opacity-90">
                                    To enable: Settings → Privacy → Location Services
                                </p>
                            )}
                        </div>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={retryLocationAccess}
                            className="bg-white text-red-600 hover:bg-red-50 border-white"
                        >
                            Retry
                        </Button>
                    </div>
                </div>
            )}

            <MapContainer
                center={[region.center.lat, region.center.lon]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                className="rounded-lg"
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {/* Region boundary circle */}
                <Circle
                    center={[region.center.lat, region.center.lon]}
                    radius={region.radiusM}
                    fillColor="red"
                    fillOpacity={0.1}
                    color="red"
                    weight={2}
                    opacity={0.3}
                />

                {/* Treasure spots */}
                {gameState.spots.map((spot) => {
                    const distance = userLocation
                        ? calculateDistance(userLocation.lat, userLocation.lon, spot.lat, spot.lon)
                        : null;
                    const distanceText = distance
                        ? distance < 1000
                            ? `${Math.round(distance)}m away`
                            : `${(distance / 1000).toFixed(1)}km away`
                        : '';

                    return (
                        <Marker
                            key={spot.id}
                            position={[spot.lat, spot.lon]}
                            icon={isSpotCompleted(spot.id) ? completedIcon : defaultIcon}
                            eventHandlers={{
                                click: () => handleSpotClick(spot),
                            }}
                        >
                            <Popup maxWidth={300} minWidth={200}>
                                <div className="text-left">
                                    <h3 className="font-bold text-base mb-2 text-red-600">{spot.title}</h3>
                                    {spot.history && (
                                        <>
                                            <p className="text-xs text-gray-800 mb-1 font-semibold">Theme: {spot.history.theme}</p>
                                            <p className="text-xs text-gray-700 mb-2">{spot.history.culturalSignificance}</p>
                                        </>
                                    )}
                                    {distanceText && (
                                        <p className="text-xs text-red-600 font-medium mb-2">📍 {distanceText}</p>
                                    )}
                                    {isSpotCompleted(spot.id) ? (
                                        <div className="bg-green-50 border border-green-600 rounded px-2 py-1 text-center">
                                            <p className="text-green-600 font-semibold text-xs">✓ Completed</p>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleSpotClick(spot)}
                                            className="mt-2 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded text-xs transition-colors"
                                        >
                                            Start Reflection
                                        </button>
                                    )}
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}

                {/* User location marker with accuracy circle */}
                {userLocation && (
                    <>
                        {/* Accuracy circle */}
                        {userLocation.accuracy && (
                            <Circle
                                center={[userLocation.lat, userLocation.lon]}
                                radius={userLocation.accuracy}
                                fillColor="#10B981"
                                fillOpacity={0.1}
                                color="#10B981"
                                weight={1}
                                opacity={0.3}
                            />
                        )}

                        {/* User position marker */}
                        <Marker
                            position={[userLocation.lat, userLocation.lon]}
                            icon={new Icon({
                                iconUrl: 'data:image/svg+xml;base64,' + btoa(`
                    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                      <!-- Outermost pulsing ring -->
                      <circle cx="20" cy="20" r="18" fill="#10B981" opacity="0.15">
                        <animate attributeName="r" values="18;22;18" dur="1.5s" repeatCount="indefinite"/>
                        <animate attributeName="opacity" values="0.15;0.05;0.15" dur="1.5s" repeatCount="indefinite"/>
                      </circle>
                      <!-- Middle pulsing ring -->
                      <circle cx="20" cy="20" r="14" fill="#10B981" opacity="0.25">
                        <animate attributeName="r" values="14;17;14" dur="1.5s" repeatCount="indefinite"/>
                        <animate attributeName="opacity" values="0.25;0.1;0.25" dur="1.5s" repeatCount="indefinite"/>
                      </circle>
                      <!-- Main green circle with blinking effect -->
                      <circle cx="20" cy="20" r="10" fill="#10B981" stroke="white" stroke-width="3">
                        <animate attributeName="opacity" values="1;0.6;1" dur="1s" repeatCount="indefinite"/>
                      </circle>
                      <!-- White exclamation mark -->
                      <text x="20" y="26" font-size="20" font-weight="bold" fill="white" text-anchor="middle">!</text>
                    </svg>
                  `),
                                iconSize: [40, 40],
                                iconAnchor: [20, 40],
                                className: 'user-location-marker',
                            })}
                            zIndexOffset={1000}
                        >
                            <Popup>
                                <div className="text-center">
                                    <p className="font-semibold">Your Location</p>
                                    {userLocation.accuracy && (
                                        <p className="text-xs text-gray-600 mt-1">
                                            Accuracy: ±{Math.round(userLocation.accuracy)}m
                                        </p>
                                    )}
                                </div>
                            </Popup>
                        </Marker>

                        {/* Recenter button */}
                        <RecenterButton
                            position={[userLocation.lat, userLocation.lon]}
                            onClick={() => console.log('Map recentered')}
                        />
                    </>
                )}
            </MapContainer>

            {selectedSpot && (
                <SpotModal
                    spot={selectedSpot}
                    gameState={gameState}
                    onGameStateUpdate={onGameStateUpdate}
                    onClose={handleModalClose}
                    userLocation={userLocation}
                />
            )}
        </>
    );
}