import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TeamPage() {
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

        {/* Header */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top duration-700">
          <h1 className="text-5xl font-bold text-red-600 mb-4">
            THE TEAM
          </h1>
          <p className="text-xl text-gray-600">
            Meet the people behind Where&apos;s Alphi?
          </p>
        </div>

        {/* Main content */}
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-700">
          {/* Concept Development - Moved to Top */}
          <section className="bg-red-600 rounded-lg shadow-xl p-6">
            <h2 className="text-xl font-bold text-white mb-3 text-center uppercase">
              Concept & Ideation Team
            </h2>
            <div className="flex justify-between px-3 text-white text-sm leading-loose text-center uppercase">
              <div>
                <p>Adrian Tam</p>
                <p>Nicole Malouf</p>
                <p>Laurence Adney</p>
                <p>Aditya Khandewal</p>
              </div>
              <div>
                <p>Jillian Lu</p>
                <p>Zara Ernest</p>
                <p>Aziza Green</p>
                <p>Ken Cheung</p>
              </div>
            </div>
          </section>

          {/* Team Behind Where's Alphi */}
          <section className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              The Team Behind Where&apos;s Alphi?
            </h2>

            <div className="space-y-6">
              {/* Project Coordinator */}
              <div className="border-l-4 border-red-600 pl-4">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Project Coordination
                </h3>
                <div className="bg-gray-50 rounded-lg p-3">
                  <h4 className="text-base font-semibold text-red-600 mb-1">
                    Adrian Tam
                  </h4>
                  <p className="text-xs text-gray-600 mb-1 italic">
                    Project Coordinator
                  </p>
                  <p className="text-gray-700 text-xs break-words">
                    Concept formulation and project coordination
                  </p>
                </div>
              </div>

              {/* Strategy & Execution */}
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Strategy & Execution
                </h3>
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <h4 className="text-base font-semibold text-orange-600 mb-1">
                      Paul Burley
                    </h4>
                    <p className="text-xs text-gray-600 mb-1 italic">
                      Product Manager & QA Lead
                    </p>
                    <p className="text-gray-700 text-xs break-words">
                      Project coordination, pitch development, asset management,
                      and quality assurance
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <h4 className="text-base font-semibold text-orange-600 mb-1">
                      Zara Ernest
                    </h4>
                    <p className="text-xs text-gray-600 mb-1 italic">
                      Marketing Strategist
                    </p>
                    <p className="text-gray-700 text-xs break-words">
                      Value proposition development and pitch narrative
                    </p>
                  </div>
                </div>
              </div>

              {/* Engineering */}
              <div className="border-l-4 border-blue-600 pl-4">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Engineering
                </h3>
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <h4 className="text-base font-semibold text-blue-600 mb-1">
                      Jillian Lu
                    </h4>
                    <p className="text-xs text-gray-600 mb-1 italic">
                      Full Stack Specialist Engineer
                    </p>
                    <p className="text-gray-700 text-xs break-words">
                      Interactive mapping, GPS proximity
                      detection logic, and AR image implementation. Full-Stack development and support.
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <h4 className="text-base font-semibold text-blue-600 mb-1">
                      Ken Cheung
                    </h4>
                    <p className="text-xs text-gray-600 mb-1 italic">
                      Lead Project Architect
                    </p>
                    <p className="text-gray-700 text-xs break-words">
                      Full-stack development, technical architecture, project management
                    </p>
                  </div>
                </div>
              </div>

              {/* Design & User Experience */}
              <div className="border-l-4 border-purple-600 pl-4">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Design & User Experience
                </h3>
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <h4 className="text-base font-semibold text-purple-600 mb-1">
                      Laurence Adney
                    </h4>
                    <p className="text-xs text-gray-600 mb-1 italic">
                      Lead Product Designer
                    </p>
                    <p className="text-gray-700 text-xs break-words">
                      User journey mapping, wireframes, visual design, and pitch
                      presentation design
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <h4 className="text-base font-semibold text-purple-600 mb-1">
                      Nicole Malouf
                    </h4>
                    <p className="text-xs text-gray-600 mb-1 italic">
                      Lead UX Designer
                    </p>
                    <p className="text-gray-700 text-xs break-words">
                      User experience flows, interaction design, wireframes, and
                      pitch presentation design
                    </p>
                  </div>
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
