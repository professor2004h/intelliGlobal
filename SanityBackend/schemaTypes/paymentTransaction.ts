import { defineField, defineType } from 'sanity';

const paymentTransaction = defineType({
  name: 'paymentTransaction',
  title: 'Payment Transaction',
  type: 'document',
  fields: [
    defineField({
      name: 'transactionId',
      title: 'Transaction ID',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Unique transaction identifier',
      readOnly: true,
    }),
    defineField({
      name: 'sponsorRegistration',
      title: 'Sponsor Registration',
      type: 'reference',
      to: [{ type: 'sponsorRegistration' }],
      validation: (Rule) => Rule.required(),
      description: 'Associated sponsor registration',
    }),
    defineField({
      name: 'paymentGateway',
      title: 'Payment Gateway',
      type: 'string',
      options: {
        list: [
          { title: 'Razorpay', value: 'razorpay' },
          { title: 'Stripe', value: 'stripe' },
          { title: 'PayPal', value: 'paypal' },
          { title: 'Bank Transfer', value: 'bank_transfer' },
          { title: 'Manual', value: 'manual' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'gatewayTransactionId',
      title: 'Gateway Transaction ID',
      type: 'string',
      description: 'Transaction ID from the payment gateway',
    }),
    defineField({
      name: 'amount',
      title: 'Amount',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
      description: 'Transaction amount',
    }),
    defineField({
      name: 'currency',
      title: 'Currency',
      type: 'string',
      validation: (Rule) => Rule.required(),
      initialValue: 'USD',
      options: {
        list: [
          { title: 'USD - US Dollar', value: 'USD' },
          { title: 'EUR - Euro', value: 'EUR' },
          { title: 'GBP - British Pound', value: 'GBP' },
          { title: 'INR - Indian Rupee', value: 'INR' },
          { title: 'CAD - Canadian Dollar', value: 'CAD' },
          { title: 'AUD - Australian Dollar', value: 'AUD' },
        ],
      },
    }),
    defineField({
      name: 'status',
      title: 'Transaction Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Processing', value: 'processing' },
          { title: 'Completed', value: 'completed' },
          { title: 'Failed', value: 'failed' },
          { title: 'Cancelled', value: 'cancelled' },
          { title: 'Refunded', value: 'refunded' },
          { title: 'Partially Refunded', value: 'partially_refunded' },
        ],
      },
      initialValue: 'pending',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'paymentMethod',
      title: 'Payment Method',
      type: 'string',
      options: {
        list: [
          { title: 'Credit Card', value: 'credit_card' },
          { title: 'Debit Card', value: 'debit_card' },
          { title: 'Bank Transfer', value: 'bank_transfer' },
          { title: 'PayPal', value: 'paypal' },
          { title: 'UPI', value: 'upi' },
          { title: 'Net Banking', value: 'net_banking' },
          { title: 'Wallet', value: 'wallet' },
          { title: 'Other', value: 'other' },
        ],
      },
    }),
    defineField({
      name: 'gatewayResponse',
      title: 'Gateway Response',
      type: 'object',
      fields: [
        {
          name: 'rawResponse',
          title: 'Raw Response',
          type: 'text',
          description: 'Raw response from payment gateway (JSON format)',
        },
        {
          name: 'errorCode',
          title: 'Error Code',
          type: 'string',
          description: 'Error code if transaction failed',
        },
        {
          name: 'errorMessage',
          title: 'Error Message',
          type: 'string',
          description: 'Error message if transaction failed',
        },
      ],
      description: 'Response data from payment gateway',
    }),
    defineField({
      name: 'fees',
      title: 'Transaction Fees',
      type: 'object',
      fields: [
        {
          name: 'gatewayFee',
          title: 'Gateway Fee',
          type: 'number',
          description: 'Fee charged by payment gateway',
        },
        {
          name: 'processingFee',
          title: 'Processing Fee',
          type: 'number',
          description: 'Additional processing fee',
        },
        {
          name: 'totalFees',
          title: 'Total Fees',
          type: 'number',
          description: 'Total fees deducted',
        },
      ],
    }),
    defineField({
      name: 'initiatedAt',
      title: 'Initiated At',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'completedAt',
      title: 'Completed At',
      type: 'datetime',
      description: 'When the transaction was completed',
    }),
    defineField({
      name: 'invoiceGenerated',
      title: 'Invoice Generated',
      type: 'boolean',
      description: 'Whether invoice has been generated for this transaction',
      initialValue: false,
    }),
    defineField({
      name: 'invoiceNumber',
      title: 'Invoice Number',
      type: 'string',
      description: 'Generated invoice number',
    }),
    defineField({
      name: 'emailSent',
      title: 'Email Sent',
      type: 'boolean',
      description: 'Whether confirmation email has been sent',
      initialValue: false,
    }),
    defineField({
      name: 'notes',
      title: 'Transaction Notes',
      type: 'text',
      rows: 3,
      description: 'Additional notes about this transaction',
    }),
  ],
  orderings: [
    {
      title: 'Initiated Date (Newest First)',
      name: 'initiatedAtDesc',
      by: [{ field: 'initiatedAt', direction: 'desc' }],
    },
    {
      title: 'Amount (High to Low)',
      name: 'amountDesc',
      by: [{ field: 'amount', direction: 'desc' }],
    },
    {
      title: 'Status',
      name: 'statusAsc',
      by: [{ field: 'status', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      transactionId: 'transactionId',
      amount: 'amount',
      currency: 'currency',
      status: 'status',
      gateway: 'paymentGateway',
      initiatedAt: 'initiatedAt',
    },
    prepare(selection) {
      const { transactionId, amount, currency, status, gateway, initiatedAt } = selection;
      const statusEmoji = {
        pending: '⏳',
        processing: '🔄',
        completed: '✅',
        failed: '❌',
        cancelled: '🚫',
        refunded: '💰',
        partially_refunded: '💸',
      }[status] || '❓';
      
      return {
        title: `${statusEmoji} ${transactionId}`,
        subtitle: `${currency} ${amount} via ${gateway} | ${new Date(initiatedAt).toLocaleDateString()}`,
      };
    },
  },
});

export default paymentTransaction;
