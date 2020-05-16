Vue.component("backend-read", {
  props: {
    actionTarget: null
  },

  data: () => ({
    translated: false
  }),

  subscriptions() {
    return {
      plotTextDetails: Rx.Observable.fromPromise(ServerService.getInfo("read-plot-text", this.actionTarget.id)).do(result => {
        if (result.error) {
          ToastNotification.notify('You cannot read notes while enemies are attacking you.');
          result = null;
        }
        if (!result) {
          this.$emit("close");
        }
      }).startWith({
        encrypted: 'Loading...'
      })
    };
  },

  template: `
<div v-if="plotTextDetails">
    <animated-text v-if="translated" :text="plotTextDetails.decrypted" :mystery-font="plotTextDetails.font" />
    <animated-text v-else :text="plotTextDetails.encrypted" :mystery-font="plotTextDetails.font" />
    <button v-if="plotTextDetails.decrypted && !translated" @click="translated = true;">Translate</button>
</div>
    `
});