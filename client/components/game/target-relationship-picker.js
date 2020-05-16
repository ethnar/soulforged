Vue.component("target-relationship-picker", {
  props: {
    value: {
      default: "everyone"
    }
  },

  methods: {
    selectTargets(targets) {
      this.$emit("input", targets);
    }
  },

  template: `
<div class="target-relationship-picker">
    <div class="item everyone" :class="{ active: value === 'everyone' }">
        <div class="button action icon text" @click.prevent="selectTargets('everyone');">
            <span class="icon-wrapper rival"><span class="multicolor-icon"></span></span>
            <span class="icon-wrapper neutral"><span class="multicolor-icon"></span></span>
            <span class="icon-wrapper friend"><span class="multicolor-icon"></span></span>
        </div>
        <div class="text">Everyone</div>
    </div>
    <div class="item no-rivals" :class="{ active: value === 'no-rivals' }">
        <div class="button action icon text" @click.prevent="selectTargets('no-rivals');">
            <span class="icon-wrapper neutral"><span class="multicolor-icon"></span></span>
            <span class="icon-wrapper friend"><span class="multicolor-icon"></span></span>
        </div>
        <div class="text">No rivals</div>
    </div>
    <div class="item friend" :class="{ active: value === 'friends' }">
        <div class="button action icon text" @click.prevent="selectTargets('friends');">
            <span class="icon-wrapper friend"><span class="multicolor-icon"></span></span>
        </div>
        <div class="text">Friends</div>
    </div>
</div>
    `
});
