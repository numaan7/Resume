import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  // Replace with your Firebase config
 apiKey: "AIzaSyCLjRtggYgQt7IKHLrlx8gnJnTi87rGVdA",
  authDomain: "sample-c07f9.firebaseapp.com",
  projectId: "sample-c07f9",
  storageBucket: "sample-c07f9.firebasestorage.app",
  messagingSenderId: "711415598109",
  appId: "1:711415598109:web:1042e597d4e9121e290af4",
  measurementId: "G-B0NKDPW3DF"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
