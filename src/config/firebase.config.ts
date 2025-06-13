import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAh4fsAYYoA9WO9pxqjIjrwxowPz4_O494",
  authDomain: "vegzi-b52a0.firebaseapp.com",
  projectId: "vegzi-b52a0",
  storageBucket: "vegzi-b52a0.firebasestorage.app",
  messagingSenderId: "602049120170",
  appId: "1:602049120170:web:91c747e7a3925fccad8dd3",
  measurementId: "G-V1JD36G2F8"
};

// Initialize Firebase

// Inicializar Firebase
export const app = initializeApp(firebaseConfig);

// Obtener instancia de Auth
export const auth = getAuth(app); 