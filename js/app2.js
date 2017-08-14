// TODO: put nyan cat gif or image on screen. done
// TODO: infinite background loop. done
// TODO: Create landing page with form and instructions and use them in game. done.

// Next:
// TODO: give player ability to jump and only use left and right keys and up key for movement. done
// TODO: Critical (make the obstacles functional). done
// TODO: Implement game winning states. done

// Next:
// TODO: move drawer to top of screen.
// TODO: add sounds.
// TODO: save high scores of players.
// TODO: Refractor code.


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

let gameLifeCycle = undefined;
let obstaclesLifeCycle = undefined;
let obstacles = [];
let yarnBall = null;
let nyanCat = null;

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
    this.xy = 0.5;
    this.x += this.xy;
  };

  // create borders
  gameWindow.right = window.innerWidth - yarnBall.width;
  gameWindow.bottom = window.innerHeight - yarnBall.height;


  $els.$gameProgress.attr({ min: 0, max: gameWindow.right });

  // pause game when user clicks away.
  $(window).on('blur', () => {
    // Pause the game when user clicks away from
    // the game.
    // Possibly to navigate to another tab/window.
    cancelAnimationFrame(gameLifeCycle);
    $(document).blur();
    console.log('cleared everything');
  });

  // restart game when user comes back.
  $(window).on('focus', () => {
    // Start the game.
    if(score) {
      gameLifeCycle = run();
    }
    console.log('created everything again.');
  });
  let runOnce = 0;
  $els.$gameLogin.on('submit', function handleSubmit(evt) {
    evt.stopPropagation();
    // get all the values from all the elements.
    const values = $(this).serialize().split('=');
    // check if a value was entered.
    if (values[1]) {
      $els.$player.html(values[1]);
      $els.$score.html('0');
      fadeOut($els.$landingPage);

      // Start the game after submit.
      gameLifeCycle = run();
      // Start creating obstacles.
      obstaclesLifeCycle = createObstacles();
    } else {
      if (!runOnce) {
        $els.$gameLogin.append('Please enter a valid nickname.');
        runOnce += 1;
      }
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


// The desired fps to run update game logic.
const fps = 30;

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
  let lagOffset = lag / frameDuration;

  // Render the game graphics at the speed
  // of the requestAnimationFrame provides.
  // Which is ususally 60 fps, depending on the device.
  renderWithInterpolation(lagOffset);

  previous = timestamp;
}

let scoreUpater = 0;
let score = 0;
let farthest = 0;
let gameOver = false;
function update() {
  // Update all objects positions
  yarnBall.move();
  nyanCat.move();
  obstacles.forEach((obstacle) => {
    obstacle.move();
    // Resolve any collision between player and an obstacle.
    yarnBall.resolveCollision(obstacle);
  });

  // get the farthest the player has reched.
  farthest = farthest > yarnBall.x ? farthest : yarnBall.x;

  // check if player won
  if (yarnBall.x <= nyanCat.x && !gameOver) {
    console.log('the cat caught you');
    fadeIn($els.$landingPage);
    $els.$gameLogin.html(`
      <p>Oh no, he caught you.</p>
      <p>Bad Nyan Cat!.</p>
      <p>Your score was: ${score}</p>
    `);
    // stop game here.
    gameOver = true;
  } else if (yarnBall.x >= gameWindow.right && !gameOver) {
    console.log('you won');
    fadeIn($els.$landingPage);
    $els.$gameLogin.html(
      `Omg! You beat the Nyan Cat.
      Your the best!!!!.
      Your score was: ${score}
    `);
    // stop game here.
    gameOver = true;
  }

  // update score
  scoreUpater += 1;
  // keep calculations small to help performance.
  if (scoreUpater >= 1000) scoreUpater = 100;
  score += scoreUpater % 100 === 0 ? 50 : 0;
  $els.$score.text(score);

  // show player how far they are.
  $els.$gameProgress.val(`${yarnBall.x}`);
}

function renderWithInterpolation(lagOffset) {
  // Get all objects that need to be rendered.
  obstacles.forEach(obstacle => obstacle.draw(lagOffset));
  yarnBall.draw(lagOffset);
  nyanCat.draw(lagOffset);
  // render each object one by one.
}

function createObstacles() {
  setInterval(() => {
    if (document.hasFocus()) {
      obstacles.push(new Obstacle($('<div>'), gameWindow.right, random(50, gameWindow.bottom), 180, 90));
    }
  }, 1000);
}

// landing page handler.
$(document).on('keypress', (evt) => {
  if (evt.keyCode === 32) {
    $els.$gameBar.toggleClass('drawer');
  }

  if (evt.keyCode === 100) {
    console.log('fade in');
    fadeIn($els.$landingPage);
    $els.$gameLogin.append('game in progress.');
  }
});


/* HELPER FUNCTIONS */

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
  animate(el[0], 'fadeOut', () => { el.css({ display: 'none' }); });
}

function fadeIn(el) {
  el.css({ display: 'block' });
  animate(el[0], 'fadeIn');
}
