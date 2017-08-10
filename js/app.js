let $els = {};
let boundary = {};
const keys = {};
let yarnBall = null;

const Physics = {
  speed: 5,
  jumpHeight: 800,
  gravity: 2,
  currVelocity: 0,
  acceleration: 2,
  friction: 0.98,
  accelerating: false,
  boundary: {},

  accelerate($obj, axis, value) {
    // change the velocity of the obj by
    // changing the acceleration of it.

    if (axis === 'x') {
      $obj.css('left', $obj.position().left - value);
    }

    if (axis === 'y') {
      $obj.css('top', $obj.position().top - value);
    }
  },

  applyGravity($obj) {
    // apply gravity to that obj until the bottom
    // is reached.
    const currYPos = $obj.position().top;
    if (currYPos <= boundary.bottom) {
      $obj.css('top', currYPos + ((this.currVelocity += 0.05) * this.gravity));
    } else {
      this.currVelocity = 0;
    }
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

};

class Player {
  constructor(xAxis, yAxis) {
    this.x = xAxis;
    this.y = yAxis;
    this.xVel = 0;
    this.yVel = 0;
    this.speed = 5;
    this.friction = 0.88;
    this.gravity = 10;
    this.isJumping = false;
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

  jump() {
    let counter = 0;
    if (!this.isJumping && (this.y >= boundary.bottom)) {
      this.isJumping = true;

      const id = setInterval(() => {
        if (counter === 20) {
          this.isJumping = false;
          clearInterval(id);
        }

        counter += 2;
        console.log('interval');
        this.y -= 40 * this.friction;
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
        this.xVel += 1;
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
  console.log(evt.keyCode);
});

// deactivate the key pressed by setting to false.
document.addEventListener('keyup', (evt) => {
  keys[evt.keyCode] = false;
});

// jump
// document.addEventListener('keypress', (evt) => {
//   if (evt.keyCode === 32) {
//     yarnBall.jump();
//   }
// });

// when click on body, toggle drawer class on game-bar
$('#toggle-drawer').click((evt) => {
  evt.stopPropagation();
  $els.gameBar.toggleClass('drawer');
});

// let isJumping = false;
// const jump = () => {
//   // let counter = Physics.jumpHeight;
//   if (!isJumping) {
//     isJumping = true;
//     const id = setInterval(() => {
//       // check if the height.
//       if ($els.yarnBall.position().top >= Physics.jumpHeight) {
//         isJumping = false;
//         Physics.applyGravity($els.yarnBall);
//         clearInterval(id);
//       } else {
//         Physics.accelerate($els.yarnBall, 'y', +(Physics.speed));
//       }
//     }, 1000 / 60);
//   }
// };

// const movePlayer = () => {
//   // box2 left-right
//   if (keys[68]) {
//     if (!($els.yarnBall.position().left >= boundary.right)) {
//       Physics.accelerate($els.yarnBall, 'x', -(Physics.speed));
//     }
//   }

//   if (keys[65]) {
//     if (!($els.yarnBall.position().left <= boundary.left)) {
//       Physics.accelerate($els.yarnBall, 'x', +(Physics.speed));
//     }
//   }

//   // box2 up-down
//   if (keys[87]) {
//     if (($els.yarnBall.position().top >= boundary.top)) {
//       // bounce away towards bottom with x force
//       Physics.accelerate($els.yarnBall, 'y', +(Physics.speed));
//     }
//   }

//   if (keys[83]) {
//     if (($els.yarnBall.position().top <= boundary.bottom)) {
//       // bounce away towards top with x force
//       Physics.accelerate($els.yarnBall, 'y', -(Physics.speed));
//     }
//   }
// };

// // player jump
// document.addEventListener('keypress', (evt) => {
//   if (evt.keyCode === 32) {
//     // make player jump with appriopate physics.
//     jump();
//   }
// });


$(document).ready(() => {
  $els = {
    gameBar: $('#game-bar'),
    toggleDrawerBtn: $('#toggle-drawer'),
    gameWindow: $('#game-window'),
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

  requestAnimationFrame(update);
});

const update = () => {
  yarnBall.draw($els.yarnBall);
  requestAnimationFrame(update);
};
