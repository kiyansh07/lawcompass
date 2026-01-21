const data = JSON.parse(localStorage.getItem("leaderboard") || "[]");

data.sort((a, b) => b.score - a.score || a.time - b.time);

const table = document.getElementById("board");
table.innerHTML = `
<tr><th>Rank</th><th>Score</th><th>Time</th></tr>
` + data.map((d, i) =>
  `<tr><td>${i + 1}</td><td>${d.score}</td><td>${d.time}s</td></tr>`
).join("");

