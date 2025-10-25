"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import ShareModal from "@/components/ShareModal";
import { Share2 } from "lucide-react";

export default function SharePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-4">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Share Demo Page</h1>
        <p className="text-muted-foreground">
          Click the button below to open the share modal
        </p>
        <Button size="lg" onClick={() => setIsModalOpen(true)}>
          <Share2 className="mr-2 h-5 w-5" />
          Open Share Modal
        </Button>
      </div>

      <ShareModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
}
