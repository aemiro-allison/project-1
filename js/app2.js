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

let obstacles = [];
let yarnBall = null;

$(document).ready(() => {
  // get the elements after DOM has loaded.
  $els = {
    $gameBar: $('#game-bar'),
    $toggleDrawerBtn: $('#toggle-drawer'),
    $gameWindow: $('#game-window'),
    $obstacleSpawn: $('#obstacle-spawn'),
    $nyanCat: $('#nyan-cat'),
    $yarnBall: $('#yarn-ball'),
  };

  yarnBall = new Player($els.$yarnBall, 0, 0);

  // create borders
  gameWindow.right = window.innerWidth - yarnBall.width;
  gameWindow.bottom = window.innerHeight - yarnBall.height;
  // Start the game.
  const gameLifeCycle = run();

  $(window).on( 'unload',() => {
    cancelAnimationFrame(gameLifeCycle);
  });

  $(window).load(() => {
    run();
  });

  createObstacle();
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

function update() {
  // Update all objects positions
  yarnBall.move();

  obstacles.forEach((obstacle) => {
    obstacle.move();
    yarnBall.resolveCollision(obstacle);
  });
  // Check for collisions
  // Resolve collisions
}

function renderWithInterpolation(lagOffset) {
  // Get all objects that need to be rendered.
  obstacles.forEach(obstacle => obstacle.draw(lagOffset));
  yarnBall.draw(lagOffset);
  // render each object one by one.
}

function createObstacle() {
  setInterval(() => {
    obstacles.push(new Obstacle($('<div>'), gameWindow.right, gameWindow.bottom / 2, 100, 400));
  }, 5000);
}


/* HELPER FUNCTIONS */

function getTimestamp() {
  return window.performance.now();
}
