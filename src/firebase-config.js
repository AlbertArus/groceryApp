import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"

// let firebaseConfig = {}

// if (process.env.REACT_APP_ENV === 'production') {
//     firebaseConfig = JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG_PROD);
//   } else {
//     firebaseConfig = JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG_DEV);
//   }

const firebaseConfig = JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG);
console.log(process.env.REACT_APP_FIREBASE_CONFIG)

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export default app;