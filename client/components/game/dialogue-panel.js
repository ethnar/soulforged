Vue.component("dialogue-panel", {
  data: () => ({
    showDetails: false,
    dialogueResponse: ""
  }),

  methods: {
    selectDialogueOption(option) {
      return ServerService.request("dialogueOption", {
        creatureId: this.data.id,
        option
      }).then(response => {
        this.dialogueResponse = response;
      });
    },

    enterDialogueMode() {
      this.selectDialogueOption();
    }
  },

  template: `
<modal v-if="showDetails" @close="showDetails = false;">
    <template slot="header">
        {{data.name}}
    </template>
    <template slot="main">
        <div class="dialogue-mode">
            <div class="npc-text">
                <animated-text :text="dialogueResponse.text" :key="dialogueResponse.option">
                    <img class="npc-icon" :src="data.icon">
                </animated-text>
                <br/>
            </div>
            <div class="dialog-choices">
                <div
                    v-for="dialogueOption in dialogueResponse.options"
                    class="dialog-option"
                    :class="{ disabled: dialogueOption.available !== true }"
                    @click="dialogueOption.available === true && selectDialogueOption(dialogueOption.option)"
                >
                    <span>{{dialogueOption.label}} <span v-if="dialogueOption.available !== true">({{dialogueOption.available}})</span></span>
                </div>
                <div
                    class="dialog-option"
                    @click="dialogueResponse = false;"
                >
                    <span>Farewell</span>
                </div>
            </div>
        </div>
    </template>
</modal>
    `
});
