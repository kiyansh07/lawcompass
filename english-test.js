document.addEventListener("DOMContentLoaded", function () {

  const questions = [
    { q: "An unintended consequence of an action, especially an unwelcome one.", options: ["Repercussion","Panegyric","Sanctuary","Gratification"], answer: 0 },
    { q: "Easily persuaded to believe something; overly trusting.", options: ["Stoic","Gullible","Ostentatious","Obdurate"], answer: 1 },
    { q: "Changing frequently, especially in loyalties or feelings.", options: ["Timid","Enervate","Fickle","Sterility"], answer: 2 },
    { q: "To reduce in intensity, force, or severity.", options: ["Vanquish","Exalt","Glutton","Abate"], answer: 3 },
    { q: "Using more words than necessary; excessively wordy.", options: ["Verbose","Evident","Sporadic","Servile"], answer: 0 },
    { q: "The area covered by something.", options: ["Allegiate","Extent","Sanctum","Masque"], answer: 1 },
    { q: "To feel or show triumphant joy or jubilation.", options: ["Enervate","Ostentatious","Exult","Abate"], answer: 2 },
    { q: "Deserving or causing public disgrace or shame.", options: ["Sanctuary","Satiate","Timid","Ignominious"], answer: 3 },
    { q: "Occurring at irregular intervals; scattered.", options: ["Sporadic","Stoic","Conspicuous","Panegyric"], answer: 0 },
    { q: "Excessively showy; designed to attract notice.", options: ["Servile","Ostentatious","Evident","Sanctum"], answer: 1 },
    { q: "Excessively eager to please or obey.", options: ["Vanquish","Sterility","Servile","Glutton"], answer: 2 },
    { q: "Refusing to change one’s mind; stubborn.", options: ["Timid","Panegyric","Satiate","Obdurate"], answer: 3 },
    { q: "Lacking in energy or vitality.", options: ["Enervate","Exalt","Conspicuous","Masque"], answer: 0 },
    { q: "A private place from which most people are excluded.", options: ["Planetarium","Sanctum","Aquarium","Panegyric"], answer: 1 },
    { q: "A public speech or text in praise of someone.", options: ["Evident","Timid","Panegyric","Sterility"], answer: 2 },
    { q: "Make suffering, deficiency, or a problem less severe.", options: ["Vanquish","Satiate","Glutton","Alleviate"], answer: 3 },
    { q: "Clearly visible or easily noticed.", options: ["Conspicuous","Stoic","Servile","Sporadic"], answer: 0 },
    { q: "Showing a lack of courage or confidence.", options: ["Evident","Timid","Ostentatious","Exult"], answer: 1 },
    { q: "Enduring pain or hardship without showing feelings.", options: ["Sterility","Sanctuary","Stoic","Verbose"], answer: 2 },
    { q: "Defeat thoroughly or completely.", options: ["Glutton","Masque","Evident","Vanquish"], answer: 3 }
  ];

  const questionsDiv = document.getElementById("questions");
  const resultSection = document.getElementById("resultSection");
  const timerEl = document.getElementById("timer");

  let timeLeft = 600;
  let timer;

  function startTimer() {
    timer = setInterval(() => {
      const min = Math.floor(timeLeft / 60);
      const sec = timeLeft % 60;
      timerEl.textContent = `${min}:${sec < 10 ? "0" : ""}${sec}`;
      timeLeft--;

      if (timeLeft < 0) {
        clearInterval(timer);
        document.getElementById("testForm").requestSubmit();
      }
    }, 1000);
  }

  function renderQuestions() {
    questionsDiv.innerHTML = "";
    questions.forEach((q, index) => {
      const div = document.createElement("div");
      div.className = "question";
      div.innerHTML = `<h3>Q${index + 1}. ${q.q}</h3>` +
        q.options.map((opt, i) => `
          <label>
            <input type="radio" name="q${index}" value="${i}">
            ${opt}
          </label>
        `).join("");
      questionsDiv.appendChild(div);
    });
  }

  document.getElementById("testForm").addEventListener("submit", function (e) {
    e.preventDefault();
    clearInterval(timer);

    let correct = 0, wrong = 0, unattempted = 0;
    let analysisHTML = "<table><tr><th>Q</th><th>Your Answer</th><th>Correct Answer</th><th>Status</th></tr>";

    questions.forEach((q, i) => {
      const selected = document.querySelector(`input[name="q${i}"]:checked`);
      if (!selected) {
        unattempted++;
        analysisHTML += `<tr><td>${i+1}</td><td>—</td><td>${q.options[q.answer]}</td><td>Unattempted</td></tr>`;
      } else if (parseInt(selected.value) === q.answer) {
        correct++;
        analysisHTML += `<tr><td>${i+1}</td><td>${q.options[q.answer]}</td><td>${q.options[q.answer]}</td><td>Correct</td></tr>`;
      } else {
        wrong++;
        analysisHTML += `<tr><td>${i+1}</td><td>${q.options[selected.value]}</td><td>${q.options[q.answer]}</td><td>Wrong</td></tr>`;
      }
    });

    const score = correct * 5 - wrong;

    analysisHTML += "</table>";

    resultSection.innerHTML = `
      <h2>Result Summary</h2>
      <p>Correct: ${correct}</p>
      <p>Wrong: ${wrong}</p>
      <p>Unattempted: ${unattempted}</p>
      <p><strong>Total Marks: ${score}</strong></p>
      <h3>Detailed Analysis</h3>
      ${analysisHTML}
    `;

    resultSection.classList.remove("hidden");
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  });

  renderQuestions();
  startTimer();

});
