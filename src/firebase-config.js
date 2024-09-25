import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyC6pqrzGdvCgL5WnzW8Ay0mzP5-YYFt7u8",
    authDomain: "groceryapp-7462d.firebaseapp.com",
    // databaseURL: "https://groceryapp-7462d-default-rtdb.europe-west1.firebasedatabase.app/",
    projectId: "groceryapp-7462d",
    storageBucket: "groceryapp-7462d.appspot.com",
    messagingSenderId: "567726198663",
    appId: "1:567726198663:web:cba7b4fa9c6595ed3acd22",
    measurementId: "G-DQMEE49WTB"
}

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export default app; 