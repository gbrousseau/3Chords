import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe('your_stripe_secret_key', {
  apiVersion: '2023-10-16',
});

export const createSubscription = async (priceId: string, customerId?: string) => {
  try {
    // If no customer ID is provided, create a new customer
    let customer = customerId;
    if (!customer) {
      const customerData = await stripe.customers.create();
      customer = customerData.id;
    }

    // Create an ephemeral key for the customer
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer },
      { apiVersion: '2023-10-16' }
    );

    // Create a subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    });

    const invoice = subscription.latest_invoice as Stripe.Invoice;
    const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

    return {
      subscription,
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer,
    };
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
};