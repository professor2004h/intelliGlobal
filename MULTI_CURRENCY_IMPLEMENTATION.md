# Multi-Currency Sponsorship System Implementation

## 🎯 Overview

A comprehensive multi-currency system has been implemented for sponsorship pricing, allowing content managers to set prices in multiple currencies and website visitors to view pricing in their preferred currency.

## ✅ Features Implemented

### Frontend Features
- **Currency Selector Dropdown**: Users can choose from USD, EUR, GBP, and INR
- **Real-time Price Updates**: All sponsorship tier prices update instantly when currency is changed
- **Persistent Currency Selection**: User's currency preference is saved in localStorage
- **Proper Currency Formatting**: Each currency displays with correct symbols and locale formatting
- **Responsive Design**: Currency selector works seamlessly on all device sizes

### Backend Features (Sanity CMS)
- **Multi-Currency Schema**: Each sponsorship tier now has separate price fields for all four currencies
- **Enhanced Studio Interface**: Content managers can set prices for USD, EUR, GBP, and INR
- **Backward Compatibility**: Migration script provided to convert existing single-currency data

## 🏗️ Technical Implementation

### 1. Schema Changes
**File**: `SanityBackend/schemaTypes/sponsorshipTiers.ts`
- Replaced single `price` field with `pricing` object containing:
  - `usd`: US Dollar price
  - `eur`: Euro price  
  - `gbp`: British Pound price
  - `inr`: Indian Rupee price

### 2. Currency Context System
**File**: `nextjs-frontend/src/contexts/CurrencyContext.tsx`
- React Context for global currency state management
- Automatic localStorage persistence
- Currency helper functions

### 3. Currency Selector Component
**File**: `nextjs-frontend/src/components/CurrencySelector.tsx`
- Dropdown with currency symbols and names
- Smooth animations and hover effects
- Accessible keyboard navigation

### 4. Updated Data Layer
**File**: `nextjs-frontend/src/app/getSponsorshipData.ts`
- New TypeScript interfaces for multi-currency support
- Helper functions: `getPriceForCurrency()`, `formatCurrency()`
- Currency constants and locale mappings

### 5. Enhanced Components
**Files**: 
- `nextjs-frontend/src/components/SponsorshipTiersSection.tsx`
- `nextjs-frontend/src/app/sponsorship/register/SponsorRegistrationForm.tsx`
- Updated to use currency context and display prices in selected currency

## 🚀 Setup Instructions

### 1. Sanity Backend Setup
1. The schema has been updated to support multi-currency pricing
2. Run the migration script to convert existing data:
   ```bash
   node migrate-sponsorship-pricing.js
   ```
3. Or create sample data:
   ```bash
   node migrate-sponsorship-pricing.js --create-samples
   ```

### 2. Frontend Integration
The currency system is automatically integrated:
- Currency provider is added to the root layout
- All sponsorship-related pages now support currency switching
- User preferences are automatically saved and restored

## 💱 Supported Currencies

| Currency | Code | Symbol | Locale |
|----------|------|--------|--------|
| US Dollar | USD | $ | en-US |
| Euro | EUR | € | de-DE |
| British Pound | GBP | £ | en-GB |
| Indian Rupee | INR | ₹ | en-IN |

## 🔧 Configuration

### Exchange Rates
The migration script uses approximate exchange rates:
- USD to EUR: 0.85
- USD to GBP: 0.73  
- USD to INR: 83.0

**Note**: For production, consider integrating with a real-time exchange rate API.

### Adding New Currencies
To add a new currency:

1. Update the schema in `sponsorshipTiers.ts`:
   ```typescript
   defineField({
     name: 'newCurrency',
     title: 'Price (NEW)',
     type: 'number',
     validation: (Rule) => Rule.required().min(0),
   })
   ```

2. Add to currency constants in `getSponsorshipData.ts`:
   ```typescript
   { code: 'NEW', symbol: 'N$', name: 'New Currency' }
   ```

3. Update TypeScript interfaces and helper functions

## 🧪 Testing

### Manual Testing Checklist
- [ ] Currency selector displays all four currencies
- [ ] Prices update immediately when currency is changed
- [ ] Currency preference persists after page reload
- [ ] Registration form shows correct prices in selected currency
- [ ] All currency symbols and formatting are correct
- [ ] Mobile responsiveness works properly

### Test Scenarios
1. **Currency Switching**: Change currency and verify all prices update
2. **Persistence**: Refresh page and confirm currency selection is maintained
3. **Registration Flow**: Complete registration with different currencies
4. **Mobile Experience**: Test currency selector on mobile devices

## 📱 Mobile Considerations
- Currency selector is optimized for touch interfaces
- Dropdown is properly sized for mobile screens
- Currency symbols are clearly visible on small screens

## 🔄 Migration Notes

### From Single Currency to Multi-Currency
If you have existing sponsorship tiers with single currency pricing:

1. **Backup your data** before running migration
2. Run the migration script: `node migrate-sponsorship-pricing.js`
3. Verify all tiers have been converted correctly in Sanity Studio
4. Test the frontend to ensure prices display correctly

### Rollback Plan
If you need to rollback:
1. The migration script removes the old `price` field
2. You can restore from backup or manually recreate the `price` field
3. Update the frontend code to use `tier.price` instead of `tier.pricing`

## 🎨 UI/UX Features
- **Smooth Transitions**: Currency changes animate smoothly
- **Visual Feedback**: Selected currency is clearly highlighted
- **Accessibility**: Full keyboard navigation support
- **Loading States**: Proper loading indicators during currency changes

## 🔮 Future Enhancements
- Real-time exchange rate integration
- Currency conversion tooltips
- Historical price tracking
- Regional currency auto-detection
- Bulk pricing updates via API

## 📞 Support
For issues or questions about the multi-currency implementation:
1. Check the browser console for any errors
2. Verify Sanity schema is properly updated
3. Ensure all sponsorship tiers have pricing data for all currencies
4. Test with different browsers and devices
