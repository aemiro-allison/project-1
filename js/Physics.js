const Physics = Object.freeze({
  speed: 0,
  acceleration: 0,
  gravity: 0,

  move(obj, axis, value) {

  },

  bounce(value) {

  },

  accelerate(obj, value) {
    // change the velocity of the obj by
    // changing the acceleration of it.
  },

  gravity(obj) {
    // apply gravity to that obj until the bottom
    // is reached.
  },

  // Àlex Garcés implementation on Stack Overflow from Mar 13 '16
  // https://stackoverflow.com/questions/2440377/javascript-collision-detection
  isCollide(a, b) {
    const aRect = a.getBoundingClientRect();
    const bRect = b.getBoundingClientRect();

    return !(
      ((aRect.top + aRect.height) < (bRect.top)) ||
      (aRect.top > (bRect.top + bRect.height)) ||
      ((aRect.left + aRect.width) < bRect.left) ||
      (aRect.left > (bRect.left + bRect.width))
    );
  },

});
