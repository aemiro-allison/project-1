/* global Obstacle, Player, PhysicsEntity */

// TODO: add sounds.
// TODO: save high scores of player.


// container to hold all the constant DOM elements
// to be used in-game.
let $els = null;


// defines the game boundary so that objects with
// physics properties will not left this space.
const gameWindow = {
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
};


// an array hold all the keys that are currently
// being pressed.
const keys = [];
let onlyRunOnce = 0;


// game life cycle id's used to end the game loop.
let gameLifeCycle;
let obstaclesLifeCycle;


// elements to be dynamically updated on screen.
const obstacles = [];
let yarnBall = null;
let nyanCat = null;


// game values
let score = 0;
let scoreUpater = 0;
let farthest = 0;
let isGameOver = false;


$(document).ready(() => {
  // get the elements after DOM has loaded.
  $els = {
    $landingPage: $('#landing-page'),
    $gameLogin: $('#game-login'),
    $gameBar: $('#game-bar'),
    $player: $('#player'),
    $score: $('#score'),
    $gameProgress: $('#game-progress'),
    $toggleDrawerBtn: $('#toggle-drawer'),
    $gameWindow: $('#game-window'),
    $obstacleSpawn: $('#obstacle-spawn'),
    $nyanCat: $('#nyan-cat'),
    $yarnBall: $('#yarn-ball'),
  };

  yarnBall = new Player($els.$yarnBall, 20, 0);
  nyanCat = new PhysicsEntity($els.$nyanCat, -400, 100);

  // make nyan cat move as well.
  nyanCat.move = function move() {
    this.previousX = this.x;
    this.xy = 0.2;
    this.x += this.xy;
  };

  // create borders
  gameWindow.right = window.innerWidth - yarnBall.width;
  gameWindow.bottom = window.innerHeight - yarnBall.height;

  // initialize the game progress bar's limits.
  $els.$gameProgress.attr({ min: 0, max: gameWindow.right });

  // pause game when user clicks away.
  $(window).on('blur', () => {
    // End the game when user clicks away from
    // the game.
    // Possibly to navigate to another tab/window.
    cancelAnimationFrame(gameLifeCycle);
    clearInterval(obstaclesLifeCycle);
  });

  // get name of player then start the game.
  $els.$gameLogin.on('submit', function handleSubmit(evt) {
    evt.stopPropagation();
    // TODO: fix dependency to bitballon.

    // get all the values from all the elements.
    const values = $(this).serialize().split('&').map(str => str.split('='));
    console.log(values);
    const nickname = values.filter(arr => arr[0] === 'nickname')[0];
    console.log(nickname);

    // check if a value was entered.
    if (nickname[1]) {
      $els.$player.html(`Player <span class="highlight">${nickname[1]}</span>`);
      $els.$score.html(`Score <span class="highlight">${score}</span>`);
      $('#nickname').hide();
      fadeOut($els.$landingPage);

      // Start the game after submit.
      gameLifeCycle = run();

      // Start creating obstacles.
      obstaclesLifeCycle = createObstacles();
    } else if (!onlyRunOnce) {
      $els.$gameLogin.append('Please enter a valid nickname.');
      onlyRunOnce += 1;
    }

    evt.preventDefault();
  });
});

// Add each key pressed into an array of keys
// and set it to true to indicate that the key
// pressed is currently being pressed.
$(document).on('keydown', (evt) => {
  keys[evt.keyCode] = true;
});

// Set the key was that currently being pressed
// to false to indicate that that key is no longer
// being pressed.
$(document).on('keyup', (evt) => {
  keys[evt.keyCode] = false;
});

// Assign the dimensions of the game window when the screen
// is resized, so that objects do not move outside the resized
// window.
$(window).on('resize', () => {
  gameWindow.right = window.innerWidth - yarnBall.width;
  gameWindow.bottom = window.innerHeight - yarnBall.height;
});


/* The Game Loop */
// The game loop consist of a main looping function
// to run the update the screen at 60 frames per second
// and the physics and calculations of the game are
// calculated at the frames per second defined below.

// The desired fps to run update game logic.
const fps = 60;

// The base time that each frame should take before
// another frame is updated.
const frameDuration = 1000 / fps;

// Holds the previous time it took the game loop
// to run.
let previous = 0;

let lag = 0;

// starts the game loop.
function run() {
  return requestAnimationFrame(gameLoop);
}

