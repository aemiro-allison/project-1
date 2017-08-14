const Physics = Object.freeze({
  GRAVITY: 0.38,
  FRICTION: 0.95,
  BOUNCE: 1.2,
});


function PhysicsEntity(el, x, y, width = el.outerWidth(), height = el.outerHeight()) {
  this.x = x;
  this.y = y;
  this.absX = x + width;
  this.absY = y + height;
  this.xv = 0;
  this.yv = 0;
  this.previousX = 0;
  this.previousY = 0;
  this.renderX = 0;
  this.renderY = 0;
  this.accelerationX = 0;
  this.accelerationY = 0;
  this.width = width;
  this.height = height;
  this.el = el;
}

// Update the entity's position on screen with its
// computed positional properties using interpolation
// to compensate for the difference between the game
// logic frame rate and the render frame rate.

// Interpolation Implementation based on the book:
// Advanced Game Design with HTML5 and JavaScript by Rex van der Spuy. pg: 177-185
// ISBN: 9781430258018
PhysicsEntity.prototype.draw = function draw(lagOffset) {
  // interpolate the position.
  if (this.previousX) {
    this.renderX = ((this.x - this.previousX) * lagOffset) + this.previousX;
  } else {
    this.renderX = this.x;
  }

  if (this.previousY) {
    this.renderY = ((this.y - this.previousY) * lagOffset) + this.previousY;
  } else {
    this.renderY = this.y;
  }

  // render new position to screen.
  this.el.css({
    left: `${Math.round(this.renderX)}px`,
    top: `${Math.round(this.renderY)}px`,
  });
};
