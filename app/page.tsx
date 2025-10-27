import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Where's Alphi? - Start Your Adventure",
  description: "A gamified real-world treasure hunt experience that meets teenagers where they are. Built on the philosophy of Alpha, we provide all the resources—your job is simply to bring your friends. Explore Alpha through an interactive adventure combining digital technology with real-world exploration.",
  openGraph: {
    title: "Where's Alphi? - Start Your Adventure",
    description: "Built on the philosophy of Alpha - a gamified treasure hunt that combines digital engagement with real-world exploration. Bring your friends and start your journey today!",
    url: 'https://wheresalphi.vercel.app',
    images: [
      {
        url: 'https://wheresalphi.vercel.app/og-whatsapp.jpg',
        width: 1200,
        height: 630,
        alt: "Where's Alphi - Interactive treasure hunt adventure",
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Where's Alphi? - Start Your Adventure",
    description: "A gamified treasure hunt that meets Gen Z where they are. Explore Alpha with friends through an interactive real-world adventure.",
    images: ['https://wheresalphi.vercel.app/og-whatsapp.jpg'],
  },
};

export default function Home() {
  return (
    <main className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-red-600">
      {/* Alphi character in the middle */}
      <div className='p-2'>
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
        </div>
      <div className="relative flex-col flex items-center justify-center px-6 py-8 animate-in fade-in slide-in-from-top duration-700">
        
        <div className="relative z-10 px-6 text-center">
          <h1 className="text-7xl font-bold text-white drop-shadow-lg px-4 py-2 animate-in fade-in zoom-in duration-700 delay-300">
            WHERE'S ALPHI?
          </h1>
          <p className="text-white mt-2 animate-in fade-in slide-in-from-bottom duration-700 delay-500 uppercase font-semibold tracking-wide">
            Start your adventure now!
          </p>
        </div>
              
      <div className="relative z-10 mt-4 flex flex-col gap-4 px-6 pb-12 w-full max-w-md mx-auto animate-in fade-in slide-in-from-bottom duration-700 delay-700">
                <Button
          asChild
          size="lg"
          className="text-lg px-8 py-6 shadow-xl w-full bg-white text-red-700 bold hover:bg-gray-50 hover:shadow-2xl"
        >
          <Link 
href="/places"> <p className="animate font-bold animate-pulse transition-all duration-200"           style={{ animationDuration: '3s' }}> START</p></Link>
        </Button>

        <Button
          asChild
          size="lg"
          className="text-lg px-8 py-6 shadow-xl transition-all duration-200 w-full bg-white text-black bold hover:bg-gray-50 hover:shadow-2xl"
        >
          <Link href="/progress">PROGRESS</Link>
        </Button>
</div></div>


      {/* Buttons at bottom */}
      <div className="relative z-10 flex flex-col gap-4 px-6 pb-12 w-full max-w-md mx-auto animate-in fade-in slide-in-from-bottom duration-700 delay-700">


        <Button
          asChild
          size="lg"
          className="text-lg px-8 py-6 shadow-xl transition-all duration-200 w-full bg-black text-white bold hover:bg-red-600 hover:shadow-2xl hover:border-white hover:border"
        >
          <Link href="/about">ABOUT</Link>
        </Button>

        <Button
          asChild
          size="lg"
          className="text-lg px-8 py-6 shadow-xl transition-all duration-200 w-full bg-black text-white bold hover:bg-red-600 hover:shadow-2xl hover:border-white hover:border"
        >
          <Link href="/team">TEAM</Link>
        </Button>

      </div>
    </main>
  );
}
