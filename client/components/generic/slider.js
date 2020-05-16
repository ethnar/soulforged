Vue.component("slider", {
  props: {
    min: {
      default: 0
    },
    max: {
      default: 100
    },
    value: {
      type: Number
    },
    step: {
      type: Number,
      default: -1
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    leftPosition() {
      return ((this.value - this.min) / (this.max - this.min)) * 100;
    },

    handleStyle() {
      return {
        left: `${this.leftPosition}%`
      };
    }
  },

  methods: {
    setValueBaseOnPosition(position) {
      if (position === null) {
        return;
      }
      position = position / this.$refs.background.clientWidth;
      position = Math.max(0, Math.min(1, position));
      if (this.step !== -1) {
        const stepsCount = (this.max - this.min) / this.step;
        position = Math.round(position * stepsCount) / stepsCount;
      }
      const value = position * (this.max - this.min) + this.min;
      if (this.old === value) {
        return;
      }
      this.old = value;
      this.$emit("input", value);
    },

    getOffsetX(event) {
      const left = this.$refs.background.getBoundingClientRect().left;
      if (event.clientX) {
        return event.clientX - left;
      }
      if (event.targetTouches && event.targetTouches.length === 1) {
        return event.targetTouches[0].clientX - left;
      }
      return null;
    },

    draggingBackground(event) {
      this.setValueBaseOnPosition(this.getOffsetX(event));
      this.startDragging(event);
    },

    startDragging(event) {
      const mouseMoveHandler = moveEvent => {
        this.setValueBaseOnPosition(this.getOffsetX(moveEvent));
      };
      const mouseUpHandler = () => {
        window.removeEventListener("mouseup", mouseUpHandler);
        window.removeEventListener("touchend", mouseUpHandler);
        window.removeEventListener("mousemove", mouseMoveHandler);
        window.removeEventListener("touchmove", mouseMoveHandler);
      };
      window.addEventListener("mouseup", mouseUpHandler);
      window.addEventListener("touchend", mouseUpHandler);
      window.addEventListener("mousemove", mouseMoveHandler);
      window.addEventListener("touchmove", mouseMoveHandler);
    }
  },

  template: `
<div class="slider" :class="{ disabled: disabled }">
    <div class="background" ref="background" @mousedown="draggingBackground($event)" @touchstart="draggingBackground($event)"></div>
    <div class="handle-container">
        <div class="handle" :style="handleStyle" @mousedown="startDragging($event)" @touchstart="startDragging($event)"></div>    
    </div>
</div>
`
});
