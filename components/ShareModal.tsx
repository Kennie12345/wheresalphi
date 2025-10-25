"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Share2, Facebook, Instagram, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ShareModal({ open, onOpenChange }: ShareModalProps) {
  const [shareUrl] = useState(() => {
    if (typeof window !== "undefined") {
      return window.location.origin;
    }
    return "";
  });

  const shareText = "Check out Where's Alphi! Find Alphi at different locations around the world.";

  // Share to Facebook
  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  // Share to Instagram
  const shareToInstagram = () => {
    alert(
      "To share on Instagram:\n\n" +
      "1. Take a screenshot of your progress\n" +
      "2. Open Instagram app\n" +
      "3. Create a new post or story\n" +
      "4. Upload your screenshot\n" +
      "5. Add: " + shareText + "\n" +
      "6. Use hashtag #WheresAlphi"
    );
  };

  // Share to TikTok
  const shareToTikTok = () => {
    alert(
      "To share on TikTok:\n\n" +
      "1. Record your Where's Alphi adventure\n" +
      "2. Open TikTok app\n" +
      "3. Create a new video\n" +
      "4. Add: " + shareText + "\n" +
      "5. Use hashtag #WheresAlphi\n" +
      "6. Add link to your bio: " + shareUrl
    );
  };

  // Native Web Share API
  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Where's Alphi",
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        console.log("Share cancelled or failed", error);
      }
    } else {
      alert("Web Share is not supported. Please use the buttons below.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[60] bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-[50%] top-[50%] z-[60] grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
            "max-w-[95vw] sm:max-w-[500px]"
          )}
        >
          <DialogHeader>
            <div className="flex justify-center mb-2">
              <Share2 className="h-10 w-10 text-primary" />
            </div>
            <DialogTitle className="text-center text-2xl">Share Your Adventure</DialogTitle>
            <DialogDescription className="text-center">
              Share Where's Alphi with your friends
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Native Share Button (mobile) */}
            {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
              <>
                <Button
                  size="lg"
                  className="w-full"
                  onClick={shareNative}
                >
                  <Share2 className="mr-2 h-5 w-5" />
                  Share Now
                </Button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or choose platform
                    </span>
                  </div>
                </div>
              </>
            )}

            {/* Social Media Buttons */}
            <div className="space-y-3">
              <Button
                size="lg"
                variant="outline"
                className="w-full justify-start"
                onClick={shareToFacebook}
              >
                <Facebook className="mr-3 h-5 w-5 text-blue-600" />
                Share on Facebook
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="w-full justify-start"
                onClick={shareToInstagram}
              >
                <Instagram className="mr-3 h-5 w-5 text-pink-600" />
                Share on Instagram
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="w-full justify-start"
                onClick={shareToTikTok}
              >
                <svg
                  className="mr-3 h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
                Share on TikTok
              </Button>
            </div>

            {/* Copy Link */}
            <div className="pt-2 border-t">
              <p className="text-sm font-medium mb-2">Copy link:</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="flex-1 px-3 py-2 border rounded-md bg-muted text-sm"
                />
                <Button
                  variant="secondary"
                  onClick={() => {
                    navigator.clipboard.writeText(shareUrl);
                    alert("Link copied!");
                  }}
                >
                  Copy
                </Button>
              </div>
            </div>
          </div>

          <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </Dialog>
  );
}
