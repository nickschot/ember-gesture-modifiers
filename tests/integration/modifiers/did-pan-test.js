import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { pan } from 'ember-gesture-modifiers/test-support';

module('Integration | Modifier | did-pan', function (hooks) {
  setupRenderingTest(hooks);

  for (const [pointerType, expectedPanCount] of Object.entries({
    mouse: 19,
    touch: 19,
    pen: 19,
  })) {
    test(`it fires the passed hooks when panning with a pointer of type "${pointerType}"`, async function (assert) {
      let startCount = 0;
      let panCount = 0;
      let endCount = 0;

      this.handlePanStart = () => {
        startCount++;
      };
      this.handlePan = () => {
        panCount++;
      };
      this.handlePanEnd = () => {
        endCount++;
      };

      if (pointerType !== 'touch') {
        this.pointerTypes = [pointerType];
      }

      await render(
        hbs`<div class="did-pan" {{did-pan onPanStart=this.handlePanStart onPan=this.handlePan onPanEnd=this.handlePanEnd pointerTypes=this.pointerTypes}} style="width: 50px; height: 10px; background: red;"></div>`
      );
      await pan('.did-pan', 'right', pointerType);

      assert.equal(startCount, 1, 'onPanStart should have been called 1 time');
      assert.equal(
        panCount,
        expectedPanCount,
        `onPan should have been called ${expectedPanCount} times`
      );
      assert.equal(endCount, 1, 'onPanEnd should have been called 1 time');
    });
  }

  test(`it fires the passed hooks when the custom threshold is met`, async function (assert) {
    assert.expect(2);

    let didStart = false;

    this.threshold = 30;
    this.handlePanStart = (e) => {
      assert.true(
        e.current.distanceX > this.threshold,
        `distanceX (${e.current.distanceX}) should be bigger than threshold (${this.threshold})`
      );
      didStart = true;
    };

    await render(
      hbs`<div class="did-pan" {{did-pan onPanStart=this.handlePanStart threshold=this.threshold}} style="width: 100px; height: 10px; background: red"></div>`
    );
    await pan('.did-pan', 'right');

    assert.true(didStart, 'onPanStart should have been called');
  });

  test(`it does not fire the passed hooks when the threshold isn't met`, async function (assert) {
    assert.expect(1);

    let didStart = false;

    this.handlePanStart = () => {
      didStart = true;
    };

    this.set('threshold', 47);

    await render(
      hbs`<div class="did-pan" {{did-pan onPanStart=this.handlePanStart threshold=this.threshold}} style="width: 50px; height: 10px; background: red"></div>`
    );
    await pan('.did-pan', 'right');

    assert.false(didStart, 'onPanStart should not have been called');
  });

  test(`it sets the correct touch-action for the passed axis`, async function (assert) {
    await render(
      hbs`<div data-test-div class="did-pan" {{did-pan axis=this.axis}} style="width: 50px; height: 10px; background: red"></div>`
    );

    assert.dom('[data-test-div]').hasStyle({
      'touch-action': 'pan-y',
    });

    this.set('axis', 'vertical');
    assert.dom('[data-test-div]').hasStyle({
      'touch-action': 'pan-x',
    });

    this.set('axis', 'horizontal');
    assert.dom('[data-test-div]').hasStyle({
      'touch-action': 'pan-y',
    });

    this.set('axis', 'both');
    assert.dom('[data-test-div]').hasStyle({
      'touch-action': 'none',
    });
  });

  module('event bubbling & capture', function () {
    test(`it works with bubble events`, async function (assert) {
      this.handlePanStart = (step) => {
        assert.step(step);
      };

      await render(
        hbs`
        <div {{did-pan onPanStart=(fn this.handlePanStart "A")}}>
          <div {{did-pan onPanStart=(fn this.handlePanStart "B")}}>
            <div class="did-pan" style="width: 50px; height: 10px; background: red"></div>
          </div>
        </div>
      `
      );
      await pan('.did-pan', 'right', 'touch');

      assert.verifySteps(['B', 'A']);
    });

    test(`it works with capture events`, async function (assert) {
      this.handlePanStart = (step) => {
        assert.step(step);
      };

      await render(
        hbs`
        <div {{did-pan capture=true onPanStart=(fn this.handlePanStart "A")}}>
          <div {{did-pan capture=false onPanStart=(fn this.handlePanStart "B")}}>
            <div class="did-pan" style="width: 50px; height: 10px; background: red"></div>
          </div>
        </div>
      `
      );
      await pan('.did-pan', 'right', 'touch');

      assert.verifySteps(['A', 'B']);
    });
  });

  module('vertical pan', function () {
    test(`it works on the vertical axis`, async function (assert) {
      let startCount = 0;
      let panCount = 0;
      let endCount = 0;

      this.handlePanStart = () => {
        startCount++;
      };
      this.handlePan = () => {
        panCount++;
      };
      this.handlePanEnd = () => {
        endCount++;
      };

      await render(
        hbs`<div class="did-pan" {{did-pan onPanStart=this.handlePanStart onPan=this.handlePan onPanEnd=this.handlePanEnd axis="vertical"}} style="width: 10px; height: 50px; background: red;"></div>`
      );
      await pan('.did-pan', 'down', 'touch');

      assert.equal(startCount, 1, 'onPanStart should have been called 1 time');
      assert.equal(panCount, 19, `onPan should have been called 19 times`);
      assert.equal(endCount, 1, 'onPanEnd should have been called 1 time');
    });

    test(`it does not react to a horizontal pan`, async function (assert) {
      let startCount = 0;
      let panCount = 0;
      let endCount = 0;

      this.handlePanStart = () => {
        startCount++;
      };
      this.handlePan = () => {
        panCount++;
      };
      this.handlePanEnd = () => {
        endCount++;
      };

      await render(
        hbs`<div class="did-pan" {{did-pan onPanStart=this.handlePanStart onPan=this.handlePan onPanEnd=this.handlePanEnd axis="vertical"}} style="width: 10px; height: 50px; background: red;"></div>`
      );
      await pan('.did-pan', 'right', 'touch');

      assert.equal(startCount, 0, 'onPanStart should have been called 0 times');
      assert.equal(panCount, 0, `onPan should have been called 0 times`);
      assert.equal(endCount, 0, 'onPanEnd should have been called 0 times');
    });
  });

  module('bi-directional pan', function () {
    test('it works when panning bi-directionally', async function (assert) {
      let startCount = 0;
      let panCount = 0;
      let endCount = 0;

      this.handlePanStart = () => {
        startCount++;
      };
      this.handlePan = () => {
        panCount++;
      };
      this.handlePanEnd = () => {
        endCount++;
      };

      await render(
        hbs`<div class="did-pan" {{did-pan onPanStart=this.handlePanStart onPan=this.handlePan onPanEnd=this.handlePanEnd axis="both"}} style="width: 50px; height: 50px; background: red;"></div>`
      );
      await pan('.did-pan', 'up-right', 'touch');

      assert.equal(startCount, 1, 'onPanStart should have been called 1 time');
      assert.equal(panCount, 23, `onPan should have been called 23 times`);
      assert.equal(endCount, 1, 'onPanEnd should have been called 1 time');
    });
  });
});
