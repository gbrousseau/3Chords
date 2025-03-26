import firebase from '@react-native-firebase/app';
import storage from '@react-native-firebase/storage';

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

export { firebase, storage };