import React from 'react';
import { formatCurrency, formatDate } from '../getSponsorshipData';

interface InvoiceData {
  invoiceNumber: string;
  date: string;
  company: string;
  contact: string;
  email: string;
  conference: string;
  sponsorshipTier: string;
  amount: number;
  currency: string;
  paymentId: string;
  billingAddress: {
    street: string;
    city: string;
    state?: string;
    postalCode?: string;
    country: string;
  };
  adminEmail?: string;
  companyLogo?: string;
}

interface InvoiceTemplateProps {
  data: InvoiceData;
  siteSettings?: any;
}

export default function InvoiceTemplate({ data, siteSettings }: InvoiceTemplateProps) {
  const logoUrl = siteSettings?.logo?.asset?.url;
  
  return (
    <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          {logoUrl && (
            <img 
              src={logoUrl} 
              alt="Company Logo" 
              className="h-16 w-auto mb-4"
            />
          )}
          <h1 className="text-3xl font-bold text-gray-900">INVOICE</h1>
          <p className="text-gray-600">Sponsorship Registration</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600 mb-2">
            #{data.invoiceNumber}
          </div>
          <div className="text-sm text-gray-600">
            <p>Date: {formatDate(data.date)}</p>
            <p>Payment ID: {data.paymentId}</p>
          </div>
        </div>
      </div>

      {/* Company Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">From:</h3>
          <div className="text-gray-700">
            <p className="font-semibold">Intelli Global Conferences</p>
            {siteSettings?.contactInfo?.email && (
              <p>{siteSettings.contactInfo.email}</p>
            )}
            {siteSettings?.contactInfo?.phone && (
              <p>{siteSettings.contactInfo.phone}</p>
            )}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Bill To:</h3>
          <div className="text-gray-700">
            <p className="font-semibold">{data.company}</p>
            <p>{data.contact}</p>
            <p>{data.email}</p>
            <div className="mt-2">
              <p>{data.billingAddress.street}</p>
              <p>
                {data.billingAddress.city}
                {data.billingAddress.state && `, ${data.billingAddress.state}`}
                {data.billingAddress.postalCode && ` ${data.billingAddress.postalCode}`}
              </p>
              <p>{data.billingAddress.country}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="mb-8">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
                Description
              </th>
              <th className="border border-gray-300 px-4 py-3 text-right font-semibold text-gray-900">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-4">
                <div>
                  <p className="font-semibold text-gray-900">
                    {data.sponsorshipTier} Sponsorship
                  </p>
                  <p className="text-sm text-gray-600">
                    Conference: {data.conference}
                  </p>
                  <p className="text-sm text-gray-600">
                    Registration Date: {formatDate(data.date)}
                  </p>
                </div>
              </td>
              <td className="border border-gray-300 px-4 py-4 text-right">
                <span className="text-lg font-semibold text-gray-900">
                  {formatCurrency(data.amount, data.currency)}
                </span>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="bg-gray-50">
              <td className="border border-gray-300 px-4 py-4 font-semibold text-gray-900">
                Total Amount
              </td>
              <td className="border border-gray-300 px-4 py-4 text-right">
                <span className="text-xl font-bold text-blue-600">
                  {formatCurrency(data.amount, data.currency)}
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Payment Information */}
      <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
        <h3 className="text-lg font-semibold text-green-800 mb-2">Payment Confirmed</h3>
        <div className="text-sm text-green-700">
          <p>Payment has been successfully processed.</p>
          <p>Transaction ID: {data.paymentId}</p>
          <p>Payment Date: {formatDate(data.date)}</p>
        </div>
      </div>

      {/* Terms and Notes */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Terms & Conditions</h3>
        <div className="text-sm text-gray-600 space-y-2">
          <p>
            • This invoice confirms your sponsorship registration for the specified conference.
          </p>
          <p>
            • Our team will contact you within 24-48 hours to discuss sponsorship benefits and logistics.
          </p>
          <p>
            • All sponsorship benefits are subject to the terms outlined in your sponsorship agreement.
          </p>
          <p>
            • For any questions regarding this invoice, please contact us at{' '}
            {data.adminEmail || siteSettings?.contactInfo?.email || 'intelliglobalconferences@gmail.com'}.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t text-center text-sm text-gray-500">
        <p>Thank you for your sponsorship and support of scientific advancement!</p>
        <p className="mt-2">
          This is a computer-generated invoice and does not require a signature.
        </p>
      </div>
    </div>
  );
}

// Function to generate HTML string for email
export function generateInvoiceHTML(data: InvoiceData, siteSettings?: any): string {
  const logoUrl = siteSettings?.logo?.asset?.url;
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice ${data.invoiceNumber}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; }
        .logo { height: 60px; }
        .invoice-title { font-size: 28px; font-weight: bold; color: #1f2937; }
        .invoice-number { font-size: 20px; font-weight: bold; color: #2563eb; }
        .section { margin-bottom: 25px; }
        .section-title { font-size: 16px; font-weight: bold; margin-bottom: 10px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #d1d5db; padding: 12px; text-align: left; }
        th { background-color: #f9fafb; font-weight: bold; }
        .total-row { background-color: #f9fafb; font-weight: bold; }
        .total-amount { font-size: 18px; color: #2563eb; }
        .payment-confirmed { background-color: #ecfdf5; border: 1px solid #10b981; padding: 15px; border-radius: 8px; }
        .terms { font-size: 14px; color: #6b7280; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af; }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          ${logoUrl ? `<img src="${logoUrl}" alt="Company Logo" class="logo">` : ''}
          <h1 class="invoice-title">INVOICE</h1>
          <p>Sponsorship Registration</p>
        </div>
        <div style="text-align: right;">
          <div class="invoice-number">#${data.invoiceNumber}</div>
          <p>Date: ${formatDate(data.date)}</p>
          <p>Payment ID: ${data.paymentId}</p>
        </div>
      </div>

      <div class="grid section">
        <div>
          <h3 class="section-title">From:</h3>
          <p><strong>Intelli Global Conferences</strong></p>
          ${siteSettings?.contactInfo?.email ? `<p>${siteSettings.contactInfo.email}</p>` : ''}
          ${siteSettings?.contactInfo?.phone ? `<p>${siteSettings.contactInfo.phone}</p>` : ''}
        </div>
        
        <div>
          <h3 class="section-title">Bill To:</h3>
          <p><strong>${data.company}</strong></p>
          <p>${data.contact}</p>
          <p>${data.email}</p>
          <p>${data.billingAddress.street}</p>
          <p>${data.billingAddress.city}${data.billingAddress.state ? `, ${data.billingAddress.state}` : ''}${data.billingAddress.postalCode ? ` ${data.billingAddress.postalCode}` : ''}</p>
          <p>${data.billingAddress.country}</p>
        </div>
      </div>

      <div class="section">
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th style="text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>${data.sponsorshipTier} Sponsorship</strong><br>
                Conference: ${data.conference}<br>
                Registration Date: ${formatDate(data.date)}
              </td>
              <td style="text-align: right;">
                <strong>${formatCurrency(data.amount, data.currency)}</strong>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="total-row">
              <td><strong>Total Amount</strong></td>
              <td style="text-align: right;">
                <span class="total-amount"><strong>${formatCurrency(data.amount, data.currency)}</strong></span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div class="payment-confirmed section">
        <h3 style="color: #065f46; margin-bottom: 10px;">Payment Confirmed</h3>
        <p style="color: #047857;">Payment has been successfully processed.</p>
        <p style="color: #047857;">Transaction ID: ${data.paymentId}</p>
        <p style="color: #047857;">Payment Date: ${formatDate(data.date)}</p>
      </div>

      <div class="section">
        <h3 class="section-title">Terms & Conditions</h3>
        <div class="terms">
          <p>• This invoice confirms your sponsorship registration for the specified conference.</p>
          <p>• Our team will contact you within 24-48 hours to discuss sponsorship benefits and logistics.</p>
          <p>• All sponsorship benefits are subject to the terms outlined in your sponsorship agreement.</p>
          <p>• For any questions regarding this invoice, please contact us at ${data.adminEmail || siteSettings?.contactInfo?.email || 'intelliglobalconferences@gmail.com'}.</p>
        </div>
      </div>

      <div class="footer">
        <p>Thank you for your sponsorship and support of scientific advancement!</p>
        <p>This is a computer-generated invoice and does not require a signature.</p>
      </div>
    </body>
    </html>
  `;
}
