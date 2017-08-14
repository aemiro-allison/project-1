const Physics = Object.freeze({
  GRAVITY: 0.58,
  FRICTION: 0.95,
  BOUNCE: 1.5,
});


function PhysicsEntity(el, x, y, width = el.outerWidth(), height = el.outerHeight()) {
  this.x = x;
  this.y = y;
  this.absX = x + width;
  this.absY = y + height;
  this.halfWidth = width * 0.5;
  this.halfHeight = height * 0.5;
  this.centerX = x + this.halfWidth;
  this.centerY = y + this.halfHeight;
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

// Calculate the new positions for the entity
// using time based physics calculations
// involving the use of delta time (lag).


// Update the entity's position on screen with its
// computed positional properties using interpolation
// to compensate for the difference between the game
// logic frame rate and the render frame rate.
PhysicsEntity.prototype.draw = function draw(lagOffset) {
  // interpolate the position.
  if (this.previousX) {
    this.renderX = (this.x - this.previousX) * lagOffset + this.previousX;
  } else {
    this.renderX = this.x;
  }

  if (this.previousY) {
    this.renderY = (this.y - this.previousY) * lagOffset + this.previousY;
  } else {
    this.renderY = this.y;
  }

  // render new position to screen.
  this.el.css({
    left: `${Math.round(this.renderX)}px`,
    top: `${Math.round(this.renderY)}px`,
  });
};
