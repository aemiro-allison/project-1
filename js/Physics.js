// each object will have these properties.
class PhysicsEntity {
  constructor({ el, x, y, width, height }) {
    this.el = el;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.halfWidth = width / 2;
    this.halfHeight = height / 2;
    this.speed = 0;
    this.xVel = 0;
    this.yVel = 0;
    this.ax = 0;
    this.ay = 0;
    this.pos = {
      top: undefined,
      left: undefined,
    };
    this.calculatePos();
  }

  calculatePos() {
    this.pos.top = +this.el.css('top').replace('px', '');
    this.pos.left = +this.el.css('left').replace('px', '');
  }

  setSpeed(sp) {
    this.speed = sp;
  }

  setX(x) {
    this.x = x;
  }

  setY(y) {
    this.y = y;
  }

  setXVel(vel) {
    this.xVel = vel;
  }

  setYVel(vel) {
    this.yVel = vel;
  }

  getXVel() {
    return this.xVel;
  }

  getYVel() {
    return this.yVel;
  }

  getSpeed() {
    return this.speed;
  }

  getVector() {
    return {
      x: this.x,
      y: this.y,
    };
  }

  getAccelerationVector() {
    return {
      x: this.ax,
      y: this.ay,
    }
  }

  getMidX() {
    return this.halfWidth + this.x;
  }

  getMidY() {
    return this.halfHeight + this.y;
  }

  getTop() {
    return this.top;
  }

  getBottom() {
    return this.bottom;
  }

  getLeft() {
    return this.left;
  }

  getRight() {
    return this.right;
  }

  getWidth() {
    return this.width;
  }

  getHeight() {
    return this.height;
  }

  getPos(side) {
    switch (side) {
      case 'top': return this.pos.top;
      case 'bottom': return this.pos.bottom;
      case 'left': return this.pos.left;
      case 'right': return this.pos.right;
      default: return this;
    }
  }
}

class PhysicsBoundary {
  constructor(top, bottom, left, right) {
    this.top = top || null;
    this.bottom = bottom || null;
    this.left = left || null;
    this.right = right || null;
  }

  setTop(top) {
    this.top = top;
  }

  setBottom(bottom) {
    this.bottom = bottom;
  }

  setLeft(left) {
    this.left = left;
  }

  setRight(right) {
    this.right = right;
  }

  getTop() {
    return this.top;
  }

  getBottom() {
    return this.bottom;
  }

  getLeft() {
    return this.left;
  }

  getRight() {
    return this.right;
  }
}

const Physics = {
  bounce: 0.5,
  dt: Date.now(),

  setDeltaTime(dt) {
    this.dt = dt - this.dt;
  },

  accelerate(el, axis, magnitude) {
    if (axis === 'x') {
      el.setXVel(el.getXVel() + (magnitude * this.dt));
      el.setX(el.getXVel() * this.dt);
    }

    if (axis === 'y') {
      el.setYVel(el.getYVel() + (magnitude * this.dt));
      el.setY(el.getYVel() * this.dt);
    }
  },

  // get the absolute value for the displacement
  // for the center of the play er and the entity.
  getDisplacement(player, entity) {
    return {
      dx: Math.abs(player.getMidX() - entity.getMidX()) / entity.halfWidth,
      dy: Math.abs(player.getMidY() - entity.getMidY()) / entity.halfHeight,
    };
  },

  // returns true if there was a collision.
  detectCollision(player, entity) {
    return (player.x < entity.x + entity.width &&
      player.x + player.width > entity.x &&
      player.y < entity.y + entity.height &&
      player.height + player.y > entity.y);
  },
};
