const TEST_PASSWORD = "1234"; // CHANGE THIS
const TEST_DURATION = 1800;

const QUESTIONS = [
  {
    q: "Synonym of 'Lucid'?",
    options: ["Clear", "Dark", "Complex", "Weak"],
    correct: 0
  },
  {
    q: "Antonym of 'Benevolent'?",
    options: ["Kind", "Cruel", "Gentle", "Soft"],
    correct: 1
  }
];

let answers = {};
let timeLeft = TEST_DURATION;
let timer;

function startTest() {
  const name = document.getElementById("nameInput").value.trim();
  const pass = document.getElementById("passInput").value;

  if (!name || pass !== TEST_PASSWORD) {
    alert("Invalid name or test code");
    return;
  }

  document.getElementById("instructions").style.display = "none";
  document.getElementById("testArea").classList.remove("hidden");

  renderQuestions();
  startTimer();
}

function renderQuestions() {
  const qDiv = document.getElementById("questions");
  QUESTIONS.forEach((q, i) => {
    qDiv.innerHTML += `
      <div class="question">
        <p>${i + 1}. ${q.q}</p>
        ${q.options.map((op, idx) =>
          `<label><input type="radio" name="q${i}" value="${idx}"> ${op}</label>`
        ).join("")}
      </div>`;
  });
}

function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").innerText = `Time Left: ${timeLeft}s`;
    if (timeLeft <= 0) submitTest();
  }, 1000);
}

function submitTest() {
  clearInterval(timer);

  let correct = 0, wrong = 0;

  QUESTIONS.forEach((q, i) => {
    const chosen = document.querySelector(`input[name="q${i}"]:checked`);
    if (!chosen) return;
    if (parseInt(chosen.value) === q.correct) correct++;
    else wrong++;
  });

  const score = correct * 5 - wrong;
  const timeTaken = TEST_DURATION - timeLeft;

  saveResult(score, timeTaken);
}

function saveResult(score, time) {
  const data = JSON.parse(localStorage.getItem("leaderboard") || "[]");
  data.push({ score, time, subject: "English" });
  localStorage.setItem("leaderboard", JSON.stringify(data));
  window.location.href = "leaderboard.html";
}

// Anti-cheating
document.addEventListener("visibilitychange", () => {
  if (document.hidden) alert("Do not switch tabs during test!");
});
document.addEventListener("contextmenu", e => e.preventDefault());

