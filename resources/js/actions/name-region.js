Vue.component("backend-name-region", {
  props: {
    actionTarget: null
  },

  data: () => ({
    preferredName: "",
    fromSelection: "",
    error: "",
    nodeIds: [],
    regionMapStyle: null
  }),

  subscriptions() {
    const regionPreferencesPromise = ServerService.request(
      "get-region-name-preferences",
      {
        nodeId: this.actionTarget.id
      }
    );
    const stream = Rx.Observable.fromPromise(regionPreferencesPromise);
    return {
      nameVotes: stream.map(preferences => {
        this.nodeIds = preferences.nodeIds;
        if (Object.keys(preferences.counts).length) {
          this.preferredName = preferences.playerOwnPreference;
          return preferences;
        }
        return null;
      }),
      mapBox: stream
        .switchMap(preferences =>
          Rx.Observable.combineLatestMap(
            preferences.nodeIds.toObject(
              id => id,
              id => MapService.getNodeStream(id)
            )
          )
        )
        .map(nodes => {
          const box = Object.values(nodes).reduce(
            (acc, node) => ({
              top: Math.min(acc.top, node.y),
              left: Math.min(acc.left, node.x),
              right: Math.max(acc.right, node.x),
              bottom: Math.max(acc.bottom, node.y)
            }),
            {
              top: Infinity,
              left: Infinity,
              right: -Infinity,
              bottom: -Infinity
            }
          );
          const scale = 200 / (55 + box.bottom - box.top);
          this.regionMapStyle = {
            transform: `scale(${scale})`
          };
          box.left = (box.left + box.right) / 2;
          box.top = (box.top + box.bottom) / 2;
          return box;
        })
    };
  },

  methods: {
    confirm() {
      ServerService.request("set-region-name", {
        name: this.preferredName,
        nodeId: this.actionTarget.id
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
<form>
    <div class="help-text">
        <div v-if="mapBox" class="region-map" :style="regionMapStyle">
            <map-node
                v-for="nodeId in nodeIds"
                :node-id="nodeId"
                :key="nodeId"
                :box="mapBox"
                :interactable="false"
            />
        </div>
        <div v-if="nameVotes && nameVotes.counts" class="names-ranking">
            <div>Names ranking:</div>
            <div v-for="(count, option) in nameVotes.counts" class="name-option">
                <input readonly :value="option" @click="preferredName = option" style="cursor: pointer;" /> <span class="points">{{count}} points</span>
            </div>
        </div>
        <div v-else>
            You are the first person to be naming this region!
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
