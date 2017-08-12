
// The desired fps to run update game logic.
const fps = 30;

// The base time that each frame should take before
// another frame is updated.
const dt = 1000 / fps;

// Holds the previous time it took the game loop
// to run.
let previous = 0;

let lag = 0;

// starts the game loop.
function run() {
  requestAnimationFrame(gameLoop);
}

function gameLoop() {
  // Tells the browser to free up CPU resources and
  // to run this function (render the next frame) when
  // it is able to.
  // (usually at the refresh rate of monitor speed)
  requestAnimationFrame(gameLoop);

  // Calcuate the time that has passed since
  // the last frame was called.
  const elasped = now - previous;

  // Correct any huge gaps in the elasped time.
  if (elasped > 1000) elasped = dt;

  // Add the time elasped to the amount of lag
  // that has accumulated by updating the game's
  // logic at a fixed rate.
  lag += elasped;

  // Update the game logic if enough lag
  // has accumulated.
  while(lag >= dt) {
    // Update the game's logic
    update();
    // reduce the lag by the delta time.
    lag -= dt;
  }

  // Render the game graphics at the speed
  // of the requestAnimationFrame provides.
  // Which is ususally 60 fps, depending on the device.
  render();

  previous = now;
}

function update() {
  // Update all objects positions
  // Check for collisions
  // Resolve collisions
}

function render() {
  // Get all objects that need to be rendered.
  // render each object one by one.
}


/*********/
/* HELPER FUNCTIONS */
/*********/

function getTimestamp() {
  return window.performance.now();
}
