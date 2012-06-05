# Gamepad API

Allows you to use gamepads in javascript.

## Quick start

```html
<script src=".../gamepad.js" type="text/javascript"></script>
```

```js
var pad = Gamepads.get(0);
```


## Events

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
