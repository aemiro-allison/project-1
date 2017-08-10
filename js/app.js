let $els = {};
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
    $els.yarnBall.css('left', $els.yarnBall.position().left + speed);
    // box2.style.left = `${box2XPos += speed}px`;
  }
  if (keys[65]) {
    $els.yarnBall.css('left', $els.yarnBall.position().left - speed);
    // box2.style.left = `${box2XPos -= speed}px`;
  }

  // box2 up-down
  if (keys[87]) {
    $els.yarnBall.css('top', $els.yarnBall.position().top - speed);
    // box2.style.top = `${box2YPos -= speed}px`;
  }
  if (keys[83]) {
    $els.yarnBall.css('top', $els.yarnBall.position().top + speed);
    // box2.style.top = `${box2YPos += speed}px`;
  }
};

const update = () => {
  handlePlayerMovement();
  requestAnimationFrame(update);
};

requestAnimationFrame(update);
