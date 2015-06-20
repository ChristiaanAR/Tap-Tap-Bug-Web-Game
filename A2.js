
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
var FPS = 60;

// store bugs and food
var bugs = [];
var splats = [];
var foods = [];
var foodpieces = 5;

// the score for each bug
var blackbugscr = 5;
var redbugscr = 3;
var orangebugscr = 1;

// the width and height of each bug
var bugwidth = 24;
var bugheight = 30;

// the width and height of food
var fdheight = 20;
var fdwidth = 20;

// the speeds for each bug in lvl 1
var blackbugsp = 150/FPS;
var redbugsp = 75/FPS;
var orangebugsp = 60/FPS;

// the speeds for each bug in lvl 2
var blackbugsp2 = 200/FPS;
var redbugsp2 = 100/FPS;
var orangebugsp2 = 80/FPS;

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
var splat;
var cloth;

// timer
var nextbug;

// food object to store location and state (eaten or not)
function Food(x, y, id) {
	this.x = x;
	this.y = y;
	this.id = id;
	
	this.draw = function() {
		context.drawImage(food, this.x, this.y);
	};
}

// adds splats and fades away
function Splat(x, y) {
    this.x = x;
    this.y = y;
    this.timeOut = setTimeout(this.remove(), 2000);

    this.remove = function () {
        for (var s = 0; s < splats.length; s++) {
            if (splats[s].x == this.x && splats[s].y == this.y) {
                splats.splice(s, 1);
            }
        }
    };
}

// bug object to store location, state and movements
function Bug(x, speed, score, bugimg, width, height) {
	this.dead = false;
	this.y = 0;
	this.x = x;
	this.speed = speed;
	this.score = score;
	this.bugimg = bugimg;
	this.width = width;
	this.height = height;
	this.food = null;
	this.angle = 0;

	this.findfood = function() {
		// doesn't move if there is no food
		if (foods.length > 0) {
			// sets the default lowest distance to first food
			var lowestdist = Math.sqrt(Math.pow((this.x - foods[0].x), 2) + Math.pow((this.y - foods[0].y), 2));
			this.food = foods[0];
			var dist;
			
			// find the nearest food using euclidean distance
			for (var i = 0; i < foods.length; i++) {
				dist = Math.sqrt(Math.pow((this.x - foods[i].x), 2) + Math.pow((this.y - foods[i].y), 2));
	
				if (dist < lowestdist) {
					lowestdist = dist;
					this.food = foods[i]; //keep track of food
				}
			}
		} else {
			this.food = null;
		}
	};
	
	this.checkeaten = function() {
		// check if food eaten
		// if the food doesn't exist anymore, find a new one
		
		if (this.food === null) {
			// if this bug ate the food, find the newest food it needs to eat
			this.findfood();
		} else {
			var found = false;
			
			// check if food exists still
			for (var i = 0; i < foods.length; i++) {
				if (foods[i].id === this.food.id) {
					found = true;
				}
			}
			if (found === false) {
				// if the food was eaten by another bug, find another food
				this.findfood();
			}
		}
	};
	
	this.draw = function() {
		// draw bug
		
		context.drawImage(bugimg, this.x, this.y);
		
	};
	
	this.UpdateDistance = function() {
		// updates distance from food
		
		this.dx = this.food.x - this.x;
		this.dy = this.food.y - this.y;
		this.distance = Math.sqrt(Math.pow(this.dx, 2) + Math.pow(this.dy, 2));
	};

	this.UpdateAngle = function() {
		// find the angle of the bug
		this.angle = Math.atan2(this.dy,this.dx) * 180 / Math.PI;
	};

	this.UpdateSpeed = function() {
		// find where the bug needs to go next
		this.moveX = this.speed * (this.dx/this.distance);
		this.moveY = this.speed * (this.dy/this.distance);
    };

	this.move = function() {
		this.checkeaten();
		
		// only move if there is a food to go after
		if (this.food) {
			// move the bug towards food
			this.UpdateDistance();
			this.UpdateAngle();
			this.UpdateSpeed();
			
			this.x += this.moveX;
			this.y += this.moveY;
			
			// check whether the bug ate the food
			this.atefood();
		}
	};
	
	this.atefood = function() {
		// collision checking for the bug and food
		if (this.distance < 1.5) {
			for (var i = 0; i < foods.length; i++) {
				// find food to delete
				if (foods[i].id === this.food.id) {
					foods.splice(i, 1);
					break;
				}
			}
			this.food = null;
		}
	};
	
	this.findfood();
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

    //clear canvas of bugs and food from last game
    var i = bugs.length;
    for (var t=0; t<i; t++) {
        bugs.pop();
    }
    i = foods.length;
    for (t=0; t<i; t++) {
        foods.pop();
    }

	// get canvas
	canvas = document.getElementById("gamecanvas");
    canvas.addEventListener("mousedown", getPosition, false);
	// set canvas width and height
	canvas.width = width;
	canvas.height = height;
	context = canvas.getContext('2d');
	
	// load images
	blackbug = new Image();
	orangebug = new Image();
	redbug = new Image();
	food = new Image();
    splat = new Image();
	cloth = new Image();
	
	var numImages = 6;
	var numLoaded = 0;
	
	// ensures image is loaded before drawing
	function imageLoaded(){
		numLoaded++;
		if (numLoaded === numImages) {
			start();
		}
	}

    splat.onload = function() {
        imageLoaded();
    };

    cloth.onload = function(){
        imageLoaded();
		context.drawImage(cloth, 0, 0);
    };

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
    splat.src = 'splat.png';
    cloth.src = 'picniccloth.png';
	
}

