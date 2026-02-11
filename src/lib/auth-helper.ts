import { initializeApp, getApp, getApps, deleteApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signOut } from "firebase/auth";

// Kita gunakan config yang sama dari environment
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const createAccountForOthers = async (email: string, password: string) => {
  // 1. Buat instance aplikasi Firebase "bayangan" (secondary)
  // Nama unik agar tidak bentrok dengan aplikasi utama 'app'
  const secondaryApp = initializeApp(firebaseConfig, "SecondaryApp");
  const secondaryAuth = getAuth(secondaryApp);

  try {
    // 2. Buat user di instance bayangan ini
    const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
    
    // 3. Logout dari instance bayangan (jaga-jaga)
    await signOut(secondaryAuth);
    
    return userCredential.user.uid;
  } catch (error) {
    throw error;
  } finally {
    // 4. Hancurkan instance bayangan agar hemat memori
    await deleteApp(secondaryApp);
  }
};