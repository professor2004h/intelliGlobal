export {};

declare global {
  interface Window {
    // PayPal SDK is loaded via external script; declare for TS
    paypal?: {
      Buttons: (config: {
        createOrder: (data: any, actions: any) => Promise<string>;
        onApprove: (data: any, actions: any) => Promise<void>;
        onError?: (err: any) => void;
        onCancel?: (data: any) => void;
      }) => {
        render: (selector: string) => Promise<void>;
      };
    };
  }
}

