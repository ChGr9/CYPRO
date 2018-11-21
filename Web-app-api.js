const apiurl = "https://codecyprus.org/th/api/";

function getTreasureHuntList() {
    var xhttp = new XMLHttpRequest();
    var challengeList = document.getElementById("treasurehuntlist");
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            var object = JSON.parse(this.responseText);
            console.log(object.status);
            for (let i = 0; i<object.treasureHunts.length;i++) {
                let newli = document.createElement("li");
                newli.innerHTML = object.treasureHunts[i].name;
                newli.id = object.treasureHunts[i].uuid;
                newli.addEventListener("click", login);
                challengeList.appendChild(newli);
            }
            document.getElementById("treasurehuntlistblock").style.display = "block";
            var li = document.getElementsByClassName("thli");

            for(var i = 0;i<li.length;i++){

            }
        }
        else {
            //TODO If response not received (error).
        }
    };
    let requesturl = apiurl + "list";
    xhttp.open("GET",requesturl, true);
    xhttp.send();
}

function login(e){
    var uuid = e.target.attributes.id.value;
    document.getElementById("treasurehuntlistblock").style.display = "none";
    document.getElementById("login").style.display = "block";

}

getTreasureHuntList();