/**
 * Generate initial touch data for passed Touch
 *
 * @function parseInitialTouchData
 * @param {Touch} touch A Touch instance
 * @param {TouchEvent} e The touch{start,move,end} event
 * @return {Object} Returns a TouchData object
 * @private
 */
export function parseInitialTouchData(e) {
  return {
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
  };
}

/**
 * Generates useful touch data from current event based on previously generated data
 *
 * @function parseTouchData
 * @param {Object} previousTouchData Previous data returned by this or the parseInitialTouchData function
 * @param {Touch} touch A Touch instance
 * @param {TouchEvent} e The touch{start,move,end} event
 * @return {Object} The new touch data
 * @private
 */
export function parseTouchData(previousTouchData, e) {
  const touchData = JSON.parse(JSON.stringify(previousTouchData));
  const data = touchData.data;

  if (data.current) {
    data.current.deltaX = e.clientX - data.current.x;
    data.current.deltaY = e.clientY - data.current.y;
  } else {
    data.current = {};
    data.current.deltaX = e.clientX - data.initial.x;
    data.current.deltaY = e.clientY - data.initial.y;
  }

  data.current.x = e.clientX;
  data.current.y = e.clientY;
  data.current.distance = getPointDistance(
    data.initial.x,
    e.clientX,
    data.initial.y,
    e.clientY
  );
  data.current.distanceX = e.clientX - data.initial.x;
  data.current.distanceY = e.clientY - data.initial.y;
  data.current.angle = getAngle(
    data.initial.x,
    data.initial.y,
    e.clientX,
    e.clientY
  );

  // overallVelocity can be calculated continuously
  const overallDeltaTime = e.timeStamp - data.initial.timeStamp;
  data.current.overallVelocityX =
    data.current.distanceX / overallDeltaTime || 0;
  data.current.overallVelocityY =
    data.current.distanceY / overallDeltaTime || 0;
  data.current.overallVelocity =
    Math.abs(data.current.overallVelocityX) >
    Math.abs(data.current.overallVelocityY)
      ? data.current.overallVelocityX
      : data.current.overallVelocityY;

  // we don't update the velocity on the final touchend event as nothing but the timestamp has changed
  // which always results in a velocity of 0
  if (e.type !== 'touchend') {
    const deltaTime = e.timeStamp - data.cache.velocity.timeStamp;

    data.current.velocityX =
      (data.current.distanceX - data.cache.velocity.distanceX) / deltaTime || 0;
    data.current.velocityY =
      (data.current.distanceY - data.cache.velocity.distanceY) / deltaTime || 0;
    data.current.velocity =
      Math.abs(data.current.velocityX) > Math.abs(data.current.velocityY)
        ? data.current.velocityX
        : data.current.velocityY;

    data.cache.velocity = {
      distanceX: data.current.distanceX,
      distanceY: data.current.distanceY,
      timeStamp: e.timeStamp,
    };
  }

  data.originalEvent = e;
  data.timeStamp = e.timeStamp;

  touchData.data = data;

  return touchData;
}

/**
 * Calculates whether or not the movement went left or right
 *
 * @function isHorizontal
 * @param {TouchData} touchData A POJO as returned from `parseInitialTouchData` or `parseTouchData`
 * @return {boolean} True if horizontal
 * @private
 */
export function isHorizontal(touchData) {
  const direction = getDirection(
    touchData.data.current.distanceX,
    touchData.data.current.distanceY
  );
  return direction === 'left' || direction === 'right';
}

/**
 * Calculates whether or not the movement went up or down
 *
 * @function isVertical
 * @param {TouchData} touchData A POJO as returned from `parseInitialTouchData` or `parseTouchData`
 * @return {boolean} true if vertical
 * @private
 */
export function isVertical(touchData) {
  const direction = getDirection(
    touchData.data.current.distanceX,
    touchData.data.current.distanceY
  );
  return direction === 'down' || direction === 'up';
}

/**
 * Calculates the direction of the touch movement
 *
 * @function getDirection
 * @param {Number} x The distance moved from the origin on the X axis
 * @param {Number} y The the distance moved from the origin on the Y axis
 * @return {string} The direction of the pan event. One of 'left', 'right', 'up', 'down'.
 * @private
 */
function getDirection(x, y) {
  if (x === y) {
    return 'none';
  } else if (Math.abs(x) >= Math.abs(y)) {
    return x < 0 ? 'left' : 'right';
  } else {
    return y < 0 ? 'down' : 'up';
  }
}

/**
 * Calculates the distance between two points
 *
 * @function getPointDistance
 * @param {number} x0 X coordinate of the origin
 * @param {number} x1 X coordinate of the current position
 * @param {number} y0 Y coordinate of the origin
 * @param {number} y1 Y coordinate of the current position
 * @return {number} Distance between the two points
 * @private
 */
function getPointDistance(x0, x1, y0, y1) {
  return Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0));
}

/**
 * Calculates the angle between two points.
 *
 * @function getAngle
 * @param {number} originX
 * @param {number} originY
 * @param {number} projectionX
 * @param {number} projectionY
 * @return {number} Angle between the two points
 * @private
 */
function getAngle(originX, originY, projectionX, projectionY) {
  const angle =
    Math.atan2(projectionY - originY, projectionX - originX) * (180 / Math.PI);
  return 360 - (angle < 0 ? 360 + angle : angle);
}
