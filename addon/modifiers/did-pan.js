import Modifier from 'ember-modifier';
import {
  parseInitialTouchData,
  parseTouchData,
  isHorizontal,
  isVertical,
} from '../utils/parse-touch-data';
import { action } from '@ember/object';

const _fn = () => {};

export default class DidPanModifier extends Modifier {
  threshold;
  axis;
  capture;
  preventScroll;
  pointerTypes;
  currentTouches = new Map();
  dragging = false;

  addEventListeners() {
    // By default, CSS rule `touch-action` is `auto`, enabling panning on both directions.
    // We override panning on a given direction, so we need to disable default browser behavior
    // on that diretion, but we need to keep the other direction pannable.
    // Thus, we set `touch-action` to `pan-y` when we pan horizontally and vice versa.
    if (this.axis === 'horizontal') {
      this.element.style.touchAction = 'pan-y';
    } else if (this.axis === 'vertical') {
      this.element.style.touchAction = 'pan-x';
    } else if (this.axis === 'both') {
      this.element.style.touchAction = 'none';
    }

    this.element.addEventListener('pointerdown', this.didTouchStart, {
      capture: this.capture,
      passive: true,
    });
    document.addEventListener('pointermove', this.documentPointerMove, {
      capture: this.capture,
      passive: !this.preventScroll,
    });
    document.addEventListener('pointercancel', this.documentPointerUp, {
      capture: this.capture,
      passive: true,
    });
    document.addEventListener('pointerup', this.documentPointerUp, {
      capture: this.capture,
      passive: true,
    });
  }

  removeEventListeners() {
    this.element.style.touchAction = null;

    this.element.removeEventListener('pointerdown', this.didTouchStart, {
      capture: this.capture,
      passive: true,
    });
    document.removeEventListener('pointermove', this.documentPointerMove, {
      capture: this.capture,
      passive: !this.preventScroll,
    });
    document.removeEventListener('pointercancel', this.documentPointerUp, {
      capture: this.capture,
      passive: true,
    });
    document.removeEventListener('pointerup', this.documentPointerUp, {
      capture: this.capture,
      passive: true,
    });
  }

  @action
  didTouchStart(e) {
    if (!this.dragging && this.pointerTypes.includes(e.pointerType)) {
      const touchData = parseInitialTouchData(e);
      this.currentTouches.set(e.pointerId, touchData);

      this.dragging = true;
    }
  }

  @action
  documentPointerMove(e) {
    if (this.dragging && this.pointerTypes.includes(e.pointerType)) {
      this.handlePointerMove(e);
    }
  }

  @action
  documentPointerUp(e) {
    if (this.dragging && this.pointerTypes.includes(e.pointerType)) {
      this.handlePointerEnd(e);
    }
  }

  @action
  handlePointerMove(e) {
    if (this.dragging && this.currentTouches.has(e.pointerId)) {
      const previousTouchData = this.currentTouches.get(e.pointerId);
      const touchData = parseTouchData(previousTouchData, e);

      if (touchData.panStarted) {
        // prevent scroll if a pan is still busy
        if (this.preventScroll) {
          e.preventDefault();
        }

        this.didPan(touchData.data);
      } else {
        // only pan when the threshold for the given axis is achieved
        if (
          !touchData.panDenied &&
          ((this.axis === 'horizontal' &&
            Math.abs(touchData.data.current.distanceX) > this.threshold) ||
            (this.axis === 'vertical' &&
              Math.abs(touchData.data.current.distanceY) > this.threshold) ||
            (this.axis === 'both' &&
              Math.abs(touchData.data.current.distance) > this.threshold))
        ) {
          // test if axis matches with data else deny the pan
          if (
            (this.axis === 'horizontal' && isHorizontal(touchData)) ||
            (this.axis === 'vertical' && isVertical(touchData)) ||
            this.axis === 'both'
          ) {
            // prevent scroll if a pan is detected
            if (this.preventScroll) {
              e.preventDefault();
            }

            touchData.panStarted = true;

            // trigger panStart hook
            this.didPanStart(touchData.data);
          } else {
            touchData.panDenied = true;
          }
        }
      }

      this.currentTouches.set(e.pointerId, touchData);
    }
  }

  @action
  handlePointerEnd(e) {
    if (this.dragging && this.currentTouches.has(e.pointerId)) {
      this.dragging = false;

      const previousTouchData = this.currentTouches.get(e.pointerId);
      const touchData = parseTouchData(previousTouchData, e);

      if (touchData.panStarted) {
        this.didPanEnd(touchData.data);
      }

      this.currentTouches.delete(e.pointerId);
    }
  }

  didReceiveArguments() {
    this.removeEventListeners();

    this.threshold = this.args.named.threshold ?? 10;
    this.axis = this.args.named.axis ?? 'horizontal';
    this.capture = this.args.named.capture ?? false;
    this.preventScroll = this.args.named.preventScroll ?? true;
    this.pointerTypes = this.args.named.pointerTypes ?? ['touch'];

    this.didPanStart = this.args.named.onPanStart ?? _fn;
    this.didPan = this.args.named.onPan ?? _fn;
    this.didPanEnd = this.args.named.onPanEnd ?? _fn;

    this.addEventListeners();
  }

  willRemove() {
    this.removeEventListeners();
    this.currentTouches.clear();
  }
}
