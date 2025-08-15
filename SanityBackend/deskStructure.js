// Custom Sanity Studio structure to include Map Location in the sidebar

export default (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem().title('Conference Event').schemaType('conferenceEvent').child(S.documentTypeList('conferenceEvent')),
      S.listItem().title('Past Conference').schemaType('pastConference').child(S.documentTypeList('pastConference')),
      S.listItem().title('About Us').schemaType('about').child(S.documentTypeList('about')),
      S.listItem().title('Hero Section').schemaType('heroSection').child(S.documentTypeList('heroSection')),
      S.listItem().title('Conferences Section').schemaType('conferences').child(S.documentTypeList('conferences')),
      S.listItem().title('Site Settings').schemaType('siteSettings').child(S.documentTypeList('siteSettings')),
      S.listItem().title('Statistics Section').schemaType('statistics').child(S.documentTypeList('statistics')),
      S.listItem().title('Sponsorship Tiers').schemaType('sponsorshipTiers').child(S.documentTypeList('sponsorshipTiers')),
      S.listItem().title('Sponsor Registration').schemaType('sponsorRegistration').child(S.documentTypeList('sponsorRegistration')),
      S.listItem().title('Payment Transaction').schemaType('paymentTransaction').child(S.documentTypeList('paymentTransaction')),
      S.listItem().title('Past Conferences Section Styling').schemaType('pastConferencesSection').child(S.documentTypeList('pastConferencesSection')),
      S.listItem().title('Journal Section Styling').schemaType('journalSection').child(S.documentTypeList('journalSection')),
      S.listItem().title('Custom Content Section').schemaType('customContentSection').child(S.documentTypeList('customContentSection')),
      S.listItem().title('Cancellation Policy').schemaType('cancellationPolicy').child(S.documentTypeList('cancellationPolicy')),
      S.listItem().title('Shipping Policy').schemaType('shippingPolicy').child(S.documentTypeList('shippingPolicy')),
      S.listItem().title('Gallery Page').schemaType('galleryPage').child(S.documentTypeList('galleryPage')),

      // Add Map Location with icon
      S.listItem()
        .title('🗺️ Map Locations')
        .schemaType('mapLocation')
        .child(S.documentTypeList('mapLocation').title('Map Locations'))
    ])
