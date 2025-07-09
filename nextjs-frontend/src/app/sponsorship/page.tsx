import Link from "next/link";
import { getSponsorshipTiers, formatCurrency, type SponsorshipTier } from "../getSponsorshipData";
import { getSiteSettingsSSR, type SiteSettings } from "../getSiteSettings";

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
      <section className="py-16 md:py-24 bg-gradient-to-br from-blue-900 via-slate-800 to-blue-900">
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
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Sponsorship Packages
            </h2>
            <div className="w-24 h-1 bg-orange-500 mx-auto"></div>
          </div>

          {/* Sponsorship Tiers Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {sponsorshipTiers.map((tier) => (
              <div 
                key={tier._id} 
                className={`bg-white rounded-xl shadow-lg border-2 p-8 ${
                  tier.featured 
                    ? 'border-orange-500 ring-4 ring-orange-100' 
                    : 'border-gray-200 hover:border-blue-300'
                } transition-all duration-300 hover:shadow-xl`}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">{tier.name}</h3>
                  {tier.featured && (
                    <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Popular
                    </span>
                  )}
                </div>
                
                {tier.description && (
                  <p className="text-gray-600 mb-6">{tier.description}</p>
                )}

                <div className="mb-6">
                  <div className="text-3xl font-bold text-blue-900 mb-2">
                    {formatCurrency(tier.price)}
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {tier.benefits.map((benefit, benefitIndex) => (
                    <li 
                      key={benefitIndex} 
                      className={`flex items-start ${
                        benefit.highlighted ? 'text-orange-600 font-semibold' : 'text-gray-700'
                      }`}
                    >
                      <svg 
                        className={`w-5 h-5 mt-0.5 mr-3 flex-shrink-0 ${
                          benefit.highlighted ? 'text-orange-500' : 'text-green-500'
                        }`} 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path 
                          fillRule="evenodd" 
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                          clipRule="evenodd" 
                        />
                      </svg>
                      {benefit.benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-blue-900 to-slate-800 rounded-2xl p-8 md:p-12 text-white">
              <h3 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Become a Sponsor?
              </h3>
              <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                Join industry leaders in supporting cutting-edge research and innovation. 
                Choose your sponsorship package and make a lasting impact.
              </p>
              <Link
                href="/sponsorship/register"
                className="inline-flex items-center bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 group"
              >
                Become a Sponsor
                <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

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
