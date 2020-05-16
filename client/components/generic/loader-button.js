Vue.component("loader-button", {
  props: ["promise"],

  data: () => ({
    promiseUnresolved: false
  }),

  watch: {
    promise(value) {
      if (value && value.then) {
        this.promiseUnresolved = true;
        value
          .then(() => {
            this.promiseUnresolved = false;
          })
          .catch(() => {
            this.promiseUnresolved = false;
          });
      }
    }
  },

  template: `
<button class="loader-button" type="submit" @click.prevent="$emit('click', $event)" :class="{ loading: promiseUnresolved }">
    <div class="loader-button-overlay"></div>
    <div class="loader-button-overlay-icon"></div>
    <div class="loader-button-content"><slot></slot></div>
</button>
    `
});
