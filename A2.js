
function setup() {
    setHighScore(lvl1HS, 1);
    document.getElementById("infoBar").style.display = 'none';
    document.getElementById("end").style.display = 'none';
	document.getElementById("gamecanvas").style.display = 'none';
}

// variables
var lvl1HS = 0;
var lvl2HS = 0;

// keep track of score, the time left and whether game paused, lvl
var lvl, score, time, clock;
var paused;

//dimensions
var height = 600;
var width = 400;

// store bugs and food
var bugs = [];
var foods = [];
var foodpieces = 5;

// the score for each bug
var blackbugscr = 5;
var redbugscr = 3;
var orangebugscr = 1;

// the speeds for each bug
var blackbugsp = 0.15;
var redbugsp = 0.075;
var orangebugsp = 0.06;

// probability for [black, red, orange]
var weights = [0.3, 0.3, 0.4];

// canvas variables
var canvas = null;
var	context = null;

// images
var blackbug;
var orangebug;
var redbug;
var food;

// timer
var nextbug;

// food object to store location and state (eaten or not)
function Food(x, y) {
	this.eaten = false;
	this.x = x;
	this.y = y;
	
	this.draw = function() {
		context.drawImage(food, this.x, this.y);
	};
}

// bug object to store location, state and movements
function Bug(x, speed, score, bugimg) {
	this.dead = false;
	this.y = 0;
	this.x = x;
	this.speed = speed;
	this.score = score;
	this.bugimg = bugimg;
	
	this.draw = function() {
		context.drawImage(bugimg, this.x, this.y);
	};
}

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
    document.getElementById("gamecanvas").style.display = 'block';

	document.getElementById("timer").textContent = "0 secs";
	document.getElementById("pause").disabled = false;
	document.getElementById("pause").textContent = "| |";

	time = 0;
	score = 0;
	addScore(0);
	nextbug = -1;
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
	food = new Image();
	
	var numImages = 4;
	var numLoaded = 0;
	
	// ensures image is loaded before drawing
	function imageLoaded(){
		numLoaded++;
		if (numLoaded === numImages) {
			//context.drawImage(food, 50, 50);
			start();
		}
	}
	
	blackbug.onload = function() {
		imageLoaded();
	};
	
	orangebug.onload = function() {
		imageLoaded();
	};
	
	redbug.onload = function() {
		imageLoaded();
	};
	
	food.onload = function() {
		imageLoaded();
	};
	
	// set img src
	blackbug.src = 'blackbug.png';
	orangebug.src = 'orangebug.png';
	redbug.src = 'redbug.png';
	food.src = 'food.png';
	
}

// start animation loop
function start() {
	
	// initialize pieces of food and draws
	for (var i = 0; i < foodpieces; i++) {
		foods.push(new Food(rand(10, 390), rand(10, 590)));
		foods[i].draw();
	}
	
	animate();
}

// random function using weights

function rand(min, max) {
	return Math.random() * (max - min) + min;
}

function getRandomItem(weight) {
	// pick random number from 0 to 1.0
	var randomnum = rand(0, 1.0);
	var weightsum = 0;
	
	// check where the random number falls
	for (var i = 0; i < weight.length; i++) {
		weightsum += weight[i];
		weightsum = +weightsum.toFixed(2); // round to 2 places and convert back to number
		
		if (randomnum <= weightsum) {
			return i; //returns which coloured bug (0 for black, 1 for red, 2 for orange)
		}
	}
}

// the animation loop
function animate() {
	document.getElementById('score').innerHTML = score;
	
	// No more food left, game over
	if (food.length === 0) {
		gameEnd();
	}


    // Animate game objects
    requestAnimFrame( animate );
    if (paused == false) {
        // decrease counter for next bug
        nextbug -= 1;
        // if counter less than zero
        if (nextbug < 0) {
            // create new bug instance and add to array
            var randbug = getRandomItem(weights);

            if (randbug === 0) {
                bugs.push(new Bug(rand(10, 390), blackbugsp, blackbugscr, blackbug));
            } else if (randbug === 1) {
                bugs.push(new Bug(rand(10, 390), redbugsp, redbugscr, redbug));
            } else {
                bugs.push(new Bug(rand(10, 390), orangebugsp, orangebugscr, orangebug));
            }
            // reset counter with a random value: one or several seconds
            nextbug = rand(1, 3) * 100;
        }

        // draw all bugs and render to canvas
        for (var i = 0; i < bugs.length; i++) {
            bugs[i].draw();
        }
    }
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
    if (paused === false) {
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

// http://paulirish.com/2011/requestanimationframe-for-smart-animating
// shim layer with setTimeout as a default by Paul Irish
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       || 
          window.webkitRequestAnimationFrame || 
          window.mozRequestAnimationFrame    || 
          window.oRequestAnimationFrame      || 
          window.msRequestAnimationFrame     || 
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();