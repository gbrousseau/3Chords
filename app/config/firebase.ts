import firebase from '@react-native-firebase/app';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCJt8ianq3Mocuylsum4NhFmufe0-OwhEw",
  authDomain: "chords-90522.firebaseapp.com",
  projectId: "chords-90522",
  storageBucket: "chords-90522.firebasestorage.app",
  messagingSenderId: "85339006592",
  appId: "1:85339006592:web:050a8d0d97da95c5bc2865",
  measurementId: "G-8PY67P9LXR"
};

// Initialize Firebase if it hasn't been initialized yet
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Export the native Firebase instances
export const nativeFirebase = firebase;
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
  firebase,
  storage,
  auth,
  firestore,
};