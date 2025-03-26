"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSubscription = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const stripe_1 = __importDefault(require("stripe"));
// Initialize Firebase Admin
admin.initializeApp();
// Initialize Stripe with your secret key
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2022-11-15',
});
exports.createSubscription = functions.https.onCall(async (data, context) => {
    try {
        // Check if user is authenticated
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated to create a subscription');
        }
        const { priceId } = data;
        const userId = context.auth.uid;
        // Get the user's email from Firebase Auth
        const userRecord = await admin.auth().getUser(userId);
        const customerEmail = userRecord.email;
        if (!customerEmail) {
            throw new functions.https.HttpsError('failed-precondition', 'User must have an email address');
        }
        // Create or retrieve Stripe customer
        let customer;
        const customers = await stripe.customers.list({ email: customerEmail });
        if (customers.data.length > 0) {
            customer = customers.data[0];
        }
        else {
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
        const invoice = subscription.latest_invoice;
        const paymentIntent = invoice.payment_intent;
        if (!paymentIntent.client_secret) {
            throw new functions.https.HttpsError('internal', 'Failed to get client secret from payment intent');
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
    }
    catch (error) {
        console.error('Error creating subscription:', error);
        throw new functions.https.HttpsError('internal', error.message || 'An error occurred while creating the subscription');
    }
});
//# sourceMappingURL=index.js.map