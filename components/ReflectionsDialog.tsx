"use client";

import { useState } from "react";
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
    } catch (error) {
      console.error("Failed to submit reflections:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
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
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !reflections.trim()}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
