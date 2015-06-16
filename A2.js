
function setup() {
    setHighScore(lvl1HS, 1);
    document.getElementById("infoBar").style.display = 'none';
}

// variables
var lvl1HS = 1;
var lvl2HS = 2;
var lvl, score, time, clock;
var paused;

function startGame() {
    /*
    * Get which lvl is selected
    * Hide all main menu elements
    * Bring up game elements
    * Start the game
    */
    lvl = 2;
    if (document.getElementById("lvl1").checked){
        lvl = 1;
    }

    document.getElementById("main").style.display = 'none';
    document.getElementById("infoBar").style.display = 'block';

    time = 0;
    score = 0;
    clock = setInterval(addTime, 1000); // timer
    paused = false;
}

function setHighScore(HS, lvl) {
    if (lvl == 1) {
        lvl1HS = HS;
    }
    else {
        lvl2HS = HS;
    }
    document.getElementById("HighScore").textContent = HS;
}

function addTime() {
    time += 1;
    document.getElementById("timer").textContent = time + " secs";
    if (time == 60) {
        // end game
    }
}

function addScore(points) {
    score += points;
    if (lvl == 1 && score > lvl1HS) {
        lvl1HS = score;
    }
    else if (score > lvl2HS) {
        lvl2HS = score;
    }
}
function pause() {
    //stop bug movement, bring up pause menu.
    if (paused == false) {
        paused = true;
        clearInterval(clock);
        document.getElementById("pause").textContent = '|>';
    }
    else {
        paused = false;
        clock = setInterval(addTime, 1000);
        document.getElementById("pause").textContent = "| |";
    }
}

