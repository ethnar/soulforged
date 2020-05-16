import { DataService } from "../../services/data.js";

Vue.component("number-selector", {
  props: {
    value: 0,
    inline: false,
    min: {
      type: Number,
      default: -100
    },
    max: {
      type: Number,
      default: 9999
    },
    choices: {
      type: Array,
      default: () => []
    }
  },

  data: () => ({
    inputValue: Number
  }),

  subscriptions() {
    return {
      tutorialArea: DataService.getIsTutorialAreaStream()
    };
  },

  watch: {
    value: {
      handler() {
        this.inputValue = this.limit(this.value);
        if (this.inputValue !== this.value) {
          this.$emit("input", this.inputValue);
        }
      },
      immediate: true
    }
  },

  methods: {
    limit(value, failSafe) {
      if (value !== value) {
        value = failSafe;
      }
      return Math.min(this.max, Math.max(this.min, value));
    },

    change(by) {
      this.$emit("input", this.limit(this.value + by, by));
    },

    set(to) {
      this.$emit("input", this.limit(to));
    },

    canChange(by) {
      return this.limit(this.value + by, by) !== this.value;
    },

    clickedInput() {
      try {
        this.$refs.numberInput.select();
      } catch (e) {}
    }
  },

  template: `
<div class="number-selector" :class="{ inline: inline }">
    <div class="number">
        <input ref="numberInput" type="number" v-model="inputValue" @input="$emit('input', limit(inputValue));" @click="clickedInput();">
        <div class="buttons">
            <a class="button" @click="change(-1)" :disabled="!canChange(-1)">&lt;</a>
            <a class="button" @click="change(1)" :disabled="!canChange(1)">&gt;</a>
        </div>
    </div>
    <div class="choices" v-if="choices.length && !tutorialArea">
        <div class="help-text">Quick selection:</div>
        <div class="quick-selection-buttons">
            <a class="button" v-for="number in choices" @click="set(number)">{{number}}</a>        
        </div>
    </div>
</div>
    `
});
