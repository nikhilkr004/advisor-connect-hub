import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCva0joVLtCyvUOPDoRLds-R9vpmRfdGlU",
  authDomain: "new-e70d7.firebaseapp.com",
  databaseURL: "https://new-e70d7-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "new-e70d7",
  storageBucket: "new-e70d7.firebasestorage.app",
  messagingSenderId: "47406421196",
  appId: "1:47406421196:web:64b6b598ee66be7be01e69",
  measurementId: "G-PVS1W824DF"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const realtimeDb = getDatabase(app);

export default app;
