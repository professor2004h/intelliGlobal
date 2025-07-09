# UPI Test Payment Guide for EventNext

## 🔧 UPI Test Configuration

The EventNext sponsor registration system now supports comprehensive UPI testing with the following enhancements:

### ✅ Enabled UPI Payment Methods
- **Google Pay** - Test with UPI apps
- **PhonePe** - Test with UPI apps  
- **Paytm** - Test with UPI apps
- **BHIM UPI** - Test with UPI apps
- **UPI Collect** - Test UPI collect flow
- **UPI Intent** - Test UPI intent flow
- **UPI QR** - Test UPI QR code flow

### 🧪 Test Credentials & Configuration

**Razorpay Test Key:** `rzp_test_tuQ7OPOieO2QPl`
**Test UPI ID:** `success@razorpay`
**Test Environment:** Development mode enabled

### 🎯 UPI Test Scenarios

#### 1. Successful UPI Payment
- Use UPI ID: `success@razorpay`
- Expected: Payment completes successfully
- Result: Registration confirmed, invoice generated

#### 2. Failed UPI Payment  
- Use UPI ID: `failure@razorpay`
- Expected: Payment fails gracefully
- Result: User can retry payment

#### 3. UPI App Testing
- Test with different UPI apps (Google Pay, PhonePe, etc.)
- Verify app-specific flows work correctly
- Check payment method detection

### 🔍 Testing Steps

1. **Start the Development Server**
   ```bash
   cd nextjs-frontend
   npm run dev
   ```

2. **Access Sponsor Registration**
   - Navigate to: `http://localhost:3000/sponsorship/register`
   - Fill out the registration form
   - Proceed to payment

3. **Test UPI Payment**
   - Select UPI as payment method
   - Use test UPI ID: `success@razorpay`
   - Complete the payment flow
   - Verify success confirmation

4. **Verify Payment Processing**
   - Check console logs for payment verification
   - Confirm invoice generation
   - Verify email notifications (if configured)

### 🛠️ Configuration Details

The UPI integration includes:

- **Multiple UPI Flows**: Collect, Intent, QR code
- **UPI App Support**: Google Pay, PhonePe, Paytm, BHIM
- **Test Mode**: Enabled for development environment
- **Fallback Options**: Cards, Net Banking, Wallets available
- **Error Handling**: Graceful failure handling with retry options

### 📱 Mobile Testing

UPI payments work best on mobile devices. Test on:
- Android devices with UPI apps installed
- iOS devices with supported UPI apps
- Mobile browsers with UPI support

### 🔒 Security Features

- Payment signature verification
- Secure test environment
- Environment-specific configuration
- Test data isolation

### 📊 Payment Flow

1. User selects sponsorship tier
2. Fills registration form
3. Proceeds to payment
4. Razorpay checkout opens with UPI options
5. User selects UPI payment method
6. Completes UPI authentication
7. Payment verified and processed
8. Registration confirmed
9. Invoice generated and sent

### 🚨 Important Notes

- UPI payments require INR currency for production
- Test environment supports USD for international testing
- All test payments use Razorpay test credentials
- No real money is processed in test mode
- Test UPI IDs are provided by Razorpay for testing

### 🔧 Troubleshooting

**Issue**: UPI option not showing
**Solution**: Ensure test credentials are properly configured

**Issue**: Payment fails immediately  
**Solution**: Check network connectivity and test UPI ID

**Issue**: Payment succeeds but registration fails
**Solution**: Check server logs and database connectivity

### 📞 Support

For UPI payment testing issues:
- Check browser console for errors
- Verify environment variables are set
- Ensure Razorpay test account is active
- Contact support if persistent issues occur
