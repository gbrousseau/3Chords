import { initializeApp } from '@react-native-firebase/app';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
initializeApp(firebaseConfig);

// Export the native Firebase instances
export const nativeFirebase = firebaseConfig;
export const nativeStorage = storage;
export const nativeAuth = auth;
export const nativeFirestore = firestore;

// Export direct instances for immediate use
export const db = firestore();
export const storageInstance = storage();
export const authInstance = auth();

// Create a simple storage interface that matches the web SDK's interface
export const webStorage = {
  ref: (path: string) => storage().ref(path),
  getDownloadURL: (ref: any) => ref.getDownloadURL(),
  uploadBytes: (ref: any, data: any) => ref.putFile(data),
};

// Export everything
export {
  firebaseConfig,
  storage,
  auth,
  firestore,
};