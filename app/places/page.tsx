"use client";

import { useState, Suspense } from "react";
import TreasureHunt from "@/components/TreasureHunt";
import { Button } from "@/components/ui/button";
import ReflectionsDialog from "@/components/ReflectionsDialog";

export default function PlacesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-red-50 via-blue-50 to-purple-50">
      {/* Header Section */}
      <div className="px-4 py-6 md:px-8 animate-in fade-in slide-in-from-top duration-700">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-red-600 drop-shadow-lg">
          WHERE'S ALPHI?
        </h1>
        <p className="text-gray-700">
          Find Alphi at different locations. Explore the map below to discover treasure spots,
          then visit them in person to collect reflections and earn rewards!
        </p>
      </div>

      {/* Treasure Hunt Section - Takes up remaining space */}
      <div className="flex-1 px-4 pb-4 md:px-8 animate-in fade-in slide-in-from-bottom duration-700 delay-300">
        <Suspense fallback={
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading treasure map...</p>
            </div>
          </div>
        }>
          <TreasureHunt />
        </Suspense>
      </div>

      {/* Button Section */}
      <div className="px-4 py-6 md:px-8 border-t bg-white/50 backdrop-blur-sm animate-in fade-in slide-in-from-bottom duration-700 delay-500">
        <Button
          size="lg"
          className="w-full md:w-auto md:min-w-[200px] bg-red-600 hover:bg-red-700 hover:scale-105 transition-all duration-200 shadow-xl hover:shadow-2xl"
          onClick={() => setIsDialogOpen(true)}
        >
          ARRIVED
        </Button>
      </div>

      {/* Reflections Dialog */}
      <ReflectionsDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
}
