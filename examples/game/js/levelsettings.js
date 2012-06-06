var LevelSettings = function() {
  var self = this;
  this.step = 0;
  this.stepSucceed = false;
  this.changeStep();
};


LevelSettings.prototype.changeStep = function() {
  var self = this;
  Game.pad.once('buttondown', function(evt) {
    switch (self.step) {
      case 0:
        Game.Controls.LEFT = evt.button;
        self.step++;
        self.changeStep();
        break;
      case 1:
        Game.Controls.RIGHT = evt.button;
        self.step++;
        self.changeStep();
        break;
      case 2:
        Game.Controls.UP = evt.button;
        self.step++;
        self.changeStep();
        break;
      case 3:
        Game.Controls.DOWN = evt.button;
        self.step++;
        self.changeStep();
        break;
    }
  });
};


LevelSettings.prototype.update = function(deltaTime) {
};


LevelSettings.prototype.render = function() {
  var c = Game.ctx;
  c.save();

  c.font = '20px sans-serif';
  switch (this.step) {
    case 0:
      c.fillText('Set your LEFT button.', 100, 100);
      break;
    case 1:
      c.fillText('Set your RIGHT button.', 100, 100);
      break;
    case 2:
      c.fillText('Set your UP button.', 100, 100);
      break;
    case 3:
      c.fillText('Set your DOWN button.', 100, 100);
      break;
    case 4:
      c.fillText('CONGRATS', 100, 100);
      Game.state = Game.States.GAME;
      break;
  }

  c.restore();
};
