'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';

function ThankYouContent() {
  const searchParams = useSearchParams();
  
  const name = searchParams.get('name') || '';
  const email = searchParams.get('email') || '';
  const phone = searchParams.get('phone') || '';
  const conference = searchParams.get('conference') || '';
  const amount = searchParams.get('amount') || '';
  const currency = searchParams.get('currency') || 'USD';
  const transactionId = searchParams.get('transactionId') || '';
  const orderId = searchParams.get('orderId') || '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Success Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-t-2xl p-8 text-white text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-4xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-green-100 text-lg">Thank you for your payment</p>
        </div>

        {/* Success Message */}
        <div className="bg-white shadow-xl rounded-b-2xl p-8">
          
          <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg mb-8">
            <div className="flex items-start">
              <div className="text-4xl mr-4">✅</div>
              <div>
                <h2 className="text-xl font-bold text-green-900 mb-2">Payment Confirmed</h2>
                <p className="text-green-700">
                  Your payment has been successfully processed. A confirmation email has been sent to <strong>{email}</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Client Information */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-blue-900 mb-4 pb-2 border-b-2 border-blue-200">
              Client Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Name</p>
                <p className="text-lg font-semibold text-gray-900">{name}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Email</p>
                <p className="text-lg font-semibold text-gray-900">{email}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Phone Number</p>
                <p className="text-lg font-semibold text-gray-900">{phone}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Conference</p>
                <p className="text-lg font-semibold text-gray-900">{conference}</p>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-blue-900 mb-4 pb-2 border-b-2 border-blue-200">
              Payment Details
            </h3>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Amount Paid</p>
                  <p className="text-3xl font-bold text-green-600">{currency} ${parseFloat(amount).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Payment Method</p>
                  <p className="text-lg font-semibold text-gray-900">PayPal</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600 mb-1">Transaction ID</p>
                  <p className="text-sm font-mono font-semibold text-gray-900 bg-white p-3 rounded border border-gray-300 break-all">
                    {transactionId}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600 mb-1">Order ID</p>
                  <p className="text-sm font-mono font-semibold text-gray-900 bg-white p-3 rounded border border-gray-300 break-all">
                    {orderId}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600 mb-1">Payment Date</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date().toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      timeZoneName: 'short'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-blue-900 mb-4 pb-2 border-b-2 border-blue-200">
              What's Next?
            </h3>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3 text-xl">📧</span>
                  <span className="text-blue-900">
                    <strong>Check your email:</strong> A confirmation email with all payment details has been sent to {email}
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3 text-xl">📋</span>
                  <span className="text-blue-900">
                    <strong>Conference details:</strong> You will receive further information about the conference via email
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3 text-xl">💾</span>
                  <span className="text-blue-900">
                    <strong>Save this page:</strong> You can print or save this page for your records
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3 text-xl">📞</span>
                  <span className="text-blue-900">
                    <strong>Need help?</strong> Contact us at contactus@intelliglobalconferences.com
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.print()}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              🖨️ Print Receipt
            </button>
            <Link
              href="/"
              className="px-8 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors shadow-lg text-center"
            >
              🏠 Return to Home
            </Link>
          </div>

          {/* Footer Note */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-600 text-sm">
              This is an automated confirmation. Please keep this information for your records.
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Intelli Global Conferences | contactus@intelliglobalconferences.com
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <ThankYouContent />
    </Suspense>
  );
}

