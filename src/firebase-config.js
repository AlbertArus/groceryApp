import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyAfdMNAyBga0KjMsJF_u_LH7ScRxf5H9pQ",
    authDomain: "reactfirebase-40062.firebaseapp.com",
    projectId: "reactfirebase-40062",
    storageBucket: "reactfirebase-40062.appspot.com",
    messagingSenderId: "66072772218",
    appId: "1:66072772218:web:e78f07de16234fe19445c3"
}

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);