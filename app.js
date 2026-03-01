// Firebase imports
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
  limit
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD_hDnbO9eAkl_uIbh7RlqyW8GwzrHFAv4",
  authDomain: "lawcompass-9d20f.firebaseapp.com",
  projectId: "lawcompass-9d20f",
  storageBucket: "lawcompass-9d20f.firebasestorage.app",
  messagingSenderId: "267483431074",
  appId: "1:267483431074:web:571f34b478aaa976e6d7fb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Password protection
const correctPassword = "lawcompass123";

const loginBtn = document.getElementById("loginBtn");
const passwordInput = document.getElementById("passwordInput");
const loginPage = document.getElementById("loginPage");
const mainContent = document.getElementById("mainContent");

if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    const password = passwordInput.value;

    if (password === correctPassword) {
      loginPage.style.display = "none";
      mainContent.style.display = "block";
      loadLeaderboard();
    } else {
      alert("Wrong password");
    }
  });
}

// Load leaderboard
async function loadLeaderboard() {
  try {
    const leaderboardRef = collection(db, "leaderboard");

    const q = query(leaderboardRef, orderBy("score", "desc"), limit(10));
    const snapshot = await getDocs(q);

    const leaderboardList = document.getElementById("leaderboard");

    if (!leaderboardList) return;

    leaderboardList.innerHTML = "";

    snapshot.forEach((docItem) => {
      const data = docItem.data();

      const li = document.createElement("li");
      li.textContent = `${data.name} - ${data.score}`;

      leaderboardList.appendChild(li);
    });

  } catch (error) {
    console.error("Leaderboard preview error:", error);
  }
}
window.loginStudent = loginStudent;
window.startTest = startTest;
window.submitTest = submitTest;
window.shfunction loginStudent() {
  const name = document.getElementById("studentName").value;
  const studentId = document.getElementById("studentId").value;
  const password = document.getElementById("testPassword").value;

  const correctPassword = "1234";

  if (!name || !studentId || !password) {
    alert("Please fill all fields");
    return;
  }

  if (password !== correctPassword) {
    alert("Incorrect test password");
    return;
  }

  localStorage.setItem("lc_name", name);
  localStorage.setItem("lc_id", studentId);

  document.getElementById("loginSection").style.display = "none";
  document.getElementById("dashboardSection").style.display = "block";
}owLeaderboard = showLeaderboard;
