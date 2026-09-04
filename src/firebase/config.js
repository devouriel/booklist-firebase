// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCFpSrXzGdE1pstAP6n-idjwpHJ-3KHg14",
  authDomain: "book-list-with-firebase-2297b.firebaseapp.com",
  projectId: "book-list-with-firebase-2297b",
  storageBucket: "book-list-with-firebase-2297b.firebasestorage.app",
  messagingSenderId: "541403943602",
  appId: "1:541403943602:web:578853a81462e4a26cefab"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
