import Modifier from 'ember-modifier';
import { parseInitialTouchData, parseTouchData, isHorizontal, isVertical } from '../utils/parse-touch-data.js';
import { action } from '@ember/object';
import { registerDestructor } from '@ember/destroyable';

function _applyDecoratedDescriptor(i, e, r, n, l) {
  var a = {};
  return Object.keys(n).forEach(function (i) {
    a[i] = n[i];
  }), a.enumerable = !!a.enumerable, a.configurable = !!a.configurable, ("value" in a || a.initializer) && (a.writable = !0), a = r.slice().reverse().reduce(function (r, n) {
    return n(i, e, r) || r;
  }, a), l && void 0 !== a.initializer && (a.value = a.initializer ? a.initializer.call(l) : void 0, a.initializer = void 0), void 0 === a.initializer ? (Object.defineProperty(i, e, a), null) : a;
}
function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[r] = t, e;
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}

var _class;
const _fn = () => {};
function cleanup(instance) {
  instance.removeEventListeners();
  instance.currentTouches.clear();
  instance.element = undefined;
}
let DidPanModifier = (_class = class DidPanModifier extends Modifier {
  constructor(owner, args) {
    super(owner, args);
    _defineProperty(this, "element", void 0);
    _defineProperty(this, "threshold", void 0);
    _defineProperty(this, "axis", void 0);
    _defineProperty(this, "capture", void 0);
    _defineProperty(this, "preventScroll", void 0);
    _defineProperty(this, "pointerTypes", void 0);
    _defineProperty(this, "currentTouches", new Map());
    _defineProperty(this, "dragging", false);
    registerDestructor(this, cleanup);
  }
  modify(element, positional, named) {
    this.removeEventListeners();
    this.element = element;
    this.threshold = named.threshold ?? 10;
    this.axis = named.axis ?? 'horizontal';
    this.capture = named.capture ?? false;
    this.preventScroll = named.preventScroll ?? true;
    this.pointerTypes = named.pointerTypes ?? ['touch'];
    this.didPanStart = named.onPanStart ?? _fn;
    this.didPan = named.onPan ?? _fn;
    this.didPanEnd = named.onPanEnd ?? _fn;
    this.addEventListeners();
  }
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
      passive: true
    });
    document.addEventListener('pointermove', this.documentPointerMove, {
      capture: this.capture,
      passive: !this.preventScroll
    });
    document.addEventListener('pointercancel', this.documentPointerUp, {
      capture: this.capture,
      passive: true
    });
    document.addEventListener('pointerup', this.documentPointerUp, {
      capture: this.capture,
      passive: true
    });
  }
  removeEventListeners() {
    if (this.element) {
      this.element.style.touchAction = null;
      this.element.removeEventListener('pointerdown', this.didTouchStart, {
        capture: this.capture,
        passive: true
      });
    }
    document.removeEventListener('pointermove', this.documentPointerMove, {
      capture: this.capture,
      passive: !this.preventScroll
    });
    document.removeEventListener('pointercancel', this.documentPointerUp, {
      capture: this.capture,
      passive: true
    });
    document.removeEventListener('pointerup', this.documentPointerUp, {
      capture: this.capture,
      passive: true
    });
  }
  didTouchStart(e) {
    if (!this.dragging && this.pointerTypes.includes(e.pointerType)) {
      const touchData = parseInitialTouchData(e);
      this.currentTouches.set(e.pointerId, touchData);
      this.dragging = true;
    }
  }
  documentPointerMove(e) {
    if (this.dragging && this.pointerTypes.includes(e.pointerType)) {
      this.handlePointerMove(e);
    }
  }
  documentPointerUp(e) {
    if (this.dragging && this.pointerTypes.includes(e.pointerType)) {
      this.handlePointerEnd(e);
    }
  }
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
        if (!touchData.panDenied && (this.axis === 'horizontal' && Math.abs(touchData.data.current.distanceX) > this.threshold || this.axis === 'vertical' && Math.abs(touchData.data.current.distanceY) > this.threshold || this.axis === 'both' && Math.abs(touchData.data.current.distance) > this.threshold)) {
          // test if axis matches with data else deny the pan
          if (this.axis === 'horizontal' && isHorizontal(touchData) || this.axis === 'vertical' && isVertical(touchData) || this.axis === 'both') {
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
}, (_applyDecoratedDescriptor(_class.prototype, "didTouchStart", [action], Object.getOwnPropertyDescriptor(_class.prototype, "didTouchStart"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "documentPointerMove", [action], Object.getOwnPropertyDescriptor(_class.prototype, "documentPointerMove"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "documentPointerUp", [action], Object.getOwnPropertyDescriptor(_class.prototype, "documentPointerUp"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "handlePointerMove", [action], Object.getOwnPropertyDescriptor(_class.prototype, "handlePointerMove"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "handlePointerEnd", [action], Object.getOwnPropertyDescriptor(_class.prototype, "handlePointerEnd"), _class.prototype)), _class);

export { DidPanModifier as default };
//# sourceMappingURL=did-pan.js.map
