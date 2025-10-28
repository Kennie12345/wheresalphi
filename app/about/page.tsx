"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function AboutPage() {
  const [isSolutionOpen, setIsSolutionOpen] = useState(false);
  const [isHowWesolveOpen, setIsHowWesolveOpen] = useState(false);
  const [isFunnelOpen, setIsFunnelOpen] = useState(false);
  const [isImpactOpen, setIsImpactOpen] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Back button */}
        <Button
          asChild
          variant="ghost"
          className="mb-6 bg-red-600 "
        >
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
          <div className=" flex p-2 items-center justify-center text-black my-8 rounded-lg uppercase text-center text-md font-bold">
            <Image src="/faithtech-logo.png" alt="FaithTech Logo" width={50} height={50} className="inline-block mr-2 " /><p className="max-w-80 break-words">A FaithTech Australia Hackathon 2025 Entry</p>
          </div>


        {/* Header */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top duration-700">
          <Image src="/3dWheresAlphi.png" alt="Where's Alphi Logo" width={200} height={100} className="mx-auto mb-4 " />
          <h1 className="text-5xl font-bold text-red-600 mb-4">
            WHERE&apos;S ALPHI?
          </h1>
          <p className="text-xl text-red-600">
            A Gamified Real-World Treasure Hunt Experience
          </p>
        </div>

        {/* Main content */}
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-700">
          {/* Problem Statement */}
          <section className="bg-red-50 rounded-lg shadow-lg p-8 border-l-4 border-red-600">
            <h2 className="text-3xl font-bold text-black mb-4">
              The Challenge
            </h2>
            <p className="text-gray-700 leading-relaxed italic mb-4">
              &quot;The next generation communicates, learns, and builds
              relationships differently. Reaching youth with Alpha requires
              tools that are engaging, safe, and relevant to their digital
              lives. Without intentional innovation, Alpha risks missing
              opportunities to empower young people to invite friends and
              explore faith together.&quot;
            </p>
            <p className="text-gray-600 text-sm font-bold">
              — Alpha Australia Problem Statement
            </p>
          </section>

          {/* Our Solution */}
          <section className="bg-white rounded-lg shadow-lg overflow-hidden">
            <button
              onClick={() => setIsSolutionOpen(!isSolutionOpen)}
              className="w-full p-8 flex items-center justify-between gap-4 text-left hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-3xl font-bold text-red-600 flex-1">
                Our Solution
              </h2>
              <ChevronDown
                className={`h-6 w-6 text-red-600 transition-transform flex-shrink-0 ${
                  isSolutionOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isSolutionOpen && (
              <div className="px-8 pb-8 animate-in fade-in slide-in-from-top duration-300">
                <p className="text-gray-700 leading-relaxed mb-4 break-words">
                  Where&apos;s Alphi? directly addresses this challenge by creating
                  a gamified, real-world treasure hunt experience that meets
                  teenagers where they are—digitally engaged yet craving authentic,
                  in-person connections.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4 break-words">
                  Built on the &quot;philosophy of Alpha,&quot; we provide all the
                  resources—the user&apos;s job is simply to bring their friends.
                  This low-barrier invitation model makes evangelism accessible and
                  non-threatening, perfectly suited for how Gen Z naturally shares
                  experiences.
                </p>
                <p className="text-gray-700 leading-relaxed break-words">
                  By combining digital technology with real-world exploration, we
                  tap into the next generation&apos;s growing desire for
                  &quot;higher friction&quot; personalized experiences that create
                  meaningful memories and genuine connection—all while naturally
                  leading them to take the next step with Alpha.
                </p>
              </div>
            )}
          </section>

          {/* How It Works */}
          <section className="bg-white rounded-lg shadow-lg overflow-hidden">
            <button
              onClick={() => setIsHowWesolveOpen(!isHowWesolveOpen)}
              className="w-full p-8 flex items-center justify-between gap-4 text-left hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-3xl font-bold text-red-600 flex-1">
                How We Solve It
              </h2>
              <ChevronDown
                className={`h-6 w-6 text-red-600 transition-transform flex-shrink-0 ${
                  isHowWesolveOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isHowWesolveOpen && (
              <div className="px-8 pb-8 animate-in fade-in slide-in-from-top duration-300">
                <div className="space-y-6 text-gray-700">
              <div className="border-l-4 border-red-200 pl-4">
                <h3 className="text-xl font-semibold text-red-600 mb-2">
                  Engaging & Relevant to Digital Lives
                </h3>
                <p className="leading-relaxed mb-2 break-words">
                  <strong>The Technology:</strong> A mobile web app leveraging
                  GPS, camera, and AR technology—tools teenagers already know
                  and love. Similar to Pokémon Go or an escape room, users
                  visit geolocations to unlock content and complete interactive
                  tasks.
                </p>
                <p className="leading-relaxed text-sm text-gray-600">
                  ✓ Meets youth where they are—on their phones
                </p>
              </div>

              <div className="border-l-4 border-red-200 pl-4">
                <h3 className="text-xl font-semibold text-red-600 mb-2">
                  Safe & Accessible
                </h3>
                <p className="leading-relaxed mb-2">
                  <strong>Local Clusters:</strong> The 8-location journey is
                  organized in regional clusters (Inner West, North Shore,
                  etc.) so teenagers with limited transport can complete the
                  entire experience safely in their local area, ideally with
                  friends.
                </p>
                <p className="leading-relaxed text-sm text-gray-600">
                  ✓ Removes barriers of distance and accessibility
                </p>
              </div>

              <div className="border-l-4 border-red-200 pl-4">
                <h3 className="text-xl font-semibold text-red-600 mb-2">
                  Empowers Invitation Culture
                </h3>
                <p className="leading-relaxed mb-2">
                  <strong>Built to Share:</strong> High sharing features let
                  users send photos, unlock special cards (&quot;Red
                  Alphi,&quot; &quot;red Alphi&quot;), and invite friends
                  naturally—the way Gen Z already communicates. The experience
                  is designed for groups, making it easy and fun to bring
                  friends along.
                </p>
                <p className="leading-relaxed text-sm text-gray-600">
                  ✓ Low-barrier invitation model that feels natural, not forced
                </p>
              </div>

              <div className="border-l-4 border-red-200 pl-4">
                <h3 className="text-xl font-semibold text-red-600 mb-2">
                  Builds Relationships Through Shared Experience
                </h3>
                <p className="leading-relaxed mb-2">
                  <strong>Real-World Connection:</strong> By requiring physical
                  presence at locations, we create space for authentic
                  conversations and shared memories—addressing the next
                  generation&apos;s hunger for genuine, in-person experiences
                  beyond screens.
                </p>
                <p className="leading-relaxed text-sm text-gray-600">
                  ✓ Digital tool that promotes offline relationship building
                </p>
              </div>

              <div className="border-l-4 border-red-200 pl-4">
                <h3 className="text-xl font-semibold text-red-600 mb-2">
                  Journey Together Through Content
                </h3>
                <p className="leading-relaxed mb-2">
                  <strong>Meaningful Exploration:</strong> Each location
                  features Life Essentials content (videos, Bible verses,
                  reflection questions) at beautiful, meditative spots. Users
                  share their reflections and read others&apos; thoughts,
                  creating community around the journey.
                </p>
                <p className="leading-relaxed text-sm text-gray-600">
                  ✓ Transforms faith exploration into an adventure with friends
                </p>
              </div>

              <div className="border-l-4 border-red-200 pl-4">
                <h3 className="text-xl font-semibold text-red-600 mb-2">
                  Gamification That Motivates
                </h3>
                <p className="leading-relaxed mb-2">
                  <strong>Progress & Achievement:</strong> Leaderboards,
                  achievements, collectible AR characters, and progress tracking
                  make the experience engaging and give users reasons to
                  complete the journey and bring friends back.
                </p>
                <p className="leading-relaxed text-sm text-gray-600">
                  ✓ Sustains engagement through the entire experience
                </p>
              </div>
                </div>
              </div>
            )}
          </section>

          {/* The Ultimate Goal */}
          <section className="bg-white rounded-lg shadow-lg overflow-hidden">
            <button
              onClick={() => setIsFunnelOpen(!isFunnelOpen)}
              className="w-full p-8 flex items-center justify-between gap-4 text-left hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-3xl font-bold text-red-600 flex-1 break-words">
                The Funnel: From Digital Discovery to In-Person Alpha
              </h2>
              <ChevronDown
                className={`h-6 w-6 text-red-600 transition-transform flex-shrink-0 ${
                  isFunnelOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isFunnelOpen && (
              <div className="px-8 pb-8 animate-in fade-in slide-in-from-top duration-300">
                <p className="text-gray-700 leading-relaxed mb-4 break-words">
                  Where&apos;s Alphi? isn&apos;t just a standalone experience—it&apos;s
                  a carefully designed taster and funnel. <strong>The end of the
                  digital journey is the beginning of the in-person one.</strong>
                </p>
                <p className="text-gray-700 leading-relaxed mb-4 break-words">
                  After completing all locations, users receive a clear,
                  natural call to action: experience Alpha in person with the
                  friends they&apos;ve journeyed with. The final location may even
                  be at a local Alpha course venue, creating a seamless bridge from
                  app to community.
                </p>
                <p className="text-gray-700 leading-relaxed break-words">
                  By this point, users have already experienced Alpha&apos;s
                  content, built relationships through the journey, and developed
                  the habit of exploring faith with friends—making the transition to
                  attending Alpha in person feel like the obvious next step, not a
                  leap.
                </p>
              </div>
            )}
          </section>

          {/* Impact Statement */}
          <section className="bg-red-600 rounded-lg shadow-xl overflow-hidden text-white">
            <button
              onClick={() => setIsImpactOpen(!isImpactOpen)}
              className="w-full p-8 flex items-center justify-between gap-4 text-left hover:bg-red-700 transition-colors"
            >
              <h2 className="text-3xl font-bold text-white flex-1">The Impact</h2>
              <ChevronDown
                className={`h-6 w-6 text-white transition-transform flex-shrink-0 ${
                  isImpactOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isImpactOpen && (
              <div className="px-8 pb-8 animate-in fade-in slide-in-from-top duration-300">
                <p className="text-lg leading-relaxed mb-4 break-words">
                  Where&apos;s Alphi? solves Alpha Australia&apos;s core
                  challenge: we&apos;ve created a tool that is simultaneously
                  engaging, safe, and relevant to how the next generation lives.
                </p>
                <p className="text-lg leading-relaxed mb-4 break-words">
                  More importantly, we&apos;ve empowered young people to do what
                  they naturally want to do—invite friends to share meaningful
                  experiences—while removing the intimidation factor from faith
                  conversations.
                </p>
                <p className="text-xl leading-relaxed font-semibold break-words">
                  This isn&apos;t just innovation for innovation&apos;s sake.
                  It&apos;s intentional design that meets the next generation where
                  they are and walks with them toward Alpha.
                </p>
              </div>
            )}
          </section>

          {/* FaithTech Hackathon */}
          <section className="bg-white rounded-lg shadow-lg p-8 ring ring-yellow-300 text-center">
            <div className="flex flex-col md:flex-row items-center gap-8">
              
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
                  FaithTech Australian Hackathon 2025
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  This project was created as an entry for the <strong>FaithTech Australian Hackathon 2025</strong>,
                  a collaborative event bringing together technologists, designers, and innovators
                  to build solutions that serve the church and advance the Kingdom.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  FaithTech is a global community of Christians in tech, working at the intersection
                  of faith and technology to create meaningful impact. Through hackathons,
                  workshops, and local gatherings, FaithTech empowers believers to use their
                  technical skills for God&apos;s glory.
                </p>
                <div className="mt-4">
                  <Button
                    asChild
                    variant="outline"
                    className="border-yellow-300 text-black hover:bg-yellow-50 bg-yellow-300"
                  >
                    <Link href="https://faithtech.com" target="_blank" rel="noopener noreferrer">
                      Learn More About FaithTech
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <div className="text-center py-8">
            <Button
              asChild
              size="lg"
              className="text-lg px-8 py-6 shadow-xl hover:scale-105 transition-all duration-200 bg-red-600 hover:bg-red-600 text-white uppercase bold font-mono" 
            >
              <Link href="/places">Start Your Adventure</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
