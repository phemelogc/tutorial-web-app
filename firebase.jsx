// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API,
  authDomain: "training-portal-d4ae0.firebaseapp.com",
  projectId: "training-portal-d4ae0",
  storageBucket: "training-portal-d4ae0.firebasestorage.app",
  messagingSenderId: "183602701587",
  appId: "1:183602701587:web:d3591624cfd07044e4e6e6",
  measurementId: "G-CGFDN9CVCG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);