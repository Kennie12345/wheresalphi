"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  MapPin,
  CheckCircle2,
  Circle,
  Trophy,
  BookOpen,
  Calendar,
  Sparkles,
  Share2,
  Star,
  MessageCircle,
  ThumbsUp,
  Users,
} from "lucide-react";
import { GameState, Spot, Collectible } from "@/lib/treasure-hunt/types";
import { loadProgress } from "@/lib/treasure-hunt/storage";
import { generateSpots } from "@/lib/treasure-hunt/spotGenerator";
import { REGIONS, COLLECTIBLES } from "@/lib/treasure-hunt/mockData";

// Mock data for location ratings and comments
interface LocationRating {
  spotId: string;
  averageRating: number;
  totalRatings: number;
  comments: Comment[];
}

interface Comment {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  text: string;
  createdAt: string;
  likes: number;
}

// Generate mock comments for locations
const generateMockComments = (spotId: string): LocationRating => {
  const mockUserNames = [
    "Sarah Chen",
    "Michael Johnson",
    "Emma Rodriguez",
    "David Kim",
    "Olivia Smith",
    "James Wilson",
  ];

  const mockCommentTexts = [
    "This location was absolutely beautiful! The verse really spoke to me in a profound way.",
    "What a peaceful spot. I spent 30 minutes here just reflecting and praying.",
    "Great experience! The connection between the location and the Bible verse was powerful.",
    "I came here with my family and we all had such meaningful conversations.",
    "The atmosphere here is perfect for quiet reflection. Highly recommend visiting early morning.",
    "This spot challenged my perspective and brought new insights to familiar scripture.",
  ];

  const numComments = Math.floor(Math.random() * 4) + 2;
  const comments: Comment[] = [];

  for (let i = 0; i < numComments; i++) {
    comments.push({
      id: `${spotId}-comment-${i}`,
      userName: mockUserNames[Math.floor(Math.random() * mockUserNames.length)],
      userAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${spotId}-${i}`,
      rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
      text: mockCommentTexts[Math.floor(Math.random() * mockCommentTexts.length)],
      createdAt: new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
      likes: Math.floor(Math.random() * 15),
    });
  }

  const totalRatings = Math.floor(Math.random() * 50) + 10;
  const averageRating = 4 + Math.random() * 0.9; // 4.0-4.9

  return {
    spotId,
    averageRating,
    totalRatings,
    comments: comments.sort((a, b) => b.likes - a.likes),
  };
};

// Star rating component
const StarRating = ({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" | "lg" }) => {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClasses[size]} ${
            star <= Math.floor(rating)
              ? "fill-yellow-400 text-yellow-400"
              : star - 0.5 <= rating
              ? "fill-yellow-400/50 text-yellow-400"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
    </div>
  );
};

export default function ProgressPage() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [locationRatings, setLocationRatings] = useState<Map<string, LocationRating>>(new Map());
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());

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

      // Generate mock ratings and comments for completed spots
      const ratings = new Map<string, LocationRating>();
      progress.completedSpotIds.forEach((spotId) => {
        ratings.set(spotId, generateMockComments(spotId));
      });
      setLocationRatings(ratings);
    }
    setIsLoading(false);
  }, []);

  const toggleComments = (spotId: string) => {
    setExpandedComments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(spotId)) {
        newSet.delete(spotId);
      } else {
        newSet.add(spotId);
      }
      return newSet;
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading progress...</p>
      </div>
    );
  }

  if (!gameState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="max-w-4xl mx-auto pt-8">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <MapPin className="w-16 h-16 text-gray-400 mb-4" />
              <h2 className="text-2xl font-bold mb-2">No Active Hunt</h2>
              <p className="text-gray-600 mb-6 text-center">
                Start your treasure hunt to track your progress!
              </p>
              <Button onClick={() => (window.location.href = "/places")}>
                Start Treasure Hunt
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const { spots, progress, collectibles, isCompleted } = gameState;
  const completionPercentage = (progress.completedSpotIds.length / 8) * 100;
  const collectedItems = collectibles.filter((c) =>
    progress.collectibles.includes(c.id)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6 pt-8">
        {/* Header */}
        <div className="text-center animate-in fade-in slide-in-from-top duration-700">
          <h1 className="text-3xl md:text-4xl font-bold text-red-600 drop-shadow-lg mb-2">
            YOUR PROGRESS
          </h1>
          <p className="text-gray-700">
            Track your journey through the hidden spots
          </p>
        </div>

        {/* Overall Progress Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Overall Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">
                  {progress.completedSpotIds.length} of 8 spots completed
                </span>
                <span className="text-sm font-medium">
                  {Math.round(completionPercentage)}%
                </span>
              </div>
              <Progress value={completionPercentage} className="h-3" />
            </div>

            {isCompleted && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-800">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-semibold">
                    Congratulations! You've completed the treasure hunt!
                  </span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {progress.completedSpotIds.length}
                </div>
                <div className="text-xs text-gray-600">Spots Visited</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {collectedItems.length}
                </div>
                <div className="text-xs text-gray-600">Collectibles</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {progress.reflections.length}
                </div>
                <div className="text-xs text-gray-600">Reflections</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {new Date(progress.startedAt).toLocaleDateString()}
                </div>
                <div className="text-xs text-gray-600">Started</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Collectibles Card */}
        {collectedItems.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                Collected Treasures
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {collectedItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col items-center p-4 rounded-lg border-2 transition-all hover:shadow-md"
                    style={{ borderColor: item.color }}
                  >
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center mb-2"
                      style={{ backgroundColor: item.color + "20" }}
                    >
                      <Sparkles
                        className="w-8 h-8"
                        style={{ color: item.color }}
                      />
                    </div>
                    <div className="text-sm font-semibold text-center">
                      {item.name}
                    </div>
                    <div className="text-xs text-gray-600 text-center mt-1">
                      {item.description}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Spots Progress Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-500" />
              Treasure Spots
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {spots.map((spot, index) => {
                const isCompleted = progress.completedSpotIds.includes(spot.id);
                const reflection = progress.reflections.find(
                  (r) => r.spotId === spot.id
                );
                const rating = locationRatings.get(spot.id);
                const commentsExpanded = expandedComments.has(spot.id);

                return (
                  <div
                    key={spot.id}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      isCompleted
                        ? "bg-green-50 border-green-200"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">
                        {isCompleted ? (
                          <CheckCircle2 className="w-6 h-6 text-green-600" />
                        ) : (
                          <Circle className="w-6 h-6 text-gray-400" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {spot.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {spot.verseRef}
                            </p>
                          </div>
                          <Badge
                            variant={isCompleted ? "default" : "outline"}
                            className="flex-shrink-0"
                          >
                            Spot {index + 1}/8
                          </Badge>
                        </div>

                        {/* Rating Section - only show for completed spots */}
                        {isCompleted && rating && (
                          <div className="mb-3 pb-3 border-b border-gray-200">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="flex items-center gap-2">
                                <StarRating rating={rating.averageRating} size="md" />
                                <span className="text-sm font-semibold text-gray-900">
                                  {rating.averageRating.toFixed(1)}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-gray-600">
                                <Users className="w-3 h-3" />
                                <span>{rating.totalRatings} ratings</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {isCompleted && (
                          <div className="text-sm space-y-3">
                            <p className="text-gray-700 italic line-clamp-2">
                              "{spot.verse}"
                            </p>

                            {reflection && (
                              <div className="bg-white p-3 rounded border border-green-200">
                                <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                                  <BookOpen className="w-3 h-3" />
                                  <span>Your reflection</span>
                                  <Calendar className="w-3 h-3 ml-auto" />
                                  <span>
                                    {new Date(
                                      reflection.createdAt
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-800">
                                  {reflection.text}
                                </p>
                              </div>
                            )}

                            {/* Community Comments Section */}
                            {rating && (
                              <div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => toggleComments(spot.id)}
                                  className="w-full"
                                >
                                  <MessageCircle className="w-4 h-4 mr-2" />
                                  {commentsExpanded ? "Hide" : "Show"} Community
                                  Reflections ({rating.comments.length})
                                </Button>

                                {commentsExpanded && (
                                  <div className="mt-3 space-y-3">
                                    {rating.comments.map((comment) => (
                                      <div
                                        key={comment.id}
                                        className="bg-white p-3 rounded-lg border border-gray-200"
                                      >
                                        <div className="flex items-start gap-3">
                                          <img
                                            src={comment.userAvatar}
                                            alt={comment.userName}
                                            className="w-8 h-8 rounded-full"
                                          />
                                          <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                              <span className="font-semibold text-sm text-gray-900">
                                                {comment.userName}
                                              </span>
                                              <StarRating
                                                rating={comment.rating}
                                                size="sm"
                                              />
                                            </div>
                                            <p className="text-sm text-gray-700 mb-2">
                                              {comment.text}
                                            </p>
                                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                              <span>
                                                {new Date(
                                                  comment.createdAt
                                                ).toLocaleDateString()}
                                              </span>
                                              <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                                                <ThumbsUp className="w-3 h-3" />
                                                <span>{comment.likes}</span>
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pb-8">
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/places")}
          >
            <MapPin className="w-4 h-4 mr-2" />
            Continue Hunt
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/history")}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            View History
          </Button>
          <Button variant="outline">
            <Share2 className="w-4 h-4 mr-2" />
            Share Progress
          </Button>
        </div>
      </div>
    </div>
  );
}
