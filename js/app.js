let $els = {};

$(document).ready(() => {
  $els = {
    gameBar: $('#game-bar'),
    toggleDrawerBtn: $('#toggle-drawer'),
    gameWindow: $('#game-window'),
    nyanCat: $('#nyan-cat'),
    yarnBall: $('#yarn-ball'),
  };
});


// when click on body, toggle drawer class on game-bar
$('#toggle-drawer').click((evt) => {
  evt.stopPropagation();
  $els.gameBar.toggleClass('drawer');
});
