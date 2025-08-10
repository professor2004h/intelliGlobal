import { PortableText } from '@portabletext/react';
import Link from 'next/link';
import { client } from '../sanity/client';

// GROQ query for active cancellation policy
const query = `*[_type == "cancellationPolicy" && isActive == true][0]{
  _id,
  title,
  subtitle,
  introduction,
  nameChangePolicy{ title, content, deadline },
  refundPolicy{ title, generalPolicy, refundTiers[]{daysBeforeConference, refundPercentage, description}, additionalTerms },
  naturalDisasterPolicy{ title, content, organizerRights, liabilityDisclaimer },
  postponementPolicy{ title, content, creditValidityPeriod },
  transferPolicy{ title, personTransfer, conferenceTransfer, transferDeadline, transferLimitations },
  visaPolicy{ title, generalAdvice, failedVisaPolicy },
  contactInformation{ title, primaryEmail, phone, instructions },
  importantNotes[]{ title, content, priority },
  lastUpdated, isActive, effectiveDate, seoTitle, seoDescription
}`;

export default async function CancellationPolicyPage() {
  let policy: any = null;
  try {
    policy = await client.fetch(query, {}, { next: { revalidate: 30, tags: ['cancellation-policy'] } });
  } catch (e) {
    console.error('Failed to fetch cancellation policy:', e);
  }

  const formatDate = (d?: string) => d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Not specified';
  const getPriorityIcon = (priority: string) => priority === 'high' ? '🔴' : priority === 'medium' ? '🟡' : priority === 'low' ? '🟢' : '📌';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-20" />
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="text-orange-400 font-semibold text-lg tracking-wide uppercase mb-4 block">Conference Policies</span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{policy?.title || 'Cancellation Policy'}</h1>
            {policy?.subtitle && (<p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">{policy.subtitle}</p>)}
          </div>
          <nav className="flex justify-center" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center"><Link href="/" className="text-blue-200 hover:text-white transition-colors">Home</Link></li>
              <li><div className="flex items-center"><svg className="w-6 h-6 text-blue-300" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg><span className="text-blue-100 ml-1 md:ml-2">Cancellation Policy</span></div></li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!policy && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8 text-center">
            <p className="text-gray-600">Cancellation policy is being updated. Please check back soon.</p>
            <Link href="/contact" className="inline-flex items-center px-6 py-3 mt-6 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors">Contact Us</Link>
          </div>
        )}

        {policy?.introduction && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <div className="prose prose-lg max-w-none"><PortableText value={policy.introduction} /></div>
          </div>
        )}

        {policy?.importantNotes?.length ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <div className="flex items-center mb-6"><span className="text-2xl mr-3">⚠️</span><h2 className="text-2xl font-bold text-gray-900">Important Notes</h2></div>
            <div className="space-y-4">
              {policy.importantNotes.map((note: any, index: number) => (
                <div key={index} className={`p-4 rounded-lg border-l-4 ${note.priority === 'high' ? 'bg-red-50 border-red-500' : note.priority === 'medium' ? 'bg-yellow-50 border-yellow-500' : 'bg-green-50 border-green-500'}`}>
                  <div className="flex items-start"><span className="text-lg mr-2 mt-0.5">{getPriorityIcon(note.priority)}</span><div className="flex-1"><h3 className="font-semibold text-gray-900 mb-2">{note.title}</h3><div className="prose prose-sm"><PortableText value={note.content} /></div></div></div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {policy?.nameChangePolicy && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <div className="flex items-center mb-6"><span className="text-2xl mr-3">✅</span><h2 className="text-2xl font-bold text-gray-900">{policy.nameChangePolicy.title}</h2></div>
            <div className="prose prose-lg max-w-none"><PortableText value={policy.nameChangePolicy.content} /></div>
            {policy.nameChangePolicy.deadline && (<div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg"><p className="text-blue-800 font-medium">🗓️ Deadline: {policy.nameChangePolicy.deadline} days before the conference</p></div>)}
          </div>
        )}

        {policy?.refundPolicy && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <div className="flex items-center mb-6"><span className="text-2xl mr-3">💰</span><h2 className="text-2xl font-bold text-gray-900">{policy.refundPolicy.title}</h2></div>
            <div className="prose prose-lg max-w-none mb-6"><PortableText value={policy.refundPolicy.generalPolicy} /></div>
            {policy.refundPolicy.refundTiers?.length ? (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Refund Schedule</h3>
                <div className="space-y-3">
                  {policy.refundPolicy.refundTiers.sort((a: any, b: any) => b.daysBeforeConference - a.daysBeforeConference).map((tier: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <span className="text-2xl font-bold text-blue-600 mr-4">{tier.refundPercentage}%</span>
                          <div>
                            <p className="font-medium text-gray-900">{tier.daysBeforeConference > 0 ? `${tier.daysBeforeConference}+ days before conference` : 'Less than 45 days before conference'}</p>
                            {tier.description && (<p className="text-sm text-gray-600">{tier.description}</p>)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
            {policy.refundPolicy.additionalTerms && (<div className="prose prose-lg max-w-none"><PortableText value={policy.refundPolicy.additionalTerms} /></div>)}
          </div>
        )}

        {policy?.transferPolicy && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <div className="flex items-center mb-6"><span className="text-2xl mr-3">🔄</span><h2 className="text-2xl font-bold text-gray-900">{policy.transferPolicy.title}</h2></div>
            <div className="space-y-6">
              <div><h3 className="text-lg font-semibold text-gray-900 mb-3">Transfer to Another Person</h3><div className="prose prose-lg max-w-none"><PortableText value={policy.transferPolicy.personTransfer} /></div></div>
              <div><h3 className="text-lg font-semibold text-gray-900 mb-3">Transfer to Another Conference</h3><div className="prose prose-lg max-w-none"><PortableText value={policy.transferPolicy.conferenceTransfer} /></div></div>
              <div><h3 className="text-lg font-semibold text-gray-900 mb-3">Transfer Limitations</h3><div className="prose prose-lg max-w-none"><PortableText value={policy.transferPolicy.transferLimitations} /></div></div>
              {policy.transferPolicy.transferDeadline && (<div className="p-4 bg-orange-50 border border-orange-200 rounded-lg"><p className="text-orange-800 font-medium">⏰ Transfer Deadline: {policy.transferPolicy.transferDeadline} days before the conference</p></div>)}
            </div>
          </div>
        )}

        {policy?.naturalDisasterPolicy && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <div className="flex items-center mb-6"><span className="text-2xl mr-3">🌪️</span><h2 className="text-2xl font-bold text-gray-900">{policy.naturalDisasterPolicy.title}</h2></div>
            <div className="space-y-6">
              <div className="prose prose-lg max-w-none"><PortableText value={policy.naturalDisasterPolicy.content} /></div>
              {policy.naturalDisasterPolicy.organizerRights && (<div><h3 className="text-lg font-semibold text-gray-900 mb-3">Organizer Rights</h3><div className="prose prose-lg max-w-none"><PortableText value={policy.naturalDisasterPolicy.organizerRights} /></div></div>)}
              {policy.naturalDisasterPolicy.liabilityDisclaimer && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-red-900 mb-3">Liability Disclaimer</h3>
                  <div className="prose prose-lg max-w-none text-red-800"><PortableText value={policy.naturalDisasterPolicy.liabilityDisclaimer} /></div>
                </div>
              )}
            </div>
          </div>
        )}

        {policy?.postponementPolicy && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <div className="flex items-center mb-6"><span className="text-2xl mr-3">🗓️</span><h2 className="text-2xl font-bold text-gray-900">{policy.postponementPolicy.title}</h2></div>
            <div className="prose prose-lg max-w-none"><PortableText value={policy.postponementPolicy.content} /></div>
            {policy.postponementPolicy.creditValidityPeriod && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg"><p className="text-green-800 font-medium">🕒 Credit Validity: {policy.postponementPolicy.creditValidityPeriod} months from postponement date</p></div>
            )}
          </div>
        )}

        {policy?.visaPolicy && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <div className="flex items-center mb-6"><span className="text-2xl mr-3">🛂</span><h2 className="text-2xl font-bold text-gray-900">{policy.visaPolicy.title}</h2></div>
            <div className="space-y-6">
              <div><h3 className="text-lg font-semibold text-gray-900 mb-3">General Advice</h3><div className="prose prose-lg max-w-none"><PortableText value={policy.visaPolicy.generalAdvice} /></div></div>
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg"><h3 className="text-lg font-semibold text-yellow-900 mb-3">Failed Visa Applications</h3><div className="prose prose-lg max-w-none text-yellow-800"><PortableText value={policy.visaPolicy.failedVisaPolicy} /></div></div>
            </div>
          </div>
        )}

        {policy?.contactInformation && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <div className="flex items-center mb-6"><span className="text-2xl mr-3">📞</span><h2 className="text-2xl font-bold text-gray-900">{policy.contactInformation.title}</h2></div>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {policy.contactInformation.primaryEmail && (<div><h3 className="font-semibold text-gray-900 mb-2">Email</h3><a href={`mailto:${policy.contactInformation.primaryEmail}`} className="text-blue-600 hover:text-blue-800 font-medium">{policy.contactInformation.primaryEmail}</a></div>)}
              {policy.contactInformation.phone && (<div><h3 className="font-semibold text-gray-900 mb-2">Phone</h3><a href={`tel:${policy.contactInformation.phone}`} className="text-blue-600 hover:text-blue-800 font-medium">{policy.contactInformation.phone}</a></div>)}
            </div>
            <div className="prose prose-lg max-w-none"><PortableText value={policy.contactInformation.instructions} /></div>
          </div>
        )}

        <div className="bg-gray-100 rounded-lg p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div><span className="font-medium">Last Updated:</span> {formatDate(policy?.lastUpdated)}</div>
            {policy?.effectiveDate && (<div><span className="font-medium">Effective Date:</span> {formatDate(policy.effectiveDate)}</div>)}
          </div>
        </div>

        <div className="text-center">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Questions About Our Policies?</h3>
            <p className="text-orange-100 mb-6">Contact our team for clarification on any cancellation or refund policies</p>
            <div className="space-x-4">
              <Link href="/contact" className="inline-block bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">Contact Us</Link>
              <Link href="/sponsorship" className="inline-block border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors">Register Now</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata() {
  try {
    const doc = await client.fetch(query);
    return {
      title: `${doc?.seoTitle || 'Cancellation Policy'} - Intelli Global Conferences`,
      description: doc?.seoDescription || 'Official cancellation and refund policies for our conferences.',
    };
  } catch {
    return {
      title: 'Cancellation Policy - Intelli Global Conferences',
      description: 'Official cancellation and refund policies for our conferences.',
    };
  }
}

