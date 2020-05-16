Vue.component("backend-follow", {
  props: {
    actionTarget: null,
    action: null
  },

  data: () => ({
    battle: true,
    travel: true
  }),

  created() {
    if (this.action.name === 'Stop following') {
      setTimeout(() => {
        this.confirm();
      });
    }
  },

  methods: {
    confirm() {
      ServerService.request("action", {
        action: "Follow",
        target: this.actionTarget.id,
        context: {
          battle: this.battle,
          travel: this.travel
        }
      });
      this.$emit("close");
    }
  },

  template: `
<form>
    <section>
        <interruption-warning :action="action" :target="actionTarget" />
        <label class="checkbox-row centered">
            <div><input type="checkbox" v-model="travel" /></div>
            <div>Follow movement</div>
        </label>
        <label class="checkbox-row centered">
            <div><input type="checkbox" v-model="battle" /></div>
            <div>Join battles</div>
        </label>
        <confirm-with-wakeup-warning :action="action" @action="confirm();" />
    </section>
</form>
    `
});