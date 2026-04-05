import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDtuPIRqXUZvplWbBKL9XG5sLlS6_V9I-g",
  authDomain: "rent-home-lab4.firebaseapp.com",
  projectId: "rent-home-lab4",
  storageBucket: "rent-home-lab4.appspot.com",
  messagingSenderId: "800726845558",
  appId: "1:800726845558:web:1b8bf6728ddd62a99f3757",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);