'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Declare Razorpay type for TypeScript
declare global {
  interface Window {
    Razorpay: any;
  }
}

// Define interfaces locally to avoid server/client import issues
interface SponsorshipTier {
  _id: string;
  name: string;
  slug: { current: string };
  price: number;
  order: number;
  featured: boolean;
  description?: string;
  benefits: Array<{
    benefit: string;
    highlighted: boolean;
  }>;
  color?: {
    hex: string;
  };
  active: boolean;
}

interface ConferenceEvent {
  _id: string;
  title: string;
  slug: { current: string };
  date: string;
  location: string;
  image?: {
    asset: {
      url: string;
    };
  };
}

interface DetailedConferenceEvent extends ConferenceEvent {
  email?: string;
  registerNowUrl?: string;
  submitAbstractUrl?: string;
  description?: string;
  shortDescription?: string;
  attendeeCount?: number;
  topics?: string[];
  highlights?: string[];
  keySpeakers?: Array<{
    name: string;
    title: string;
    organization?: string;
  }>;
}

// Client-side utility functions
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const generateRegistrationId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `SPONSOR-${timestamp}-${randomStr}`.toUpperCase();
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

interface SponsorRegistrationFormProps {
  sponsorshipTiers: SponsorshipTier[];
  conferences: ConferenceEvent[];
}

