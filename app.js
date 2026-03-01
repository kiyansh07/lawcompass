// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  query,
  orderBy,
  limit
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Questions import
import { questions } from "./questions.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "lawcompass-9d20f.firebaseapp.com",
  projectId: "lawcompass-9d20f",
  storageBucket: "lawcompass-9d20f.appspot.com",
  messagingSenderId: "267483431074",
  appId: "1:267483431074:web:571f34b478aaa976e6d7fb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Global variables
let currentQuestion = 0;
let score = 0;
let answers = [];

// Password (change whenever you want new test access)
const TEST_PASSWORD = "1234";


// ================= LOGIN SYSTEM =================

function loginStudent() {
  const name = document.getElementById("studentName").value.trim();
  const studentId = document.getElementById("studentId").value.trim();
  const password = document.getElementById("testPassword").value.trim();

  if (!name || !studentId || !password) {
    alert("Please fill all fields");
    return;
  }

  if (password !== TEST_PASSWORD) {
    alert("Incorrect Test Password");
    return;
  }

  localStorage.setItem("lc_name", name);
  localStorage.setItem("lc_id", studentId);

  document.getElementById("loginSection").style.display = "none";
  document.getElementById("dashboardSection").style.display = "block";
}


// ================= START TEST =================

async function startTest() {
  const studentId = localStorage.getItem("lc_id");

  // Check if student already attempted
  const docRef = doc(db, "leaderboard", studentId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    alert("You have already attempted this test.");
    showLeaderboard();
    return;
  }

  document.getElementById("dashboardSection").style.display = "none";
  document.getElementById("testSection").style.display = "block";

  loadQuestion();
}


// ================= LOAD QUESTIONS =================

function loadQuestion() {
  const container = document.getElementById("questionContainer");
  const q = questions[currentQuestion];

  container.innerHTML = `
    <div class="question-box">
      <h3>Question ${currentQuestion + 1} of ${questions.length}</h3>
      <p>${q.question}</p>

      ${q.options
        .map(
          (opt, index) =>
            `<button class="option-btn" onclick="selectAnswer(${index})">${opt}</button>`
        )
        .join("")}
    </div>
  `;
}


// ================= SELECT ANSWER =================

function selectAnswer(index) {
  const q = questions[currentQuestion];

  answers.push(index);

  if (index === q.answer) {
    score++;
  }

  currentQuestion++;

  if (currentQuestion < questions.length) {
    loadQuestion();
  } else {
    finishTest();
  }
}


// ================= FINISH TEST =================

async function finishTest() {
  const name = localStorage.getItem("lc_name");
  const studentId = localStorage.getItem("lc_id");

  try {
    await setDoc(doc(db, "leaderboard", studentId), {
      name: name,
      studentId: studentId,
      score: score,
      total: questions.length,
      time: Date.now()
    });

    alert("Test submitted successfully!");

    document.getElementById("testSection").style.display = "none";
    showLeaderboard();

  } catch (error) {
    console.error(error);
    alert("Submission failed");
  }
}


// ================= LEADERBOARD =================

async function showLeaderboard() {
  document.getElementById("dashboardSection").style.display = "none";
  document.getElementById("leaderboardSection").style.display = "block";

  try {
    const leaderboardRef = collection(db, "leaderboard");

    const q = query(
      leaderboardRef,
      orderBy("score", "desc"),
      limit(50)
    );

    const snapshot = await getDocs(q);

    const table = document.getElementById("leaderboardTable");
    table.innerHTML = "";

    let rank = 1;

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();

      table.innerHTML += `
        <tr>
          <td>${rank}</td>
          <td>${data.name}</td>
          <td>${data.studentId}</td>
          <td>${data.score}/${data.total}</td>
        </tr>
      `;

      rank++;
    });

  } catch (error) {
    console.error("Leaderboard error:", error);
  }
}


// ================= NAVIGATION =================

function goHome() {
  document.getElementById("leaderboardSection").style.display = "none";
  document.getElementById("dashboardSection").style.display = "block";
}


// ================= MAKE FUNCTIONS GLOBAL =================

window.loginStudent = loginStudent;
window.startTest = startTest;
window.selectAnswer = selectAnswer;
window.showLeaderboard = showLeaderboard;
window.goHome = goHome;
