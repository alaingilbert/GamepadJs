/**
 * Events manager.
 * @constructor
 */
var EventEmitter = function() {
  this.callbacks_ = {};
};


/**
 * Listen for a specific signal.
 * @param {string} signal Signal to listen on.
 * @param {Function} callback Callback.
 * @return {boolean} False if the callback already exists, true otherwise.
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
  return true;
};


/**
 * Emit a signal.
 * @param {string} signal Signal to emit.
 * @param {Object} evt Event to be emitted.
 * @return {boolean} False if there is no callbacks, true otherwise.
 */
EventEmitter.prototype.emit = function(signal, evt) {
  var callbacks = this.callbacks_[signal];
  if (!callbacks) { return false; }
  for (var i = 0; i < callbacks.length; i++) {
    callbacks[i].call(this, evt);
  }
  return true;
};



/**
 * Gamepads global variable.
 */
var Gamepads = {};


/**
 * Array that contain all the Gamepad objects.
 * @type {Array.<Gamepad>}
 */
Gamepads.pads = [];


/**
 * Is the Gamepads initialized.
 * @private
 */
Gamepads.isInit_ = false;


/**
 * Get all the gamepads connected.
 * @return {Object} All gamepads.
 */
Gamepads.getGamepads = function() {
  return navigator.webkitGamepads ||
         navigator.mozGamepads ||
         navigator.gamepads;
};


/**
 * Verify that the browser support the gamepad api.
 */
Gamepads.supported = Gamepads.getGamepads() != undefined;


/**
 * Get the gamepad at the specified index.
 * @return {Gamepad} Get the Gamepad at the specified index.
 */
Gamepads.get = function(idx) {
  if (!Gamepads.isInit_) { Gamepads.update(); }
  return Gamepads.pads[idx];
};


/**
 * Get the current gamepad count.
 * @return {number} The number of Gamepads detedted.
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
  Gamepads.isInit_ = true;
  var pads = Gamepads.getGamepads();
  for (var i = 0; i < pads.length; i++) {
    if (Gamepads.pads[i]) {
      Gamepads.pads[i].refresh(pads[i]);
    } else {
      Gamepads.pads[i] = new Gamepad(pads[i]);
    }
  }
};



/**
 * Represent a Gamepad.
 * @param {Object} params Parameters.
 * @constructor
 * @extends {EventEmitter}
 */
var Gamepad = function(params) {
  params = params || {};
  EventEmitter.call(this);
  this.id = params.id;
  this.previousState = {};
  this.isConnected = false;
  this.lastUpdate_ = {};
  this.deadZone_ = 0.07;
};
Gamepad.prototype.__proto__ = EventEmitter.prototype;


/**
 * Refresh the Gamepad properties.
 * @param {Object} params Parameters.
 */
Gamepad.prototype.refresh = function(params) {
  params = params || {};
  if (params.id) {
    if (!this.isConnected) {
      var evt = { type: 'connected',
                  timestamp: new Date().getTime(),
                  index: params.index
                };
      this.emit('connected', evt);
    }
    this.isConnected = true;
    this.map(params);
  } else {
    if (this.lastUpdate_.id) {
      var evt = { type: 'disconnected',
                  timestamp: new Date().getTime()
                };
      this.emit('disconnected', evt);
      this.isConnected = false;
    }
  }
  this.lastUpdate_ = params;
};


/**
 * Set all the Gamepad properties.
 * @param {Object} map Mapping.
 */
Gamepad.prototype.setMap = function(map) {
  for (var key in map) {

    // If the key was defined, and is now different.
    if (this.previousState[key] !== undefined &&
        map[key] != this.previousState[key])
    {
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


      // Buttons
      } else {
        var evt = {
          button: key,
          timestamp: new Date().getTime()
        };
        if (map[key] === 1) {
          evt.type = 'buttondown';
          this.emit('buttondown', evt);
        } else if (map[key] === 0) {
          evt.type = 'buttonup';
          this.emit('buttonup', evt);
        }
      }
    }
    this[key] = map[key];
  }
};


/**
 * Get the correct mapping.
 * @param {Object} params Paramters.
 */
Gamepad.prototype.map = function(params) {
  var map = {};
  switch (this.getType()) {
    case 'Logitech F310':
      map = this.getLogitechF310Map(params);
      break;
  }
  var defaultMap = this.getDefaultMapping(params);
  for (var key in defaultMap) {
    map[key] = defaultMap[key];
  }
  this.setMap(map);
  this.previousState = map;
};


/**
 * Get the Logitech F310 buttons mapping.
 * @param {Object} params Parameters.
 * @return {Object} The Logitech F310 mapping.
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
    LEFT_STICK_X: this.adjustWithDeadZone(params.axes[0]) || 0,
    LEFT_STICK_Y: this.adjustWithDeadZone(params.axes[1]) || 0,
    RIGHT_STICK_X: this.adjustWithDeadZone(params.axes[2]) || 0,
    RIGHT_STICK_Y: this.adjustWithDeadZone(params.axes[3]) || 0
  };
};


/**
 * Get the default mapping.
 * @param {Object} params Parameters.
 * @return {Object} The default mapping
 */
Gamepad.prototype.getDefaultMapping = function(params) {
  var mapping = {};
  for (var i = 0; i < params.buttons.length; i++) {
    mapping['BUTTON_' + i] = params.buttons[i];
  }
  for (var i = 0; i < params.axes.length; i++) {
    var value = params.axes[i];
    mapping['AXE_' + i] = this.adjustWithDeadZone(params.axes[i]);
  }
  return mapping;
};


/**
 * @param {number} value The real joystick value.
 * @return {number} The new value.
 */
Gamepad.prototype.adjustWithDeadZone = function(value) {
  if (value + this.deadZone_ >= 1) { value = 1; }
  if (value - this.deadZone_ <= -1) { value = -1; }
  if (value <= this.deadZone_ && value >= -this.deadZone_) { value = 0; }
  return value;
};


/**
 * Get the gamepad type.
 * @return {string} The Gamepad type.
 */
Gamepad.prototype.getType = function() {
  if (this.id.indexOf('Vendor: 046d') != -1 &&
      this.id.indexOf('Product: c216') != -1)
  {
    return 'Logitech F310';
  }
};
