import { initStripe } from '@stripe/stripe-react-native';

// Replace with your Stripe publishable key
export const STRIPE_PUBLISHABLE_KEY = 'your_publishable_key';

export const initializeStripe = async () => {
  try {
    await initStripe({
      publishableKey: STRIPE_PUBLISHABLE_KEY,
      merchantIdentifier: '3chords_merchant', // Only required for Apple Pay
      urlScheme: '3chords', // Required for 3D Secure and bank redirects
    });
  } catch (error) {
    console.error('Failed to initialize Stripe:', error);
  }
};

export const SUBSCRIPTION_PRICES = {
  'pay-per-service': 'price_pay_per_service',
  'basic': 'price_basic_monthly',
  'standard': 'price_standard_monthly',
  'premium': 'price_premium_monthly',
} as const;