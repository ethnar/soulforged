Vue.component("help-icon", {
  props: ["title"],

  data: () => ({
    open: false
  }),

  watch: {
    open(value) {
      if (value) {
        this.$emit("show");
      } else {
        this.$emit("hide");
      }
    }
  },

  template: `
<div class="help-icon">
    <div class="icon" @click="open = true">
        ?
    </div>
    <modal @close="open = false" v-if="open">
        <div slot="header">
            {{title || 'Loading...'}}
        </div>
        <div slot="main" class="help-text">
            <slot></slot>
        </div>
    </modal>
</div>
    `
});
