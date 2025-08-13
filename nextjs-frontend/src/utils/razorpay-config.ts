// Payments disabled: provide stubs so imports (if any) don't break
export const getRazorpayConfig = () => ({ keyId: '', keySecret: '', isTestMode: false });
export const isRazorpayConfigured = () => false;
