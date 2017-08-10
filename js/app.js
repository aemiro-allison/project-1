let $els = {};
let boundary = {};
const keys = {};
let yarnBall = null;

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

// function changeBgColor(shouldChangeBg) {
//   if (shouldChangeBg) {
//     $els.nyanCat[0].style.backgroundColor = 'green';
//     $els.yarnBall[0].style.backgroundColor = 'green';
//   } else {
//     $els.nyanCat[0].style.backgroundColor = 'grey';
//     $els.yarnBall[0].style.backgroundColor = 'grey';
//   }
// }
class Obstacle {
  constructor(y, width, height) {
    // create obstacle element.
    this.el = $('<div>');
    this.el.css('width', width);
    this.el.css('height', height);
    this.el.attr('class', 'obstacle');
    this.el.appendTo('#obstacles');

    // uniquely idenity each obstacle
    this.id = Math.floor(Math.random() * 2);

    this.y = y;
    this.x = boundary.right + 300;
    this.speed = 5;
  }

  move() {
    this.x -= this.speed;
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
        this.y -= 30 * this.friction;
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
  // changeBgColor(isCollide($els.yarnBall, $els.nyanCat));
  requestAnimationFrame(update);
};

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
