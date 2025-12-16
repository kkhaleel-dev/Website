// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQyUlUXo4s5scndmjF3MvUcyiwcDToq20",
  authDomain: "citalumniapp-f692b.firebaseapp.com",
  databaseURL:
    "https://citalumniapp-f692b-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "citalumniapp-f692b",
  messagingSenderId: "879637363344",
  appId: "1:879637363344:web:df7fb77f0d4dfcf599b615",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);
