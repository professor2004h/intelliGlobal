'use client';

import Link from "next/link";
import { useCurrency } from '../contexts/CurrencyContext';
import { formatCurrency, getPriceForCurrency, type SponsorshipTier } from '../app/getSponsorshipData';
import CurrencySelector from './CurrencySelector';

interface SponsorshipTiersSectionProps {
  sponsorshipTiers: SponsorshipTier[];
}

export default function SponsorshipTiersSection({ sponsorshipTiers }: SponsorshipTiersSectionProps) {
  const { selectedCurrency } = useCurrency();

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Sponsorship Packages
          </h2>
          <div className="w-24 h-1 bg-orange-500 mx-auto mb-8"></div>
          
          {/* Currency Selector */}
          <div className="flex justify-center mb-8">
            <div className="w-64">
              <CurrencySelector showLabel={true} />
            </div>
          </div>
        </div>

        {/* Sponsorship Tiers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {sponsorshipTiers.map((tier) => {
            const price = getPriceForCurrency(tier, selectedCurrency);
            
            return (
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
                    {formatCurrency(price, selectedCurrency)}
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

                <div className="flex justify-center">
                  <Link
                    href="/sponsorship/register"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition-colors duration-200"
                  >
                    Register Now
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-blue-600 rounded-2xl p-8 md:p-12 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Partner With Us?
            </h3>
            <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Join industry leaders in showcasing your brand at our global conferences. 
              Contact us for custom sponsorship packages tailored to your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/sponsorship/register"
                className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
              >
                Start Registration
              </Link>
              <Link
                href="/contact"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
