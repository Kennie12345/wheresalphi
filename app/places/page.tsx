"use client";

import { useState, Suspense } from "react";
import TreasureHunt from "@/components/TreasureHunt";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function PlacesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [reflections, setReflections] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement submission logic (e.g., save to database)
    console.log("Reflections submitted:", reflections);
    setIsDialogOpen(false);
    setReflections("");
  };

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
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Share your Alpha reflections</DialogTitle>
              <DialogDescription>
                Take a moment to reflect on your experience at this location.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Textarea
                placeholder="Share your thoughts and reflections..."
                value={reflections}
                onChange={(e) => setReflections(e.target.value)}
                className="min-h-[150px]"
                required
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
