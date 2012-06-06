var Game = {};


Game.init = function() {
  Game.canvas = document.getElementById('canvas');
  Game.ctx = Game.canvas.getContext('2d');
  Game.background = new Background();
  Game.player = new Player();
  Game.pad = Gamepads.get(0);
  Game.States = {BIND_KEYS: 0, GAME: 1, UNSUPPORTED: 2};
  Game.lastFrame = new Date().getTime();

  Game.Controls = {LEFT: null, RIGHT: null, UP: null, DOWN: null};

  if (Gamepads.supported) {
    Game.levelSettings = new LevelSettings();
    Game.state = Game.States.BIND_KEYS;
  } else {
    Game.state = Game.States.UNSUPPORTED;
  }

  Game.cycle();
};


Game.update = function(deltaTime) {
  switch (Game.state) {
    case Game.States.BIND_KEYS:
      Gamepads.update();
      Game.levelSettings.update(deltaTime);
      break;
    case Game.States.GAME:
      Gamepads.update();
      Game.background.update(deltaTime);
      Game.player.update(deltaTime);
      break;
    case Game.States.UNSUPPORTED:
      break;
  }
};


Game.render = function() {
  var c = Game.ctx;
  c.save();
  c.clearRect(0, 0, Game.canvas.width, Game.canvas.height);

  switch (Game.state) {
    case Game.States.BIND_KEYS:
      Game.levelSettings.render();
      break;
    case Game.States.GAME:
      Game.background.render();
      Game.player.render();
      break;
    case Game.States.UNSUPPORTED:
      c.textAlign = 'center';
      c.font = '20px sans-serif';
      c.fillText('Your browser does not support html5 gamepads api.',
          Game.canvas.width/2, Game.canvas.height/2);
      break;
  }

  c.strokeRect(0, 0, Game.canvas.width, Game.canvas.height);
  c.restore();
};


Game.cycle = function() {
  var deltaTime = new Date().getTime() - Game.lastFrame;
  Game.update(deltaTime);
  Game.render();
  Game.lastFrame = new Date().getTime();
  requestAnimFrame(Game.cycle);
};


window.requestAnimFrame = (function(){
  return window.requestAnimationFrame       || // La forme standardisée
         window.webkitRequestAnimationFrame || // Pour Chrome et Safari
         window.mozRequestAnimationFrame    || // Pour Firefox
         window.oRequestAnimationFrame      || // Pour Opera
         window.msRequestAnimationFrame     || // Pour Internet Explorer
         function(callback){                   // Pour les élèves du dernier rang
           window.setTimeout(callback, 1000 / 60);
         };
})();


document.addEventListener('DOMContentLoaded', function() { Game.init(); });
