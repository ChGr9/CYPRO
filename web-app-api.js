const apiurl = "https://codecyprus.org/th/api/";

function leaderboard() {
    let xhttp = new XMLHttpRequest();
    let leaderboardtable = document.getElementById("leaderboard");
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let object = JSON.parse(this.responseText);
            for (let i = 0; i<object.leaderboard.length;i++) {
                let tdranking = document.createElement("td");
                let tdplayer = document.createElement("td");
                let tdscore = document.createElement("td");
                tdranking.innerHTML = i +1;
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
    let testurl= "https://codecyprus.org/th/test-api/leaderboard?sorted&size=10";
    xhttp.open("GET",testurl, true);
    xhttp.send();
}

function getTreasureHuntList() {
    let xhttp = new XMLHttpRequest();
    //var messages = document.getElementById("messages");
    let treasurehuntList = document.getElementById("treasurehuntlist");
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

function displaylogin(e){
    uuid = e.target.attributes.id.value;
    document.getElementById("treasurehuntlist").style.display = "none";
    document.getElementById("welcome1").style.display = "none"
    document.getElementById("form2").style.display = "block";
    document.getElementById("welcome2").style.display = "block";
}

function submitanswer(url) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let object = JSON.parse(this.responseText);
            //messages.innerHTML = object.message;
            getscore();
            if (object.correct == true){
                getquestion();
            }
        }
        else {
            //TODO If response not received (error).
        }
    }
    xhttp.open("GET",url,true);
    xhttp.send();
}

function lianswer(e) {
    let answer = e.target.innerHTML;
    let requesturl = apiurl + "answer?session=" + session + "&answer=" + answer.toString();
    submitanswer(requesturl);
}

function inputboxanswer() {
    let requesturl = apiurl + "answe?session=" + session + "&answer=" + document.getElementById("inputbox").innerHTML;
    submitanswer(requesturl);
}

function linkanswers() {
    let mcq = document.getElementById("mcq").getElementsByTagName("li");
    for(let i =0; i<mcq.length;i++){
        mcq[i].addEventListener("click", lianswer);
    }
    let tof = document.getElementById("tof").getElementsByTagName("li");
    for (let i =0; i<tof.length;i++){
        tof[i].addEventListener("click", lianswer);
    }
    getscore();
    getquestion();
}

function getscore() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200){
            let object = JSON.parse(this.responseText);
            //score.innerHTML = object.score;
        }
        else {
            //TODO If response not received (error).
        }
    }
}

function getquestion() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState===4 && this.status === 200){
            let object = JSON.parse(this.responseText);
            if (object.completed == false) {
                let questiontype = object.questionType;
                document.getElementById("questions").innerHTML = object.questionText;
                console.log(questiontype);
                if (questiontype == "BOOLEAN") {
                    document.getElementById("box").style.display = "none";
                    document.getElementById("mcq").style.display = "none";
                    document.getElementById("tof").style.display = "block"
                }
                else if (questiontype == "INTEGER") {
                    document.getElementById("inputbox").setAttribute("type", "number");
                    document.getElementById("box").style.display = "block";
                    document.getElementById("mcq").style.display = "none";
                    document.getElementById("tof").style.display = "none";
                }
                else if (questiontype == "NUMERIC") {
                    document.getElementById("inputbox").setAttribute("type", "number");
                    document.getElementById("box").style.display = "block";
                    document.getElementById("mcq").style.display = "none";
                    document.getElementById("tof").style.display = "none";
                }
                else if (questiontype == "MCQ") {
                    document.getElementById("mcq").style.display = "block";
                    document.getElementById("box").style.display = "none";
                    document.getElementById("tof").style.display = "none";
                }
                else if (questiontype == "TEXT") {
                    document.getElementById("inputbox").setAttribute("type", "text");
                    document.getElementById("box").style.display = "block";
                    document.getElementById("mcq").style.display = "none";
                    document.getElementById("tof").style.display = "none";
                }
            }
            else {
                console.log("finished");
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
    linkanswers();
}

function loginsubmit(){
    let v = document.getElementById("teamname").value;
    //messages.innerHTML = "";
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200){
            let object = JSON.parse(this.responseText);
            if (object.status === "OK"){
                session = object.session;
                displayQuestions();
            }
            else if (object.status === "ERROR"){
                //messages.innerHTML = object.errorMessages[0];
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

var uuid;
var session;
