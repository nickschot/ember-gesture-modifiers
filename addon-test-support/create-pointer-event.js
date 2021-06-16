import { assert } from '@ember/debug';

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
export default function createPointerEvent(
  target,
  eventType,
  x,
  y,
  identifier = 0,
  pointerType = 'touch'
) {
  assert(
    'Argument "pointerType" must be one of "touch", "mouse" or "pen".',
    ['touch', 'mouse', 'pen'].includes(pointerType)
  );

  return new PointerEvent(eventType, {
    bubbles: true,
    cancelable: true,
    identifier: identifier || 0,
    target,
    clientX: x,
    clientY: y,
    pointerType: [pointerType],
  });
}
