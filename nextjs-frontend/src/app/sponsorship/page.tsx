import Link from "next/link";
import { getSponsorshipTiers, type SponsorshipTier } from "../getSponsorshipData";
import { getSiteSettingsSSR, type SiteSettings } from "../getSiteSettings";
import SponsorshipTiersSection from "../../components/SponsorshipTiersSection";

export const metadata = {
  title: "Sponsorship Opportunities - Intelli Global Conferences",
  description: "Partner with us to showcase your brand at our global conferences. Explore sponsorship packages and benefits for industry leaders.",
};

export default async function SponsorshipPage() {
  let sponsorshipTiers: SponsorshipTier[] = [];
  let siteSettings: SiteSettings | null = null;

  try {
    [sponsorshipTiers, siteSettings] = await Promise.all([
      getSponsorshipTiers(),
      getSiteSettingsSSR(),
    ]);
  } catch (error) {
    console.error('Error fetching sponsorship data:', error);
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            For Sponsor / Exhibitor
          </h1>
          <div className="max-w-4xl mx-auto">
            <p className="text-xl md:text-2xl text-blue-100 leading-relaxed mb-8">
              Intelli Global Conferences organizes interdisciplinary global conferences to showcase revolutionary basic and applied research outcomes within life sciences including medicine and other diverse roles of science and technology around the world.
            </p>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-6">
                  Adding value to the experience while integrating your brand's products will not only showcase the authenticity of the brand, but will result in great, objective 3rd party recognition that will move the influencer needle. When your brand purchases a Sponsorship package, it is committing itself to delivering experiential relevance and value to thousands of industry influencers including press, creative's and their millions of collective followers, who have come to expect nothing less from Intelli Global Conferences and its partners.
                </p>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Intelli Global Conferences offers different packages for sponsors/exhibitors to demonstrate their support towards science and its people by providing financial contributions to facilitate the presentations of noble research findings, hospitality and other necessary management for the scientific gathering.
                </p>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-900 italic">
                    Visualize this partnership through the eyes of world class noble people…!!!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsorship Tiers Section */}
      <SponsorshipTiersSection sponsorshipTiers={sponsorshipTiers} />

      {/* Contact Information */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
              Need More Information?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h4 className="text-xl font-semibold text-gray-900 mb-4">Email Us</h4>
                <p className="text-gray-600 mb-4">
                  For sponsorship inquiries and custom packages
                </p>
                <a 
                  href={`mailto:${siteSettings?.contactInfo?.email || 'contact@intelliglobalconferences.com'}`}
                  className="text-blue-600 hover:text-blue-800 font-semibold"
                >
                  {siteSettings?.contactInfo?.email || 'contact@intelliglobalconferences.com'}
                </a>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h4 className="text-xl font-semibold text-gray-900 mb-4">Call Us</h4>
                <p className="text-gray-600 mb-4">
                  Speak directly with our sponsorship team
                </p>
                <a 
                  href={`tel:${siteSettings?.contactInfo?.phone || '+1-234-567-8900'}`}
                  className="text-blue-600 hover:text-blue-800 font-semibold"
                >
                  {siteSettings?.contactInfo?.phone || '+1-234-567-8900'}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
