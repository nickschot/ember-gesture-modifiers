import { settled, getRootElement } from '@ember/test-helpers';
import createPointerEvent from './create-pointer-event';

function timeout(duration) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), duration);
  });
}

function nextTickPromise() {
  return new Promise((resolve) => {
    setTimeout(resolve);
  });
}

function getElement(target) {
  if (
    target.nodeType === Node.ELEMENT_NODE ||
    target.nodeType === Node.DOCUMENT_NODE ||
    target instanceof Window
  ) {
    return target;
  } else if (typeof target === 'string') {
    let rootElement = getRootElement();

    return rootElement.querySelector(target);
  } else {
    throw new Error('Must use an element or a selector string');
  }
}

function sendEvent(element, type, x, y, pointerType) {
  const event = createPointerEvent(element, type, x, y, 0, pointerType);
  element.dispatchEvent(event);
}

async function _pan(element, options = {}) {
  const { top, left, width, height } = element.getBoundingClientRect();

  const {
    direction = 'right',
    duration = 300,
    resolution = 17, // ms per step
    pointerType,
  } = options;

  const right = left + width;
  const bottom = top + height;

  const middleX = left + width / 2;
  const middleY = top + height / 2;

  const {
    startX = direction === 'left'
      ? right - 1
      : direction === 'right' || direction === 'up-right'
      ? left + 1
      : middleX,
    endX = direction === 'left'
      ? left + 1
      : direction === 'right' || direction === 'up-right'
      ? right - 1
      : middleX,
    startY = direction === 'up' || direction === 'up-right'
      ? bottom - 1
      : direction === 'down'
      ? top + 1
      : middleY,
    endY = direction === 'up' || direction === 'up-right'
      ? top + 1
      : direction === 'down'
      ? bottom - 1
      : middleY,
  } = options;

  const steps = Math.ceil(duration / resolution);

  sendEvent(document, 'pointerdown', startX, startY, pointerType);
  sendEvent(element, 'pointerdown', startX, startY, pointerType);
  for (let i = 1; i < steps; i++) {
    await timeout(resolution);
    const x =
      direction === 'left'
        ? startX - ((startX - endX) / steps) * i
        : direction === 'right' || direction === 'up-right'
        ? startX + ((endX - startX) / steps) * i
        : middleX;
    const y =
      direction === 'up' || direction === 'up-right'
        ? startY - ((startY - endY) / steps) * i
        : direction === 'down'
        ? startY + ((endY - startY) / steps) * i
        : middleY;

    sendEvent(document, 'pointermove', x, y, pointerType);
    sendEvent(element, 'pointermove', x, y, pointerType);
  }
  sendEvent(document, 'pointerup', endX, endY, pointerType);
  sendEvent(element, 'pointerup', endX, endY, pointerType);
}

export default async function pan(target, direction, pointerType) {
  await nextTickPromise();

  if (!target) {
    throw new Error('Must pass an element or selector to `pan`.');
  }

  let element = getElement(target);
  if (!element) {
    throw new Error(`Element not found when calling \`pan('${target}')\`.`);
  }

  await _pan(element, { direction, pointerType });

  return settled();
}
