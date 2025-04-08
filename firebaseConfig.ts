// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: 'AIzaSyCJt8ianq3Mocuylsum4NhFmufe0-OwhEw',
    authDomain: 'chords-90522.firebaseapp.com',
    projectId: 'chords-90522',
    storageBucket: 'chords-90522.firebasestorage.app',
    messagingSenderId: '85339006592',
    appId: '1:85339006592:web:050a8d0d97da95c5bc2865',
    measurementId: 'G-8PY67P9LXR',
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_STORAGE = getStorage(FIREBASE_APP);
export const FIREBASE_FIRESTORE = getFirestore(FIREBASE_APP);