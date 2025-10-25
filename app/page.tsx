import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full flex flex-col overflow-hidden bg-gradient-to-b from-blue-50 to-white">


      {/* Alphi character in the middle */}
      <div className="relative flex-col flex items-center justify-center px-6 py-8">
        <div className="relative w-full aspect-square">
          <Image
            src="/WheresAlphi.png"
            alt="Where's Alphi"
            fill
            className="object-contain drop-shadow-xl"
            priority
            quality={100}
          />
        </div>
        <div className="relative z-10 px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-red-600 drop-shadow-lg px-4 py-2">
            WHERE'S ALPHI?
          </h1>
        </div>
      </div>

      {/* Title at top */}


      {/* Buttons at bottom */}
      <div className="relative z-10 flex flex-col gap-4 px-6 pb-12 w-full max-w-md mx-auto">
        <Button
          asChild
          size="lg"
          className="text-lg px-8 py-6 shadow-xl hover:scale-105 transition-transform w-full bg-red-600 hover:bg-red-700"
        >
          <Link href="/protected">PLACES</Link>
        </Button>

        <Button
          asChild
          size="lg"
          variant="outline"
          className="text-lg px-8 py-6 shadow-xl hover:scale-105 transition-transform w-full border-red-600 text-red-600 hover:bg-red-50"
        >
          <Link href="/progress">PROGRESS</Link>
        </Button>
      </div>
    </main>
  );
}
