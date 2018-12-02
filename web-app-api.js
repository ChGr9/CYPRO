const apiurl = "https://codecyprus.org/th/api/";

function emptyLeaderboard() {
    let leaderboardtable = document.getElementById("leaderboard");
    for (let i = 0; i < 10; i++) {
        let tdranking = document.createElement("td");
        let tdplayer = document.createElement("td");
        let tdscore = document.createElement("td");
        tdranking.innerHTML = i + 1;
        tdplayer.innerHTML = "-";
        tdscore.innerHTML = "-";
        let newtr = document.createElement("tr");
        newtr.appendChild(tdranking);
        newtr.appendChild(tdplayer);
        newtr.appendChild(tdscore);
        leaderboardtable.appendChild(newtr);
    }
}
function leaderboard() {
    if (session == undefined) {
        emptyLeaderboard();
    }
    else {
        let xhttp = new XMLHttpRequest();
        let leaderboardtable = document.getElementById("leaderboard");
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                let object = JSON.parse(this.responseText);
                for (let i = 0; i < object.leaderboard.length; i++) {
                    let tdranking = document.createElement("td");
                    let tdplayer = document.createElement("td");
                    let tdscore = document.createElement("td");
                    tdranking.innerHTML = i + 1;
                    tdplayer.innerHTML = object.leaderboard[i].player;
                    tdscore.innerHTML = object.leaderboard[i].score;
                    let newtr = document.createElement("tr");
                    newtr.appendChild(tdranking);
                    newtr.appendChild(tdplayer);
                    newtr.appendChild(tdscore);
                    leaderboardtable.appendChild(newtr);
                }
            }
            else {
                //TODO If response not received (error).
            }
        };
        let testurl = "https://codecyprus.org/th/test-api/leaderboard?sorted&size=10";
        xhttp.open("GET", testurl, true);
        xhttp.send();
    }
}
function getTreasureHuntList() {
    let xhttp = new XMLHttpRequest();
    var messages = document.getElementById("messages");
    var loginmessages = document.getElementById("loginmessages");
    let treasurehuntList = document.getElementById("treasurehuntlist");
    treasurehuntList.innerHTML = "";
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let object = JSON.parse(this.responseText);
            for (let i = 0; i<object.treasureHunts.length;i++) {
                let newli = document.createElement("li");
                newli.innerHTML = object.treasureHunts[i].name;
                newli.id = object.treasureHunts[i].uuid;
                newli.classList.add("sample");
                newli.addEventListener("click", displaylogin);
                treasurehuntList.appendChild(newli);
            }
            document.getElementById("welcome1").style.display = "block";
            treasurehuntList.style.display = "block";
        }
        else {
            //TODO If response not received (error).
        }
    }
    let requesturl = apiurl + "list";
    xhttp.open("GET",requesturl, true);
    xhttp.send();
}

function sendposition(position) {
    let lat = position.coords.latitude;
    let lng = position.coords.longitude;
    let xhttp = new XMLHttpRequest();
    let requesturl = apiurl + "location?session=" + session + "&latitude=" + lat + "&longitude" + lng;
    xhttp.open("GET", requesturl, true);
    xhttp.send();
}

function getlocation() {
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(sendposition);
    }
}

function displaylogin(e){
    uuid = e.target.attributes.id.value;
    document.getElementById("treasurehuntlist").style.display = "none";
    document.getElementById("welcome1").style.display = "none";
    document.getElementById("form2").style.display = "block";
    document.getElementById("welcome2").style.display = "block";
    document.getElementById("teamname").innerHTML = "";
}

function skip() {
    if (confirm("Are you sure you want to skip the current question?")) {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200){
                let object = JSON.parse(this.responseText);
                if (object.status === "OK") {
                    messages.className = "successmessage";
                    getquestion();
                    messages.innerHTML = object.message;
                }
                else {
                    messages.className = "errormessage";
                    messages.innerHTML = "Question can't be skipped";
                }
            }
        }
        let requesturl = apiurl + "skip?session=" + session;
        xhttp.open("GET", requesturl, true);
        xhttp.send();
    }
}

function submitanswer(url) {
    getlocation();
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let object = JSON.parse(this.responseText);
            if (object.status === "OK") {
                if (object.correct === true) {
                    messages.className = "successmessage";
                }
                else {
                    messages.className = "errormessages"
                }
                messages.innerHTML = object.message;
                console.log(object);
                getscore();
                if (object.correct === true) {
                    getquestion();
                }
            }
            else {
                messages.className = "errormessage";
                messages.innerHTML = object.errorMessages[0];
            }
        }
        else {
            //TODO If response not received (error).
        }
    }
    xhttp.open("GET",url,true);
    xhttp.send();
}

function mcqanswer(e) {
    let answer = e.target.innerHTML;
    let requesturl = apiurl + "answer?session=" + session + "&answer=" + answer.toString();
    submitanswer(requesturl);
}

