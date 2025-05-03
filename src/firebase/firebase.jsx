// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAba-29ngtzmu1SOIp0ZNEzJsZGxsE78KI",
  authDomain: "training-portal-d4ae0.firebaseapp.com",
  projectId: "training-portal-d4ae0",
  storageBucket: "training-portal-d4ae0.firebasestorage.app",
  messagingSenderId: "183602701587",
  appId: "1:183602701587:web:d3591624cfd07044e4e6e6",
  measurementId: "G-CGFDN9CVCG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db, onAuthStateChanged };