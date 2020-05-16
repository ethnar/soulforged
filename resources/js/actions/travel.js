Vue.component("backend-travel", {
  props: {
    actionTarget: null,
    action: null
  },

  data: () => ({
    skipUnknowns: false,
    assault: false,
    disregard: false,
    enemyOption: 'avoid',
  }),

  created()   {
    if (
      this.actionTarget &&
      this.actionTarget.creatures &&
      this.actionTarget.creatures.some(c => c.hostile || (!c.hostile && !c.friendly))
    ) {
      this.selectOption('engage');
    }
  },

  subscriptions() {
    return {
      tutorialArea: DataService.getIsTutorialAreaStream()
        .do(tutorialArea => {
          if (tutorialArea) {
            this.assault = true;
          }
        })
    };
  },

  methods: {
    confirm() {
      ServerService.request("action", {
        action: "Travel",
        target: this.actionTarget.id,
        context: {
          skipUnknowns: this.skipUnknowns,
          assault: this.assault,
          disregard: this.disregard
        }
      });
      this.$emit("close");
    },
    selectOption(option) {
      this.enemyOption = option;
      switch(option) {
        case 'avoid':
          this.skipUnknowns = this.assault = this.disregard = false;
          break;
        case 'engage':
          this.assault = true;
          this.skipUnknowns = this.disregard = false;
          break;
        case 'disregard':
          this.skipUnknowns = this.assault = this.disregard = true;
          break
      }
    }
  },

  template: `
<form>
    <section>
        <action-blocked-info :action="action" />
        <difficulty-help-icon :action="action" />
        <interruption-warning :action="action" :target="actionTarget" />
        <div class="help-text" v-if="action.difficulty">
            <span class="difficulty-indicator">
                Difficulty: 
                <span :class="action.difficulty">{{action.difficulty}}</span>
            </span>
        </div>
        <section class="clear-both" v-if="!tutorialArea">
          <header class="centered">
            Hostiles &amp; Unknowns
          </header>
          <div class="selection-button-row">
            <button :class="{ active: enemyOption === 'avoid'}" @click.prevent="selectOption('avoid')">Avoid</button>
            <button :class="{ active: enemyOption === 'engage'}" @click.prevent="selectOption('engage')">Ambush</button>
            <button :class="{ active: enemyOption === 'disregard'}" @click.prevent="selectOption('disregard')">Disregard</button>
          </div>
<!--          <label class="checkbox-row centered">-->
<!--              <div><input type="checkbox" v-model="disregard" /></div>-->
<!--              <div>Disregard hostile creatures</div>-->
<!--          </label>-->
<!--          <label class="checkbox-row centered">-->
<!--              <div><input type="checkbox" v-model="assault" /></div>-->
<!--              <div>Engage hostile creatures</div>-->
<!--          </label>-->
<!--          <label class="checkbox-row centered">-->
<!--              <div><input type="checkbox" v-model="skipUnknowns" /></div>-->
<!--              <div>Ignore unknown creatures</div>-->
<!--          </label>-->
        </section>
        <confirm-with-wakeup-warning :action="action" @action="confirm();" />
    </section>
</form>
    `
});
