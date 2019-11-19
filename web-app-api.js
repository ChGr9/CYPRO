const apiurl = "https://codecyprus.org/th/api/";
var camera = 0;

var opts = {
    // Whether to scan continuously for QR codes. If false, use scanner.scan() to
    // manually scan. If true, the scanner emits the "scan" event when a QR code is
    // scanned. Default true.
    continuous: true,

    // The HTML element to use for the camera's video preview. Must be a <video>
    // element. When the camera is active, this element will have the "active" CSS
    // class, otherwise, it will have the "inactive" class. By default, an invisible
    // element will be created to host the video.
    video: document.getElementById('preview'),

    // Whether to horizontally mirror the video preview. This is helpful when trying to
    // scan a QR code with a user-facing camera. Default true.
    mirror: false,

    // Whether to include the scanned image data as part of the scan result. See the
    // "scan" event for image format details. Default false.
    captureImage: false,

    // Only applies to continuous mode. Whether to actively scan when the tab is not
    // active.
    // When false, this reduces CPU usage when the tab is not active. Default true.
    backgroundScan: true,

    // Only applies to continuous mode. The period, in milliseconds, before the same QR
    // code will be recognized in succession. Default 5000 (5 seconds).
    refractoryPeriod: 5000,

    // Only applies to continuous mode. The period, in rendered frames, between scans. A
    // lower scan period increases CPU usage but makes scan response faster.
    // Default 1 (i.e. analyze every frame).
    scanPeriod: 1
};


var scanner = new Instascan.Scanner(opts);

function QRreader() {
    document.getElementById("QRreader").style.display = "block";
    document.getElementById("startqr").style.display = "none";
    document.getElementById("stopqr").style.display = "block";
    Instascan.Camera.getCameras().then(function (cameras) {
        if (cameras.length > 1) {
            scanner.start(cameras[0]);
        }
        else {
            console.error('No rear camera found.');
            alert("No rear camera found.");
        }
    }).catch(function (e) {
        console.error(e);
    });
    scanner.addListener('scan', function (content) {
        console.log(content);
        let element = document.createElement("a");
        element.innerHTML = content;
        element.href = content;
        document.getElementById("content").appendChild(element);
    });
}

function QRstop() {
    scanner.stop();
    document.getElementById("QRreader").style.display = "none";
    document.getElementById("startqr").style.display = "block";
    document.getElementById("stopqr").style.display = "none";
}

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
    let queryString = decodeURIComponent(window.location.search);
    queryString = queryString.substring(1);
    let array = queryString.split("=");
    session = array[1];
    if (session == "") {
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
        };
        let requesturl = apiurl + "leaderboard?session=" + session + "&sorted&limit=10";
        xhttp.open("GET", requesturl, true);
        xhttp.send();
    }
}

function leaderboardcall() {
    location.replace("leaderboard.html" + "?session=" + session);
}

function getTreasureHuntList() {
    let xhttp = new XMLHttpRequest();
    var messages = document.getElementById("messages");
    var loginmessages = document.getElementById("loginmessages");
    var locationmessages = document.getElementById("locationmessages");
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
    document.getElementById("back").style.display = "block";
}

function restart() {
    if (confirm("Are you sure you want to restart the game?")) {
        document.cookie = "";
        location.reload();
    }
}

function skip() {
    if (confirm("Are you sure you want to skip the current question?")) {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200){
                let object = JSON.parse(this.responseText);
                if (object.status === "OK") {
                    messages.className = "successmessage";
                    messages.innerHTML = "Skipped";
                    getquestion();
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
                    messages.innerHTML = "Well Done";
                    getquestion();
                }
                else {
                    messages.className = "errormessage"
                    messages.innerHTML = "Wrong Answer";
                }
                getscore();
            }
            else {
                messages.className = "errormessage";
                messages.innerHTML = object.errorMessages[0];
            }
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
    element.value = "";
    submitanswer(requesturl);
}

function inputnumber() {
    let element = document.getElementById("numberanswer");
    let answer = element.value;
    let requesturl = apiurl + "answer?session=" + session + "&answer=" + answer;
    element.value = "";
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
                if (object.canBeSkipped == true){
                    document.getElementById("skipbutton").style.display = "block";
                }
                else {
                    document.getElementById("skipbutton").style.display = "none";
                }
                if (object.requiresLocation == true){
                    locationmessages.innerHTML = "Location Required";
                }
                else {
                    locationmessages.innerHTML = "";
                }
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
                document.cookie = "";
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
    }
    let requesturl = apiurl + "question?session=" + session;
    xhttp.open("GET", requesturl,true);
    xhttp.send();
}

function displayQuestions() {
    document.getElementById("form2").style.display = "none";
    document.getElementById("welcome2").style.display = "none";
    document.getElementById("back").style.display = "none";
    document.getElementById("welcome3").style.display = "block";
    document.getElementById("questions").style.display = "block";
    document.getElementById("showpoints").style.display = "block";
    document.getElementById("skipbutton").style.display = "block";
    document.getElementById("restart").style.display = "block";
    linkanswers();
}

function loginsubmit(){
    let v = document.getElementById("teamname").value;
    loginmessages.innerHTML = "";
    document.getElementById("teamname").value = "";
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200){
            let object = JSON.parse(this.responseText);
            if (object.status === "OK"){
                session = object.session;
                document.cookie = session;
                displayQuestions();
            }
            else if (object.status === "ERROR"){
                loginmessages.innerHTML = v + ", is already in use";
            }
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

function checkcookies() {
    if (session === ""){
        getTreasureHuntList();
    }
    else {
        var uuid;
        displayQuestions();
    }
}

var session = document.cookie;
