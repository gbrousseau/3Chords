import { initializeApp } from 'firebase/app';
import { getFunctions, httpsCallable } from 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyCJt8ianq3Mocuylsum4NhFmufe0-OwhEw",
  authDomain: "chords-90522.firebaseapp.com",
  projectId: "chords-90522",
  storageBucket: "chords-90522.firebasestorage.app",
  messagingSenderId: "85339006592",
  appId: "1:85339006592:web:050a8d0d97da95c5bc2865",
  measurementId: "G-8PY67P9LXR"
};

const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);

export const createSubscription = async (priceId: string) => {
  try {
    const createSubscriptionFunction = httpsCallable(functions, 'createSubscription');
    const result = await createSubscriptionFunction({ priceId });
    return result.data as { clientSecret: string };
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export default {
  createSubscription,
};