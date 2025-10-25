import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";

// Import PlacesMap dynamically to prevent SSR issues with Leaflet
const PlacesMap = dynamic(
  () => import("@/components/places-map").then((mod) => mod.PlacesMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[500px] flex items-center justify-center bg-muted rounded-lg">
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    ),
  }
);

export default function PlacesPage() {

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

      {/* Map Section - Takes up remaining space */}
      <div className="flex-1 px-4 pb-4 md:px-8">
        <PlacesMap className="w-full h-full min-h-[400px] md:min-h-[500px]" />
      </div>

      {/* Button Section */}
      <div className="px-4 py-6 md:px-8 border-t">
        <Button
          size="lg"
          className="w-full md:w-auto md:min-w-[200px]"
          onClick={() => {
            // TODO: Implement arrival confirmation logic
            alert("Arrived! (Implementation pending)");
          }}
        >
          ARRIVED
        </Button>
      </div>
    </div>
  );
}
