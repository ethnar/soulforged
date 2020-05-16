Vue.component("modal", {
  props: {
    closeable: {
      type: Boolean,
      default: true
    }
  },

  data: () => ({
    headerSideStyle: ""
  }),

  mounted() {
    document.body.appendChild(this.$el);
  },

  destroyed() {
    if (document.body.contains(this.$el)) {
      document.body.removeChild(this.$el);
    }
  },

  template: `
<div class="modal">
    <div class="contents">
        <div v-if="closeable" class="close" @click="$emit('close')"></div>
        <div class="title" ref="title">
            <div class="title-contents">
                <slot name="header"></slot>
            </div>
        </div>
        <div class="main">
            <slot name="main"></slot>
        </div>
    </div>
    <div class="backdrop" @click="$emit('close')"></div>
</div>
    `
});
