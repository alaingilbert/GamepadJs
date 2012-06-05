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
  var callbacks = this.callbacks_[signal] || [];
  for (var i = 0; i < callbacks.length; i++) {
    if (callback == callbacks[i]) {
      return false;
    }
  }
  if (!this.callbacks_[signal]) { this.callbacks_[signal] = []; }
  this.callbacks_[signal].push(callback);
};


/**
 * @param {string} signal Signal to emit.
 * @param {Object} evt Event to be emitted.
 */
EventEmitter.prototype.emit = function(signal, evt) {
  var callbacks = this.callbacks_[signal];
  if (!callbacks) { return false; }
  for (var i = 0; i < callbacks.length; i++) {
    callbacks[i].call(this, evt);
  }
};



/**
 *
 */
var Gamepads = {};


/** */
Gamepads.pads = [];


/** */
Gamepads.isInit = false;


/** */
Gamepads.getGamepads = function() {
  return navigator.webkitGamepads ||
         navigator.mozGamepads ||
         navigator.gamepads;
};


/** */
Gamepads.supported = Gamepads.getGamepads() != undefined;


/**
 * Get the gamepad at the specified index.
 */
Gamepads.get = function(idx) {
  if (!Gamepads.isInit) { Gamepads.update(); }
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
  Gamepads.isInit = true;
  var pads = Gamepads.getGamepads();
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
  this.previousState = {};
  this.map(params);
  EventEmitter.call(this);
};
Gamepad.prototype.__proto__ = EventEmitter.prototype;


/**
 *
 */
Gamepad.prototype.refresh = function(params) {
  params = params || {};
  this.map(params);
};


/**
 * @param {Object} map Mapping.
 */
Gamepad.prototype.setMap = function(map) {
  for (var key in map) {
    if (this.previousState[key] !== undefined && map[key] != this.previousState[key]) {
      if (key == 'LEFT_STICK_X' ||
          key == 'LEFT_STICK_Y')
      {
        var evt = {
          button: 'LEFT_STICK',
          timestamp: new Date().getTime(),
          type: 'stickmove',
          x: map['LEFT_STICK_X'],
          y: map['LEFT_STICK_Y']
        };
        this.emit('stickmove', evt);


      } else if ( key == 'RIGHT_STICK_X' ||
                  key == 'RIGHT_STICK_Y')
      {
        var evt = {
          button: 'RIGHT_STICK',
          timestamp: new Date().getTime(),
          type: 'stickmove',
          x: map['RIGHT_STICK_X'],
          y: map['RIGHT_STICK_Y']
        };
        this.emit('stickmove', evt);


      } else {
        var evt = {
          button: key,
          timestamp: new Date().getTime()
        };
        if (map[key] === 1) {
          evt.type = 'buttondown';
          this.emit('buttondown', evt);
        }
        if (map[key] === 0) {
          evt.type = 'buttonup';
          this.emit('buttonup', evt);
        }
      }
    }
    this[key] = map[key];
  }
};


/**
 * @param {Object} params Paramters.
 */
Gamepad.prototype.map = function(params) {
  var map = {};
  switch (this.getType()) {
    case 'Logitech Dual Action':
      map = this.getLogitechF310Map(params);
      this.setMap(map);
      this.previousState = map;
      break;
    default:
      map = this.getLogitechF310Map(params);
      break
  }
};


/**
 * @param {Object} params Parameters.
 */
Gamepad.prototype.getLogitechF310Map = function(params) {
  return {
    A: params.buttons[0] || 0,
    B: params.buttons[1] || 0,
    X: params.buttons[2] || 0,
    Y: params.buttons[3] || 0,
    LEFT_SHOULDER_0: params.buttons[4] || 0,
    RIGHT_SHOULDER_0: params.buttons[5] || 0,
    LEFT_SHOULDER_1: params.buttons[6] || 0,
    RIGHT_SHOULDER_1: params.buttons[7] || 0,
    SELECT: params.buttons[8] || 0,
    START: params.buttons[9] || 0,
    LEFT_STICK_BUTTON: params.buttons[10] || 0,
    RIGHT_STICK_BUTTON: params.buttons[11] || 0,
    UP: params.buttons[12] || 0,
    DOWN: params.buttons[13] || 0,
    LEFT: params.buttons[14] || 0,
    RIGHT: params.buttons[15] || 0,
    LEFT_STICK_X: params.axes[0] || 0,
    LEFT_STICK_Y: params.axes[1] || 0,
    RIGHT_STICK_X: params.axes[2] || 0,
    RIGHT_STICK_Y: params.axes[3] || 0
  };
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
