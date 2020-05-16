let instance;

Vue.component("toast-notification", {
  data: () => ({
    message: "",
    visible: false
  }),

  mounted() {
    instance = this;
  },

  methods: {
    hide() {
      this.visible = false;
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
    },

    show() {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.visible = true;
      this.timeout = setTimeout(() => {
        this.hide();
      }, 4000);
    }
  },

  template: `
<div :class="{ visible: visible }" @click="hide();" class="toast-message">{{message}}</div>
`
});

export const ToastNotification = (window.ToastNotification = {
  notify(message) {
    instance.message = message;
    instance.show();
  }
});
