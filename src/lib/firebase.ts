import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: (import.meta as any).env.VITE_FIREBASE_API_KEY || "AIzaSyA2XCANKbZg_mn-FK0FyC2XTv8AvQXpnpc",
  authDomain: (import.meta as any).env.VITE_FIREBASE_AUTH_DOMAIN || "skilltrader-632bb.firebaseapp.com",
  projectId: (import.meta as any).env.VITE_FIREBASE_PROJECT_ID || "skilltrader-632bb",
  storageBucket: (import.meta as any).env.VITE_FIREBASE_STORAGE_BUCKET || "skilltrader-632bb.firebasestorage.app",
  messagingSenderId: (import.meta as any).env.VITE_FIREBASE_MESSAGING_SENDER_ID || "827254887539",
  appId: (import.meta as any).env.VITE_FIREBASE_APP_ID || "1:827254887539:web:ab84eaf499c623daddc606"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export default app;
