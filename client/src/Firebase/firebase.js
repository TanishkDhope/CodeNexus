// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, deleteDoc, collection, getDocs } from "firebase/firestore";
import { getDatabase, ref, get, child, update } from 'firebase/database';

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
const app = initializeApp(firebaseConfig);
export const auth=getAuth(app)
export const db = getFirestore(app);
export const googleProvider=new GoogleAuthProvider(app)

const database = getDatabase(app);

const analytics = getAnalytics(app);
export default app;
export { database, ref, get, child, update,  analytics, doc, getDoc, setDoc, updateDoc, deleteDoc ,collection, getDocs };