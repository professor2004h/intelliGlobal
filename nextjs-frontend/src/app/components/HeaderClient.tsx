'use client';

import { useState } from 'react';
import Link from 'next/link';
import { type SiteSettings } from '../getSiteSettings';

interface HeaderClientProps {
  siteSettings: SiteSettings | null;
}

export default function HeaderClient({ siteSettings }: HeaderClientProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-4 lg:space-x-6 xl:space-x-8">
        <Link
          href="/"
          className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
        >
          Home
        </Link>
        <Link
          href="/about"
          className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
        >
          About Us
        </Link>
        <Link
          href="/conferences"
          className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
        >
          All Conferences
        </Link>
        <Link
          href="/past-conferences"
          className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
        >
          Past Conferences
        </Link>
        <Link
          href="/gallery"
          className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
        >
          Gallery
        </Link>
        <Link
          href="/sponsorship"
          className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
        >
          Sponsorship
        </Link>
        {siteSettings?.journal?.showJournal && (
          <Link
            href={(siteSettings as any)?.journal?.journalUrl || "/journal"}
            target={(siteSettings as any)?.journal?.openInNewTab ? "_blank" : "_self"}
            rel={(siteSettings as any)?.journal?.openInNewTab ? "noopener noreferrer" : undefined}
            className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
          >
            Journal
          </Link>
        )}
        <Link
          href="/contact"
          className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
        >
          Contact Us
        </Link>
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden">
        <button
          onClick={toggleMenu}
          className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600 transition-colors"
          aria-label="Toggle menu"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t z-40">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 rounded-lg mt-2 mx-2 shadow-lg">
            <Link
              href="/"
              className="block px-3 py-3 text-gray-700 hover:text-blue-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/about"
              className="block px-3 py-3 text-gray-700 hover:text-blue-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
            <Link
              href="/conferences"
              className="block px-3 py-3 text-gray-700 hover:text-blue-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              All Conferences
            </Link>
            <Link
              href="/past-conferences"
              className="block px-3 py-3 text-gray-700 hover:text-blue-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Past Conferences
            </Link>
            <Link
              href="/gallery"
              className="block px-3 py-3 text-gray-700 hover:text-blue-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Gallery
            </Link>
            <Link
              href="/sponsorship"
              className="block px-3 py-3 text-gray-700 hover:text-blue-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Sponsorship
            </Link>
            {siteSettings?.journal?.showJournal && (
              <Link
                href={(siteSettings as any)?.journal?.journalUrl || "/journal"}
                target={(siteSettings as any)?.journal?.openInNewTab ? "_blank" : "_self"}
                rel={(siteSettings as any)?.journal?.openInNewTab ? "noopener noreferrer" : undefined}
                className="block px-3 py-3 text-gray-700 hover:text-blue-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Journal
              </Link>
            )}
            <Link
              href="/contact"
              className="block px-3 py-3 text-gray-700 hover:text-blue-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact Us
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
