// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getDatabase, ref as rtdbRef, get as rtdbGet } from "firebase/database";
import { getFirestore, collection, doc, getDoc, getDocs } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAs1DkY1uZghYbI7MxcouN3v1Rg8Nn8jFQ",
    authDomain: "laundry-management-syste-f2103.firebaseapp.com",
    databaseURL: "https://laundry-management-syste-f2103-default-rtdb.firebaseio.com",
    projectId: "laundry-management-syste-f2103",
    storageBucket: "laundry-management-syste-f2103.appspot.com",
    messagingSenderId: "1097297982578",
    appId: "1:1097297982578:web:ead49a9e07f9781117feeb",
    measurementId: "G-3MQQJ0WVMB"
};

const app = initializeApp(firebaseConfig);

// Realtime Database
const db = getDatabase(app);

// Firestore
const sdb = getFirestore(app);

// Export with aliases for backward compatibility
export { db, sdb, rtdbRef as ref, rtdbGet as get, collection, doc, getDoc, getDocs };
