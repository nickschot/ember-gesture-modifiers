# ember-gesture-modifiers

Addon that provides gestures as modifiers.

## Compatibility

- Ember.js v3.24 or above
- Ember CLI v3.24 or above
- Node.js v12 or above

## Installation

```
ember install ember-gesture-modifiers
```

## Usage

Currently only a Pan modifier is provided. More gestures will be added in the future.

## Pan modifier

```handlebars
<div
  {{did-pan
    onPanStart=this.didPanStart
    onPan=this.didPan
    onPanEnd=this.didPanEnd
  }}
>
```

### arguments

- **onPanStart** - hook fired when a pan is started
- **onPan** - hook fired when the pan is updated
- **onPanEnd** - hook fired when a pan has ended
- **threshold** _(default: 10)_ - minimum touch movement needed in px to start a pan
- **axis** _(default: 'horizontal')_ - axis for the pan event to be recognized ('horizontal', 'vertical' or 'both')
- **capture** _(default: false)_ - whether or not to use capture events instead of bubbling
- **preventScroll** _(default: true)_ - whether or not to prevent scroll during panning
- **pointerTypes** _(default: ['touch'])_ - the pointer types to support (one or more of 'touch', 'mouse', 'pen')

The hooks are passed a TouchData object which looks like:

```javascript
{
  originalEvent: <TouchEvent>,
  timeStamp: 2896.435000002384,
  initial: {
    x: 427.87109375,
    y: 276.98046875,
    timeStamp: 2251.9500000053085
  },
  current: {
    deltaX: 0,
    deltaY: 0,
    x: 192.95703125,
    y: 279.12890625,
    distance: 234.92388670364133,
    distanceX: -234.9140625,
    distanceY: 2.1484375,
    angle: 180.52399148917002,
    overallVelocityX: -0.36449888283057935,
    overallVelocityY: 0.0033335725424327154,
    overallVelocity: -0.36449888283057935,
    velocityX: -0.03269026669500546,
    velocityY: 0,
    velocity: -0.03269026669500546
  },
  cache: {
    velocity: {
      distanceX: -234.9140625,
      distanceY: 2.1484375,
      timeStamp: 2613.435000006575
    }
  }
}
```

## Testing

A `pan` test helper is exposed by the addon.

```javascript
import { pan } from 'ember-gesture-modifiers/test-support';

...

// arg1: CSS selector on which the pan happens
// arg2: a direction in which the pan should happen. Either 'left', 'right', 'down', 'up' or 'up-right'.
await pan('.my-css-selector', 'right');
```

## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.

## License

This project is licensed under the [MIT License](LICENSE.md).
