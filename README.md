# Gamepad API

Allows you to use gamepads in javascript.

![Screen shot 1](http://us.cdn4.123rf.com/168nwm/chisnikov/chisnikov1104/chisnikov110400057/9267738-boitier-de-commande-contour-noir-sur-blanc-bakcground-illustration-vectorielle.jpg)

## Quick start

```html
<script src=".../gamepad.js" type="text/javascript"></script>
```

```js
var pad = Gamepads.get(0);
```

In the game loop, you have to put the following command.

It will update the state of all the connected gamepads.

```js
Gamepads.update();
```

## Properties

All the buttons/joysticks states are accessible like this:

Get a button state (replace X by a number). Return a value in the range [0..1]

```js
pad.BUTTON_X;
```

Get a joystick state (replace X by a number). Return a value in the range [-1..1]

```js
pad.AXE_X;
```


If the gamepad is known, you can access it with some user friendly names:

```js
pad.A;
pad.B;
pad.X;
pad.Y;
pad.LEFT_SHOULDER_0;
pad.RIGHT_SHOULDER_0;
pad.LEFT_SHOULDER_1;
pad.RIGHT_SHOULDER_1;
pad.SELECT;
pad.START;
pad.LEFT_STICK_BUTTON;
pad.LEFT_STICK_BUTTON;
pad.UP;
pad.DOWN;
pad.LEFT;
pad.RIGHT;
pad.LEFT_STICK_X;
pad.LEFT_STICK_Y;
pad.RIGHT_STICK_X;
pad.RIGHT_STICK_Y;
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
