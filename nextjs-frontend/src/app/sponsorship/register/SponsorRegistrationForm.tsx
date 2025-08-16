'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCurrency } from '../../../contexts/CurrencyContext';

// Payments are disabled in this deployment

// Define interfaces locally to avoid server/client import issues
interface SponsorshipTier {
  _id: string;
  name: string;
  slug: { current: string };
  pricing: {
    usd: number;
    eur: number;
    gbp: number;
    inr: number;
  };
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

// Currency types
type Currency = 'USD' | 'EUR' | 'GBP' | 'INR';

// Currency helper functions
function getPriceForCurrency(tier: SponsorshipTier, currency: Currency): number {
  switch (currency) {
    case 'USD':
      return tier.pricing.usd;
    case 'EUR':
      return tier.pricing.eur;
    case 'GBP':
      return tier.pricing.gbp;
    case 'INR':
      return tier.pricing.inr;
    default:
      return tier.pricing.usd;
  }
}

// Format currency with proper locale and symbol
function formatCurrency(amount: number, currency: Currency = 'INR'): string {
  const localeMap: Record<Currency, string> = {
    'USD': 'en-US',
    'EUR': 'de-DE',
    'GBP': 'en-GB',
    'INR': 'en-IN',
  };

  return new Intl.NumberFormat(localeMap[currency], {
    style: 'currency',
    currency: currency,
  }).format(amount);
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

  // Currency context
  const { selectedCurrency } = useCurrency();

  // State for site settings (admin contact info)
  const [siteSettings, setSiteSettings] = useState<any>(null);

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
      customAmount: '',
      isCustomAmount: false,

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
  const [razorpayLoaded, setRazorpayLoaded] = useState(false); // deprecated
  const [formData, setFormData] = useState(initializeFormState);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [detailedConferences, setDetailedConferences] = useState<(DetailedConferenceEvent & { isTechnologyRelated?: boolean })[]>([]);
  const [showConferenceDetails, setShowConferenceDetails] = useState(false);

  const PAYMENTS_ENABLED = false;

  // Payments are disabled - no external scripts needed
  useEffect(() => {
    if (!PAYMENTS_ENABLED) {
      setRazorpayLoaded(false); // Keep disabled
      return;
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

  // Fetch site settings for admin contact info
  useEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        const response = await fetch('/api/site-settings');
        if (response.ok) {
          const settings = await response.json();
          setSiteSettings(settings);
        }
      } catch (error) {
        console.error('Error fetching site settings:', error);
      }
    };

    fetchSiteSettings();
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

    let newFormData = {
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    };

    // Handle tier selection changes
    if (name === 'tierId') {
      if (value === 'custom') {
        newFormData.isCustomAmount = true;
        newFormData.tierId = '';
      } else {
        newFormData.isCustomAmount = false;
        newFormData.customAmount = '';
      }
    }

    // Handle custom amount input
    if (name === 'customAmount') {
      // Only allow numbers and decimal point
      const numericValue = value.replace(/[^0-9.]/g, '');
      // Ensure only one decimal point
      const parts = numericValue.split('.');
      if (parts.length > 2) {
        return; // Don't update if more than one decimal point
      }
      newFormData.customAmount = numericValue;
    }

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

        if (formData.isCustomAmount) {
          if (!formData.customAmount.trim()) {
            newErrors.customAmount = 'Please enter a custom amount';
          } else {
            const amount = parseFloat(formData.customAmount);
            if (isNaN(amount) || amount <= 0) {
              newErrors.customAmount = 'Please enter a valid amount greater than 0';
            } else if (amount > 100000) {
              newErrors.customAmount = 'Maximum custom amount is $100,000';
            }
          }
        } else {
          if (!formData.tierId) newErrors.tierId = 'Please select a sponsorship tier';
        }
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
    if (!PAYMENTS_ENABLED) {
      alert('Payments are currently disabled. Please contact support.');
      return;
    }
    if (!validateStep(currentStep)) return;

    setPaymentLoading(true);

    try {
      const selectedConference = conferences.find(c => c._id === formData.conferenceId);

      // Handle custom amount or regular tier
      let selectedTier = null;
      let usdAmount = 0;
      let tierName = '';

      if (formData.isCustomAmount) {
        usdAmount = parseFloat(formData.customAmount);
        tierName = 'Custom Sponsorship';
        if (isNaN(usdAmount) || usdAmount <= 0) {
          throw new Error('Please enter a valid custom amount');
        }
      } else {
        selectedTier = sponsorshipTiers.find(t => t._id === formData.tierId);
        if (!selectedTier) {
          throw new Error('Please select a sponsorship tier');
        }
        usdAmount = getPriceForCurrency(selectedTier, selectedCurrency);
        tierName = selectedTier.name;
      }

      if (!selectedConference) {
        throw new Error('Please select a conference');
      }

      const registrationId = generateRegistrationId();

      // Convert USD to INR for UPI support (approximate conversion for testing)
      const inrAmount = Math.round(usdAmount * 83); // Approximate USD to INR conversion

      const sponsorshipData = {
        registrationId,
        ...formData,
        conferenceName: selectedConference.title,
        tierName: tierName,
        amount: usdAmount, // USD amount (custom or tier price)
        amountINR: inrAmount, // INR amount for payment processing
        isCustomAmount: formData.isCustomAmount,
        customAmount: formData.isCustomAmount ? usdAmount : undefined,
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
        description: `${tierName} Sponsorship - ${selectedConference.title}`,
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
          sponsorship_tier: tierName,
          conference: selectedConference.title,
          is_custom_amount: formData.isCustomAmount ? 'true' : 'false',
          custom_amount_usd: formData.isCustomAmount ? usdAmount.toString() : '',
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

  // Handle both regular tiers and custom amounts
  const selectedTier = formData.isCustomAmount ? null : sponsorshipTiers.find(tier => tier._id === formData.tierId);
  const selectedConference = conferences.find(conf => conf._id === formData.conferenceId);
  const selectedDetailedConference = detailedConferences.find(conf => conf._id === formData.conferenceId);

  // Create a display object for custom amounts
  const displayTier = formData.isCustomAmount ? {
    name: 'Custom Sponsorship',
    price: parseFloat(formData.customAmount) || 0,
    description: 'Custom sponsorship package - details to be discussed with admin team'
  } : selectedTier ? {
    ...selectedTier,
    price: getPriceForCurrency(selectedTier, selectedCurrency)
  } : null;

  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-12">
      <div className="max-w-4xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="sponsorship-form-header text-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">
            Sponsor Registration
          </h1>
          <p className="text-base md:text-lg text-gray-600">
            Join us as a sponsor and showcase your brand to industry leaders
          </p>
        </div>

        {/* Progress Steps */}
        <div className="progress-steps-container mb-6 md:mb-8">
          <div className="progress-steps flex items-center justify-center space-x-3 md:space-x-6">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="progress-step flex items-center">
                <div className={`progress-step-circle w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs md:text-sm font-medium ${
                  step <= currentStep
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {step}
                </div>
                <div className="progress-step-label ml-1 md:ml-2 text-xs md:text-sm font-medium text-gray-600 hidden sm:block">
                  {step === 1 && 'Selection'}
                  {step === 2 && 'Information'}
                  {step === 3 && 'Review'}
                  {step === 4 && 'Payment'}
                </div>
                {step < 4 && (
                  <div className={`progress-step-connector ml-2 md:ml-6 w-6 md:w-12 h-1 ${
                    step < currentStep ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="sponsorship-form-container bg-white rounded-lg shadow-lg p-4 md:p-8">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Conference & Tier Selection */}
            {currentStep === 1 && (
              <div className="space-y-4 md:space-y-6">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4 md:mb-6">
                  Select Conference & Sponsorship Tier
                </h2>

                {/* Conference Selection */}
                <div className="mobile-form-field">
                  <label htmlFor="conferenceId" className="mobile-form-label block text-sm font-medium text-gray-700 mb-2">
                    Select Conference *
                  </label>
                  <select
                    name="conferenceId"
                    value={formData.conferenceId}
                    onChange={handleInputChange}
                    disabled={loading}
                    className={`mobile-form-select w-full px-3 md:px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.conferenceId ? 'border-red-500 error' : 'border-gray-300'
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
                    <p className="mobile-form-error mt-1 text-sm text-red-600">{errors.conferenceId}</p>
                  )}
                </div>

                {/* Sponsorship Tier Selection */}
                <div className="mobile-form-field">
                  <label className="mobile-form-label block text-sm font-medium text-gray-700 mb-4">
                    Select Sponsorship Option *
                  </label>

                  {/* Sponsorship Option Selection */}
                  <div className="space-y-4">
                    {/* Predefined Tiers Option */}
                    <div>
                      <label className="flex items-center space-x-3 cursor-pointer mb-3">
                        <input
                          type="radio"
                          name="sponsorshipOption"
                          checked={!formData.isCustomAmount}
                          onChange={(e) => {
                            if (e.target.checked) {
                              const newFormData = {
                                ...formData,
                                isCustomAmount: false,
                                customAmount: ''
                              };
                              setFormData(newFormData);
                              saveFormData(newFormData);
                            }
                          }}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Choose from Available Packages
                        </span>
                      </label>

                      {!formData.isCustomAmount && (
                        <div className="ml-7">
                          <select
                            name="tierId"
                            value={formData.tierId}
                            onChange={handleInputChange}
                            disabled={loading}
                            className={`mobile-form-select w-full px-3 md:px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              errors.tierId ? 'border-red-500 error' : 'border-gray-300'
                            }`}
                          >
                            <option value="">Choose a sponsorship tier...</option>
                            {sponsorshipTiers.map((tier) => (
                              <option key={tier._id} value={tier._id}>
                                {tier.name} - {formatCurrency(getPriceForCurrency(tier, selectedCurrency), selectedCurrency)}
                              </option>
                            ))}
                          </select>
                          {errors.tierId && (
                            <p className="mobile-form-error mt-1 text-sm text-red-600">{errors.tierId}</p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* OR Divider */}
                    <div className="flex items-center my-4">
                      <div className="flex-1 border-t border-gray-300"></div>
                      <span className="px-4 text-sm text-gray-500 bg-white">OR</span>
                      <div className="flex-1 border-t border-gray-300"></div>
                    </div>

                    {/* Custom Amount Option */}
                    <div>
                      <label className="flex items-center space-x-3 cursor-pointer mb-3">
                        <input
                          type="radio"
                          name="sponsorshipOption"
                          checked={formData.isCustomAmount}
                          onChange={(e) => {
                            if (e.target.checked) {
                              const newFormData = {
                                ...formData,
                                isCustomAmount: true,
                                tierId: ''
                              };
                              setFormData(newFormData);
                              saveFormData(newFormData);
                            }
                          }}
                          className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Custom Sponsorship Amount
                        </span>
                      </label>

                      {formData.isCustomAmount && (
                        <div className="mt-3 ml-7">
                          <div className="relative">
                            <span className="absolute left-3 top-3 text-gray-500">$</span>
                            <input
                              type="text"
                              name="customAmount"
                              value={formData.customAmount}
                              onChange={handleInputChange}
                              placeholder="Enter amount (any positive value)"
                              disabled={loading}
                              className={`mobile-form-input w-full pl-8 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                                errors.customAmount ? 'border-red-500 error' : 'border-gray-300'
                              }`}
                            />
                          </div>
                          {errors.customAmount && (
                            <p className="mobile-form-error mt-1 text-sm text-red-600">{errors.customAmount}</p>
                          )}

                          {/* Admin Contact Information for Custom Amounts */}
                          <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0">
                                <svg className="w-5 h-5 text-orange-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <div className="flex-1">
                                <h4 className="text-sm font-semibold text-orange-800 mb-2">
                                  Custom Sponsorship Package Details
                                </h4>
                                <p className="text-sm text-orange-700 mb-3">
                                  For custom sponsorship amounts, please contact our admin team to discuss package details and benefits tailored to your investment.
                                </p>

                                {siteSettings?.contactInfo && (
                                  <div className="space-y-2">
                                    <div className="flex items-center space-x-2 text-sm">
                                      <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                      </svg>
                                      <span className="text-orange-800">
                                        <strong>Email:</strong> {siteSettings.contactInfo.email}
                                      </span>
                                    </div>

                                    {siteSettings.contactInfo.phone && (
                                      <div className="flex items-center space-x-2 text-sm">
                                        <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                        </svg>
                                        <span className="text-orange-800">
                                          <strong>Phone:</strong> {siteSettings.contactInfo.phone}
                                        </span>
                                      </div>
                                    )}

                                    {siteSettings.contactInfo.whatsapp && (
                                      <div className="flex items-center space-x-2 text-sm">
                                        <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.106"/>
                                        </svg>
                                        <span className="text-orange-800">
                                          <strong>WhatsApp:</strong> {siteSettings.contactInfo.whatsapp}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                )}

                                <p className="text-xs text-orange-600 mt-3">
                                  💡 You can still proceed with payment for your custom amount. Our team will contact you within 24 hours to finalize the sponsorship package details.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Dynamic Pricing Display */}
                {displayTier && (
                  <div className="mobile-summary-card">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4 space-y-3 md:space-y-0">
                      <div className="flex-1">
                        <h3 className="text-lg md:text-xl font-semibold text-blue-900 mb-2">
                          {displayTier.name}
                          {formData.isCustomAmount && (
                            <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                              Custom Amount
                            </span>
                          )}
                        </h3>
                        <p className="text-sm md:text-base text-blue-800 mb-2">{displayTier.description || 'No description available'}</p>
                      </div>
                      <div className="text-center md:text-right">
                        <p className="mobile-summary-price text-2xl md:text-3xl font-bold text-blue-900">{formatCurrency(displayTier.price, selectedCurrency)}</p>
                        <p className="text-xs md:text-sm text-blue-700">Total Amount</p>
                      </div>
                    </div>
                    {formData.isCustomAmount ? (
                      <div>
                        <p className="font-medium text-blue-900 mb-2">Custom Package Benefits:</p>
                        <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                          <p className="text-sm text-orange-800">
                            📞 Our admin team will contact you within 24 hours to discuss and customize your sponsorship package benefits based on your investment level.
                          </p>
                        </div>
                      </div>
                    ) : (
                      selectedTier?.benefits && selectedTier.benefits.length > 0 && (
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
                      )
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
              <div className="space-y-4 md:space-y-6">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4 md:mb-6">
                  Company Information
                </h2>

                <div className="mobile-form-grid tablet-form-grid grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="mobile-form-field">
                    <label htmlFor="companyName" className="mobile-form-label block text-sm font-medium text-gray-700 mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className={`mobile-form-input tablet-form-input w-full px-3 md:px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.companyName ? 'border-red-500 error' : 'border-gray-300'
                      }`}
                      placeholder="Enter your company name"
                    />
                    {errors.companyName && (
                      <p className="mobile-form-error mt-1 text-sm text-red-600">{errors.companyName}</p>
                    )}
                  </div>

                  <div className="mobile-form-field">
                    <label htmlFor="contactPerson" className="mobile-form-label block text-sm font-medium text-gray-700 mb-2">
                      Contact Person *
                    </label>
                    <input
                      type="text"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleInputChange}
                      className={`mobile-form-input tablet-form-input w-full px-3 md:px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.contactPerson ? 'border-red-500 error' : 'border-gray-300'
                      }`}
                      placeholder="Enter contact person name"
                    />
                    {errors.contactPerson && (
                      <p className="mobile-form-error mt-1 text-sm text-red-600">{errors.contactPerson}</p>
                    )}
                  </div>

                  <div className="mobile-form-field">
                    <label htmlFor="email" className="mobile-form-label block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`mobile-form-input tablet-form-input w-full px-3 md:px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.email ? 'border-red-500 error' : 'border-gray-300'
                      }`}
                      placeholder="Enter email address"
                    />
                    {errors.email && (
                      <p className="mobile-form-error mt-1 text-sm text-red-600">{errors.email}</p>
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
                      <span className="font-medium text-gray-700">Sponsorship Option:</span>
                      <p className="text-gray-900">
                        {formData.isCustomAmount ? 'Custom Sponsorship' : (selectedTier?.name || 'Not selected')}
                        {formData.isCustomAmount && (
                          <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                            Custom
                          </span>
                        )}
                      </p>
                      {displayTier && (
                        <p className="text-2xl font-bold text-blue-600">{formatCurrency(displayTier.price, selectedCurrency)}</p>
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
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
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
                        <span className="font-medium text-blue-800">Sponsorship Option:</span>
                        <p className="text-blue-900 font-semibold">
                          {formData.isCustomAmount ? 'Custom Sponsorship' : (selectedTier?.name || 'Not selected')}
                          {formData.isCustomAmount && (
                            <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                              Custom
                            </span>
                          )}
                        </p>
                        <p className="text-blue-700 text-sm">
                          {formData.isCustomAmount
                            ? 'Custom sponsorship package - details to be discussed with admin team'
                            : (selectedTier?.description || 'No description available')
                          }
                        </p>
                      </div>

                      <div className="bg-white p-4 rounded-lg border border-blue-300">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-blue-900">Total Amount:</span>
                          <span className="text-3xl font-bold text-blue-600">
                            {displayTier ? formatCurrency(displayTier.price, selectedCurrency) : formatCurrency(0, selectedCurrency)}
                          </span>
                        </div>
                        <p className="text-sm text-blue-700 mt-1">One-time sponsorship fee</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Options */}
                <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <span className="text-2xl">⚠️</span>
                      <h4 className="text-lg font-semibold text-yellow-800">Payments Currently Disabled</h4>
                    </div>
                    <p className="text-yellow-700 mb-4">
                      Online payments are temporarily disabled on this deployment. To complete your sponsorship registration:
                    </p>
                    <div className="space-y-2 text-yellow-700">
                      <p><strong>📧 Email:</strong> intelliglobalconferences@gmail.com</p>
                      <p><strong>📞 Phone:</strong> Contact our team for payment arrangements</p>
                      <p><strong>💼 Bank Transfer:</strong> Wire transfer details available upon request</p>
                    </div>
                    <div className="mt-4 p-3 bg-yellow-100 rounded border border-yellow-300">
                      <p className="text-sm text-yellow-800">
                        <strong>Note:</strong> Your registration details have been saved. Our team will contact you within 24 hours to arrange payment and finalize your sponsorship.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-blue-600">📞</span>
                    <span className="text-sm font-medium text-blue-900">Need Assistance?</span>
                  </div>
                  <p className="text-sm text-blue-800 mb-2">
                    Our team is ready to help you complete your sponsorship registration.
                  </p>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• Email: intelliglobalconferences@gmail.com</li>
                    <li>• Response time: Within 24 hours</li>
                    <li>• Multiple payment options available</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mobile-form-navigation flex flex-col md:flex-row justify-between mt-6 md:mt-8 gap-3 md:gap-0">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentStep === 1 || paymentLoading}
                className={`mobile-form-button mobile-form-button-secondary tablet-form-button px-4 md:px-6 py-3 rounded-lg font-medium ${
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
                  className="mobile-form-button mobile-form-button-primary tablet-form-button px-4 md:px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                  {currentStep === 3 ? 'Submit Registration' : 'Next'}
                </button>
              ) : (
                <div className="text-sm text-gray-600 text-center md:text-left">
                  Your registration will be submitted and our team will contact you for payment arrangements
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
                  Please review all information above. Our team will contact you to arrange payment after you submit this form.
                </p>
                {selectedTier && (
                  <div className="mt-3 p-3 bg-white rounded border">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">Total Amount:</span>
                      <span className="text-2xl font-bold text-blue-600">{formatCurrency(getPriceForCurrency(selectedTier, selectedCurrency), selectedCurrency)}</span>
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
