import { initializeApp } from "firebase/app";

import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const firebaseAuthDomain = "khongkhun-e6def.firebaseapp.com";

const firebaseConfig = {
  apiKey: "AIzaSyBmHf7mKH846i87MsSZ7LngQ7pT5so7mmY",
  authDomain: import.meta.env.DEV ? firebaseAuthDomain : window.location.host,
  projectId: "khongkhun-e6def",
  storageBucket: "khongkhun-e6def.firebasestorage.app",
  messagingSenderId: "260566796572",
  appId: "1:260566796572:web:ce8561ca180b0faf28d2d9",
  measurementId: "G-57SN6ENC69",
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);


const provider = new GoogleAuthProvider();

provider.setCustomParameters({
  prompt: "select_account"
});


export const signInWithGoogle = () =>
  signInWithPopup(auth, provider);

export const signIn = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const signUp = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);

export const observeAuthState = (callback) =>
  onAuthStateChanged(auth, callback);

export const logOut = () =>
  signOut(auth);