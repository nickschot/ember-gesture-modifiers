
## v3.0.0 (2022-01-17)

#### :boom: Breaking Change
* [#188](https://github.com/nickschot/ember-gesture-modifiers/pull/188) feat: Ember v4 Support, drop Ember < 3.24 ([@knownasilya](https://github.com/knownasilya))
* [#72](https://github.com/nickschot/ember-gesture-modifiers/pull/72) drop node 10 support ([@nickschot](https://github.com/nickschot))

#### :bug: Bug Fix
* [#137](https://github.com/nickschot/ember-gesture-modifiers/pull/137) use document based event handlers for pointer move/up/cancel for all pointer types ([@nickschot](https://github.com/nickschot))
* [#71](https://github.com/nickschot/ember-gesture-modifiers/pull/71) fix parse-touch-data re-export ([@nickschot](https://github.com/nickschot))

#### :house: Internal
* [#138](https://github.com/nickschot/ember-gesture-modifiers/pull/138) use ember-auto-import v2 in ember-beta test scenario ([@nickschot](https://github.com/nickschot))
* [#76](https://github.com/nickschot/ember-gesture-modifiers/pull/76) remove console.log from modifier code ([@nickschot](https://github.com/nickschot))
* [#73](https://github.com/nickschot/ember-gesture-modifiers/pull/73) upgrade to ember-cli 3.27 blueprint ([@nickschot](https://github.com/nickschot))

#### Committers: 2
- Ilya Radchenko ([@knownasilya](https://github.com/knownasilya))
- Nick Schot ([@nickschot](https://github.com/nickschot))


## v1.1.1 (2021-07-07)

#### :bug: Bug Fix
* [#69](https://github.com/nickschot/ember-gesture-modifiers/pull/69) fix pan test-helper calculating coordinates for intermediate events incorrectly in certain cases ([@nickschot](https://github.com/nickschot))

#### Committers: 1
- Nick Schot ([@nickschot](https://github.com/nickschot))


## v1.1.0 (2021-06-17)

#### :rocket: Enhancement
* [#60](https://github.com/nickschot/ember-gesture-modifiers/pull/60) Add vertical & bi-directional test coverage & pan test-helper extension ([@nickschot](https://github.com/nickschot))

#### :bug: Bug Fix
* [#53](https://github.com/nickschot/ember-gesture-modifiers/pull/53) fix capture argument not working & add test coverage ([@nickschot](https://github.com/nickschot))

#### :memo: Documentation
* [#42](https://github.com/nickschot/ember-gesture-modifiers/pull/42) fix minimum supported Ember.js version in README ([@nickschot](https://github.com/nickschot))

#### :house: Internal
* [#41](https://github.com/nickschot/ember-gesture-modifiers/pull/41) add github CI configuration ([@nickschot](https://github.com/nickschot))
* [#37](https://github.com/nickschot/ember-gesture-modifiers/pull/37) enable renovatebot ([@nickschot](https://github.com/nickschot))
* [#30](https://github.com/nickschot/ember-gesture-modifiers/pull/30) upgrade to ember-cli 3.26, add embroider test setup ([@nickschot](https://github.com/nickschot))

#### Committers: 1
- Nick Schot ([@nickschot](https://github.com/nickschot))


## v1.1.0-beta.1 (2021-02-03)

#### :rocket: Enhancement
* [#22](https://github.com/nickschot/ember-gesture-modifiers/pull/22) add proper drag support for mouse based pointer events ([@nickschot](https://github.com/nickschot))
* [#21](https://github.com/nickschot/ember-gesture-modifiers/pull/21) add bidirectional pan support ([@nickschot](https://github.com/nickschot))

#### :memo: Documentation
* [#19](https://github.com/nickschot/ember-gesture-modifiers/pull/19) fix pointerTypes argument documentation ([@nickschot](https://github.com/nickschot))

#### Committers: 1
- Nick Schot ([@nickschot](https://github.com/nickschot))


## v1.0.0 (2020-11-19)

#### :boom: Breaking Change
* [#16](https://github.com/nickschot/ember-gesture-modifiers/pull/16) implement PointerEvents (replacing TouchEvents) ([@nickschot](https://github.com/nickschot))

#### :rocket: Enhancement
* [#16](https://github.com/nickschot/ember-gesture-modifiers/pull/16) implement PointerEvents (replacing TouchEvents) ([@nickschot](https://github.com/nickschot))

#### :memo: Documentation
* [#15](https://github.com/nickschot/ember-gesture-modifiers/pull/15) Add code comments to explain `touch-action` setting ([@lolmaus](https://github.com/lolmaus))

#### Committers: 2
- Andrey Mikhaylov (lolmaus) ([@lolmaus](https://github.com/lolmaus))
- Nick Schot ([@nickschot](https://github.com/nickschot))


## v0.2.0 (2020-08-05)

#### :boom: Breaking Change
* [#11](https://github.com/nickschot/ember-gesture-modifiers/pull/11) set touchmove event listener's passive option to false when the preventScroll argument is passed, remove passive argument ([@nickschot](https://github.com/nickschot))

#### :house: Internal
* [#12](https://github.com/nickschot/ember-gesture-modifiers/pull/12) Update to ember-cli 3.20 & upgrade other dependencies ([@nickschot](https://github.com/nickschot))
* [#3](https://github.com/nickschot/ember-gesture-modifiers/pull/3) add changelog ([@nickschot](https://github.com/nickschot))

#### Committers: 1
- Nick Schot ([@nickschot](https://github.com/nickschot))


## v0.1.1 (2020-03-01)

#### :house: Internal
* [#2](https://github.com/nickschot/ember-gesture-modifiers/pull/2) remove dependency on ember-mobile-core ([@nickschot](https://github.com/nickschot))

#### Committers: 1
- Nick Schot ([@nickschot](https://github.com/nickschot))