// Game Loop Implementation based on the book:
// Advanced Game Design with HTML5 and JavaScript by Rex van der Spuy. pg: 177-185
// ISBN: 9781430258018
function gameLoop(timestamp) {
  // Tells the browser to free up CPU resources and
  // to run this function (render the next frame) when
  // it is able to.
  // (usually at the refresh rate of monitor speed)
  requestAnimationFrame(gameLoop);

  // Calcuate the time that has passed since
  // the last frame was called.

  let elasped = timestamp - previous;

  // Correct any huge gaps in the elasped time.
  if (elasped > 1000) elasped = frameDuration;

  // Add the time elasped to the amount of lag
  // that has accumulated by updating the game's
  // logic at a fixed rate.
  lag += elasped;

  // Update the game logic if enough lag
  // has accumulated to catch up to the
  // current frame.
  while (lag >= frameDuration) {
    // Update the game's logic
    update();

    // reduce the lag by the delta time.
    lag -= frameDuration;
  }

  // The difference between update frame rate
  // and the game render frame rate.
  const lagOffset = lag / frameDuration;

  // Render the game graphics at the speed
  // of the requestAnimationFrame provides.
  // Which is ususally 60 fps, depending on the device.
  renderWithInterpolation(lagOffset);

  previous = timestamp;
}


function update() {
  // Update all objects positions
  yarnBall.move();

  // when the player reaches a third of the way to
  // the right boundary, start the nyan cat's movement.
  if (farthest >= gameWindow.right / 3) nyanCat.move();

  // move each obstacle and resolve any collisions
  // between any of the obstacles and the player.
  obstacles.forEach((obstacle) => {
    obstacle.move();
    // Resolve any collision between player and an obstacle.
    yarnBall.resolveCollision(obstacle);
  });

  // get the farthest distance the player has reched.
  farthest = farthest > yarnBall.x ? farthest : yarnBall.x;

  // Check if the yarnBall is touching the left border or
  // if he/she has passed the nyan cat, he/she loses.
  if ((yarnBall.x <= nyanCat.x && !isGameOver) || (yarnBall.x === gameWindow.left && !isGameOver)) {
    // return to the landing page.
    fadeIn($els.$landingPage);

    // display the loser's message.
    $els.$gameLogin.html(`
      <p>Oh no, he caught you.</p>
      <p>Bad Nyan Cat!.</p>
      <p>Your score was: <span class="highlight">${score}</span></p>
      <button class="btn" onclick="newGame();">NEW GAME</button>
    `);

    // stop game state checking here.
    isGameOver = true;
  } else if (yarnBall.x >= gameWindow.right && !isGameOver) {
    // return to the landing page.
    fadeIn($els.$landingPage);

    // display the winner's message.
    $els.$gameLogin.html(`
      <p>Omg! You beat the Nyan Cat.</p>
      <p>Your the best!!!!.</p>
      <p>Your score was: <span class="highlight">${score}</span></p>
      <button class="btn">NEW GAME</button>
    `);

    // stop game state checking here.
    isGameOver = true;
  }

  // update score
  scoreUpater += 1;

  // keep calculations small to help performance.
  if (scoreUpater >= 1000) scoreUpater = 100;

  // update score by each 100 runs of the update function
  // or by each 100 pixels the player moves.
  score += scoreUpater % 100 === 0 ? 50 : 0;

  // show the player's current score.
  $els.$score.html(`Score <span class="highlight">${score}</span>`);

  // show player how far they are.
  $els.$gameProgress.val(`${yarnBall.x}`);
}

function renderWithInterpolation(lagOffset) {
  // Get all objects that need to be rendered.
  // Render each object one by one.
  obstacles.forEach(obstacle => obstacle.draw(lagOffset));
  yarnBall.draw(lagOffset);
  nyanCat.draw(lagOffset);
}

// create new obstacles
function createObstacles() {
  setInterval(() => {
    if (document.hasFocus()) {
      obstacles.push(new Obstacle(
        $('<div>'), // create new element and append to screen.
        gameWindow.right + 200, // x position
        random(20, gameWindow.bottom), // y position
        180, // width
        90, // height
      ));
    }
  }, (1000000 / window.innerHeight) * 0.5);
}


/* HELPER FUNCTIONS */

function newGame(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  window.location.href = 'index.html';
}

function random(min, max) {
  return (Math.random() * (max - min)) + min;
}

function animate(el, animationName, callback = () => {}, remove = true) {
  el.classList.toggle(animationName);
  el.addEventListener('animationend', function animationHandler() {
    if (remove) el.classList.toggle(animationName);
    el.removeEventListener('animationend', animationHandler);
    callback(el);
  });
}

function fadeOut(el) {
  animate(el[0], 'fadeOut', () => {
    el.css({ display: 'none' });
  });
}

function fadeIn(el) {
  el.css({ display: 'block' });
  animate(el[0], 'fadeIn');
}
