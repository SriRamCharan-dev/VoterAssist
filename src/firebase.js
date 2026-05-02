import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Google Firebase Configuration
// We use a mock config by default to prevent crashes if the keys aren't set yet.
// To make this fully live, add your VITE_FIREBASE_API_KEY to the .env file.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "mock-api-key-for-hackathon",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "voterassist-demo.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "voterassist-demo",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "voterassist-demo.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};

// Initialize Google Firebase Services
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