// start animation loop
function start() {
	
	// initialize pieces of food and draws
	for (var i = 0; i < foodpieces; i++) {
		foods.push(new Food(rand(fdwidth, width-fdwidth), rand(fdheight, height-fdheight), i));
		foods[i].draw();
	}
	
	animate();
}

// random function using weights

function rand(min, max) {
	return +(Math.random() * (max - min) + min).toFixed(1);
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

	// No more food left, game over
	if (foods.length === 0) {
		gameEnd();
	}

		// Animate game objects
		requestAnimFrame(animate);

	if (paused === false) {
		// clear canvas
		context.clearRect(0, 0, canvas.width, canvas.height);

		// move all bugs
		for (var i = 0; i < bugs.length; i++) {
			bugs[i].move();
		}
	
        // decrease counter for next bug
        nextbug -= 1;
        // if counter less than zero
        if (nextbug < 0) {
            // create new bug instance and add to array
            var randbug = getRandomItem(weights);

            if (randbug === 0) {
                bugs.push(new Bug(rand(10, 390), blackbugsp, blackbugscr, blackbug, bugwidth, bugheight));
            } else if (randbug === 1) {
                bugs.push(new Bug(rand(10, 390), redbugsp, redbugscr, redbug, bugwidth, bugheight));
            } else {
                bugs.push(new Bug(rand(10, 390), orangebugsp, orangebugscr, orangebug, bugwidth, bugheight));
            }
            // reset counter with a random value: one or several seconds (60 frames per sec)
            nextbug = rand(1, 3) * FPS;
        }
		
		// draw bg to canvas
		context.drawImage(cloth, 0, 0);
		
		// draw all food and render to canvas
		for (i = 0; i < foods.length; i++) {
			foods[i].draw();
		}
		
		// draw all bugs and render to canvas
        for (i = 0; i < bugs.length; i++) {
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
	else
	{
		document.getElementById("endMsg").textContent = 'Game Over';
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
    document.getElementById("gamecanvas").style.display = 'none';
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


function getPosition(event) {
    var x = 0;
    var y = 0;
    var canvas = document.getElementById("gamecanvas");
    var bugX = 0;
    var bugY = 0;

    x = event.x - canvas.offsetLeft;
    y = event.y - canvas.offsetTop;

    if (paused === false) {
        for (var i=0; i<bugs.length; i++) {
            bugX = bugs[i].x;
            bugY = bugs[i].y;
            if (bugX+40>=x && x>=bugX-30 && bugY+30>=y && y>=bugY-30) { // if bug was clicked on
				console.log("Clicked on");
                addScore(bugs[i].score);
                //splats.push();
                bugs.splice(i, 1);
            }
        }
    }
}