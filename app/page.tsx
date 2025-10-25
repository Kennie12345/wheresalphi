import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full flex flex-col overflow-hidden bg-gradient-to-b from-blue-50 to-white">
      {/* Alphi character in the middle */}
      <div className="relative flex-col flex items-center justify-center px-6 py-8 animate-in fade-in slide-in-from-top duration-700">
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
          <h1 className="text-4xl md:text-5xl font-bold text-red-600 drop-shadow-lg px-4 py-2 animate-in fade-in zoom-in duration-700 delay-300">
            WHERE'S ALPHI?
          </h1>
          <p className="text-gray-600 mt-2 animate-in fade-in slide-in-from-bottom duration-700 delay-500">
            Start your adventure to find Alphi!
          </p>
        </div>
      </div>

      {/* Buttons at bottom */}
      <div className="relative z-10 flex flex-col gap-4 px-6 pb-12 w-full max-w-md mx-auto animate-in fade-in slide-in-from-bottom duration-700 delay-700">
        <Button
          asChild
          size="lg"
          className="text-lg px-8 py-6 shadow-xl hover:scale-105 transition-all duration-200 w-full bg-red-600 hover:bg-red-700 hover:shadow-2xl"
        >
          <Link href="/places">PLACES</Link>
        </Button>

        <Button
          asChild
          size="lg"
          variant="outline"
          className="text-lg px-8 py-6 shadow-xl hover:scale-105 transition-all duration-200 w-full border-red-600 text-red-600 hover:bg-red-50 hover:shadow-2xl"
        >
          <Link href="/progress">PROGRESS</Link>
        </Button>
      </div>
    </main>
  );
}
