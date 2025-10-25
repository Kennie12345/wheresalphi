'use client';

import { ArrowRight, MapPin, Clock, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlphaVenue } from '@/lib/treasure-hunt/types';

interface NextStepPanelProps {
    venue: AlphaVenue;
}

export default function NextStepPanel({ venue }: NextStepPanelProps) {
    const handleShareSuccess = () => {
        if (navigator.share) {
            navigator.share({
                title: 'I completed Alfie\'s Treasure Hunt!',
                text: 'I just found all 8 treasure spots and collected spiritual insights. Join me for the next step!',
                url: window.location.href,
            }).catch(console.error);
        } else {
            // Fallback for browsers without Web Share API
            const text = `I completed Alfie's Treasure Hunt! Join me for the next step: ${venue.name}`;
            if (navigator.clipboard) {
                navigator.clipboard.writeText(text);
                alert('Success message copied to clipboard!');
            }
        }
    };

    const handleGetDirections = () => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${venue.lat},${venue.lon}`;
        window.open(url, '_blank');
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4 z-40">
            <Card className="max-w-md mx-auto">
                <CardHeader className="pb-2">
                    <CardTitle className="text-center text-xl text-green-700">
                        🎉 Congratulations! 🎉
                    </CardTitle>
                    <p className="text-center text-gray-600">
                        You've completed Alfie's Treasure Hunt!
                    </p>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div className="text-center">
                        <h3 className="font-semibold text-lg mb-2">Your Next Step</h3>
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <h4 className="font-semibold text-blue-800">{venue.name}</h4>
                            <div className="flex items-center gap-1 mt-1 text-sm text-gray-600">
                                <MapPin className="w-3 h-3" />
                                <span>{venue.address}</span>
                            </div>
                            <p className="text-sm text-gray-700 mt-2">{venue.description}</p>
                        </div>
                    </div>

                    {/* Start Times */}
                    <div>
                        <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            Alpha Course Times
                        </h4>
                        <div className="space-y-1">
                            {venue.startTimes.map((time, index) => (
                                <div key={index} className="text-sm bg-gray-50 px-3 py-1 rounded">
                                    {time}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                        <Button onClick={handleGetDirections} variant="outline" size="sm">
                            <MapPin className="w-4 h-4 mr-1" />
                            Directions
                        </Button>
                        <Button onClick={handleShareSuccess} variant="outline" size="sm">
                            <Share2 className="w-4 h-4 mr-1" />
                            Share
                        </Button>
                    </div>

                    <Button className="w-full" size="lg">
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Join Alpha Course
                    </Button>

                    <p className="text-xs text-center text-gray-500">
                        Continue your spiritual journey with Alpha - exploring faith, friendship, and the meaning of life.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}