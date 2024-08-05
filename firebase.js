// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAlRMwYAH_r-Sq3nHtuAdkNtwXtY9o-if8",
  authDomain: "pantrix-d78f8.firebaseapp.com",
  projectId: "pantrix-d78f8",
  storageBucket: "pantrix-d78f8.appspot.com",
  messagingSenderId: "804202094900",
  appId: "1:804202094900:web:7b82ea27d797454dd9c561",
  measurementId: "G-HHP5RMXLY4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);
const auth = getAuth(app);

export { firestore, auth };
