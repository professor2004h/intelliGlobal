import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'specialRegistration',
  title: 'Special Registrations (VIP Clients)',
  type: 'document',
  icon: () => '💎',
  fields: [
    defineField({
      name: 'clientName',
      title: 'Client Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      options: {
        list: [
          {title: 'Mr', value: 'Mr'},
          {title: 'Ms', value: 'Ms'},
          {title: 'Mrs', value: 'Mrs'},
          {title: 'Prof', value: 'Prof'},
          {title: 'Dr', value: 'Dr'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'firstName',
      title: 'First Name',
      type: 'string',
    }),
    defineField({
      name: 'lastName',
      title: 'Last Name',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'phoneNumber',
      title: 'Phone Number',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'country',
      title: 'Country',
      type: 'string',
    }),
    defineField({
      name: 'postalAddress',
      title: 'Full Postal Address',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'conferenceSelected',
      title: 'Conference Selected',
      type: 'reference',
      to: [{type: 'conferenceEvent'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'paymentAmount',
      title: 'Payment Amount',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'currency',
      title: 'Currency',
      type: 'string',
      initialValue: 'USD',
      options: {
        list: [
          {title: 'USD', value: 'USD'},
          {title: 'EUR', value: 'EUR'},
          {title: 'GBP', value: 'GBP'},
        ],
      },
    }),
    defineField({
      name: 'paypalTransactionId',
      title: 'PayPal Transaction ID',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'paypalOrderId',
      title: 'PayPal Order ID',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'paymentStatus',
      title: 'Payment Status',
      type: 'string',
      options: {
        list: [
          {title: 'Pending', value: 'pending'},
          {title: 'Completed', value: 'completed'},
          {title: 'Failed', value: 'failed'},
          {title: 'Refunded', value: 'refunded'},
        ],
      },
      initialValue: 'pending',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'registrationDate',
      title: 'Registration Date',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'paymentDate',
      title: 'Payment Date',
      type: 'datetime',
    }),
    defineField({
      name: 'emailSent',
      title: 'Confirmation Email Sent',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'emailSentDate',
      title: 'Email Sent Date',
      type: 'datetime',
    }),
    defineField({
      name: 'notes',
      title: 'Internal Notes',
      type: 'text',
      rows: 4,
      description: 'Internal notes about this registration (not visible to client)',
    }),
  ],
  preview: {
    select: {
      clientName: 'clientName',
      email: 'email',
      phoneNumber: 'phoneNumber',
      amount: 'paymentAmount',
      currency: 'currency',
      status: 'paymentStatus',
      conference: 'conferenceSelected.title',
      transactionId: 'paypalTransactionId',
      date: 'registrationDate',
    },
    prepare(selection) {
      const {clientName, email, phoneNumber, amount, currency, status, conference, transactionId, date} = selection

      // Format amount with currency
      const formattedAmount = amount ? `${currency || 'USD'} ${amount.toFixed(2)}` : 'N/A'

      // Format date
      const formattedDate = date ? new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) : 'N/A'

      // Status emoji for visual feedback
      const statusEmoji = {
        pending: '⏳',
        completed: '✅',
        failed: '❌',
        refunded: '💰',
      }[status as string] || '❓'

      // Status text with proper capitalization
      const statusText = status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'

      return {
        title: `${statusEmoji} ${clientName || 'Unnamed Client'} | ${formattedAmount}`,
        subtitle: `📧 ${email || 'No email'} | 📞 ${phoneNumber || 'No phone'}`,
        description: `🎫 ${conference || 'No Conference'} | 💳 ${statusText} | 🆔 ${transactionId || 'Pending'} | 📅 ${formattedDate}`,
      }
    },
  },
  orderings: [
    {
      title: 'Registration Date (Newest First)',
      name: 'registrationDateDesc',
      by: [{field: 'registrationDate', direction: 'desc'}],
    },
    {
      title: 'Registration Date (Oldest First)',
      name: 'registrationDateAsc',
      by: [{field: 'registrationDate', direction: 'asc'}],
    },
    {
      title: 'Payment Amount (Highest First)',
      name: 'amountDesc',
      by: [{field: 'paymentAmount', direction: 'desc'}],
    },
    {
      title: 'Client Name (A-Z)',
      name: 'nameAsc',
      by: [{field: 'clientName', direction: 'asc'}],
    },
  ],
})