export default function SponsorRegistrationForm({ sponsorshipTiers, conferences }: SponsorRegistrationFormProps) {
  console.log('🎯 CLIENT: Form received conferences:', conferences);
  console.log('🎯 CLIENT: Form received tiers:', sponsorshipTiers);

  // Initialize form state with localStorage persistence
  const initializeFormState = () => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('sponsorRegistrationForm');
      if (savedData) {
        try {
          return JSON.parse(savedData);
        } catch (error) {
          console.error('Error parsing saved form data:', error);
        }
      }
    }
    return {
      // Step 1: Conference & Tier Selection
      conferenceId: '',
      tierId: '',

      // Step 2: Company Information
      companyName: '',
      contactPerson: '',
      email: '',
      phone: '',
      website: '',
      companyAddress: '',

      // Step 3: Additional Information
      specialRequests: '',
      marketingMaterials: false,
      logoPlacement: false,
      speakingOpportunity: false,
    };
  };

  const initializeCurrentStep = () => {
    if (typeof window !== 'undefined') {
      const savedStep = localStorage.getItem('sponsorRegistrationStep');
      if (savedStep) {
        const step = parseInt(savedStep, 10);
        return step >= 1 && step <= 4 ? step : 1;
      }
    }
    return 1;
  };

  const [currentStep, setCurrentStep] = useState(initializeCurrentStep);
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [formData, setFormData] = useState(initializeFormState);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [detailedConferences, setDetailedConferences] = useState<(DetailedConferenceEvent & { isTechnologyRelated?: boolean })[]>([]);
  const [showConferenceDetails, setShowConferenceDetails] = useState(false);

  // Load Razorpay script with better error handling
  useEffect(() => {
    const loadRazorpay = () => {
      try {
        // Check if script is already being loaded
        const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
        if (existingScript) {
          console.log('🔄 Razorpay script already loading...');
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => {
          console.log('✅ Razorpay script loaded successfully');
          setRazorpayLoaded(true);
        };
        script.onerror = () => {
          console.error('❌ Failed to load Razorpay script');
          setRazorpayLoaded(false);
        };
        document.body.appendChild(script);
      } catch (error) {
        console.error('❌ Error loading Razorpay script:', error);
        setRazorpayLoaded(false);
      }
    };

    if (!window.Razorpay) {
      loadRazorpay();
    } else {
      console.log('✅ Razorpay already available');
      setRazorpayLoaded(true);
    }
  }, []);

  // Fetch detailed conference information
  const fetchDetailedConferences = async () => {
    try {
      console.log('🔍 Fetching detailed conference information...');
      const response = await fetch('/api/detailed-conferences');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('📊 Received detailed conference data:', data);
      setDetailedConferences(data);
    } catch (error) {
      console.error('❌ Error fetching detailed conferences:', error);
    }
  };

  // Load detailed conferences when component mounts
  useEffect(() => {
    fetchDetailedConferences();
  }, []);

  // Initialize form state from localStorage on client-side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('sponsorRegistrationForm');
      const savedStep = localStorage.getItem('sponsorRegistrationStep');

      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          setFormData(parsedData);
          console.log('✅ Restored form data from localStorage');
        } catch (error) {
          console.error('Error parsing saved form data:', error);
        }
      }

      if (savedStep) {
        const step = parseInt(savedStep, 10);
        if (step >= 1 && step <= 4) {
          setCurrentStep(step);
          console.log('✅ Restored current step from localStorage:', step);
        }
      }
    }
  }, []);

  // Save form data to localStorage whenever it changes
  const saveFormData = (newFormData: typeof formData) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sponsorRegistrationForm', JSON.stringify(newFormData));
    }
  };

  // Save current step to localStorage
  const saveCurrentStep = (step: number) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sponsorRegistrationStep', step.toString());
    }
  };

  // Clear saved form data (used after successful submission)
  const clearSavedData = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sponsorRegistrationForm');
      localStorage.removeItem('sponsorRegistrationStep');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    const newFormData = {
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    };

    setFormData(newFormData);
    saveFormData(newFormData); // Persist form data

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    switch (step) {
      case 1:
        if (!formData.conferenceId) newErrors.conferenceId = 'Please select a conference';
        if (!formData.tierId) newErrors.tierId = 'Please select a sponsorship tier';
        break;
      case 2:
        if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
        if (!formData.contactPerson.trim()) newErrors.contactPerson = 'Contact person is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!isValidEmail(formData.email)) newErrors.email = 'Please enter a valid email';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        break;
      case 3:
        // No required fields in step 3
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      saveCurrentStep(nextStep); // Persist current step
    }
  };

  const handlePrevious = () => {
    const prevStep = currentStep - 1;
    setCurrentStep(prevStep);
    saveCurrentStep(prevStep); // Persist current step
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission is handled by individual step navigation and payment buttons
    // This prevents any accidental form submissions
  };

  // Payment processing functions
  const createPaymentOrder = async (amount: number, paymentMethod: string) => {
    try {
      const response = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency: 'INR', // Use INR for UPI support in test mode
          receipt: `receipt_${Date.now()}`,
          notes: {
            paymentMethod,
            conferenceId: formData.conferenceId,
            tierId: formData.tierId,
            upi_enabled: true,
          },
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to create payment order');
      }

      return data.order;
    } catch (error) {
      console.error('❌ Error creating payment order:', error);
      throw error;
    }
  };

  const verifyPayment = async (paymentData: any, sponsorshipData: any) => {
    try {
      const response = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...paymentData,
          sponsorshipData,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Payment verification failed');
      }

      return data;
    } catch (error) {
      console.error('❌ Error verifying payment:', error);
      throw error;
    }
  };

  const sendInvoice = async (paymentData: any, sponsorshipData: any, invoiceNumber: string) => {
    try {
      const response = await fetch('/api/payment/send-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentData,
          sponsorshipData,
          invoiceNumber,
          customerEmail: formData.email,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to send invoice');
      }

      return data;
    } catch (error) {
      console.error('❌ Error sending invoice:', error);
      throw error;
    }
  };

  const handlePayment = async (paymentMethod: string) => {
    if (!validateStep(currentStep)) return;

    setPaymentLoading(true);

    try {
      const selectedConference = conferences.find(c => c._id === formData.conferenceId);
      const selectedTier = sponsorshipTiers.find(t => t._id === formData.tierId);

      if (!selectedTier || !selectedConference) {
        throw new Error('Please select both conference and sponsorship tier');
      }

      const registrationId = generateRegistrationId();

      // Convert USD to INR for UPI support (approximate conversion for testing)
      const usdAmount = selectedTier.price;
      const inrAmount = Math.round(usdAmount * 83); // Approximate USD to INR conversion

      const sponsorshipData = {
        registrationId,
        ...formData,
        conferenceName: selectedConference.title,
        tierName: selectedTier.name,
        amount: selectedTier.price, // Keep original USD amount for records
        amountINR: inrAmount, // INR amount for payment processing
        submittedAt: new Date().toISOString(),
      };

      console.log('💳 Payment conversion:', { usdAmount, inrAmount });

      // Create payment order with INR amount for UPI support
      const order = await createPaymentOrder(inrAmount, paymentMethod);

      console.log('🔧 Order created:', order);
      console.log('🔑 Razorpay Key:', process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);

      // Get Razorpay key with fallback mechanism
      let finalRazorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

      console.log('🔍 Frontend Environment Check:', {
        razorpayKeyExists: !!finalRazorpayKey,
        razorpayKeyValue: finalRazorpayKey || 'NOT_SET',
        allEnvKeys: Object.keys(process.env).filter(key => key.includes('RAZORPAY')),
        nodeEnv: process.env.NODE_ENV
      });

      // If frontend env var is not available, use the known working key
      if (!finalRazorpayKey) {
        console.log('⚠️ Frontend environment variable not available, using fallback key');
        finalRazorpayKey = 'rzp_test_ylYi97dkIOTZL7'; // Known working key from environment
      }

      // Validate the final key
      if (!finalRazorpayKey || !finalRazorpayKey.startsWith('rzp_')) {
        console.error('❌ Invalid Razorpay key:', finalRazorpayKey);
        alert('Payment configuration error. Please contact support.');
        setPaymentLoading(false);
        return;
      }

      console.log('✅ Using Razorpay key:', finalRazorpayKey.substring(0, 8) + '...');

      // Configure Razorpay options following official documentation
      const options = {
        key: finalRazorpayKey,
        amount: order.amount,
        currency: order.currency, // INR for UPI compatibility
        name: 'Intelli Global Conferences',
        description: `${selectedTier.name} Sponsorship - ${selectedConference.title}`,
        order_id: order.id,

        // Enable UPI and other payment methods - CRITICAL FOR UPI SUPPORT
        method: {
          upi: true,           // Enable UPI payments
          card: true,          // Enable card payments
          netbanking: true,    // Enable net banking
          wallet: true,        // Enable wallet payments
          emi: false,          // Disable EMI for sponsorship
          paylater: false      // Disable pay later options
        },

        // UPI specific settings
        upi: {
          flow: ['collect', 'intent', 'qr'],
          apps: ['gpay', 'phonepe', 'paytm', 'bhim', 'mobikwik', 'freecharge']
        },

        // Prefill customer information for better conversion rates
        prefill: {
          name: formData.name || '',
          email: formData.email || '',
          contact: formData.phone || ''
        },

        // Theme configuration
        theme: {
          color: '#3399cc'
        },

        // Additional UPI and payment optimization
        readonly: {
          email: true,
          name: true,
          contact: true
        },

        // Enhanced modal settings for better UPI experience
        modal: {
          backdropclose: false,
          escape: true,
          handleback: true,
          confirm_close: false,
          animation: true,
          ondismiss: function() {
            console.log('💔 Payment modal dismissed by user');
            setPaymentLoading(false);
          }
        },

        // Enhanced payment method preferences and display settings
        config: {
          display: {
            language: 'en',
            blocks: {
              utib: {
                name: 'Pay using UPI',
                instruments: [
                  { method: 'upi' },
                  { method: 'card' },
                  { method: 'netbanking' },
                  { method: 'wallet' }
                ]
              }
            },
            sequence: ['block.utib'],
            preferences: {
              show_default_blocks: true
            }
          }
        },

        // Notes for payment tracking and UPI configuration
        notes: {
          sponsorship_tier: selectedTier.name,
          conference: selectedConference.title,
          test_mode: 'true',
          upi_test_enabled: 'true',
          test_upi_id: 'success@razorpay',
          // Enhanced UPI settings
          upi_flows_enabled: 'collect,intent,qr',
          upi_apps_supported: 'gpay,phonepe,paytm,bhim',
          payment_methods_enabled: 'upi,card,netbanking,wallet'
        },



        handler: async function (response: any) {
          try {
            console.log('✅ Payment successful! Processing...', response);
            setPaymentLoading(true);

            // Verify payment
            console.log('🔐 Verifying payment signature...');
            const verificationResult = await verifyPayment(response, sponsorshipData);
            console.log('✅ Payment verification successful:', verificationResult);

            // Send invoice
            console.log('📧 Generating and sending invoice...');
            const invoiceResult = await sendInvoice(
              {
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                timestamp: verificationResult.timestamp,
              },
              sponsorshipData,
              verificationResult.invoiceNumber
            );
            console.log('✅ Invoice sent successfully:', invoiceResult);

            // Show detailed success message
            const successMessage = `🎉 Payment Successful!\n\n` +
              `Registration ID: ${registrationId}\n` +
              `Payment ID: ${response.razorpay_payment_id}\n` +
              `Invoice Number: ${verificationResult.invoiceNumber}\n\n` +
              `📧 Invoice has been sent to: ${formData.email}\n\n` +
              `Thank you for sponsoring ${selectedConference.title}!`;

            alert(successMessage);

            // Reset form and clear saved data
            const resetFormData = {
              conferenceId: '',
              tierId: '',
              companyName: '',
              contactPerson: '',
              email: '',
              phone: '',
              website: '',
              companyAddress: '',
              specialRequests: '',
              marketingMaterials: false,
              logoPlacement: false,
              speakingOpportunity: false,
            };
            setFormData(resetFormData);
            setCurrentStep(1);
            clearSavedData(); // Clear localStorage

          } catch (error) {
            console.error('❌ Error processing payment:', error);
            const errorMessage = `❌ Payment Processing Error\n\n` +
              `Your payment was successful, but there was an issue processing your registration.\n\n` +
              `Payment ID: ${response.razorpay_payment_id}\n` +
              `Please contact support at intelliglobalconferences@gmail.com\n` +
              `with your payment ID for assistance.`;
            alert(errorMessage);
          } finally {
            setPaymentLoading(false);
          }
        },
        retry: {
          enabled: true,
          max_count: 3
        },
        timeout: 900, // 15 minutes timeout
        remember_customer: false
      };

      // Debug Razorpay configuration before opening
      console.log('🚀 Opening Razorpay with options:', {
        key: options.key,
        amount: options.amount,
        currency: options.currency,
        method: options.method,
        order_id: options.order_id
      });

      // Enhanced UPI and payment method debugging
      console.log('💳 Payment Methods Configuration:', {
        upiEnabled: options.method?.upi,
        cardEnabled: options.method?.card,
        netbankingEnabled: options.method?.netbanking,
        walletEnabled: options.method?.wallet,
        currency: options.currency,
        upiConfig: options.upi,
        displayConfig: options.config?.display,
        razorpayKey: options.key?.substring(0, 10) + '...'
      });

      // Open Razorpay checkout with error handling
      try {
        console.log('🚀 Initializing Razorpay with validated options...');

        if (!window.Razorpay) {
          throw new Error('Razorpay library not loaded');
        }

        const rzp = new window.Razorpay(options);
        console.log('✅ Razorpay instance created successfully');

      // Add event listeners for debugging
      rzp.on('payment.failed', function (response: any) {
        console.error('❌ Payment failed:', response.error);
      });

      console.log('🔓 Opening Razorpay modal...');
        rzp.open();
        console.log('✅ Razorpay modal opened successfully');

      } catch (razorpayError) {
        console.error('❌ Razorpay initialization failed:', razorpayError);
        alert('Payment system initialization failed. Please refresh and try again.');
        setPaymentLoading(false);
        return;
      }

    } catch (error) {
      console.error('❌ Error initiating payment:', error);
      alert(error instanceof Error ? error.message : 'Error initiating payment. Please try again.');
      setPaymentLoading(false);
    }
  };

  const selectedTier = sponsorshipTiers.find(tier => tier._id === formData.tierId);
  const selectedConference = conferences.find(conf => conf._id === formData.conferenceId);
  const selectedDetailedConference = detailedConferences.find(conf => conf._id === formData.conferenceId);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Sponsor Registration
          </h1>
          <p className="text-lg text-gray-600">
            Join us as a sponsor and showcase your brand to industry leaders
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-6">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {step}
                </div>
                <div className="ml-2 text-sm font-medium text-gray-600">
                  {step === 1 && 'Selection'}
                  {step === 2 && 'Information'}
                  {step === 3 && 'Review'}
                  {step === 4 && 'Payment'}
                </div>
                {step < 4 && (
                  <div className={`ml-6 w-12 h-1 ${
                    step < currentStep ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Conference & Tier Selection */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Select Conference & Sponsorship Tier
                </h2>
                
                {/* Conference Selection */}
                <div>
                  <label htmlFor="conferenceId" className="block text-sm font-medium text-gray-700 mb-2">
                    Select Conference *
                  </label>
                  <select
                    name="conferenceId"
                    value={formData.conferenceId}
                    onChange={handleInputChange}
                    disabled={loading}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.conferenceId ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Choose a conference...</option>
                    {conferences && conferences.length > 0 ? (
                      conferences.map((conference) => (
                        <option key={conference._id} value={conference._id}>
                          {conference.title} - {new Date(conference.date).toLocaleDateString()} - {conference.location}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>
                        No conferences available
                      </option>
                    )}
                  </select>
                  {errors.conferenceId && (
                    <p className="mt-1 text-sm text-red-600">{errors.conferenceId}</p>
                  )}
                </div>

                {/* Sponsorship Tier Selection */}
                <div>
                  <label htmlFor="tierId" className="block text-sm font-medium text-gray-700 mb-2">
                    Select Sponsorship Tier *
                  </label>
                  <select
                    name="tierId"
                    value={formData.tierId}
                    onChange={handleInputChange}
                    disabled={loading}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.tierId ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Choose a sponsorship tier...</option>
                    {sponsorshipTiers.map((tier) => (
                      <option key={tier._id} value={tier._id}>
                        {tier.name} - {formatCurrency(tier.price)}
                      </option>
                    ))}
                  </select>
                  {errors.tierId && (
                    <p className="mt-1 text-sm text-red-600">{errors.tierId}</p>
                  )}
                </div>

                {/* Dynamic Pricing Display */}
                {selectedTier && (
                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-blue-900 mb-2">{selectedTier.name}</h3>
                        <p className="text-blue-800 mb-2">{selectedTier.description || 'No description available'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-blue-900">{formatCurrency(selectedTier.price)}</p>
                        <p className="text-sm text-blue-700">Total Amount</p>
                      </div>
                    </div>
                    {selectedTier.benefits && selectedTier.benefits.length > 0 && (
                      <div>
                        <p className="font-medium text-blue-900 mb-2">Benefits Included:</p>
                        <ul className="list-disc list-inside text-blue-800 text-sm space-y-1">
                          {selectedTier.benefits.map((benefitObj, index) => (
                            <li key={index}>
                              {typeof benefitObj === 'string' ? benefitObj : benefitObj.benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Selected Conference Display */}
                {selectedConference && (
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-green-900">Selected Conference:</h4>
                      {selectedDetailedConference && (
                        <button
                          type="button"
                          onClick={() => setShowConferenceDetails(!showConferenceDetails)}
                          className="text-sm text-blue-600 hover:text-blue-800 underline"
                        >
                          {showConferenceDetails ? 'Hide Details' : 'View Details'}
                        </button>
                      )}
                    </div>
                    <p className="text-green-800 font-medium">{selectedConference.title}</p>
                    <p className="text-sm text-green-700 mb-2">
                      📅 {new Date(selectedConference.date).toLocaleDateString()} • 📍 {selectedConference.location}
                    </p>

                    {/* Technology-related badge */}
                    {selectedDetailedConference?.isTechnologyRelated && (
                      <div className="mb-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          🤖 Technology Conference
                        </span>
                      </div>
                    )}

                    {/* Detailed Conference Information */}
                    {showConferenceDetails && selectedDetailedConference && (
                      <div className="mt-4 pt-4 border-t border-green-200">
                        <div className="space-y-3">
                          {/* Contact Information */}
                          {(selectedDetailedConference.email || selectedDetailedConference.registerNowUrl || selectedDetailedConference.submitAbstractUrl) && (
                            <div>
                              <h5 className="font-medium text-green-900 mb-1">Contact Information:</h5>
                              <div className="text-sm text-green-700 space-y-1">
                                {selectedDetailedConference.email && (
                                  <p>📧 {selectedDetailedConference.email}</p>
                                )}
                                {selectedDetailedConference.registerNowUrl && (
                                  <p>🔗 <a href={selectedDetailedConference.registerNowUrl} target="_blank" rel="noopener noreferrer">Register Now</a></p>
                                )}
                                {selectedDetailedConference.submitAbstractUrl && (
                                  <p>📝 <a href={selectedDetailedConference.submitAbstractUrl} target="_blank" rel="noopener noreferrer">Submit Abstract</a></p>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Attendee Count */}
                          {selectedDetailedConference.attendeeCount && (
                            <div>
                              <h5 className="font-medium text-green-900 mb-1">Expected Attendance:</h5>
                              <p className="text-sm text-green-700">
                                👥 {selectedDetailedConference.attendeeCount.toLocaleString()} attendees
                              </p>
                            </div>
                          )}

                          {/* Description */}
                          {(selectedDetailedConference.description || selectedDetailedConference.shortDescription) && (
                            <div>
                              <h5 className="font-medium text-green-900 mb-1">About:</h5>
                              <p className="text-sm text-green-700 leading-relaxed">
                                {selectedDetailedConference.shortDescription || selectedDetailedConference.description}
                              </p>
                            </div>
                          )}

                          {/* Topics */}
                          {selectedDetailedConference.topics && selectedDetailedConference.topics.length > 0 && (
                            <div>
                              <h5 className="font-medium text-green-900 mb-1">Topics:</h5>
                              <div className="flex flex-wrap gap-1">
                                {selectedDetailedConference.topics.slice(0, 8).map((topic, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs"
                                  >
                                    {topic}
                                  </span>
                                ))}
                                {selectedDetailedConference.topics.length > 8 && (
                                  <span className="px-2 py-1 bg-green-200 text-green-600 rounded text-xs">
                                    +{selectedDetailedConference.topics.length - 8} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Key Speakers */}
                          {selectedDetailedConference.keySpeakers && selectedDetailedConference.keySpeakers.length > 0 && (
                            <div>
                              <h5 className="font-medium text-green-900 mb-1">Key Speakers:</h5>
                              <div className="text-sm text-green-700 space-y-1">
                                {selectedDetailedConference.keySpeakers.slice(0, 3).map((speaker, index) => (
                                  <div key={index}>
                                    <span className="font-medium">{speaker.name}</span>
                                    {speaker.title && <span> - {speaker.title}</span>}
                                    {speaker.organization && <span className="text-green-600"> at {speaker.organization}</span>}
                                  </div>
                                ))}
                                {selectedDetailedConference.keySpeakers.length > 3 && (
                                  <p className="text-xs text-green-600">
                                    +{selectedDetailedConference.keySpeakers.length - 3} more speakers
                                  </p>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Highlights */}
                          {selectedDetailedConference.highlights && selectedDetailedConference.highlights.length > 0 && (
                            <div>
                              <h5 className="font-medium text-green-900 mb-1">Highlights:</h5>
                              <ul className="text-sm text-green-700 space-y-1">
                                {selectedDetailedConference.highlights.slice(0, 4).map((highlight, index) => (
                                  <li key={index} className="flex items-start">
                                    <span className="mr-2 text-green-500">•</span>
                                    {highlight}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Company Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Company Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.companyName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your company name"
                    />
                    {errors.companyName && (
                      <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Person *
                    </label>
                    <input
                      type="text"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.contactPerson ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter contact person name"
                    />
                    {errors.contactPerson && (
                      <p className="mt-1 text-sm text-red-600">{errors.contactPerson}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter email address"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 md:py-4 rounded-lg border-2 bg-white transition-all duration-300 focus:outline-none text-gray-900 placeholder-gray-500 text-sm md:text-base ${
                        errors.phone
                          ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                          : 'border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200'
                      }`}
                      placeholder="Enter phone number"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600 bg-red-50 px-2 py-1 rounded border border-red-200">{errors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                      Website (Optional)
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://www.yourcompany.com"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="companyAddress" className="block text-sm font-medium text-gray-700 mb-2">
                      Company Address (Optional)
                    </label>
                    <textarea
                      name="companyAddress"
                      value={formData.companyAddress}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your company address"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Review & Additional Information */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Review & Submit
                </h2>

                {/* Registration Summary */}
                <div className="bg-gray-50 p-6 rounded-lg border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Registration Summary</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-6">
                    <div>
                      <span className="font-medium text-gray-700">Conference:</span>
                      <p className="text-gray-900">{selectedConference?.title || 'Not selected'}</p>
                      {selectedConference && (
                        <p className="text-gray-600 text-xs">
                          📅 {new Date(selectedConference.date).toLocaleDateString()} • 📍 {selectedConference.location}
                        </p>
                      )}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Sponsorship Tier:</span>
                      <p className="text-gray-900">{selectedTier?.name || 'Not selected'}</p>
                      {selectedTier && (
                        <p className="text-2xl font-bold text-blue-600">{formatCurrency(selectedTier.price)}</p>
                      )}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Company:</span>
                      <p className="text-gray-900">{formData.companyName || 'Not provided'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Contact:</span>
                      <p className="text-gray-900">{formData.contactPerson || 'Not provided'}</p>
                      <p className="text-gray-600 text-xs">{formData.email}</p>
                    </div>
                  </div>
                </div>

                {/* Additional Options */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Additional Services (Optional)</h4>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="marketingMaterials"
                        checked={formData.marketingMaterials}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Include marketing materials in conference bags</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="logoPlacement"
                        checked={formData.logoPlacement}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Logo placement on conference website</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="speakingOpportunity"
                        checked={formData.speakingOpportunity}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Interested in speaking opportunities</span>
                    </label>
                  </div>
                </div>

                {/* Special Requests */}
                <div>
                  <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-2">
                    Special Requests or Comments
                  </label>
                  <textarea
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Any special requirements, dietary restrictions, or additional information..."
                  />
                </div>
              </div>
            )}

            {/* Step 4: Payment Processing */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Payment Processing
                </h2>

                {/* Final Registration Summary */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">Final Registration Summary</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium text-blue-800">Conference:</span>
                        <p className="text-blue-900 font-semibold">{selectedConference?.title || 'Not selected'}</p>
                        {selectedConference && (
                          <p className="text-blue-700 text-sm">
                            📅 {new Date(selectedConference.date).toLocaleDateString()} • 📍 {selectedConference.location}
                          </p>
                        )}
                      </div>

                      <div>
                        <span className="font-medium text-blue-800">Company:</span>
                        <p className="text-blue-900 font-semibold">{formData.companyName}</p>
                        <p className="text-blue-700 text-sm">{formData.contactPerson} • {formData.email}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <span className="font-medium text-blue-800">Sponsorship Tier:</span>
                        <p className="text-blue-900 font-semibold">{selectedTier?.name || 'Not selected'}</p>
                        <p className="text-blue-700 text-sm">{selectedTier?.description || 'No description available'}</p>
                      </div>

                      <div className="bg-white p-4 rounded-lg border border-blue-300">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-blue-900">Total Amount:</span>
                          <span className="text-3xl font-bold text-blue-600">
                            {selectedTier ? formatCurrency(selectedTier.price) : '$0.00'}
                          </span>
                        </div>
                        <p className="text-sm text-blue-700 mt-1">One-time sponsorship fee</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Options */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Payment Method</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => handlePayment('Stripe')}
                      disabled={paymentLoading || !razorpayLoaded}
                      className="w-full px-8 py-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center space-x-3 transition-colors"
                    >
                      {paymentLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Processing Payment...</span>
                        </>
                      ) : (
                        <>
                          <span className="text-xl">💳</span>
                          <span>Pay with Stripe</span>
                          <span className="text-sm opacity-80">• Secure Payment</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handlePayment('PayPal')}
                      disabled={paymentLoading || !razorpayLoaded}
                      className="w-full px-8 py-4 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 disabled:opacity-50 flex items-center justify-center space-x-3 transition-colors"
                    >
                      {paymentLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Processing Payment...</span>
                        </>
                      ) : (
                        <>
                          <span className="text-xl">🅿️</span>
                          <span>Pay with PayPal</span>
                          <span className="text-sm opacity-80">• Secure Payment</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Security Information */}
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-green-600">🔒</span>
                    <span className="text-sm font-medium text-green-900">Secure Payment Processing</span>
                  </div>
                  <p className="text-sm text-green-800">
                    Your payment is processed securely through Razorpay with 256-bit SSL encryption.
                    Both payment options support UPI, cards, net banking, and digital wallets.
                  </p>
                  <div className="mt-2 text-xs text-green-700">
                    <p>• PCI DSS Level 1 compliant</p>
                    <p>• Your card details are never stored on our servers</p>
                    <p>• Invoice will be automatically generated and emailed after successful payment</p>
                  </div>
                </div>

                {/* UPI Payment Information - Prominently Displayed */}
                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-lg border-2 border-orange-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-2xl">📱</span>
                    <span className="text-lg font-semibold text-orange-900">Quick UPI Payments Available</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div>
                      <p className="text-base font-semibold text-orange-800 mb-3">🚀 Instant UPI Payment Options:</p>
                      <div className="text-sm text-orange-700 space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                          <p><strong>Google Pay</strong> - Tap & Pay</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                          <p><strong>PhonePe</strong> - Quick Payment</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                          <p><strong>Paytm</strong> - Secure & Fast</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                          <p><strong>BHIM UPI</strong> - Government App</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                          <p><strong>Any UPI App</strong> - Universal Support</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-800 mb-2">Other Methods:</p>
                      <div className="text-xs text-blue-700 space-y-1">
                        <p>• Credit/Debit Cards</p>
                        <p>• Net Banking</p>
                        <p>• Digital Wallets</p>
                        <p>• EMI Options</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 p-2 bg-blue-100 rounded text-xs text-blue-800">
                    <p className="font-medium">🧪 Test Mode Active:</p>
                    <p>Use test UPI ID: <code className="bg-blue-200 px-1 rounded">success@razorpay</code> or test cards for testing payments</p>
                  </div>

                  {/* UPI Testing Note */}
                  <div className="mt-2 p-2 bg-yellow-100 rounded text-xs text-yellow-800 border border-yellow-300">
                    <p className="font-medium">⚠️ UPI Testing Note:</p>
                    <p>If UPI options don't appear in the payment modal, this is due to test account limitations. UPI is fully functional in production mode.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentStep === 1 || paymentLoading}
                className={`px-6 py-3 rounded-lg font-medium ${
                  currentStep === 1 || paymentLoading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-600 text-white hover:bg-gray-700'
                }`}
              >
                Previous
              </button>

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                  {currentStep === 3 ? 'Proceed to Payment' : 'Next'}
                </button>
              ) : (
                <div className="text-sm text-gray-600">
                  Select a payment method above to complete your registration
                </div>
              )}
            </div>

            {/* Step 3 Information */}
            {currentStep === 3 && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-blue-600">📋</span>
                  <span className="text-sm font-medium text-blue-900">Review Your Registration</span>
                </div>
                <p className="text-sm text-blue-800">
                  Please review all information above. Click "Proceed to Payment" to continue to the secure payment processing step.
                </p>
                {selectedTier && (
                  <div className="mt-3 p-3 bg-white rounded border">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">Total Amount:</span>
                      <span className="text-2xl font-bold text-blue-600">{formatCurrency(selectedTier.price)}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </form>
        </div>

        {/* Back to Sponsorship Link */}
        <div className="text-center mt-8">
          <Link 
            href="/sponsorship" 
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Sponsorship Information
          </Link>
        </div>
      </div>
    </div>
  );
}
