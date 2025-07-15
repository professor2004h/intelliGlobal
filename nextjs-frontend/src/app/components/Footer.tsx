import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getSiteSettings, getImageUrl } from '../getSiteSettings';

export default async function Footer() {
  let siteSettings = null;

  try {
    siteSettings = await getSiteSettings();
  } catch (error) {
    console.error('Error fetching site settings for footer:', error);
  }

  return (
    <footer className="relative text-white bg-gray-900">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      
      {/* Content wrapper */}
      <div className="relative z-10">
        {/* Newsletter Section */}
        <div className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Subscribe to Our Newsletter</h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Stay updated with the latest conferences, research opportunities, and academic events.
              </p>
              <div className="max-w-md mx-auto flex">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 rounded-l-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 border border-gray-300"
                />
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-r-lg font-medium transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* Mobile-First Layout */}
          <div className="block lg:hidden">
            {/* Logo at top left for mobile */}
            <div className="mb-8">
              {siteSettings?.logo && getImageUrl(siteSettings.logo) ? (
                <Image
                  src={getImageUrl(siteSettings.logo) || ''}
                  alt={siteSettings.logo.alt || 'Intelli Global Conferences Logo'}
                  width={180}
                  height={54}
                  className="h-12 w-auto object-contain"
                  priority
                />
              ) : (
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-sm">IGC</span>
                  </div>
                  <h2 className="text-lg font-bold">Intelli Global Conferences</h2>
                </div>
              )}
            </div>

            {/* Mobile Contact Grid */}
            <div className="grid grid-cols-1 gap-6 mb-8">
              
              {/* Location */}
              <div className="flex items-center space-x-4 p-4 bg-gray-800 bg-opacity-50 rounded-lg">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold text-base">NewYork</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center space-x-4 p-4 bg-gray-800 bg-opacity-50 rounded-lg">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <a
                    href={`mailto:${siteSettings?.contactInfo?.email || "intelliglobalconferences@gmail.com"}`}
                    className="text-white font-medium text-sm hover:text-blue-300 transition-colors break-all"
                  >
                    {siteSettings?.contactInfo?.email || "intelliglobalconferences@gmail.com"}
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center space-x-4 p-4 bg-gray-800 bg-opacity-50 rounded-lg">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <a
                    href={`tel:${siteSettings?.contactInfo?.phone || "+919876543421"}`}
                    className="text-white font-medium text-sm hover:text-blue-300 transition-colors"
                  >
                    Phone: {siteSettings?.contactInfo?.phone || "+919876543421"}
                  </a>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-center space-x-4 p-4 bg-gray-800 bg-opacity-50 rounded-lg">
                <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <a
                    href={`https://wa.me/${(siteSettings?.contactInfo?.whatsapp || "919876543421").replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white font-medium text-sm hover:text-green-300 transition-colors"
                  >
                    WhatsApp: {siteSettings?.contactInfo?.whatsapp || "+919876543421"}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-4 gap-8">
            {/* Company Info with Logo */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                {/* Logo */}
                <div className="mb-6">
                  {siteSettings?.logo && getImageUrl(siteSettings.logo) ? (
                    <Image
                      src={getImageUrl(siteSettings.logo) || ''}
                      alt={siteSettings.logo.alt || 'Intelli Global Conferences Logo'}
                      width={200}
                      height={60}
                      className="h-12 sm:h-16 w-auto object-contain"
                      priority
                    />
                  ) : (
                    <div className="flex items-center">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-white font-bold text-lg sm:text-xl">IGC</span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold">Intelli Global Conferences</h2>
                    </div>
                  )}
                </div>
                <p className="text-gray-300 mb-6 max-w-md">
                  We at Intelli Global Conferences built an ecosystem that brings the Scholars, people in the Scientific Study & Research,
                  knowledge group of the society, the students, learners and more on a common ground – to share their knowledge,
                  on the scientific progress that brings along the benefits to humanity and to our existence itself.
                </p>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/conferences" className="text-gray-300 hover:text-white transition-colors">All Conferences</Link></li>
                <li><Link href="/past-conferences" className="text-gray-300 hover:text-white transition-colors">Past Conferences</Link></li>
                <li><Link href="/sponsorship" className="text-gray-300 hover:text-white transition-colors">Sponsorship</Link></li>
                <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact Us</Link></li>
              </ul>
            </div>

            {/* Contact Info - Desktop */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-blue-400 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-blue-400 font-medium text-sm mb-1">NewYork</p>
                    <p className="text-gray-300 text-sm">
                      {siteSettings?.contactInfo?.address || "7 Bell Yard, London, WC2A 2JR, United Kingdom"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <a
                    href={`mailto:${siteSettings?.contactInfo?.email || "intelliglobalconferences@gmail.com"}`}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {siteSettings?.contactInfo?.email || "intelliglobalconferences@gmail.com"}
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <a
                    href={`tel:${siteSettings?.contactInfo?.phone || "+919876543421"}`}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    Phone: {siteSettings?.contactInfo?.phone || "+919876543421"}
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  <a
                    href={`https://wa.me/${(siteSettings?.contactInfo?.whatsapp || "919876543421").replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    WhatsApp: {siteSettings?.contactInfo?.whatsapp || "+919876543421"}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                ©2025 Copyright Intelli Global Conferences. All Rights Reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Terms & Conditions
                </Link>
                <Link href="/faqs" className="text-gray-400 hover:text-white text-sm transition-colors">
                  FAQs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
