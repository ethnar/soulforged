import { ToastNotification } from "../generic/toast-notification.js";

Vue.component("entity-name-voting", {
  props: ["voteKey"],

  data: () => ({
    preferredName: ""
  }),

  subscriptions() {
    return {
      nameVotes: this.stream("voteKey")
        .switchMap(voteKey =>
          Rx.Observable.fromPromise(
            ServerService.request("get-vote-name-preferences", { key: voteKey })
          )
        )
        .do(preferences => {
          this.preferredName = preferences.playerOwnPreference || "";
        })
    };
  },

  methods: {
    confirm() {
      ServerService.request("set-vote-name", {
        key: this.voteKey,
        name: this.preferredName
      }).then(response => {
        if (response === true) {
          this.$emit("close");
        } else {
          ToastNotification.notify(response);
        }
      });
    }
  },

  computed: {
    hasVotes() {
      return this.nameVotes.counts && Object.keys(this.nameVotes.counts).length;
    }
  },

  created() {
    this.preferredName = "";
  },

  template: `
<form v-if="nameVotes">
    <div class="help-text">
        <div v-if="hasVotes" class="names-ranking">
            <div>Names ranking:</div>
            <div v-for="(count, option) in nameVotes.counts" class="name-option">
                <input readonly :value="option" @click="preferredName = option" style="cursor: pointer;" /> <span class="points">{{count}} points</span>
            </div>
        </div>
        <div v-else>
            You are the first person to be naming it!
        </div>
        <div>Provide your preferred name:</div>
        <input v-model="preferredName" class="player-input"><br/>
        <br/>
    </div>
    <button type="submit" @click.prevent="confirm();">Confirm</button>
</form>
    `
});

Vue.component("entity-name", {
  props: ["entity", "editable"],

  data: () => ({
    voting: false
  }),

  subscriptions() {
    return {
      description: this.stream("voting").switchMap(voting =>
        voting
          ? ServerService.getInfo("entity-description", {
              entityKey: this.entity.nameable
            })
          : Rx.Observable.of("")
      )
    };
  },

  methods: {
    startVoting() {
      if (this.reallyEditable) {
        this.voting = true;
      }
    }
  },

  computed: {
    reallyEditable() {
      return this.editable && this.entity.nameable;
    },

    unnamed() {
      return !this.entity.name || this.entity.name === "Unnamed";
    },

    displayName() {
      return this.entity.name || "Unnamed";
    }
  },

  template: `
<span class="entity-name" :class="{ unnamed: unnamed, editable: reallyEditable }">
    <span @click="startVoting">
        <span class="name">{{displayName}}</span>
        <div v-if="reallyEditable" class="edit-icon" />
    </span>
    <modal v-if="voting" @close="voting = false">
        <div slot="header">
            Vote name
        </div>
        <div slot="main">
            <div class="main">
                <div class="main-icon">
                    <item-icon size="large" :src="entity.icon" />
                </div>
                <div class="item-properties html">
                    {{description}}
                </div>
            </div>
            <entity-name-voting @close="voting = false" :vote-key="entity.nameable" />
        </div>    
    </modal>
</span>
    `
});
