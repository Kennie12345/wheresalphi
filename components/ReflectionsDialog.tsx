"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReflectionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  spotTitle?: string;
  spotId?: string;
  onSubmit?: (reflection: string) => void | Promise<void>;
}

export default function ReflectionsDialog({
  open,
  onOpenChange,
  spotTitle = "this location",
  spotId,
  onSubmit,
}: ReflectionsDialogProps) {
  const [reflections, setReflections] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showVideo, setShowVideo] = useState(true); // Start with video visible

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (onSubmit) {
        await onSubmit(reflections);
      } else {
        // Default behavior: log to console
        console.log("Reflections submitted:", { spotId, spotTitle, reflections });
      }
      onOpenChange(false);
      setReflections("");
      setShowVideo(true); // Reset video for next time
    } catch (error) {
      console.error("Failed to submit reflections:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setShowVideo(true); // Reset video for next time
  };

  // Full-screen video overlay (appears first when dialog opens)
  const videoOverlay = open && showVideo && typeof document !== 'undefined' ? createPortal(
    <div className="fixed inset-0 bg-black z-[3000] flex items-center justify-center">
      <div className="relative w-full h-full flex items-center justify-center p-4">
        <Button
          onClick={() => setShowVideo(false)}
          variant="ghost"
          className="absolute top-4 right-4 text-white hover:bg-white/20 z-[3001]"
        >
          <X className="w-6 h-6" />
        </Button>
        <div className="text-center">
          <div className="w-full max-w-4xl aspect-video bg-gray-900 rounded-lg flex items-center justify-center mb-4">
            <span className="text-white text-2xl">📹 Video Placeholder</span>
          </div>
          <p className="text-white text-sm">Video content would be loaded here</p>
          <Button
            onClick={() => setShowVideo(false)}
            className="mt-4"
          >
            Continue to Reflections
          </Button>
        </div>
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <>
      {videoOverlay}
      {!showVideo && (
        <Dialog open={open} onOpenChange={handleClose}>
          <DialogPrimitive.Portal>
            <DialogPrimitive.Overlay className="fixed inset-0 z-[60] bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
            <DialogPrimitive.Content
              className={cn(
                "fixed left-[50%] top-[50%] z-[60] grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
                "sm:max-w-[500px]"
              )}
            >
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Share your Alpha reflections</DialogTitle>
                  <DialogDescription>
                    Take a moment to reflect on your experience at {spotTitle}.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Textarea
                    placeholder="Share your thoughts and reflections..."
                    value={reflections}
                    onChange={(e) => setReflections(e.target.value)}
                    className="min-h-[150px]"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting || !reflections.trim()}>
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </Button>
                </DialogFooter>
              </form>
              <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </DialogPrimitive.Close>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        </Dialog>
      )}
    </>
  );
}
