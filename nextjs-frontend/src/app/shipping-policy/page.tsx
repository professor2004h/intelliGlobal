import { Metadata } from 'next';
import { client } from '../lib/sanity';
import { notFound } from 'next/navigation';

// Define the shipping policy interface
interface ShippingPolicy {
  _id: string;
  pageTitle: string;
  pageSubtitle?: string;
  introduction?: string;
  shippingMethods?: {
    title: string;
    content: Array<{
      method: string;
      description: string;
      deliveryTime: string;
      cost: string;
    }>;
  };
  processingTime?: {
    title: string;
    content: string;
  };
  shippingRestrictions?: {
    title: string;
    content: string;
  };
  internationalShipping?: {
    title: string;
    content: string;
  };
  trackingInformation?: {
    title: string;
    content: string;
  };
  damagedOrLostPackages?: {
    title: string;
    content: string;
  };
  contactInformation?: {
    title: string;
    content: string;
  };
  importantNotes?: string[];
  effectiveDate: string;
  lastUpdated: string;
  isActive: boolean;
}

// Fetch shipping policy data from Sanity
async function getShippingPolicy(): Promise<ShippingPolicy | null> {
  try {
    const query = `*[_type == "shippingPolicy" && isActive == true] | order(_createdAt desc)[0]{
      _id,
      pageTitle,
      pageSubtitle,
      introduction,
      shippingMethods,
      processingTime,
      shippingRestrictions,
      internationalShipping,
      trackingInformation,
      damagedOrLostPackages,
      contactInformation,
      importantNotes,
      effectiveDate,
      lastUpdated,
      isActive
    }`;

    const shippingPolicy = await client.fetch(query, {}, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    return shippingPolicy;
  } catch (error) {
    console.error('Error fetching shipping policy:', error);
    return null;
  }
}

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  const shippingPolicy = await getShippingPolicy();
  
  return {
    title: shippingPolicy?.pageTitle || 'Shipping Policy | Intelligent Global Conferences',
    description: shippingPolicy?.pageSubtitle || shippingPolicy?.introduction || 'Learn about our shipping policy, delivery methods, processing times, and shipping restrictions.',
    keywords: 'shipping policy, delivery, shipping methods, processing time, international shipping, order tracking',
    openGraph: {
      title: shippingPolicy?.pageTitle || 'Shipping Policy',
      description: shippingPolicy?.pageSubtitle || 'Learn about our shipping policy and delivery information.',
      type: 'website',
    },
  };
}

export default async function ShippingPolicyPage() {
  const shippingPolicy = await getShippingPolicy();

  if (!shippingPolicy) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Shipping Policy</h1>
              <p className="text-lg text-gray-600">
                Our shipping policy is being updated. Please check back soon or contact us for shipping information.
              </p>
            </div>
            <div className="bg-blue-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-blue-900 mb-2">Need Shipping Information?</h2>
              <p className="text-blue-700 mb-4">
                For immediate shipping inquiries, please contact our support team.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Contact Support
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-12 text-white">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <h1 className="text-4xl font-bold">{shippingPolicy.pageTitle}</h1>
                {shippingPolicy.pageSubtitle && (
                  <p className="text-xl text-blue-100 mt-2">{shippingPolicy.pageSubtitle}</p>
                )}
              </div>
            </div>
            <div className="flex items-center text-blue-100 text-sm">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4m-6 0h6m-6 0V7a1 1 0 00-1 1v10a2 2 0 002 2h4a2 2 0 002-2V8a1 1 0 00-1-1V7" />
              </svg>
              Effective Date: {new Date(shippingPolicy.effectiveDate).toLocaleDateString()}
              <span className="mx-2">•</span>
              Last Updated: {new Date(shippingPolicy.lastUpdated).toLocaleDateString()}
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Introduction */}
            {shippingPolicy.introduction && (
              <div className="mb-8">
                <p className="text-lg text-gray-700 leading-relaxed">{shippingPolicy.introduction}</p>
              </div>
            )}

            {/* Shipping Methods */}
            {shippingPolicy.shippingMethods && (
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </div>
                  {shippingPolicy.shippingMethods.title}
                </h2>
                <div className="grid gap-4">
                  {shippingPolicy.shippingMethods.content?.map((method, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{method.method}</h3>
                      <p className="text-gray-700 mb-3">{method.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center">
                          <span className="font-medium text-gray-600 mr-2">Delivery Time:</span>
                          <span className="text-gray-900">{method.deliveryTime}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium text-gray-600 mr-2">Cost:</span>
                          <span className="text-gray-900">{method.cost}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Processing Time */}
            {shippingPolicy.processingTime && (
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  {shippingPolicy.processingTime.title}
                </h2>
                <div className="bg-green-50 rounded-lg p-6">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{shippingPolicy.processingTime.content}</p>
                </div>
              </section>
            )}

            {/* Shipping Restrictions */}
            {shippingPolicy.shippingRestrictions && (
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  {shippingPolicy.shippingRestrictions.title}
                </h2>
                <div className="bg-red-50 rounded-lg p-6">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{shippingPolicy.shippingRestrictions.content}</p>
                </div>
              </section>
            )}

            {/* International Shipping */}
            {shippingPolicy.internationalShipping && (
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  {shippingPolicy.internationalShipping.title}
                </h2>
                <div className="bg-purple-50 rounded-lg p-6">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{shippingPolicy.internationalShipping.content}</p>
                </div>
              </section>
            )}

            {/* Tracking Information */}
            {shippingPolicy.trackingInformation && (
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  {shippingPolicy.trackingInformation.title}
                </h2>
                <div className="bg-indigo-50 rounded-lg p-6">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{shippingPolicy.trackingInformation.content}</p>
                </div>
              </section>
            )}

            {/* Damaged or Lost Packages */}
            {shippingPolicy.damagedOrLostPackages && (
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01" />
                    </svg>
                  </div>
                  {shippingPolicy.damagedOrLostPackages.title}
                </h2>
                <div className="bg-orange-50 rounded-lg p-6">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{shippingPolicy.damagedOrLostPackages.content}</p>
                </div>
              </section>
            )}

            {/* Contact Information */}
            {shippingPolicy.contactInformation && (
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  {shippingPolicy.contactInformation.title}
                </h2>
                <div className="bg-teal-50 rounded-lg p-6">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{shippingPolicy.contactInformation.content}</p>
                </div>
              </section>
            )}

            {/* Important Notes */}
            {shippingPolicy.importantNotes && shippingPolicy.importantNotes.length > 0 && (
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  Important Notes
                </h2>
                <div className="bg-yellow-50 rounded-lg p-6">
                  <ul className="space-y-2">
                    {shippingPolicy.importantNotes.map((note, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700">{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            {/* Footer */}
            <div className="border-t border-gray-200 pt-8 mt-8">
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <p className="text-sm text-gray-600 mb-2">
                  This shipping policy is effective as of {new Date(shippingPolicy.effectiveDate).toLocaleDateString()}
                  and was last updated on {new Date(shippingPolicy.lastUpdated).toLocaleDateString()}.
                </p>
                <p className="text-sm text-gray-500">
                  For questions about this shipping policy, please contact our support team.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
