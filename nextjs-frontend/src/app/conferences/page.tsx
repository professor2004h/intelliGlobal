import Image from "next/image";
import Link from "next/link";
import { getConferences, getConferenceEvents, type ConferenceType, type ConferenceEventType } from "../getconferences";
import { PortableText } from "@portabletext/react";

export const metadata = {
  title: "Conferences | Intelli Global Conferences",
  description: "Discover our upcoming and featured conferences featuring leading experts, researchers, and professionals from around the world.",
  keywords: ["conferences", "academic conferences", "research events", "professional conferences", "global conferences", "upcoming events"],
};

export default async function ConferencesPage() {
  // Fetch conferences section content and events
  const [conferencesSection, conferenceEvents] = await Promise.all([
    getConferences(),
    getConferenceEvents(20) // Get up to 20 conferences
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Hero Section */}
      <section className="relative py-12 md:py-16 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
        {conferencesSection?.backgroundImage?.url ? (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-60"
            style={{
              backgroundImage: `url(${conferencesSection.backgroundImage.url})`,
            }}
          ></div>
        ) : (
          <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center opacity-10"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/60 to-slate-800/60"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <span className="inline-block px-4 py-2 bg-orange-500/20 text-white rounded-full text-sm font-semibold tracking-wide uppercase mb-6 backdrop-blur-sm border border-orange-400/30">
              Global Events
            </span>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              {conferencesSection?.title || (
                <>
                  Our
                  <span className="block text-white">
                    Conferences
                  </span>
                </>
              )}
            </h1>
            
            {conferencesSection?.description && (
              <div className="text-xl md:text-2xl text-white mb-8 leading-relaxed max-w-3xl mx-auto [&_*]:text-white [&_p]:text-white [&_span]:text-white">
                <PortableText value={conferencesSection.description} />
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/contact"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 hover:text-white transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact Us
              </Link>
              
              <Link
                href="/past-conferences"
                className="inline-flex items-center px-8 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 hover:text-white transition-all duration-200 backdrop-blur-sm border border-white/20 hover:border-white/30"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Past Conferences
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">{conferenceEvents.length}+</div>
              <div className="text-slate-600 font-medium">Total Conferences</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">50+</div>
              <div className="text-slate-600 font-medium">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">10K+</div>
              <div className="text-slate-600 font-medium">Participants</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">500+</div>
              <div className="text-slate-600 font-medium">Speakers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Conferences Grid */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {conferenceEvents && conferenceEvents.length > 0 ? (
            <>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                  Featured Conferences
                </h2>
                <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                  Join leading experts, researchers, and professionals from around the world at our carefully curated conferences.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {conferenceEvents.map((event) => (
                  <ConferenceCard key={event._id} event={event} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1m-6 0h8m-8 0l-2 9a2 2 0 002 2h8a2 2 0 002-2l-2-9m-8 0V9a2 2 0 012-2h4a2 2 0 012 2v0" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">No Conferences Available</h3>
                <p className="text-slate-600 mb-6">
                  We're currently updating our conference listings. Please check back soon or contact us for more information.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors duration-200"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-gradient-to-r from-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Join Our Next Conference?
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Don't miss out on networking opportunities, cutting-edge research presentations, and professional development sessions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Get Information
            </Link>
            <Link
              href="/sponsorship"
              className="inline-flex items-center px-8 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-200 backdrop-blur-sm border border-white/20 hover:border-white/30"
            >
              Become a Sponsor
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// Conference Card Component
function ConferenceCard({ event }: { event: ConferenceEventType }) {
  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-200 hover:border-orange-200 h-full">
      {event.imageUrl && (
        <div className="relative h-56 overflow-hidden">
          {event.conferenceImageUrl ? (
            <a
              href={event.conferenceImageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full h-full"
            >
              <Image
                src={event.imageUrl}
                alt={event.title}
                width={400}
                height={250}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
              />
            </a>
          ) : (
            <div className="w-full h-full">
              <Image
                src={event.imageUrl}
                alt={event.title}
                width={400}
                height={250}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
        </div>
      )}

      <div className="p-6">
        {event.conferenceImageUrl ? (
          <a
            href={event.conferenceImageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl font-bold text-slate-900 hover:text-orange-600 mb-3 leading-tight transition-colors duration-200 cursor-pointer block"
          >
            {event.title}
          </a>
        ) : (
          <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight">{event.title}</h3>
        )}

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-slate-600">
            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1m-6 0h8m-8 0l-2 9a2 2 0 002 2h8a2 2 0 002-2l-2-9m-8 0V9a2 2 0 012-2h4a2 2 0 012 2v0" />
            </svg>
            <span className="text-sm">{formattedDate}</span>
          </div>

          <div className="flex items-center text-slate-600">
            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-sm">{event.location}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          {event.registerNowUrl && (
            <a
              href={event.registerNowUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 transform hover:scale-105"
            >
              Register Now
            </a>
          )}

          {event.submitAbstractUrl && (
            <a
              href={event.submitAbstractUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-slate-100 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-200 transition-colors duration-200"
            >
              Submit Abstract
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
