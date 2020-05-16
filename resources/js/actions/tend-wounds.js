Vue.component("backend-tend-wounds", {
  props: {
    actionTarget: null,
    action: null
  },

  data: () => ({
    repetitions: 1
  }),

  subscriptions() {
    const creaturesStream = ServerService.getNodeStream().pluck("creatures");

    return {
      creatures: creaturesStream.map(creatures =>
        [...creatures].sort(creaturesSorter)
      ),
      currentNodeId: DataService.getCurrentNodeIdStream().do(currentNodeId => {
        ServerService.selectLiveUpdateNodeId(currentNodeId);
      })
    };
  },

  methods: {
    confirm(creature) {
      ServerService.request("action", {
        action: "Tend wounds",
        target: this.actionTarget.id,
        repetitions: +this.repetitions,
        extra: {
          creatureId: creature.id
        }
      }).then(response => {
        if (response) {
          this.$emit("close");
        }
      });
    }
  },

  computed: {
    filterEffects() {
      // const painEffectNames = [
      //     'Minor pain',
      //     'Pain',
      //     'Major pain',
      //     'Extreme pain',
      // ];
      const filter = buff =>
        // painEffectNames.includes(buff.name) ||
        buff.name.indexOf(this.actionTarget.tendingEffect) === 0;
      return this.actionTarget ? filter : () => false;
    }
  },

  template: `
<form>
    <section>
        <interruption-warning :action="action" :target="actionTarget" />
        <div class="help-text" v-if="action.difficulty">
            <span class="difficulty-indicator">
                Difficulty: 
                <span :class="action.difficulty">{{action.difficulty}}</span>
            </span>
        </div>
        <number-selector class="number-select" v-model="repetitions" :min="1" :choices="[1, 20, 100]"></number-selector><br/>
        <creature-list-item
            v-for="creature in creatures"
            v-if="!creature.dead"
            :creature="creature"
            :include-actions="false"
            :key="creature.id"
            :effects-filter="filterEffects"
        >
            <button type="submit" @click.prevent="confirm(creature);">Confirm</button>
        </creature-list-item>
    </section>
</form>
    `
});
