"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Calendar,
  Clock,
  BookOpen,
  Image as ImageIcon,
  Heart,
  MessageCircle,
  Navigation,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { GameState, Spot, Reflection } from "@/lib/treasure-hunt/types";
import { loadProgress } from "@/lib/treasure-hunt/storage";
import { generateSpots } from "@/lib/treasure-hunt/spotGenerator";
import { REGIONS, COLLECTIBLES } from "@/lib/treasure-hunt/mockData";

interface VisitHistoryItem {
  spot: Spot;
  completedAt: string;
  reflection?: Reflection;
  collectibleEarned?: string;
  photoCount?: number;
  timeSpent?: number; // in minutes
}

export default function HistoryPage() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [visitHistory, setVisitHistory] = useState<VisitHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const progress = loadProgress();
    if (progress) {
      const region =
        REGIONS.find((r) => r.key === progress.regionKey) || REGIONS[0];
      const spots = generateSpots(region, progress.seed);

      setGameState({
        spots,
        progress,
        collectibles: COLLECTIBLES,
        isCompleted: progress.completedSpotIds.length === 8,
      });

      // Create mock visit history with timestamps
      const history: VisitHistoryItem[] = [];
      const baseTime = new Date(progress.startedAt).getTime();

      progress.completedSpotIds.forEach((spotId, index) => {
        const spot = spots.find((s) => s.id === spotId);
        if (!spot) return;

        const reflection = progress.reflections.find((r) => r.spotId === spotId);

        // Mock: Add 1-3 hours between each visit
        const hoursOffset = index * (2 + Math.random() * 4);
        const visitTime = new Date(baseTime + hoursOffset * 60 * 60 * 1000);

        // Mock: Random collectible earned (simplified)
        const collectibleEarned = progress.collectibles[index];

        history.push({
          spot,
          completedAt: visitTime.toISOString(),
          reflection,
          collectibleEarned,
          photoCount: Math.floor(Math.random() * 5) + 1,
          timeSpent: Math.floor(Math.random() * 20) + 5, // 5-25 minutes
        });
      });

      // Sort by completion time (most recent first)
      history.sort(
        (a, b) =>
          new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
      );

      setVisitHistory(history);
    }
    setIsLoading(false);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading history...</p>
      </div>
    );
  }

  if (!gameState || visitHistory.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="max-w-4xl mx-auto pt-8">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Clock className="w-16 h-16 text-gray-400 mb-4" />
              <h2 className="text-2xl font-bold mb-2">No Visit History</h2>
              <p className="text-gray-600 mb-6 text-center">
                Complete some treasure hunt locations to see your history!
              </p>
              <Button onClick={() => (window.location.href = "/places")}>
                Start Exploring
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const totalTimeSpent = visitHistory.reduce(
    (sum, item) => sum + (item.timeSpent || 0),
    0
  );
  const totalPhotos = visitHistory.reduce(
    (sum, item) => sum + (item.photoCount || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6 pt-8 pb-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Your Journey History
          </h1>
          <p className="text-gray-600">
            A timeline of your treasure hunt adventures
          </p>
        </div>

        {/* Stats Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              Journey Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {visitHistory.length}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  Locations Visited
                </div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {totalTimeSpent}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  Minutes Exploring
                </div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {visitHistory.filter((v) => v.reflection).length}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  Reflections Written
                </div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {totalPhotos}
                </div>
                <div className="text-xs text-gray-600 mt-1">Photos Taken</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline Header */}
        <div className="flex items-center gap-2 px-4">
          <Clock className="w-5 h-5 text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-900">
            Visit Timeline
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-300 via-purple-300 to-blue-300 hidden md:block" />

          <div className="space-y-6">
            {visitHistory.map((visit, index) => {
              const collectible = visit.collectibleEarned
                ? COLLECTIBLES.find((c) => c.id === visit.collectibleEarned)
                : null;

              return (
                <div key={visit.spot.id} className="relative">
                  {/* Timeline dot */}
                  <div className="absolute left-6 top-6 w-5 h-5 rounded-full bg-blue-500 border-4 border-white shadow-md hidden md:block z-10" />

                  <Card className="md:ml-16 hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <MapPin className="w-4 h-4 text-blue-600" />
                            <CardTitle className="text-lg">
                              {visit.spot.title}
                            </CardTitle>
                          </div>
                          <p className="text-sm text-gray-600">
                            {visit.spot.verseRef}
                          </p>
                        </div>
                        <Badge variant="outline" className="flex-shrink-0">
                          Visit #{visitHistory.length - index}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Visit Details */}
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(visit.completedAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatTime(visit.completedAt)}</span>
                        </div>
                        {visit.timeSpent && (
                          <div className="flex items-center gap-1">
                            <Navigation className="w-4 h-4" />
                            <span>{visit.timeSpent} min spent</span>
                          </div>
                        )}
                        {visit.photoCount && visit.photoCount > 0 && (
                          <div className="flex items-center gap-1">
                            <ImageIcon className="w-4 h-4" />
                            <span>{visit.photoCount} photos</span>
                          </div>
                        )}
                      </div>

                      {/* Bible Verse */}
                      <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                        <p className="text-sm text-gray-800 italic">
                          "{visit.spot.verse}"
                        </p>
                        <p className="text-xs text-gray-600 mt-2 font-medium">
                          — {visit.spot.verseRef}
                        </p>
                      </div>

                      {/* Collectible Earned */}
                      {collectible && (
                        <div
                          className="flex items-center gap-3 p-3 rounded-lg border-2"
                          style={{ borderColor: collectible.color + "40" }}
                        >
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{
                              backgroundColor: collectible.color + "20",
                            }}
                          >
                            <Sparkles
                              className="w-5 h-5"
                              style={{ color: collectible.color }}
                            />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-semibold">
                              Collectible Earned: {collectible.name}
                            </div>
                            <div className="text-xs text-gray-600">
                              {collectible.description}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Reflection */}
                      {visit.reflection && (
                        <div className="bg-white p-4 rounded-lg border-2 border-purple-200">
                          <div className="flex items-center gap-2 mb-2">
                            <BookOpen className="w-4 h-4 text-purple-600" />
                            <span className="text-sm font-semibold text-purple-900">
                              My Reflection
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">
                            {visit.reflection.text}
                          </p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <Button variant="ghost" size="sm" className="flex-1">
                          <Heart className="w-4 h-4 mr-1" />
                          Favorite
                        </Button>
                        <Button variant="ghost" size="sm" className="flex-1">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          Add Note
                        </Button>
                        <Button variant="ghost" size="sm" className="flex-1">
                          <Navigation className="w-4 h-4 mr-1" />
                          View on Map
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>

        {/* Continue Journey Button */}
        {gameState.progress.completedSpotIds.length < 8 && (
          <div className="flex justify-center pt-4">
            <Button
              size="lg"
              onClick={() => (window.location.href = "/places")}
            >
              <MapPin className="w-4 h-4 mr-2" />
              Continue Your Journey
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
