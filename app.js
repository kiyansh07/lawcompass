// ================= GLOBAL VARIABLES =================

let studentName = "";
let studentId = "";

let currentQuestionIndex = 0;
let score = 0;
let userAnswers = [];

// questions come from questions.js
// make sure questions.js is loaded before this file

// ================= LOGIN SYSTEM =================

function loginStudent() {
  const nameInput = document.getElementById("studentName");
  const idInput = document.getElementById("studentId");

  studentName = nameInput.value.trim();
  studentId = idInput.value.trim();

  if (!studentName || !studentId) {
    alert("Please enter your name and student ID");
    return;
  }

  // Prevent multiple attempts
  const attemptKey = "attempt_" + studentId;

  if (localStorage.getItem(attemptKey)) {
    alert("You have already attempted this test.");
    return;
  }

  document.getElementById("passwordSection").style.display = "block";
}

// ================= PASSWORD VERIFICATION =================

async function verifyPassword() {
  const enteredPassword = document.getElementById("testPassword").value;

  if (!enteredPassword) {
    alert("Enter test password");
    return;
  }

  try {
    const docRef = db.collection("testSettings").doc("currentTest");
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      alert("Test settings not found.");
      return;
    }

    const data = docSnap.data();

    if (enteredPassword !== data.password) {
      alert("Incorrect password");
      return;
    }

    startTest();

  } catch (error) {
    console.error(error);
    alert("Error verifying password");
  }
}

// ================= START TEST =================

function startTest() {
  document.querySelector(".container").style.display = "none";
  document.getElementById("quizContainer").style.display = "block";

  loadQuestion();
}

// ================= LOAD QUESTION =================

function loadQuestion() {
  const questionElement = document.getElementById("question");
  const optionsContainer = document.getElementById("options");

  optionsContainer.innerHTML = "";

  const currentQuestion = questions[currentQuestionIndex];

  questionElement.textContent =
    (currentQuestionIndex + 1) + ". " + currentQuestion.question;

  currentQuestion.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.classList.add("option-btn");
    button.textContent = option;

    button.onclick = () => selectAnswer(index);

    optionsContainer.appendChild(button);
  });
}

// ================= SELECT ANSWER =================

function selectAnswer(selectedIndex) {
  userAnswers[currentQuestionIndex] = selectedIndex;

  const buttons = document.querySelectorAll(".option-btn");

  buttons.forEach((btn) => {
    btn.style.background = "white";
  });

  buttons[selectedIndex].style.background = "#dbeafe";
}

// ================= NEXT QUESTION =================

function nextQuestion() {
  if (userAnswers[currentQuestionIndex] === undefined) {
    alert("Please select an answer");
    return;
  }

  currentQuestionIndex++;

  if (currentQuestionIndex >= questions.length) {
    submitTest();
    return;
  }

  loadQuestion();
}

// ================= SUBMIT TEST =================

async function submitTest() {
  calculateScore();

  try {
    await db.collection("leaderboard").add({
      name: studentName,
      studentId: studentId,
      score: score,
      total: questions.length,
      timestamp: new Date()
    });

    // Save attempt
    localStorage.setItem("attempt_" + studentId, "true");

    document.getElementById("quizContainer").style.display = "none";
    document.getElementById("resultContainer").style.display = "block";

  } catch (error) {
    console.error(error);
    alert("Error submitting test.");
  }
}

// ================= CALCULATE SCORE =================

function calculateScore() {
  score = 0;

  questions.forEach((q, index) => {
    if (userAnswers[index] === q.answer) {
      score++;
    }
  });
}

// ================= HOMEPAGE LEADERBOARD PREVIEW =================

async function loadTopLeaderboard() {
  try {
    const container = document.getElementById("topLeaderboard");

    if (!container) return;

    const snapshot = await db
      .collection("leaderboard")
      .orderBy("score", "desc")
      .limit(5)
      .get();

    container.innerHTML = "";

    snapshot.forEach((doc, index) => {
      const data = doc.data();

      container.innerHTML += `
        <div class="leaderboard-card">
          <span>#${index + 1} ${data.name}</span>
          <span>${data.score}</span>
        </div>
      `;
    });

  } catch (error) {
    console.log("Leaderboard preview error:", error);
  }
}

// Run leaderboard preview
loadTopLeaderboard();
