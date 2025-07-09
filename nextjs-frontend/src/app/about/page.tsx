import Image from "next/image";
import { getAboutUsContent } from "../getAboutUs";
import { PortableText } from "@portabletext/react";
import { getAboutPageStatistics, getDefaultStatistics } from "../getStatistics";
import StatisticsSection from "../components/StatisticsSection";

export const metadata = {
  title: "About Us - Intelli Global Conferences",
  description: "Learn more about Intelli Global Conferences and our mission to connect scholars, researchers, and professionals worldwide.",
};

export default async function AboutPage() {
  const about = await getAboutUsContent();
  const statistics = await getAboutPageStatistics();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              About
              <span className="block gradient-text bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
                Intelli Global Conferences
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Connecting minds, sharing knowledge, transforming the world through academic excellence
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
                {about?.title && (
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
                    {about.title}
                  </h2>
                )}
                
                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                  {about?.description ? (
                    <PortableText value={about.description} />
                  ) : (
                    <div className="space-y-6">
                      <p>
                        We at Intelli Global Conferences built an ecosystem that brings the Scholars, people in the Scientific Study & Research, 
                        knowledge group of the society, the students, learners and more on a common ground – to share their knowledge, 
                        on the scientific progress that brings along the benefits to humanity and to our existence itself.
                      </p>
                      
                      <p>
                        Our agile Platform enables stake holders to carry out listing, updating & promoting different events, conferences, 
                        knowledge sharing sessions, seminars on latest technological advancements, workshops for participants and more. 
                        With a large group of diverse subscribers from different academic backgrounds, that include subject matter experts, 
                        researchers, academicians and more from across the Globe.
                      </p>
                      
                      <p>
                        We are the pioneers in connecting people – bringing in the best minds to the table to resolve complex global human concerns 
                        to deliver simple usable solutions. We are in the critical path of bringing scientific innovations to the masses.
                      </p>
                      
                      <p>
                        Core to our business - are People, a pack of extraordinary associates, who passionately express themselves by providing 
                        an ecosystem that brings best minds together in the quest to solve complex Global concerns.
                      </p>
                      
                      <p>
                        Enable a Better World - with knowledge sharing among Global Citizens By enabling knowledge sharing platforms, 
                        establishing an ecosystem that sustains today agile demands, promoting collaboration & constructive sharing.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-8">
                {/* Image */}
                {about?.imageUrl && (
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <Image
                      src={about.imageUrl}
                      alt="About Intelli Global Conferences"
                      width={400}
                      height={300}
                      className="w-full h-64 object-cover"
                    />
                  </div>
                )}

                {/* Dynamic Statistics */}
                <StatisticsSection
                  data={statistics || getDefaultStatistics()}
                  className="shadow-lg"
                />

                {/* Contact Info */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-blue-600 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="text-gray-700 text-sm font-medium">Address</p>
                        <p className="text-gray-600 text-sm">7 Bell Yard, London, WC2A 2JR, United Kingdom</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      <div>
                        <p className="text-gray-700 text-sm font-medium">Email</p>
                        <a href="mailto:intelliglobalconferences@gmail.com" className="text-blue-600 hover:text-blue-800 text-sm">
                          intelliglobalconferences@gmail.com
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      <div>
                        <p className="text-gray-700 text-sm font-medium">WhatsApp</p>
                        <p className="text-gray-600 text-sm">+44 20 4571 8752</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-700">
                To create a global platform that connects scholars, researchers, and professionals, fostering knowledge sharing 
                and collaboration that drives scientific progress and benefits humanity.
              </p>
            </div>

            <div className="text-center p-8 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-700">
                To be the world&apos;s leading conference platform that transforms how knowledge is shared, enabling breakthrough
                discoveries and innovations that shape a better future for all.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
