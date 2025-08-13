export {};

declare global {
  interface Window {
    // Razorpay checkout is loaded via external script; declare for TS
    Razorpay?: new (options: any) => any;
  }
}

