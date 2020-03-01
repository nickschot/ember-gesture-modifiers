/**
 * Generates a mock touchEvent like object for testing purposes
 * @param {string} eventType touchstart, touchmove or touchend
 * @param {number} x
 * @param {number} y
 * @param {number} timeStampDelta
 * @returns {{type: *, touches: Touch[], changedTouches: Touch[], timeStamp: number}}
 */
export default function createTouchEvent(eventType, x, y, timeStampDelta = 0) {
  let touch = new Touch({
    identifier: Date.now(),
    target: window,
    clientX: x,
    clientY: y
  });

  // we mock it using an object because we can't otherwise set the timeStamp
  return {
    type: eventType,
    touches: [touch],
    changedTouches: [touch],
    timeStamp: 234011.29999995464 + timeStampDelta
  };
}
