class Player extends PhysicsEntity {
  constructor(el, x, y, width, height) {
    super(el, x, y, width, height);
  }

  move() {
    // get entity's previous position.
    this.previousX = this.x;
    this.previousY = this.y;

    // perform any collision resolving only if a
    // only if a object is colliding with player.
    // this.resolveCollision(el);

    // jump
    // if (keys[32]) {
    //   yarnBall.jump();
    // }

    // move to top
    if (keys[87]) {
      this.yv -= 0.5 / Physics.GRAVITY;
    }
    // move to bottom
    if (keys[83]) {
      this.yv += 0.5;
    }
    // move to right
    if (keys[68]) {
      this.xv += 0.5;
    }
    // move to left
    if (keys[65]) {
      this.xv -= 1;
    }

    // apply friction to x val
    // this.xv *= Physics.FRICTION;

    // Update the positional values for the entity
    // by using the updated velocity to move.
    this.xv *= Physics.FRICTION;
    this.yv += Physics.GRAVITY;
    this.x += this.xv;
    this.y += this.yv;

    // bounds checking for left to right
    if (this.x >= gameWindow.right) {
      this.x = gameWindow.right;
      this.xv = -this.xv;
    } else if (this.x <= gameWindow.left) {
      this.x = gameWindow.left;
      this.xv = Math.abs(this.xv);
    }

    // bounds checking for top to bottom
    if (this.y >= gameWindow.bottom) {
      this.y = gameWindow.bottom;
      this.yv = -this.yv/2;
    } else if (this.y <= gameWindow.top) {
      this.y = gameWindow.top;
      this.yv = Math.abs(this.yv);
    }
  }

  resolveCollision(el) {
    // if player is colliding with an obstacle.
    // find the sides that are colliding and
    // reverse the velocity with a bounce possibly.

    // TODO: fix collision so that the correct side is fired. done.
    // TODO: fix top width, does not fire. guess because it is close to left and right.
    if (this.isCollide(el.el)) {
      if (this.x <= el.x) {
        // collision at left
        this.xv = -(el.xv*1.4) * Physics.BOUNCE;
        console.log('collision at left');
      } else if (this.y <= el.y) {
        // collision at top
        this.yv -= (this.yv*1.4 + Physics.GRAVITY)*Physics.BOUNCE;
        this.y += this.yv;
        console.log('collision at top');
      // } else {
      } else if ((gameWindow.bottom - this.y) >= (gameWindow.bottom - el.y)) {
        // collision at bottom
        this.yv -= (this.yv * 2);
        console.log('collision at bottom');
      } else if ((this.x + this.width) >= (el.x + el.width)) {
        // collision at right
        // this.xv += (this.xv * 1.2);
        this.xv += -this.xv;
        console.log('collision at right');
      }
    }
  }

  isCollide(b) {
    const aRect = this.el[0].getBoundingClientRect();
    const bRect = b[0].getBoundingClientRect();

    return !(
      ((aRect.top + aRect.height) < (bRect.top)) ||
      (aRect.top > (bRect.top + bRect.height)) ||
      ((aRect.left + aRect.width) < bRect.left) ||
      (aRect.left > (bRect.left + bRect.width))
    );
  }
}

class Obstacle extends PhysicsEntity {
  constructor(el, x, y, width, height) {
    super(el, x, y, width, height);
    this.el.css({
      top: `${y}px`,
      left: `${x}px`,
      width: `${width}px`,
      height: `${height}px`,
    });
    this.el.attr('class', 'obstacle');
    this.el.appendTo($els.$obstacleSpawn);
  }

  move() {
    // if obstacle has disappeared off the screen,
    // remove it completely from DOM and obstacles array.
    if ((this.x - 20) <= gameWindow.left) this.remove();

    // get entity's previous position.
    this.previousX = this.x;
    this.previousY = this.y;

    // TODO: Update the velocity for time. ( constant velocity)
    this.xv += this.accelerationX + 0.1;

    // Update the positional values for the entity
    // by using the updated velocity to move.
    this.x -= this.xv;
  }

  remove() {
    // completely remove the obstacle from DOM
    this.el.remove();
    // and from obstacles array.
    obstacles.shift();
  }
}
