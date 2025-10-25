import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/WheresAlphi.png"
          alt="Where's Alphi"
          fill
          className="object-cover"
          priority
          quality={100}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-6 px-6 py-12 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-foreground drop-shadow-lg text-red-600 bg-white/70 px-4 py-2 rounded-lg">
          Hello Alphi!
        </h1>

        <Button
          asChild
          size="lg"
          className="text-lg px-8 py-6 shadow-xl hover:scale-105 transition-transform"
        >
          <Link href="/protected">Find Alphi</Link>
        </Button>
      </div>
    </main>
  );
}
