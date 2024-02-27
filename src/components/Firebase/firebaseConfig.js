import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'
import { doc, getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAbFxxUKvDp7uXboNVzMbQCR_meoBL0CKk",
  authDomain: "marvel-quiz-5c439.firebaseapp.com",
  projectId: "marvel-quiz-5c439",
  storageBucket: "marvel-quiz-5c439.appspot.com",
  messagingSenderId: "687798647806",
  appId: "1:687798647806:web:c59a4022ad21d55a251eaf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore();
export const user = uid => doc(firestore, `users/${uid}`)


