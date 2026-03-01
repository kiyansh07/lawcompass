let currentUser = null;
let currentQuestion = 0;
let answers = [];
let timerInterval;
let startTime;

/* PAGE NAVIGATION (Animated transitions) */
function show(page){
document.querySelectorAll(".page").forEach(p=>{
p.classList.remove("active");
});
document.getElementById(page).classList.add("active");
}

/* LOGIN */
function login(){
let name = document.getElementById("name").value.trim();
let id = document.getElementById("studentId").value.trim();

if(!name || !id){
alert("Enter Name and Student ID");
return;
}

currentUser = { name, id };
show("instructionsPage");
}

/* INSTRUCTIONS → PASSWORD */
function goToPassword(){
show("passwordPage");
}

/* PASSWORD CHECK + STUDENT LIMIT */
async function verifyPassword(){

let entered = document.getElementById("testPassword").value;

let ref = doc(db,"testSettings","currentTest");
let snap = await getDoc(ref);
let data = snap.data();

if(entered !== data.testPassword){
alert("Wrong password");
return;
}

if(data.activeStudents >= data.maxStudents){
alert("Test capacity reached");
return;
}

await updateDoc(ref,{
activeStudents: data.activeStudents + 1
});

startExam();
}

/* START EXAM */
function startExam(){
show("examPage");

document.getElementById("testName").innerText = testConfig.testName;

createNavigator();
loadQuestion();
startTimer();

startTime = new Date();
}

/* LOAD QUESTION */
function loadQuestion(){

let q = questions[currentQuestion];

let html = `<h3>Q${currentQuestion+1}. ${q.question}</h3>`;

q.options.forEach((opt,i)=>{
html += `
<div class="option">
<input type="radio"
${answers[currentQuestion] === i ? "checked":""}
onclick="saveAnswer(${i})">
${opt}
</div>
`;
});

document.getElementById("questionContainer").innerHTML = html;

highlightCurrent();
}

/* SAVE ANSWER */
function saveAnswer(i){
answers[currentQuestion] = i;

let buttons = document.querySelectorAll("#navigator button");
buttons[currentQuestion].classList.add("answered");
}

/* NAVIGATION */
function nextQuestion(){
if(currentQuestion < questions.length - 1){
currentQuestion++;
loadQuestion();
}
}

function prevQuestion(){
if(currentQuestion > 0){
currentQuestion--;
loadQuestion();
}
}

function jump(i){
currentQuestion = i;
loadQuestion();
}

/* QUESTION NAVIGATOR */
function createNavigator(){

let nav = "";

for(let i=0;i<questions.length;i++){
nav += `<button onclick="jump(${i})">${i+1}</button>`;
}

document.getElementById("navigator").innerHTML = nav;
}

/* CURRENT QUESTION HIGHLIGHT */
function highlightCurrent(){
let buttons = document.querySelectorAll("#navigator button");

buttons.forEach(b=>b.classList.remove("current"));
buttons[currentQuestion].classList.add("current");
}

/* TIMER */
function startTimer(){

let time = testConfig.durationMinutes * 60;

timerInterval = setInterval(()=>{

time--;

let min = Math.floor(time / 60);
let sec = time % 60;

document.getElementById("timer").innerText =
`${min}:${sec < 10 ? "0"+sec : sec}`;

if(time <= 0){
clearInterval(timerInterval);
submitTest();
}

},1000);
}

/* SUBMIT TEST */
async function submitTest(){

clearInterval(timerInterval);

let score = 0;

questions.forEach((q,i)=>{
if(answers[i] === q.answer) score++;
});

let submitTime = new Date();

/* SAVE RESULT */
await setDoc(doc(db,"leaderboard",currentUser.id),{
name: currentUser.name,
score: score,
submittedAt: submitTime
});

document.getElementById("scoreDisplay").innerText =
`Score: ${score} / ${questions.length}`;

show("resultPage");

calculateRank();
}

/* RANK BADGES */
function showBadge(rank){

let badge = "";

if(rank === 1) badge = "🏆 Champion";
else if(rank <= 3) badge = "🥇 Top Performer";
else if(rank <= 10) badge = "⭐ Elite Ranker";
else badge = "📘 Participant";

document.getElementById("badge").innerText = badge;
}

/* CALCULATE RANK */
async function calculateRank(){

let snap = await getDocs(collection(db,"leaderboard"));

let arr = [];

snap.forEach(doc=>{
arr.push(doc.data());
});

arr.sort((a,b)=>{
if(b.score !== a.score) return b.score - a.score;
return new Date(a.submittedAt) - new Date(b.submittedAt);
});

let rank = arr.findIndex(x=>x.name === currentUser.name) + 1;

document.getElementById("rankDisplay").innerText =
`Your Rank: ${rank}`;

showBadge(rank);
}

/* LOAD LEADERBOARD */
async function loadLeaderboard(){

show("leaderboardPage");

let q = query(
collection(db,"leaderboard"),
orderBy("score","desc"),
orderBy("submittedAt","asc"),
limit(10)
);

let snap = await getDocs(q);

let html = "";
let r = 1;

snap.forEach(doc=>{

let d = doc.data();

let rankClass = "";
if(r === 1) rankClass = "rank1";
if(r === 2) rankClass = "rank2";
if(r === 3) rankClass = "rank3";

html += `
<p class="${rankClass}">
#${r} ${d.name} — ${d.score}
</p>
`;

r++;
});

document.getElementById("top10").innerHTML = html;
}

/* SEARCH RANK */
async function searchRank(){

let term = document.getElementById("searchBox").value.toLowerCase();

let snap = await getDocs(collection(db,"leaderboard"));

let arr = [];

snap.forEach(doc=>{
arr.push(doc.data());
});

arr.sort((a,b)=>{
if(b.score !== a.score) return b.score - a.score;
return new Date(a.submittedAt) - new Date(b.submittedAt);
});

let index = arr.findIndex(x =>
x.name.toLowerCase().includes(term)
);

if(index === -1){
document.getElementById("searchResult").innerText = "Not found";
return;
}

let d = arr[index];

document.getElementById("searchResult").innerText =
`Rank: ${index+1} | ${d.name} | Score: ${d.score}`;
}
async function loadTopLeaderboard(){
const snapshot = await db
.collection("leaderboard")
.orderBy("score","desc")
.limit(5)
.get();

const container = document.getElementById("topLeaderboard");

if(!container) return;

container.innerHTML="";

snapshot.forEach((doc,index)=>{
const data = doc.data();

container.innerHTML += `
<div class="leaderboard-card">
<span>#${index+1} ${data.name}</span>
<span>${data.score}</span>
</div>
`;
});
}

loadTopLeaderboard();
