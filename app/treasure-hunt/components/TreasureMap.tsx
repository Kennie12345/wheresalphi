'use client';

import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { Icon } from 'leaflet';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { GameState, Spot, Region } from '@/lib/treasure-hunt/types';
import SpotModal from './SpotModal';
import VideoIntroModal from './VideoIntroModal';
import AlphaQuestionnaireModal from './AlphaQuestionnaireModal';

// Fix for default markers in Next.js
const defaultIcon = new Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

const completedIcon = new Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 0C5.6 0 0 5.6 0 12.5c0 12.5 12.5 28.5 12.5 28.5s12.5-16 12.5-28.5C25 5.6 19.4 0 12.5 0z" fill="#22c55e"/>
      <circle cx="12.5" cy="12.5" r="8" fill="white"/>
      <path d="M8.5 12.5l2 2 4-4" stroke="#22c55e" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `),
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

interface TreasureMapProps {
    gameState: GameState;
    onGameStateUpdate: (gameState: GameState) => void;
    region: Region;
}

export default function TreasureMap({ gameState, onGameStateUpdate, region }: TreasureMapProps) {
    const searchParams = useSearchParams();
    const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
    const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
    const [showVideoIntro, setShowVideoIntro] = useState(false);
    const [showQuestionnaire, setShowQuestionnaire] = useState(false);

    // Show video intro after 3 seconds on mount
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowVideoIntro(true);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

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

    // Get user location
    useEffect(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude,
                    });
                },
                (error) => {
                    console.warn('Could not get user location:', error);
                },
                { enableHighAccuracy: true, timeout: 10000 }
            );
        }
    }, []);

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

    const handleVideoComplete = () => {
        setShowVideoIntro(false);
        setShowQuestionnaire(true);
    };

    const handleQuestionnaireClose = () => {
        setShowQuestionnaire(false);
    };

    const handleQuestionnaireSubmit = (data: any) => {
        console.log('Alpha questionnaire submitted:', data);
        // Here you could send the data to your API
    };

    console.log('TreasureMap render - selectedSpot:', selectedSpot?.title || 'none');

    return (
        <>
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
                    fillColor="blue"
                    fillOpacity={0.1}
                    color="blue"
                    weight={2}
                    opacity={0.3}
                />

                {/* Treasure spots */}
                {gameState.spots.map((spot) => (
                    <Marker
                        key={spot.id}
                        position={[spot.lat, spot.lon]}
                        icon={isSpotCompleted(spot.id) ? completedIcon : defaultIcon}
                        eventHandlers={{
                            click: () => handleSpotClick(spot),
                        }}
                    >
                        <Popup>
                            <div className="text-center">
                                <h3 className="font-semibold">{spot.title}</h3>
                                <p className="text-sm text-gray-600">{spot.verseRef}</p>
                                {isSpotCompleted(spot.id) ? (
                                    <p className="text-green-600 font-medium mt-1">✓ Completed</p>
                                ) : (
                                    <p className="text-blue-600 font-medium mt-1">Click to explore</p>
                                )}
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* User location marker */}
                {userLocation && (
                    <Marker
                        position={[userLocation.lat, userLocation.lon]}
                        icon={new Icon({
                            iconUrl: 'data:image/svg+xml;base64,' + btoa(`
                <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="10" cy="10" r="8" fill="#3b82f6" stroke="white" stroke-width="2"/>
                  <circle cx="10" cy="10" r="3" fill="white"/>
                </svg>
              `),
                            iconSize: [20, 20],
                            iconAnchor: [10, 10],
                        })}
                    >
                        <Popup>Your Location</Popup>
                    </Marker>
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

            {showVideoIntro && (
                <VideoIntroModal
                    onComplete={handleVideoComplete}
                />
            )}

            {showQuestionnaire && (
                <AlphaQuestionnaireModal
                    onClose={handleQuestionnaireClose}
                    onSubmit={handleQuestionnaireSubmit}
                />
            )}
        </>
    );
}