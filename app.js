let currentUser = null;
let currentQuestion = 0;
let answers = [];
let startTime;
let timerInterval;

function show(page){
document.querySelectorAll("section").forEach(s=>s.classList.add("hidden"));
document.getElementById(page).classList.remove("hidden");
}

async function login(){
let name=document.getElementById("name").value;
let id=document.getElementById("studentId").value;

if(!name || !id){
alert("Enter details");
return;
}

currentUser={name,id};
show("instructionsPage");
}

function goToPassword(){
show("passwordPage");
}

async function verifyPassword(){
let entered=document.getElementById("testPassword").value;

let ref=doc(db,"testSettings","currentTest");
let snap=await getDoc(ref);
let data=snap.data();

if(entered!==data.testPassword){
alert("Wrong password");
return;
}

if(data.activeStudents>=data.maxStudents){
alert("Test full");
return;
}

await updateDoc(ref,{
activeStudents:data.activeStudents+1
});

startExam();
}

function startExam(){
show("examPage");
loadQuestion();
createNavigator();
startTimer();
startTime=new Date();
}

function loadQuestion(){
let q=questions[currentQuestion];
let html=`<h3>${q.question}</h3>`;

q.options.forEach((opt,i)=>{
html+=`
<div>
<input type="radio" name="q" onclick="saveAnswer(${i})"
${answers[currentQuestion]==i?"checked":""}>
${opt}
</div>`;
});

document.getElementById("questionContainer").innerHTML=html;
}

function saveAnswer(i){
answers[currentQuestion]=i;
}

function nextQuestion(){
if(currentQuestion<questions.length-1){
currentQuestion++;
loadQuestion();
}
}

function prevQuestion(){
if(currentQuestion>0){
currentQuestion--;
loadQuestion();
}
}

function createNavigator(){
let nav="";
for(let i=0;i<questions.length;i++){
nav+=`<button onclick="jump(${i})">${i+1}</button>`;
}
document.getElementById("navigator").innerHTML=nav;
}

function jump(i){
currentQuestion=i;
loadQuestion();
}

function startTimer(){
let time=testConfig.durationMinutes*60;
timerInterval=setInterval(()=>{
time--;
let min=Math.floor(time/60);
let sec=time%60;
document.getElementById("timer").innerText=min+":"+sec;

if(time<=0){
clearInterval(timerInterval);
submitTest();
}
},1000);
}

async function submitTest(){
clearInterval(timerInterval);

let score=0;
questions.forEach((q,i)=>{
if(answers[i]==q.answer) score++;
});

let submitTime=new Date();

await setDoc(doc(db,"leaderboard",currentUser.id),{
name:currentUser.name,
score:score,
submittedAt:submitTime
});

document.getElementById("scoreDisplay").innerText=
"Score: "+score+" / "+questions.length;

show("resultPage");

calculateRank();
}

async function calculateRank(){
let snap=await getDocs(collection(db,"leaderboard"));
let arr=[];

snap.forEach(doc=>{
arr.push(doc.data());
});

arr.sort((a,b)=>{
if(b.score!==a.score) return b.score-a.score;
return new Date(a.submittedAt)-new Date(b.submittedAt);
});

let rank=arr.findIndex(x=>x.name===currentUser.name)+1;

document.getElementById("rankDisplay").innerText=
"Your Rank: "+rank;
}

async function loadLeaderboard(){
show("leaderboardPage");

let q=query(collection(db,"leaderboard"),
orderBy("score","desc"),
orderBy("submittedAt","asc"),
limit(10));

let snap=await getDocs(q);

let html="";
let r=1;

snap.forEach(doc=>{
let d=doc.data();
html+=`<p>${r}. ${d.name} - ${d.score}</p>`;
r++;
});

document.getElementById("top10").innerHTML=html;
}

async function searchRank(){
let term=document.getElementById("searchBox").value.toLowerCase();

let snap=await getDocs(collection(db,"leaderboard"));
let arr=[];

snap.forEach(doc=>{
arr.push(doc.data());
});

arr.sort((a,b)=>{
if(b.score!==a.score) return b.score-a.score;
return new Date(a.submittedAt)-new Date(b.submittedAt);
});

let index=arr.findIndex(x=>
x.name.toLowerCase().includes(term)
);

if(index==-1){
document.getElementById("searchResult").innerText="Not found";
return;
}

let d=arr[index];

document.getElementById("searchResult").innerText=
`Rank: ${index+1} | ${d.name} | Score: ${d.score}`;
}

