import Modifier from 'ember-modifier';
import { parseInitialTouchData, parseTouchData, isHorizontal, isVertical } from '../utils/parse-touch-data';
import { action } from '@ember/object';

const _fn = () => {};

export default class DidPanModifier extends Modifier {
  threshold;
  axis;
  capture;
  preventScroll;
  currentTouches = new Map();

  addEventListeners() {
    // if an axis is set, limit scroll to a single axis
    if(this.axis === 'horizontal'){
      this.element.style.touchAction = 'pan-y';
    } else if(this.axis === 'vertical') {
      this.element.style.touchAction = 'pan-x';
    }

    this.element.addEventListener('touchstart', this.didTouchStart, { capture: this.useCapture, passive: true });
    this.element.addEventListener('touchmove', this.didTouchMove, { capture: this.useCapture, passive: !this.preventScroll });
    this.element.addEventListener('touchend', this.didTouchEnd, { capture: this.useCapture, passive: true });
    this.element.addEventListener('touchcancel', this.didTouchEnd, { capture: this.useCapture, passive: true });
  }

  removeEventListeners() {
    this.element.style.touchAction = null;

    this.element.removeEventListener('touchstart', this.didTouchStart, { capture: this.useCapture, passive: true });
    this.element.removeEventListener('touchmove', this.didTouchMove, { capture: this.useCapture, passive: !this.preventScroll });
    this.element.removeEventListener('touchend', this.didTouchEnd, { capture: this.useCapture, passive: true });
    this.element.removeEventListener('touchcancel', this.didTouchEnd, { capture: this.useCapture, passive: true });
  }

  @action
  didTouchStart(e){
    for(const touch of e.changedTouches){
      const touchData = parseInitialTouchData(touch, e);

      this.currentTouches.set(touch.identifier, touchData);
    }
  }

  @action
  didTouchMove(e){
    for(const touch of e.changedTouches){
      const previousTouchData = this.currentTouches.get(touch.identifier);
      const touchData = parseTouchData(previousTouchData, touch, e);

      if(touchData.panStarted){
        // prevent scroll if a pan is still busy
        if(this.preventScroll){
          e.preventDefault();
        }

        this.didPan(touchData.data);
      } else {
        // only pan when the threshold for the given axis is achieved
        if(
          !touchData.panDenied
          && (
            (this.axis === 'horizontal' && Math.abs(touchData.data.current.distanceX) > this.threshold)
            || (this.axis === 'vertical' && Math.abs(touchData.data.current.distanceY) > this.threshold)
          )
        ){
          // test if axis matches with data else deny the pan
          if(  (this.axis === 'horizontal' && isHorizontal(touchData))
            || (this.axis === 'vertical' && isVertical(touchData))
          ){
            // prevent scroll if a pan is detected
            if(this.preventScroll){
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

      this.currentTouches.set(touch.identifier, touchData);
    }
  }

  @action
  didTouchEnd(e){
    for(const touch of e.changedTouches){
      const previousTouchData = this.currentTouches.get(touch.identifier);
      const touchData = parseTouchData(previousTouchData, touch, e);

      if(touchData.panStarted){
        this.didPanEnd(touchData.data);
      }

      this.currentTouches.delete(touch.identifier);
    }
  }

  didReceiveArguments() {
    this.threshold = this.args.named.threshold ?? 10;
    this.axis = this.args.named.axis ?? 'horizontal';
    this.capture = this.args.named.capture ?? false;
    this.preventScroll = this.args.named.preventScroll ?? true;

    this.didPanStart = this.args.named.onPanStart ?? _fn;
    this.didPan = this.args.named.onPan ?? _fn;
    this.didPanEnd = this.args.named.onPanEnd ?? _fn;

    this.removeEventListeners();
    this.addEventListeners();
  }

  willRemove() {
    this.removeEventListeners();
    this.currentTouches.clear();
  }
}
