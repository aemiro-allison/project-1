let $els = {};
let boundary = {};

const keys = {};
const speed = 5;

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
});

// add the key pressed and indicate that it is active
// by setting to true.
document.addEventListener('keydown', (evt) => {
  keys[evt.keyCode] = true;
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

const handlePlayerMovement = () => {
  // box2 left-right

  if (keys[68]) {
    if (!($els.yarnBall.position().left >= boundary.right)) {
      $els.yarnBall.css('left', $els.yarnBall.position().left + speed);
    } else {
      $els.yarnBall.css('left', $els.yarnBall.position().left - speed);
    }
  }
  if (keys[65]) {
    if (!($els.yarnBall.position().left <= boundary.left)) {
      $els.yarnBall.css('left', $els.yarnBall.position().left - speed);
    } else {
      $els.yarnBall.css('left', $els.yarnBall.position().left + speed);
    }
  }

  // box2 up-down
  if (keys[87]) {
    if (!($els.yarnBall.position().top >= boundary.top)) {
      $els.yarnBall.css('top', $els.yarnBall.position().top + speed);
    } else {
      $els.yarnBall.css('top', $els.yarnBall.position().top - speed);
    }
  }
  if (keys[83]) {
    if (!($els.yarnBall.position().top <= boundary.bottom)) {
      $els.yarnBall.css('top', $els.yarnBall.position().top - speed);
    } else {
      $els.yarnBall.css('top', $els.yarnBall.position().top + speed);
    }
  }
};

const update = () => {
  handlePlayerMovement();
  requestAnimationFrame(update);
};

requestAnimationFrame(update);
