/** */
var Gamepads = {};


/** */
Gamepads.pads = [];


/**
 * Get the gamepad at the specified index.
 */
Gamepads.get = function(idx) {
  return Gamepads.pads[idx];
};


/**
 * Get the current gamepad count.
 */
Gamepads.length = function() {
  var count = 0;
  for (var i = 0; i < Gamepads.pads.length; i++) {
    if (Gamepads.pads[i]) {
      count++;
    }
  }
  return count;
};


/**
 * Update all gamepads state.
 */
Gamepads.update = function() {
  var pads = navigator.webkitGamepads;
  for (var i = 0; i < pads.length; i++) {
    if (!pads[i]) {
      Gamepads.pads[i] = null;
      continue;
    }

    if (Gamepads.pads[i]) {
      Gamepads.pads[i].refresh(pads[i]);
    } else {
      Gamepads.pads[i] = new Gamepad(pads[i]);
    }
  }
};



/**
 * @constructor
 * @extends {EventEmitter}
 */
var Gamepad = function(params) {
  params = params || {};
  this.id = params.id;
  console.log(params.id, params);
  this.map(params);
  EventEmitter.call(this);
};


/**
 *
 */
Gamepad.prototype.refresh = function(params) {
  params = params || {};
  this.map(params);
};


/**
 * @param {Object} params Paramters.
 */
Gamepad.prototype.map = function(params) {
  switch (this.getType()) {
    case 'Logitech Dual Action':
      this.mapLogitechDualAction(params);
      break;
  }
};


/**
 * @param {Object} params Parameters.
 */
Gamepad.prototype.mapLogitechDualAction = function(params) {
  this.A = params.buttons[0] || 0;
  this.B = params.buttons[1] || 0;
  this.X = params.buttons[2] || 0;
  this.Y = params.buttons[3] || 0;
  this.LEFT_SHOULDER_0 = params.buttons[4] || 0;
  this.RIGHT_SHOULDER_0 = params.buttons[5] || 0;
  this.LEFT_SHOULDER_1 = params.buttons[6] || 0;
  this.RIGHT_SHOULDER_1 = params.buttons[7] || 0;
  this.SELECT = params.buttons[8] || 0;
  this.START = params.buttons[9] || 0;
  this.LEFT_STICK_BUTTON = params.buttons[10] || 0;
  this.RIGHT_STICK_BUTTON = params.buttons[11] || 0;
  this.UP = params.buttons[12] || 0;
  this.DOWN = params.buttons[13] || 0;
  this.LEFT = params.buttons[14] || 0;
  this.RIGHT = params.buttons[15] || 0;
  this.LEFT_STICK_X = params.axes[0] || 0;
  this.LEFT_STICK_Y = params.axes[1] || 0;
  this.RIGHT_STICK_X = params.axes[2] || 0;
  this.RIGHT_STICK_Y = params.axes[3] || 0;
};


/**
 * Get the gamepad type.
 */
Gamepad.prototype.getType = function() {
  if (this.id.indexOf('Vendor: 046d') != -1 &&
      this.id.indexOf('Product: c216') != -1)
  {
    return 'Logitech Dual Action';
  }
};



/**
 * @constructor
 */
var EventEmitter = function() {
  this.callbacks_ = {};
};


/**
 * @param {string} signal Signal to listen on.
 * @param {Function} callback Callback.
 */
EventEmitter.prototype.on = function(signal, callback) {
  var callbacks = this.callbacks_[signal];
  for (var i = 0; i < callbacks.length; i++) {
    if (callback == callbacks[i]) {
      return false;
    }
  }
  this.callbacks_[signal].push(callback);
};


/**
 * @param {string} signal Signal to emit.
 */
EventEmitter.prototype.emit = function(signal) {
  var callbacks = this.callbacks_[signal];
  for (var i = 0; i < callbacks.length; i++) {
    callbacks[i].call(this);
  }
};
