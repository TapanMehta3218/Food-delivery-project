// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "padmavati-bhojanalaya.firebaseapp.com",
  projectId: "padmavati-bhojanalaya",
  storageBucket: "padmavati-bhojanalaya.firebasestorage.app",
  messagingSenderId: "711772360413",
  appId: "1:711772360413:web:79b7e224fd0a54e059d534",
  measurementId: "G-18542FEVQ8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
export { app, auth };
