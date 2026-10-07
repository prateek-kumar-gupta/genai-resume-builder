import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDC8Mu4mnsJ3rz6YCOSO5F8iuCKxvCv1AI",
  authDomain: "careercraft-a.firebaseapp.com",
  projectId: "careercraft-a",
  storageBucket: "careercraft-a.firebasestorage.app",
  messagingSenderId: "928694894267",
  appId: "1:928694894267:web:d43eb55fd52ccc6d4db39e",
  measurementId: "G-9X3T6LHV74"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
