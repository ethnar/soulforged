export default Vue.component("radial-progress", {
  props: {
    percentage: Number,
    size: {
      type: Number,
      default: 50
    },
    color: {
      type: String,
      default: "lightgray"
    },
    pieces: {
      type: Number,
      default: 5
    }
  },

  computed: {
    firstRotation() {
      return (Math.min(this.percentage, 50) / 50) * 180 - 90 + 45;
    },

    secondRotation() {
      return ((this.percentage - 50) / 50) * 180 + 90 + 45;
    }
  },

  template: `
<div class="radial-progress" :style="{width: size + 'px', height: size + 'px' }" @click="$emit('click', $event)">
    <div class="radial-progress-wrapper" :style="{ 'transform': 'scale(' + (size / 100) + ')' }">
        <div class="half first-background"></div>
        <div class="half first" :style="{ 'transform': 'rotate(' + firstRotation + 'deg)', 'border-top-color': color, 'border-left-color': color }"></div>
        <div class="half second" :style="{ 'transform': 'rotate(' + secondRotation + 'deg)', 'border-top-color': color, 'border-left-color': color }" v-if="percentage > 50"></div>
        <div class="half second-overlay"></div>
        <div class="mid-cover"></div>
        <div class="shadow"></div>
    </div>
</div>
`
});
