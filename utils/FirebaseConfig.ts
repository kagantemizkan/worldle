import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCFPexeqHX8wSTE1l7KWLVdIoSaJWNJN8M",
    authDomain: "wordle-clone-1bfad.firebaseapp.com",
    projectId: "wordle-clone-1bfad",
    storageBucket: "wordle-clone-1bfad.appspot.com",
    messagingSenderId: "286973299858",
    appId: "1:286973299858:web:ed6037ae6168528b3aea4b"
};

const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);