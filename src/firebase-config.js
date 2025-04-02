import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage";

// let firebaseConfig = {}

// if (process.env.REACT_APP_ENV === 'production') {
//     firebaseConfig = JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG_PROD);
//   } else {
//     firebaseConfig = JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG_DEV);
//   }

const firebaseConfig = JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG);

const app = initializeApp(firebaseConfig);
const storage = getStorage(app)

export const db = getFirestore(app);
export {storage}

export default app;