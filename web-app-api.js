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
                newli.addEventListener("click", displaylogin);
                treasurehuntList.appendChild(newli);
            }
            document.getElementById("welcome").style.display = "block";
            treasurehuntList.style.display = "block;"
        }
        else {
            //TODO If response not received (error).
        }
    };
    let requesturl = apiurl + "list";
    xhttp.open("GET",requesturl, true);
    xhttp.send();
}

function displaylogin(e){
    var uuid;
    uuid = e.target.attributes.id.value;
    document.getElementById("treasurehuntlistblock").style.display = "none";
    document.getElementById("login").style.display = "block";
}

function getquestion() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState===4 && this.status === 200){
            let object = JSON.parse(this.responseText);
            let questiontext = object.questionText;
            let questiontype = object.questionType;
            let currentquestionindex = object.questionQuestionIndex;
            let numberofquestions = object.numOfQuestions;
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
    document.getElementById("login").style.display = "none";
    //document.getElementById("...").style.display = "block";
}

function loginsubmit(){
    let v = document.getElementById("teamname").value;
    messages.innerHTML = "";
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200){
            let object = JSON.parse(this.responseText);
            if (object.status === "OK"){
                messages.innerHTML = "";
                var session;
                session = object.session;
                //displayQuestions();
            }
            else if (object.status === "ERROR"){
                messages.innerHTML = object.errorMessages[0];
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