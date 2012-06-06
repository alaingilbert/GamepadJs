# Gamepad API

Allows you to use gamepads in javascript.

## Quick start

```html
<script src=".../gamepad.js" type="text/javascript"></script>
```

```js
var pad = Gamepads.get(0);
```

## Properties

All the buttons/joystick states are accessible like this:

Get a button state. (replace X by a number) In the range [0..1]

```js
pad.BUTTON_X;
```

Get a joystick state. (replace X by a number) In the range [-1..1]

```js
pad.AXE_X;
```


If the gamepad is known, you can access it with some user friendly names:

```js
pad.A;
pad.B;
pad.X;
pad.Y;
pad.LEFT_STICK_X;
pad.LEFT_STICK_Y;
...
```


## Events

### connected

```js
pad.on('connected', function(evt) { console.log(evt); });
// {"index":0,"timestamp":1338874409909,"type":"connected"}
```

### disconnected

```js
pad.on('disconnected', function(evt) { console.log(evt); });
// {"timestamp":1338874409909,"type":"disconnected"}
```

### stickmove

```js
pad.on('stickmove', function(evt) { console.log(evt); });
// {"button":"RIGHT_STICK","timestamp":1338874409909,
// "type":"stickmove","x":0.003921627998352051,"y":0.003921627998352051}
```

### buttondown

```js
pad.on('buttondown', function(evt) { console.log(evt); });
// {"button":"A","timestamp":1338873574415,"type":"buttondown"}
```

### buttonup

```js
pad.on('buttonup', function(evt) { console.log(evt); });
// {"button":"A","timestamp":1338873574415,"type":"buttonup"}
```

## Author

Alain Gilbert ([@alain_gilbert](https://twitter.com/alain_gilbert))
