// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBwsAunM3nRNUHUzFb9yUmKzCeoqigTHOY",
  authDomain: "megahack-a6ee9.firebaseapp.com",
  projectId: "megahack-a6ee9",
  storageBucket: "megahack-a6ee9.firebasestorage.app",
  messagingSenderId: "613646385300",
  appId: "1:613646385300:web:f0ef5ac76d0330b22c3481",
  measurementId: "G-10V45TGZJX"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);