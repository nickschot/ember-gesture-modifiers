import {
  parseInitialTouchData,
  parseTouchData,
  isHorizontal,
  isVertical,
} from 'ember-gesture-modifiers/utils/parse-touch-data';
import { module, test } from 'qunit';
import createMockPointerEvent from '../../helpers/create-mock-pointer-event';

module('Unit | Utility | parse-touch-data', function () {
  test('it returns the initial touch data', function (assert) {
    const e = createMockPointerEvent('pointermove', 0, 0);
    let touchData = parseInitialTouchData(e);

    assert.deepEqual(touchData, {
      data: {
        initial: {
          x: e.clientX,
          y: e.clientY,
          timeStamp: e.timeStamp,
        },
        cache: {
          velocity: {
            distanceX: 0,
            distanceY: 0,
            timeStamp: e.timeStamp,
          },
        },
        timeStamp: e.timeStamp,
        originalEvent: e,
      },
      panStarted: false,
      panDenied: false,
    });
  });

  test('it returns the parsed touch data', async function (assert) {
    const e1 = createMockPointerEvent('pointermove', 0, 0);
    const e2 = createMockPointerEvent('pointermove', 42, 33, 52);
    let initialTouchData = parseInitialTouchData(e1);
    let touchData = parseTouchData(initialTouchData, e2);

    assert.deepEqual(touchData, {
      data: {
        cache: {
          velocity: {
            distanceX: 42,
            distanceY: 33,
            timeStamp: e2.timeStamp,
          },
        },
        current: {
          angle: 321.84277341263095,
          deltaX: 42,
          deltaY: 33,
          distance: 53.41348144429457,
          distanceX: 42,
          distanceY: 33,
          overallVelocity: 0.8076923076923077,
          overallVelocityX: 0.8076923076923077,
          overallVelocityY: 0.6346153846153846,
          velocity: 0.8076923076923077,
          velocityX: 0.8076923076923077,
          velocityY: 0.6346153846153846,
          x: 42,
          y: 33,
        },
        initial: initialTouchData.data.initial,
        originalEvent: e2,
        timeStamp: e2.timeStamp,
      },
      panDenied: false,
      panStarted: false,
    });
  });

  test('it detects a touch as horizontal', function (assert) {
    assert.expect(4);

    let e1 = createMockPointerEvent('pointermove', 0, 0);
    let initialTouchData = parseInitialTouchData(e1);

    let e2 = createMockPointerEvent('pointermove', 42, 33, 52);
    let touchData = parseTouchData(initialTouchData, e2);
    assert.equal(isHorizontal(touchData), true);

    e2 = createMockPointerEvent('pointermove', -42, -33, 52);
    touchData = parseTouchData(initialTouchData, e2);
    assert.equal(isHorizontal(touchData), true);

    e2 = createMockPointerEvent('pointermove', 0, 0, 52);
    touchData = parseTouchData(initialTouchData, e2);
    assert.equal(isHorizontal(touchData), false);

    e2 = createMockPointerEvent('pointermove', -33, -42, 52);
    touchData = parseTouchData(initialTouchData, e2);
    assert.equal(isHorizontal(touchData), false);
  });

  test('it detects a touch as vertical', function (assert) {
    assert.expect(4);

    let e1 = createMockPointerEvent('pointermove', 0, 0);
    let initialTouchData = parseInitialTouchData(e1);

    let e2 = createMockPointerEvent('pointermove', 42, 33, 52);
    let touchData = parseTouchData(initialTouchData, e2);
    assert.equal(isVertical(touchData), false);

    e2 = createMockPointerEvent('pointermove', -42, -33, 52);
    touchData = parseTouchData(initialTouchData, e2);
    assert.equal(isVertical(touchData), false);

    e2 = createMockPointerEvent('pointermove', 0, 0, 52);
    touchData = parseTouchData(initialTouchData, e2);
    assert.equal(isVertical(touchData), false);

    e2 = createMockPointerEvent('pointermove', -33, -42, 52);
    touchData = parseTouchData(initialTouchData, e2);
    assert.equal(isVertical(touchData), true);
  });
});
