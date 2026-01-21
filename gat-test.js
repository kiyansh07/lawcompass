/* ==============================
   CONFIGURATION (EDIT HERE)
================================ */

const SUBJECT = "GAT";
const TEST_PASSWORD = "5678";   // CHANGE THIS PER TEST
const TEST_DURATION = 1800;     // seconds (30 minutes)

/* ==============================
   QUESTIONS (EDIT FREELY)
================================ */

const QUESTIONS = [
  {
    q: "If 12 workers can complete a work in 15 days, how many days will 20 workers take?",
    options: ["9", "10", "12", "15"],
    correct: 1
  },
  {
    q: "Which of the following is NOT a fundamental duty?",
    options: [
      "To safeguard public property",
      "To vote in elections",
      "To promote harmony",
      "To develop scientific temper"
    ],
    correct: 1
  },
  {
    q: "The ratio of boys to girls in a class is 3:2. If there are 18 boys, how many girls are there?",
    options: ["10", "12", "15", "18"],
    correct: 1
  }
];

/* ==============================
   INTERNAL STATE
================================ */

let timeLeft = TEST_DURATION;
let timerInterval;

/* ==============================
   START TEST
================================ */

function startTest() {
  const name = document.getElementById("nameInput").value.trim();
  const pass = document.getElementById("passInput").value.trim();

  if (!name) {
    alert("Please enter your name.");
    return;
  }

  if (pass !== TEST_PASSWORD) {
    alert("Invalid test code.");
    return;
  }

  localStorage.setItem("currentUser", name);

  document.getElementById("instructions").style.display = "none";
  document.getElementById("testArea").classList.remove("hidden");

  renderQuestions();
  startTimer();
}

/* ==============================
   RENDER QUESTIONS
================================ */

function renderQuestions() {
  const container = document.getElementById("questions");
  container.innerHTML = "";

  QUESTIONS.forEach((q, index) => {
    const div = document.createElement("div");
    div.className = "question";

    div.innerHTML = `
      <p><strong>Q${index + 1}.</strong> ${q.q}</p>
      ${q.options.map((opt, i) => `
        <label>
          <input type="radio" name="q${index}" value="${i}">
          ${opt}
        </label><br>
      `).join("")}
    `;

    container.appendChild(div);
  });
}

/* ==============================
   TIMER
================================ */

function startTimer() {
  updateTimer();
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimer();

    if (timeLeft <= 0) {
      submitTest();
    }
  }, 1000);
}

function updateTimer() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  document.getElementById("timer").innerText =
    `Time Left: ${minutes}:${seconds.toString().padStart(2, "0")}`;
}

/* ==============================
   SUBMIT & EVALUATE
================================ */

function submitTest() {
  clearInterval(timerInterval);

  let correct = 0;
  let wrong = 0;

  QUESTIONS.forEach((q, index) => {
    const selected = document.querySelector(`input[name="q${index}"]:checked`);
    if (!selected) return;

    if (parseInt(selected.value) === q.correct) {
      correct++;
    } else {
      wrong++;
    }
  });

  const score = (correct * 5) - (wrong * 1);
  const timeTaken = TEST_DURATION - timeLeft;
  const name = localStorage.getItem("currentUser") || "Anonymous";

  saveResult(name, score, timeTaken);
}

/* ==============================
   SAVE TO LEADERBOARD
================================ */

function saveResult(name, score, time) {
  const leaderboard =
    JSON.parse(localStorage.getItem("leaderboard")) || [];

  leaderboard.push({
    name: name,
    subject: SUBJECT,
    score: score,
    time: time
  });

  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
  window.location.href = "leaderboard.html";
}

/* ==============================
   BASIC ANTI-CHEAT
================================ */

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    alert("Warning: Do not switch tabs during the test.");
  }
});

document.addEventListener("contextmenu", e => e.preventDefault());