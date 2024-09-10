// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, onAuthStateChanged, signInWithCredential, signOut } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCwmP_eWmRdyoZ7h1-r6PCAOocibS2BFTU",
  authDomain: "ec463-mini-ry-sk.firebaseapp.com",
  databaseURL: "https://ec463-mini-ry-sk-default-rtdb.firebaseio.com",
  projectId: "ec463-mini-ry-sk",
  storageBucket: "ec463-mini-ry-sk.appspot.com",
  messagingSenderId: "819894863579",
  appId: "1:819894863579:web:b5ed8bdcfc68450f332efe",
  measurementId: "G-P7H2ZGEKLK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { auth, onAuthStateChanged, signInWithCredential, signOut };