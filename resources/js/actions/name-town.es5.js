Vue.component("backend-name-town", {
  data: () => ({
    preferredName: "",
    fromSelection: "",
    error: ""
  }),

  subscriptions() {
    return {
      nameVotes: Rx.Observable.fromPromise(ServerService.request("get-town-name-preferences")).do(preferences => {
        this.preferredName = preferences.playerOwnPreference || "";
      })
    };
  },

  methods: {
    confirm() {
      ServerService.request("set-town-name", {
        name: this.preferredName
      }).then(response => {
        if (response === true) {
          this.$emit("close");
        }
        this.error = response;
      });
    }
  },

  created() {
    this.preferredName = "";
  },

  template: `
<form v-if="nameVotes">
    <div class="help-text">
        <div v-if="nameVotes.counts" class="names-ranking">
            <div>Names ranking:</div>
            <div v-for="(count, option) in nameVotes.counts" class="name-option">
                <input readonly :value="option" @click="preferredName = option" style="cursor: pointer;" /> <span class="points">{{count}} points</span>
            </div>
        </div>
        <div v-else>
            You are the first person to be naming this town!
        </div>
        <br/>
        <div>Provide your preferred name:</div>
        <input v-model="preferredName" class="player-input"><br/>
        {{error}}
        <br/>
    </div>
    <button type="submit" @click.prevent="confirm();">Confirm</button>
</form>
    `
});