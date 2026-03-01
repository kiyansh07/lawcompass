import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "lawcompass-9d20f.firebaseapp.com",
  projectId: "lawcompass-9d20f",
  storageBucket: "lawcompass-9d20f.appspot.com",
  messagingSenderId: "267483431074",
  appId: "1:267483431074:web:571f34b478aaa976e6d7fb"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

