const testapi = "https://codecyprus.org/th/test-api/";

function listset() {
    clear(settings);
    clear(result);
    settings.innerHTML = " <form action=\"JAVASCRIPT:list()\">\n" +
        "        <input type=\"number\" id=\"numberoflist\">\n" +
        "        <input type=\"submit\">\n" +
        "    </form>";
}

function startset() {
    clear(settings);
    clear(result);
    settings.innerHTML = "<form action=\"JAVASCRIPT:start()\">\n" +
        "        <input type=\"radio\" name=\"player\" value=\"inactive\"> inactive <br>\n" +
        "        <input type=\"radio\" name=\"player\" value=\"empty\"> empty <br>\n" +
        "        <input type=\"radio\" name=\"player\" value=\"player\"> player <br>\n" +
        "        <input type=\"radio\" name=\"player\" value=\"app\"> app <br>\n" +
        "        <input type=\"radio\" name=\"player\" value=\"unknown\"> unkown <br>\n" +
        "        <input type=\"radio\" name=\"player\" value=\"missing\"> missing <br>\n" +
        "        <input type=\"submit\">\n" +
        "    </form>";
}

function questionset() {
    clear(settings);
    clear(result);
    settings.innerHTML = "<form action=\"JAVASCRIPT:question()\">\n" +
        "        <input type=\"checkbox\" id=\"complete\"> completed <br>\n" +
        "        <input type=\"radio\" name=\"question\" value=\"boolean\"> boolean <br>\n" +
        "        <input type=\"radio\" name=\"question\" value=\"mcq\"> mcq <br>\n" +
        "        <input type=\"radio\" name=\"question\" value=\"integer\"> integer <br>\n" +
        "        <input type=\"radio\" name=\"question\" value=\"numeric\"> numeric <br>\n" +
        "        <input type=\"radio\" name=\"question\" value=\"text\"> text <br>\n" +
        "        <input type=\"checkbox\" name=\"checkbox\" value=\"can-be-skipped\"> can be skipped <br>\n" +
        "        <input type=\"checkbox\" name=\"checkbox\" value=\"requires-location\"> requires location <br>\n" +
        "        <input type=\"submit\">\n" +
        "    </form>";
}

function answerset() {
    clear(settings);
    clear(result);
    settings.innerHTML = "<form action=\"JAVASCRIPT:answer()\">\n" +
        "        <input type=\"radio\" id=\"correct\"> correct <br>\n" +
        "        <input type=\"radio\" id=\"wrong\"> wrong <br>\n" +
        "        <input type=\"checkbox\" id=\"complete\"> complete <br>\n" +
        "        <input type=\"submit\">\n" +
        "    </form>";
}

function leaderboardset() {
    clear(settings);
    clear(result);
    settings.innerHTML = "<form action=\"JAVASCRIPT:leaderboard()\">\n" +
        "        <input type=\"number\" id=\"numberofleaderboard\"> <br>\n" +
        "        <input type=\"submit\">\n" +
        "    </form>";
}

function list() {
    let xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        let object = JSON.parse(this.responseText);
        for (let i = 0; i<object.treasureHunts.length;i++) {
            let newli = document.createElement("li");
            newli.innerHTML = object.treasureHunts[i].name;
            newli.id = object.treasureHunts[i].uuid;
            result.appendChild(newli);
        }
        clear(settings);
    }
    let url = testapi + "list?number-of-ths=" + document.getElementById("numberoflist").value;
    xhttp.open("GET",url, true);
    xhttp.send();
}

function start() {
    let message = document.createElement("p");
    let xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        let object = JSON.parse(this.responseText);
        if (object.status === "OK"){
            message.innerHTML = "success"
        }
        else if (object.status === "ERROR"){
            for (let i=0; i<object.errorMessages.length; i++){
                message.innerHTML = message.innerHTML + object.errorMessages[i];
            }
        }
        result.appendChild(message);
        clear(settings);
    }
    let url = testapi + "start?player=";
    var form = document.forms[0];
    for (let i = 0; i < form.length; i++) {
        if (form[i].checked) {
            url = url + form[i].value;
        }
    }
    xhttp.open("GET",url,true);
    xhttp.send();
}

