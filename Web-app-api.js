const apiurl = "https://codecyprus.org/th/api/";

function getTreasureHuntList() {
    let xhttp = new XMLHttpRequest();
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
            document.getElementById("treasurehuntlistblock").style.display = "block";
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
    uuid = e.target.attributes.id.value;
    document.getElementById("treasurehuntlistblock").style.display = "none";
    document.getElementById("login").style.display = "block";
}

function getquestion() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState===4 && this.status === 200){
            let object = JSON.parse(this.responseText);
            // needs some team decisions as what do show and what not
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
    if (v==""){
        messages.innerHTML = "Enter teamname";
    }
    else {
        messages.innerHTML = "";
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200){
                let object = JSON.parse(this.responseText);
                if (object.status === "OK"){
                    messages.innerHTML = "";
                    session = object.session;
                    displayQuestions();
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
}

var session;
var uuid;
var messages = document.getElementById("messages");
getTreasureHuntList();