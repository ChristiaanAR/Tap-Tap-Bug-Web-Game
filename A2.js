
function setup() {
    setHighScore(lvl1HS, 1);
    document.getElementById("infoBar").style.display = 'none';
    document.getElementById("end").style.display = 'none';
}

// variables
var lvl1HS = 0;
var lvl2HS = 0;

// keep track of score, the time left and whether game paused, lvl
var lvl, score, time, clock;
var paused;

//dimensions
height = 600;
width = 400;

// store bugs and food
var bugs = [];
var food = [];

// the score for each bug
var blackbugscr = 5;
var redbugscr = 3;
var orangebugscr = 1;

// probability for [black, red, orange]
var weights = [0.3, 0.3, 0.4];

// canvas variables
var canvas = null;
var	context = null;

// images
blackbug;
orangebug;
redbug;

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

    document.getElementById("end").style.display = 'none';
    document.getElementById("main").style.display = 'none';
    document.getElementById("infoBar").style.display = 'block';

    document.getElementById("timer").textContent = "0 secs";
    document.getElementById("pause").disabled = false;
    document.getElementById("pause").textContent = "| |";

    time = 0;
    score = 0;
    addScore(0);
    pause();
	
	// get canvas
	canvas = document.getElementById("gamecanvas");
	// set canvas width and height
	canvas.width = width;
	canvas.height = height;
	context = canvas.getContext('2d');
	
	// load images
	blackbug = new Image();
	orangebug = new Image();
	redbug = new Image();
	
	blackbug.src = "blackbug.png";
	orangebug.src = "orangebug.png";
	redbug.src = "redbug.png";
	
}



function gameEnd() {
    pause();
    document.getElementById("end").style.display = 'block';
    if (lvl == 1 && score > lvl1HS) {
        setHighScore(score, 1);
        document.getElementById("endMsg").textContent = 'New High Score!';
    }
    else if (score > lvl2HS) {
        setHighScore(score, 2);
        document.getElementById("endMsg").textContent = 'New High Score!';
    }

    document.getElementById("pause").disabled = true;
    document.getElementById("finalScore").textContent = score;
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
        gameEnd();
    }
}

function addScore(points) {
    score += points;
    document.getElementById("score").textContent = "score: " + score;
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

function returnToMain() {
    document.getElementById("timer").textContent = "0 secs";
    document.getElementById("pause").disabled = false;
    document.getElementById("pause").textContent = "| |";

    document.getElementById("infoBar").style.display = 'none';
    document.getElementById("end").style.display = 'none';
    document.getElementById("main").style.display = 'block';
}

window.addEventListener('resize', resize, false);