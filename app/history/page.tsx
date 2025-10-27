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
  History,
  Award,
  Camera,
  Timer,
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
      <div className="min-h-screen bg-black p-4">
        <div className="max-w-4xl mx-auto pt-8">
          <Card className="bg-white border-red-600 border-2">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <History className="w-16 h-16 text-red-600 mb-4 animate-pulse" />
              <h2 className="text-2xl font-bold mb-2 text-black">No Visit History</h2>
              <p className="text-gray-700 mb-6 text-center">
                Complete some treasure hunt locations to see your history!
              </p>
              <Button
                onClick={() => (window.location.href = "/places")}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
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
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-4xl mx-auto space-y-6 pt-8 pb-8">
        {/* Header */}
        <div className="text-center animate-in fade-in slide-in-from-top duration-700">
          <h1 className="text-3xl md:text-4xl font-bold text-red-600 drop-shadow-lg mb-2">
            YOUR JOURNEY HISTORY
          </h1>
          <p className="text-white">
            A timeline of your treasure hunt adventures
          </p>
        </div>

        {/* Stats Summary Card */}
        <Card className="bg-white border-red-600 border-2 animate-in fade-in slide-in-from-bottom duration-700">
          <CardHeader className="bg-red-600">
            <CardTitle className="flex items-center gap-2 text-white">
              <Award className="w-5 h-5" />
              Journey Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-red-50 rounded-lg border-2 border-red-200 hover:border-red-600 transition-all hover:scale-105">
                <MapPin className="w-6 h-6 text-red-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-red-600">
                  {visitHistory.length}
                </div>
                <div className="text-xs text-gray-700 mt-1 font-medium">
                  Locations Visited
                </div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-red-600 transition-all hover:scale-105">
                <Timer className="w-6 h-6 text-black mx-auto mb-2" />
                <div className="text-2xl font-bold text-black">
                  {totalTimeSpent}
                </div>
                <div className="text-xs text-gray-700 mt-1 font-medium">
                  Minutes Exploring
                </div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg border-2 border-red-200 hover:border-red-600 transition-all hover:scale-105">
                <BookOpen className="w-6 h-6 text-red-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-red-600">
                  {visitHistory.filter((v) => v.reflection).length}
                </div>
                <div className="text-xs text-gray-700 mt-1 font-medium">
                  Reflections Written
                </div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-red-600 transition-all hover:scale-105">
                <Camera className="w-6 h-6 text-black mx-auto mb-2" />
                <div className="text-2xl font-bold text-black">
                  {totalPhotos}
                </div>
                <div className="text-xs text-gray-700 mt-1 font-medium">Photos Taken</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline Header */}
        <div className="flex items-center gap-2 px-4 animate-in fade-in slide-in-from-left duration-700">
          <History className="w-5 h-5 text-red-600" />
          <h2 className="text-xl font-semibold text-white">
            Visit Timeline
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-red-600 via-red-400 to-red-600 hidden md:block" />

          <div className="space-y-6">
            {visitHistory.map((visit, index) => {
              const collectible = visit.collectibleEarned
                ? COLLECTIBLES.find((c) => c.id === visit.collectibleEarned)
                : null;

              return (
                <div
                  key={visit.spot.id}
                  className="relative animate-in fade-in slide-in-from-right duration-700"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-6 top-6 w-5 h-5 rounded-full bg-red-600 border-4 border-white shadow-lg hidden md:block z-10 animate-pulse" />

                  <Card className="md:ml-16 hover:shadow-2xl transition-all hover:scale-[1.02] bg-white border-2 border-gray-200 hover:border-red-600">
                    <CardHeader className="pb-3 bg-gradient-to-r from-red-50 to-white">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <MapPin className="w-4 h-4 text-red-600" />
                            <CardTitle className="text-lg text-black">
                              {visit.spot.title}
                            </CardTitle>
                          </div>
                          <p className="text-sm text-gray-700 font-medium">
                            {visit.spot.verseRef}
                          </p>
                        </div>
                        <Badge variant="outline" className="flex-shrink-0 border-red-600 text-red-600">
                          Visit #{visitHistory.length - index}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Visit Details */}
                      <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                        <div className="flex items-center gap-1 font-medium">
                          <Calendar className="w-4 h-4 text-red-600" />
                          <span>{formatDate(visit.completedAt)}</span>
                        </div>
                        <div className="flex items-center gap-1 font-medium">
                          <Clock className="w-4 h-4 text-red-600" />
                          <span>{formatTime(visit.completedAt)}</span>
                        </div>
                        {visit.timeSpent && (
                          <div className="flex items-center gap-1 font-medium">
                            <Timer className="w-4 h-4 text-red-600" />
                            <span>{visit.timeSpent} min spent</span>
                          </div>
                        )}
                        {visit.photoCount && visit.photoCount > 0 && (
                          <div className="flex items-center gap-1 font-medium">
                            <Camera className="w-4 h-4 text-red-600" />
                            <span>{visit.photoCount} photos</span>
                          </div>
                        )}
                      </div>

                      {/* Bible Verse */}
                      <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-600">
                        <p className="text-sm text-gray-800 italic">
                          "{visit.spot.verse}"
                        </p>
                        <p className="text-xs text-gray-700 mt-2 font-bold">
                          — {visit.spot.verseRef}
                        </p>
                      </div>

                      {/* Collectible Earned */}
                      {collectible && (
                        <div className="flex items-center gap-3 p-3 rounded-lg border-2 border-red-200 bg-red-50 hover:border-red-600 transition-all">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-red-600">
                            <Sparkles className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-semibold text-black">
                              Collectible Earned: {collectible.name}
                            </div>
                            <div className="text-xs text-gray-700">
                              {collectible.description}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Reflection */}
                      {visit.reflection && (
                        <div className="bg-white p-4 rounded-lg border-2 border-red-200 hover:border-red-600 transition-all">
                          <div className="flex items-center gap-2 mb-2">
                            <BookOpen className="w-4 h-4 text-red-600" />
                            <span className="text-sm font-semibold text-black">
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
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all"
                        >
                          <Heart className="w-4 h-4 mr-1" />
                          Favorite
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all"
                        >
                          <MessageCircle className="w-4 h-4 mr-1" />
                          Add Note
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all"
                        >
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
          <div className="flex justify-center pt-4 animate-in fade-in slide-in-from-bottom duration-700">
            <Button
              size="lg"
              onClick={() => (window.location.href = "/places")}
              className="bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-2xl hover:scale-105 transition-all"
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
