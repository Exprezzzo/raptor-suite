// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBQvKjG8XLHb4PVLNgvR0b6DDQdFCMdLAE',
  authDomain: 'raptor-suite.firebaseapp.com',
  projectId: 'raptor-suite',
  storageBucket: 'raptor-suite.appspot.com',
  messagingSenderId: '277123240771',
  appId: '1:277123240771:web:3802e33f088dc2dd563191'
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);