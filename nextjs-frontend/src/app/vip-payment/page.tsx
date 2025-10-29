'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';

interface Conference {
  _id: string;
  title: string;
  startDate: string;
  endDate: string;
  location: string;
  isUpcoming: boolean;
}

interface FormData {
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  country: string;
  postalAddress: string;
  conferenceId: string;
  conferenceName: string;
  paymentAmount: string;
}

export default function VIPPaymentPage() {
  const router = useRouter();
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    country: '',
    postalAddress: '',
    conferenceId: '',
    conferenceName: '',
    paymentAmount: '',
  });

  // Fetch conferences on mount
  useEffect(() => {
    fetchConferences();
  }, []);

  const fetchConferences = async () => {
    try {
      const response = await fetch('/api/vip-payment/conferences');
      const data = await response.json();
      
      if (data.success) {
        setConferences(data.conferences);
      }
    } catch (error) {
      console.error('Error fetching conferences:', error);
    } finally {
      setLoading(false);
    }
  };

  // Check if form is valid
  const isFormValid = () => {
    return (
      formData.title &&
      formData.firstName &&
      formData.lastName &&
      formData.email &&
      formData.phoneNumber &&
      formData.conferenceId &&
      formData.paymentAmount &&
      parseFloat(formData.paymentAmount) > 0
    );
  };

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'conferenceId') {
      const selectedConference = conferences.find(c => c._id === value);
      setFormData(prev => ({
        ...prev,
        conferenceId: value,
        conferenceName: selectedConference?.title || '',
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Initialize PayPal when form becomes valid
  useEffect(() => {
    if (isFormValid() && paypalLoaded && window.paypal) {
      initializePayPal();
    }
  }, [formData, paypalLoaded]);

  const initializePayPal = () => {
    const paypalContainer = document.getElementById('paypal-button-container');
    if (!paypalContainer || paypalContainer.innerHTML || !window.paypal) return;

    window.paypal.Buttons({
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: formData.paymentAmount,
              currency_code: 'USD'
            },
            description: `VIP Payment - ${formData.conferenceName}`
          }]
        });
      },
      onApprove: async (data: any, actions: any) => {
        setProcessing(true);
        try {
          const order = await actions.order.capture();
          console.log('Payment captured:', order);

          // Process payment on backend
          const response = await fetch('/api/vip-payment/process', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              clientData: {
                title: formData.title,
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                country: formData.country,
                postalAddress: formData.postalAddress,
              },
              paymentData: {
                transactionId: order.id,
                orderId: order.id,
                amount: formData.paymentAmount,
                currency: 'USD',
                status: order.status,
              },
              conferenceData: {
                conferenceId: formData.conferenceId,
                conferenceName: formData.conferenceName,
              },
            }),
          });

          const result = await response.json();

          if (result.success) {
            // Redirect to thank you page with data
            const queryParams = new URLSearchParams({
              name: `${formData.title} ${formData.firstName} ${formData.lastName}`,
              email: formData.email,
              phone: formData.phoneNumber,
              conference: formData.conferenceName,
              amount: formData.paymentAmount,
              currency: 'USD',
              transactionId: order.id,
              orderId: order.id,
            });
            
            router.push(`/vip-payment/thank-you?${queryParams.toString()}`);
          } else {
            alert('Payment processing failed. Please contact support.');
          }
        } catch (error) {
          console.error('Error processing payment:', error);
          alert('An error occurred. Please contact support.');
        } finally {
          setProcessing(false);
        }
      },
      onError: (err: any) => {
        console.error('PayPal error:', err);
        alert('Payment failed. Please try again.');
        setProcessing(false);
      }
    }).render('#paypal-button-container');
  };

  return (
    <>
      <Script
        src={`https://www.paypal.com/sdk/js?client-id=AUmI5g_PA8vHr0HSeZq7PukrblnMLeOLQbW60lNHoJGLAqTg3JZjAeracZmAh1WSuuqmZnUIJxLdzGXc&currency=USD`}
        onLoad={() => setPaypalLoaded(true)}
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-t-2xl p-8 text-white">
            <h1 className="text-3xl font-bold text-center">VIP Client Payment</h1>
            <p className="text-center mt-2 text-blue-100">Special payment portal for valued clients</p>
          </div>

          {/* Form Container */}
          <div className="bg-white rounded-b-2xl shadow-xl p-8">
            
            {/* Validation Message */}
            {!isFormValid() && (
              <div className="mb-8 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
                <div className="flex items-center">
                  <div className="text-4xl mr-4">📝</div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900">Complete the form to proceed</h3>
                    <p className="text-blue-700 mt-1">Fill in all required fields above</p>
                  </div>
                </div>
              </div>
            )}

            {/* Conference Selection */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Conference <span className="text-red-500">*</span>
              </label>
              <select
                name="conferenceId"
                value={formData.conferenceId}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
              >
                <option value="">-- Select a Conference --</option>
                {loading ? (
                  <option>Loading conferences...</option>
                ) : (
                  conferences.map((conf) => (
                    <option key={conf._id} value={conf._id}>
                      {conf.title} - {new Date(conf.startDate).toLocaleDateString()}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Personal Details Section */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-blue-900 mb-4 pb-2 border-b-2 border-blue-200">
                Personal Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Any</option>
                    <option value="Mr">Mr</option>
                    <option value="Ms">Ms</option>
                    <option value="Mrs">Mrs</option>
                    <option value="Prof">Prof</option>
                    <option value="Dr">Dr</option>
                  </select>
                </div>

                {/* First Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First Name *"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last Name *"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email *"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Phone Number *"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Further Information Section */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-blue-900 mb-4 pb-2 border-b-2 border-blue-200">
                Further Information
              </h2>
              
              <div className="space-y-6">
                {/* Country */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Select country"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Full Postal Address */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Postal Address
                  </label>
                  <textarea
                    name="postalAddress"
                    value={formData.postalAddress}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Payment Amount Section */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-blue-900 mb-4 pb-2 border-b-2 border-blue-200">
                Payment Amount
              </h2>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Custom Payment Amount (USD) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg font-bold">$</span>
                  <input
                    type="number"
                    name="paymentAmount"
                    value={formData.paymentAmount}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-semibold"
                    required
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">Enter the amount discussed with the owner</p>
              </div>
            </div>

            {/* PayPal Button Container */}
            {isFormValid() && (
              <div className="mt-8">
                <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-green-900 mb-4 text-center">
                    ✅ Form Complete - Proceed to Payment
                  </h3>
                  <div id="paypal-button-container" className="max-w-md mx-auto"></div>
                  {processing && (
                    <div className="text-center mt-4">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <p className="text-blue-600 mt-2">Processing payment...</p>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}

