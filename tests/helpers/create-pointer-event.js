/**
 * Generates a PointerEvent for testing purposes
 *
 * @param {Element} target
 * @param {string} eventType pointerdown, pointermove or pointerend
 * @param {number} x
 * @param {number} y
 * @param {number} identifier
 * @returns {PointerEvent}
 */
export default function createPointerEvent(target, eventType, x, y, identifier = 0) {
  return new PointerEvent(eventType, {
    identifier: identifier || 0,
    target,
    clientX: x,
    clientY: y,
    pointerType: ['touch']
  });
}
