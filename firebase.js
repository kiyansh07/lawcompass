import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD_hDnbO9eAkl_uIbh7RlqyW8GwzrHFAv4",
  authDomain: "lawcompass-9d20f.firebaseapp.com",
  projectId: "lawcompass-9d20f",
  storageBucket: "lawcompass-9d20f.firebasestorage.app",
  messagingSenderId: "267483431074",
  appId: "1:267483431074:web:571f34b478aaa976e6d7fb"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* expose everything globally */
window.db = db;
window.doc = doc;
window.getDoc = getDoc;
window.setDoc = setDoc;
window.updateDoc = updateDoc;
window.collection = collection;
window.getDocs = getDocs;
window.query = query;
window.orderBy = orderBy;
window.limit = limit;
window.addDoc = addDoc;