function question() {
    let xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        let object = JSON.parse(this.responseText);
        if (object.completed == false) {
            let paragraph = document.createElement("p");
            paragraph.innerHTML = object.currentQuestionIndex + 1 + "/" + object.numOfQuestions;
            let questiontype = object.questionType;
            paragraph.innerHTML = paragraph.innerHTML +"<br>"+ object.questionText;
            result.appendChild(paragraph);
            if (object.canBeSkipped == true){
                let skip = document.createElement("button");
                skip.innerHTML = "Skip";
                result.appendChild(skip);
            }
            if (object.requiresLocation == true){
                let message = document.createElement("p");
                message.innerHTML = "Location Required";
                result.appendChild(message);
            }
            if (questiontype == "BOOLEAN") {
                result.innerHTML = result.innerHTML + "<form>\n" +
                    "        <input type=\"radio\">True <br>\n" +
                    "        <input type=\"radio\">False <br>\n" +
                    "    </form>";
            }
            else if (questiontype == "INTEGER") {
                result.innerHTML = result.innerHTML + "<form>\n" +
                    "        <input type=\"number\">\n" +
                    "        <input type=\"submit\">\n" +
                    "    </form>";
            }
            else if (questiontype == "NUMERIC") {
                result.innerHTML = result.innerHTML + "<form>\n" +
                    "        <input type=\"number\" step=\"0.001\">\n" +
                    "        <input type=\"submit\">\n" +
                    "    </form>";
            }
            else if (questiontype == "MCQ") {
                result.innerHTML = result.innerHTML + "<form>\n" +
                    "        <input type=\"radio\">A <br>\n" +
                    "        <input type=\"radio\">B <br>\n" +
                    "        <input type=\"radio\">C <br>\n" +
                    "        <input type=\"radio\">D <br>\n" +
                    "    </form>";
            }
            else if (questiontype == "TEXT") {
                result.innerHTML = result.innerHTML + "<form>\n" +
                    "        <input type=\"text\">\n" +
                    "        <input type=\"submit\">\n" +
                    "    </form>";
            }
        }
        else {
            let message = document.createElement("p");
            message.innerHTML = "End"
            result.appendChild(message);
        }
        clear(settings);
    }
    let url = testapi + "question?";
    if (document.getElementById("complete").checked){
        url = url + "completed";
    }
    url = url + "&";
    var form = document.forms[0];
    for (let i = 1; i < form.length; i++) {
        if (form[i].checked) {
            url = url + form[i].value + "&";
        }
    }
    xhttp.open("GET", url,true);
    xhttp.send();
}

function answer() {
    let xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        let object = JSON.parse(this.responseText);
        let message = document.createElement("p");
        message.innerHTML = object.message;
        result.appendChild(message);
        clear(settings);
    }
    let url = testapi + "answer?";
    var correct = document.getElementsByClassName("correct");
    if (document.getElementById("correct").checked){
        url = url + "correct=" + true + "&";
    }
    if (document.getElementById("wrong").checked){
        url = url + "correct=" + false + "&";
    }
    if (document.getElementById("complete").checked){
        url = url + "complete";
    }
    xhttp.open("GET", url, true);
    xhttp.send();
}

function leaderboard() {
    let xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        let object = JSON.parse(this.responseText);
        for (let i = 0; i<object.leaderboard.length;i++) {
            let newli = document.createElement("li");
            newli.innerHTML = object.leaderboard[i].player + ": " + object.leaderboard[1].score;
            result.appendChild(newli);
        }
        clear(settings);
    }
    let url = testapi + "leaderboard?";
    url = url + "size=" + document.getElementById("numberofleaderboard").value;
    xhttp.open("GET",url, true);
    xhttp.send();
}

function clear(ele) {
    while (ele.firstChild) {
        ele.removeChild(ele.firstChild);
    }
}

var settings = document.getElementById("settings");
var result = document.getElementById("result");