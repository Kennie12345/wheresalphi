"use client";

import Image from "next/image";

interface PlacesMapProps {
  className?: string;
}

export function PlacesMap({ className }: PlacesMapProps) {
  return (
    <div className={className}>
      <div className="relative w-full min-h-[400px] h-full rounded-lg overflow-hidden bg-muted">
        <Image
          src="/NorthsideConference.png"
          alt="Map showing Northside Conference Centre location"
          fill
          className="object-contain"
          priority
          sizes="100vw"
        />
      </div>
    </div>
  );
}
