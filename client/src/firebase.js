// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "mern-auth-4f004.firebaseapp.com",
    projectId: "mern-auth-4f004",
    storageBucket: "mern-auth-4f004.firebasestorage.app",
    messagingSenderId: "319997687516",
    appId: "1:319997687516:web:a1b95565bf633746e5a619",
    measurementId: "G-BJKVZL3TBC",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
