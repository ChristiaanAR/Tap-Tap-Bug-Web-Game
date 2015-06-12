
function startGame() {
    /*
    * Get which lvl is selected
    * Hide all main menu elements
    * Bring up game elements (un-hide them?)
    * Start the game
    */
    var lvl = 2;
    if (document.getElementById("lvl1").checked){
        lvl = 1;
    }

    document.getElementById("main").style.visibility = 'hidden';
}

var lvl1HS = 1;
var lvl2HS = 2;

function setHighScore(HS, lvl) {
    if (lvl == 1) {
        lvl1HS = HS;
    }
    else {
        lvl2HS = HS;
    }
    document.getElementById("HighScore").textContent = HS;
}
