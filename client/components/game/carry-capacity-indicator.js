import { Utils } from "../generic/utils.js";

Vue.component("carry-capacity-indicator", {
  props: {
    current: Number,
    thresholds: Object,
    max: Number
  },

  computed: {
    burdenLevel() {
      if (!this.thresholds) {
        return null;
      }
      return +Object.keys(this.thresholds).find(
        key => this.currentMined <= this.thresholds[key]
      );
    },

    actualMax() {
      return this.thresholds ? this.thresholds[2] : this.max;
    },

    fillStyle() {
      const width = (this.currentMined / this.actualMax) * 100;
      return {
        width: `${width}%`
      };
    },

    fillCutStyle() {
      const width = 100 / (this.currentMined / this.actualMax);
      return {
        width: `${width}%`
      };
    },

    currentMined() {
      return Math.max(0, this.current);
    },

    currentText() {
      return Utils.decimalTwo(this.currentMined, Math.ceil);
    },

    maxText() {
      return Utils.decimalTwo(this.actualMax);
    },

    displayText() {
      return `${Utils.decimalTwo(this.currentMined)} / ${Utils.decimalTwo(
        this.actualMax
      )}`;
    },

    overburdened() {
      return this.currentMined > this.actualMax;
    },

    burdenLevelClass() {
      return this.burdenLevel !== undefined
        ? `burden-${this.burdenLevel}`
        : undefined;
    }
  },

  template: `
<div class="carry-capacity">
    <div class="bar" :class="[{ overburdened: overburdened }, burdenLevelClass]">
        <div class="display under"><decimal-secondary :value="currentText" /> / <decimal-secondary :value="maxText" /></div>
        <div class="fill-cut" :style="fillStyle">
            <div class="fill" :style="fillCutStyle">
                <div class="display over"><decimal-secondary :value="currentText" /> / <decimal-secondary :value="maxText" /></div>
            </div>
        </div>
    </div>
</div>
    `
});
