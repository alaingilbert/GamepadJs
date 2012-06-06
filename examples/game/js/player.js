var Player = function() {
  this.x = 100;
  this.y = 100;
  this.w = 100;
  this.h = 100;
  this.velocity = 200;
};


Player.prototype.update = function(deltaTime) {
  if (Game.pad[Game.Controls.LEFT]) {
    this.x -= deltaTime / 1000 * this.velocity;
  }
  if (Game.pad[Game.Controls.RIGHT]) {
    this.x += deltaTime / 1000 * this.velocity;
  }
  if (Game.pad[Game.Controls.UP]) {
    this.y -= deltaTime / 1000 * this.velocity;
  }
  if (Game.pad[Game.Controls.DOWN]) {
    this.y += deltaTime / 1000 * this.velocity;
  }
};


Player.prototype.render = function() {
  var c = Game.ctx;
  c.save();
  c.translate(this.x, this.y);

  c.fillRect(0, 0, this.w, this.h);

  c.restore();
};
