/* ==============================
   CONFIGURATION (EDIT HERE)
================================ */

const SUBJECT = "English";
const TEST_PASSWORD = "1234";   // CHANGE THIS PER TEST
const TEST_DURATION = 1800;     // seconds (30 minutes)

/* ==============================
   QUESTIONS (EDIT FREELY)
================================ */
const questions = [
  {
    q: "An unintended consequence of an action, especially an unwelcome one.",
    options: ["Repercussion", "Panegyric", "Sanctuary", "Gratification"],
    answer: 0
  },
  {
    q: "Easily persuaded to believe something; overly trusting.",
    options: ["Stoic", "Gullible", "Ostentatious", "Obdurate"],
    answer: 1
  },
  {
    q: "Changing frequently, especially in loyalties or feelings.",
    options: ["Timid", "Enervate", "Fickle", "Sterility"],
    answer: 2
  },
  {
    q: "To reduce in intensity, force, or severity.",
    options: ["Vanquish", "Exalt", "Glutton", "Abate"],
    answer: 3
  },
  {
    q: "Using more words than necessary; excessively wordy.",
    options: ["Verbose", "Evident", "Sporadic", "Servile"],
    answer: 0
  },
  {
    q: "The area covered by something.",
    options: ["Allegiate", "Extent", "Sanctum", "Masque"],
    answer: 1
  },
  {
    q: "To feel or show triumphant joy or jubilation.",
    options: ["Enervate", "Ostentatious", "Exult", "Abate"],
    answer: 2
  },
  {
    q: "Deserving or causing public disgrace or shame.",
    options: ["Sanctuary", "Satiate", "Timid", "Ignominious"],
    answer: 3
  },
  {
    q: "Occurring at irregular intervals; scattered.",
    options: ["Sporadic", "Stoic", "Conspicuous", "Panegyric"],
    answer: 0
  },
  {
    q: "Excessively showy; designed to attract notice.",
    options: ["Servile", "Ostentatious", "Evident", "Sanctum"],
    answer: 1
  },
  {
    q: "Excessively eager to please or obey.",
    options: ["Vanquish", "Sterility", "Servile", "Glutton"],
    answer: 2
  },
  {
    q: "Refusing to change one’s mind; stubborn.",
    options: ["Timid", "Panegyric", "Satiate", "Obdurate"],
    answer: 3
  },
  {
    q: "Lacking in energy or vitality.",
    options: ["Enervate", "Exalt", "Conspicuous", "Masque"],
    answer: 0
  },
  {
    q: "A private place from which most people are excluded.",
    options: ["Planetarium", "Sanctum", "Aquarium", "Panegyric"],
    answer: 1
  },
  {
    q: "A public speech or text in praise of someone.",
    options: ["Evident", "Timid", "Panegyric", "Sterility"],
    answer: 2
  },
  {
    q: "Make suffering, deficiency, or a problem less severe.",
    options: ["Vanquish", "Satiate", "Glutton", "Alleviate"],
    answer: 3
  },
  {
    q: "Clearly visible or easily noticed.",
    options: ["Conspicuous", "Stoic", "Servile", "Sporadic"],
    answer: 0
  },
  {
    q: "Showing a lack of courage or confidence.",
    options: ["Evident", "Timid", "Ostentatious", "Exult"],
    answer: 1
  },
  {
    q: "Enduring pain or hardship without showing feelings.",
    options: ["Sterility", "Sanctuary", "Stoic", "Verbose"],
    answer: 2
  },
  {
    q: "Defeat thoroughly or completely.",
    options: ["Glutton", "Masque", "Evident", "Vanquish"],
    answer: 3
  }
];

const questionsDiv = document.getElementById("questions");
const resultSection = document.getElementById("resultSection");
const timerEl = document.getElementById("timer");

let timeLeft = 600; // 10 minutes

function startTimer() {
  const interval = setInterval(() => {
    let min = Math.floor(timeLeft / 60);
    let sec = timeLeft % 60;
    timerEl.textContent = `${min}:${sec < 10 ? "0" : ""}${sec}`;
    timeLeft--;

    if (timeLeft < 0) {
      clearInterval(interval);
      document.getElementById("testForm").requestSubmit();
    }
  }, 1000);
}

function loadQuestions() {
  questions.forEach((q, index) => {
    let html = `<div class="question">
      <h3>Q${index + 1}. ${q.q}</h3>`;

    q.options.forEach((opt, i) => {
      html += `
        <label>
          <input type="radio" name="q${index}" value="${i}">
          ${opt}
        </label>`;
    });

    html += `</div>`;
    questionsDiv.innerHTML += html;
  });
}

document.getElementById("testForm").addEventListener("submit", function (e) {
  e.preventDefault();

  let correct = 0, wrong = 0, unattempted = 0;
  let analysis = "";

  questions.forEach((q, i) => {
    const selected = document.querySelector(`input[name="q${i}"]:checked`);

    if (!selected) {
      unattempted++;
      analysis += `<p>Q${i+1}: Unattempted | Correct: ${q.options[q.answer]}</p>`;
    } else if (parseInt(selected.value) === q.answer) {
      correct++;
      analysis += `<p>Q${i+1}: Correct</p>`;
    } else {
      wrong++;
      analysis += `<p>Q${i+1}: Wrong | Correct: ${q.options[q.answer]}</p>`;
    }
  });

  const score = correct * 5 - wrong;

  resultSection.innerHTML = `
    <h2>Result Summary</h2>
    <p>Correct: ${correct}</p>
    <p>Wrong: ${wrong}</p>
    <p>Unattempted: ${unattempted}</p>
    <p><strong>Total Marks: ${score}</strong></p>
    <hr>
    <h3>Self Analysis</h3>
    ${analysis}
  `;

  resultSection.classList.remove("hidden");
  window.scrollTo(0, document.body.scrollHeight);
});

loadQuestions();
startTimer();


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
