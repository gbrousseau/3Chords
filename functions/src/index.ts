import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';

// Initialize Firebase Admin
admin.initializeApp();

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
});

export const createSubscription = functions.https.onCall(async (data, context) => {
  try {
    // Check if user is authenticated
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'User must be authenticated to create a subscription'
      );
    }

    const { priceId } = data;
    const userId = context.auth.uid;

    // Get the user's email from Firebase Auth
    const userRecord = await admin.auth().getUser(userId);
    const customerEmail = userRecord.email;

    if (!customerEmail) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'User must have an email address'
      );
    }

    // Create or retrieve Stripe customer
    let customer: Stripe.Customer;
    const customers = await stripe.customers.list({ email: customerEmail });

    if (customers.data.length > 0) {
      customer = customers.data[0];
    } else {
      customer = await stripe.customers.create({
        email: customerEmail,
        metadata: {
          firebaseUID: userId,
        },
      });
    }

    // Create the subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
      metadata: {
        firebaseUID: userId,
      },
    });

    // Get the client secret from the subscription's latest invoice
    const invoice = subscription.latest_invoice as Stripe.Invoice;
    const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

    if (!paymentIntent.client_secret) {
      throw new functions.https.HttpsError(
        'internal',
        'Failed to get client secret from payment intent'
      );
    }

    // Store subscription details in Firestore
    await admin.firestore().collection('subscriptions').doc(userId).set({
      stripeCustomerId: customer.id,
      stripeSubscriptionId: subscription.id,
      status: subscription.status,
      priceId: priceId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return {
      clientSecret: paymentIntent.client_secret,
    };
  } catch (error: any) {
    console.error('Error creating subscription:', error);
    throw new functions.https.HttpsError(
      'internal',
      error.message || 'An error occurred while creating the subscription'
    );
  }
}); 