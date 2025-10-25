"use client";

import { useState, Suspense } from "react";
import TreasureHunt from "@/components/TreasureHunt";
import { Button } from "@/components/ui/button";
import ReflectionsDialog from "@/components/ReflectionsDialog";

export default function PlacesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Section */}
      <div className="px-4 py-6 md:px-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Places</h1>
        <p className="text-muted-foreground">
          Find Alphi at different locations. Use the map below to navigate to
          the target location, then click "ARRIVED" when you reach your
          destination.
        </p>
      </div>

      {/* Treasure Hunt Section - Takes up remaining space */}
      <div className="flex-1 px-4 pb-4 md:px-8">
        <Suspense fallback={<div className="flex items-center justify-center h-full">Loading...</div>}>
          <TreasureHunt />
        </Suspense>
      </div>

      {/* Button Section */}
      <div className="px-4 py-6 md:px-8 border-t">
        <Button
          size="lg"
          className="w-full md:w-auto md:min-w-[200px]"
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
