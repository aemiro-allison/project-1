let $els = {};
let boundary = {};
const keys = {};
let yarnBall = null;
let obs1 = null;

//   // Àlex Garcés implementation on Stack Overflow from Mar 13 '16
//   // https://stackoverflow.com/questions/2440377/javascript-collision-detection
//   function isCollide(a, b) {
//     const aRect = a[0].getBoundingClientRect();
//     const bRect = b[0].getBoundingClientRect();

//     return !(
//       ((aRect.top + aRect.height) < (bRect.top)) ||
//       (aRect.top > (bRect.top + bRect.height)) ||
//       ((aRect.left + aRect.width) < bRect.left) ||
//       (aRect.left > (bRect.left + bRect.width))
//     );
//   };

function changeBgColor($el1, $el2) {
  const shouldChangeBg = yarnBall.isCollide($el1, $el2);
  if (shouldChangeBg) {
    $el1.css('background', 'green');
    $el2.css('background', 'green');
  } else {
    $el1.css('background', 'grey');
    $el2.css('background', 'grey');
  }
}
class Obstacle {
  constructor(y, width, height) {
    // uniquely idenity each obstacle
    this.id = Math.floor(Math.random() * 2);

    this.y = y;
    this.x = boundary.right + 200;
    this.speed = 5;

    // create obstacle element.
    this.el = $('<div>');
    this.el.css('width', width);
    this.el.css('height', height);
    this.el.css('left', this.x);
    this.el.css('top', this.y);
    this.el.attr('class', 'obstacle');
    this.el.appendTo('#obstacle-spawn');
  }

  draw() {
    this.move();
    this.el.css('left', this.x);
  }

  move() {
    if (this.x === 'removed') return;
    if (this.x <= boundary.left) {
      this.x = 'removed';
      this.remove();
    }

    this.x -= this.speed;
  }

  remove() {
    this.el.detach().remove();
    console.log('removed');
  }
}


class Player {
  constructor(xAxis, yAxis) {
    this.x = xAxis;
    this.y = yAxis;
    this.xVel = 0;
    this.yVel = 0;
    this.speed = 5;
    this.friction = 0.88;
    this.gravity = 5;
    this.isJumping = false;
    this.jumpingIntervalID = null;
    this.bounce = 0.6;
  }

  draw($el) {
    this.move();
    this.applyGravity();
    $el.css('left', this.x);
    $el.css('top', this.y);
  }

  applyGravity() {
    // apply gravity to that obj until the bottom
    // is reached.
    if (this.y <= boundary.bottom && !keys[87] && !this.isJumping) {
      this.y += ((this.yVel += 0.3) * this.gravity * this.friction);
    }
  }

  resolve(shouldResolve) {
    if (shouldResolve) {
      if (keys[32]) {
        this.jump(this.jumpingIntervalID);
      }
      this.xVel -= obs1.speed + this.speed;
      this.x -= this.xVel * this.bounce;
      this.yVel -= 0.5;
    }
  }

  isCollide(a, b) {
    const aRect = a[0].getBoundingClientRect();
    const bRect = b[0].getBoundingClientRect();

    return !(
      ((aRect.top + aRect.height) < (bRect.top)) ||
      (aRect.top > (bRect.top + bRect.height)) ||
      ((aRect.left + aRect.width) < bRect.left) ||
      (aRect.left > (bRect.left + bRect.width))
    );
  }

  jump(id) {
    let counter = 0;
    if (id) {
      this.isJumping = false;
      clearInterval(id);
    }

    if ((!this.isJumping && (this.y >= boundary.bottom)) || id) {
      this.isJumping = true;

      this.jumpingIntervalID = setInterval(() => {
        if (counter === 20) {
          this.isJumping = false;
          clearInterval(this.jumpingIntervalID);
        }

        counter += 2;
        console.log('interval');
        this.y -= 25 * this.friction;
      }, 1000 / 60);
    }
  }

  move() {
    // jump
    if (keys[32]) {
      yarnBall.jump();
    }
    // move to top
    if (keys[87]) {
      if (this.yVel > -this.speed) {
        this.yVel -= 1;
      }
    }
    // move to bottom
    if (keys[83]) {
      if (this.yVel < this.speed) {
        this.yVel += 1;
      }
    }
    // move to right
    if (keys[68]) {
      if (this.xVel < this.speed) {
        this.xVel += 2.5;
      }
    }
    // move to left
    if (keys[65]) {
      if (this.xVel > -this.speed) {
        this.xVel -= 1;
      }
    }

    // apply friction to x val
    this.xVel *= this.friction;
    this.x += this.xVel;

    // apply friction to y val
    this.yVel *= this.friction;
    this.y += this.yVel;

    // bounds checking for left to right
    if (this.x >= boundary.right) {
      this.x = boundary.right;
    } else if (this.x <= boundary.right) {
      // this.x = 0;
    }

    // bounds checking for top to bottom
    if (this.y >= boundary.bottom) {
      this.y = boundary.bottom;
    } else if (this.x <= boundary.bottom) {
      // this.y = 0;
    }
  }
}


// add the key pressed and indicate that it is active
// by setting to true.
document.addEventListener('keydown', (evt) => {
  keys[evt.keyCode] = true;
  // console.log(evt.keyCode);
});

// deactivate the key pressed by setting to false.
document.addEventListener('keyup', (evt) => {
  keys[evt.keyCode] = false;
});

// when click on body, toggle drawer class on game-bar
$('#toggle-drawer').click((evt) => {
  evt.stopPropagation();
  $els.gameBar.toggleClass('drawer');
});

const update = () => {
  yarnBall.draw($els.yarnBall);
  obs1.draw();
  yarnBall.resolve(yarnBall.isCollide($els.yarnBall, obs1.el));
  // changeBgColor($els.yarnBall, obs1.el);
  requestAnimationFrame(update);
};

$(document).ready(() => {
  $els = {
    gameBar: $('#game-bar'),
    toggleDrawerBtn: $('#toggle-drawer'),
    gameWindow: $('#game-window'),
    obstacleSpawn: $('#obstacle-spawn'),
    nyanCat: $('#nyan-cat'),
    yarnBall: $('#yarn-ball'),
  };

  boundary = {
    left: 0,
    right: window.innerWidth - $els.yarnBall.outerWidth(),
    top: 0,
    bottom: window.innerHeight - $els.yarnBall.outerHeight(),
  };

  yarnBall = new Player(boundary.left, boundary.bottom);
  obs1 = new Obstacle(500, 10, 300);

  requestAnimationFrame(update);
});
