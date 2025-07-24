// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBRN-Do2RTisslCrGjO6iG6Hm2xOX-_s5E",
  authDomain: "ai-rag-c2b94.firebaseapp.com",
  projectId: "ai-rag-c2b94",
  storageBucket: "ai-rag-c2b94.firebasestorage.app",
  messagingSenderId: "299507144360",
  appId: "1:299507144360:web:e480f743230699ca00149d",
  measurementId: "G-2FWDMMMGT7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signOut };