function inputtof(answer) {
    let requesturl = apiurl + "answer?session=" + session + "&answer=" + answer;
    submitanswer(requesturl);
}
function inputtext() {
    let element = document.getElementById("textanswer");
    let answer = element.value;
    let requesturl = apiurl + "answer?session=" + session + "&answer=" + answer;
    element.innerHTML = "";
    submitanswer(requesturl);
}

function inputnumber() {
    let element = document.getElementById("numberanswer");
    let answer = element.value;
    let requesturl = apiurl + "answer?session=" + session + "&answer=" + answer;
    element.innerHTML = "";
    submitanswer(requesturl);
}

function linkanswers() {
    let mcq = document.getElementById("mcq").getElementsByTagName("li");
    for(let i =0; i<mcq.length;i++){
        mcq[i].addEventListener("click", mcqanswer);
    }
    getscore();
    getquestion();
}

function getscore() {
    let xhttp = new XMLHttpRequest();
    let score = document.getElementById("points");
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200){
            let object = JSON.parse(this.responseText);
            score.innerHTML = object.score;
        }
        else {
            //TODO If response not received (error).
        }
    }
    let requesturl = apiurl + "score?session=" + session;
    xhttp.open("GET", requesturl, true);
    xhttp.send();
}

function getquestion() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState===4 && this.status === 200){
            let object = JSON.parse(this.responseText);
            if (object.completed == false) {
                document.getElementById("currentquestion").innerHTML = object.currentQuestionIndex + 1 + "/" + object.numOfQuestions;
                let questiontype = object.questionType;
                document.getElementById("questions").innerHTML = object.questionText;
                if (questiontype == "BOOLEAN") {
                    document.getElementById("numberbox").style.display = "none";
                    document.getElementById("textbox").style.display = "none";
                    document.getElementById("mcq").style.display = "none";
                    document.getElementById("tof").style.display = "block";
                }
                else if (questiontype == "INTEGER") {
                    document.getElementById("numberanswer").step = 1;
                    document.getElementById("numberbox").style.display = "block";
                    document.getElementById("textbox").style.display = "none";
                    document.getElementById("mcq").style.display = "none";
                    document.getElementById("tof").style.display = "none";
                }
                else if (questiontype == "NUMERIC") {
                    document.getElementById("numberanswer").step = 0.001;
                    document.getElementById("numberbox").style.display = "block";
                    document.getElementById("textbox").style.display = "none";
                    document.getElementById("mcq").style.display = "none";
                    document.getElementById("tof").style.display = "none";
                }
                else if (questiontype == "MCQ") {
                    document.getElementById("mcq").style.display = "block";
                    document.getElementById("numberbox").style.display = "none";
                    document.getElementById("textbox").style.display = "none";
                    document.getElementById("tof").style.display = "none";
                }
                else if (questiontype == "TEXT") {
                    document.getElementById("textbox").style.display = "block";
                    document.getElementById("numberbox").style.display = "none";
                    document.getElementById("mcq").style.display = "none";
                    document.getElementById("tof").style.display = "none";
                }
            }
            else {
                messages.innerHTML = "";
                document.getElementById("textbox").style.display = "none";
                document.getElementById("numberbox").style.display = "none";
                document.getElementById("mcq").style.display = "none";
                document.getElementById("tof").style.display = "none";
                document.getElementById("welcome3").style.display = "none";
                document.getElementById("questions").style.display = "none";
                document.getElementById("showpoints").style.display = "none";
                document.getElementById("skipbutton").style.display = "none";
                document.getElementById("end").style.display = "block";
            }
        }
        else{
            //TODO If response not received (error).
        }
    }
    let requesturl = apiurl + "question?session=" + session;
    xhttp.open("GET", requesturl,true);
    xhttp.send();
}

function displayQuestions() {
    document.getElementById("form2").style.display = "none";
    document.getElementById("welcome2").style.display = "none";
    document.getElementById("welcome3").style.display = "block";
    document.getElementById("questions").style.display = "block";
    document.getElementById("showpoints").style.display = "block";
    document.getElementById("skipbutton").style.display = "block";
    linkanswers();
}

function loginsubmit(){
    let v = document.getElementById("teamname").value;
    loginmessages.innerHTML = "";
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200){
            let object = JSON.parse(this.responseText);
            if (object.status === "OK"){
                session = object.session;
                displayQuestions();
            }
            else if (object.status === "ERROR"){
                loginmessages.innerHTML = v + ", is already in use";
            }
        }
        else {
            //TODO If response not received (error).
        }
    }
    let requesturl = apiurl + "start?player=" +v +"&app=Team1&treasure-hunt-id=" + uuid.toString();
    xhttp.open("GET",requesturl,true);
    xhttp.send();
}

function playagain() {
    document.getElementById("end").style.display = "none";
    getTreasureHuntList();
}

var uuid;
var session;
