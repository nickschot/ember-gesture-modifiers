/**
 * Generates a mock PointerEvent like object for testing purposes
 * @param {string} eventType pointerdown, pointermove or pointerup
 * @param {number} x
 * @param {number} y
 * @param {number} timeStampDelta
 */
export default function createMockPointerEvent(eventType, x, y, timeStampDelta = 0) {
  // we mock it using an object because we can't otherwise set the timeStamp
  return {
    type: eventType,
    identifier: Date.now(),
    target: document.body,
    clientX: x,
    clientY: y,
    timeStamp: 234011.29999995464 + timeStampDelta
  }
}
