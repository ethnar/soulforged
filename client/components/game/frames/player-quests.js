import { ServerService } from "../../../services/server.js";
import "../perks.js";
import { DataService } from "../../../services/data.js";

Vue.component("player-quests", {
  data: () => ({
    dialogueResponse: null
  }),

  subscriptions() {
    return {
      quests: DataService.getMyQuestsStream()
    };
  },

  created() {
    this.requestId = 0;
  },

  methods: {
    questAction(quest) {
      this.selectedQuest = quest;
      this.dialogueResponse = {
        loading: true
      };
      this.requestId += 1;
      const requestId = this.requestId;
      return ServerService.request("questDialogue", {
        questId: quest.id
      }).then(response => {
        if (requestId === this.requestId) {
          this.dialogueResponse = response;
        }
      });
    },

    close() {
      this.requestId += 1;
      this.dialogueResponse = null;
    },

    selectDialogueOption(option) {
      this.requestId += 1;
      const requestId = this.requestId;
      return ServerService.request("questDialogue", {
        questId: this.selectedQuest.id,
        option
      }).then(response => {
        if (requestId === this.requestId) {
          this.dialogueResponse = response;
        }
      });
    }
  },

  template: `
<div class="player-quests" v-if="quests">
    <section>
        <header>Quests</header>
        <div v-for="quest in quests" class="quest">
            <div class="title">
                {{quest.title}}
            </div>
            <div class="description help-text">{{quest.description}}</div>
            <div v-for="obj in quest.objectives" class="objective" :class="{ complete: obj.progress >= 1 }">
                <div class="checkmark"></div>
                <div class="label">{{obj.label}}</div>
                <div v-if="obj.target" class="progress-bar">
                    <div class="fill" :style="{ width: Math.min(obj.progress * 100, 100) + '%' }"></div>
                </div>
            </div>
            <div class="centered">
                <button @click="questAction(quest)" :class="[{ highlight: !quest.reviewed}, quest.completed ? 'proceed' : 'info']">
                    {{quest.completed ? 'Proceed' : 'Info'}}
                </button>
            </div>
        </div>
    </section>
    <modal v-if="dialogueResponse" @close="close();">
        <template slot="header">
            {{selectedQuest.title}}
        </template>
        <template slot="main">
            <div v-if="dialogueResponse.loading">
                Loading....
            </div>
            <div v-else class="dialogue-mode">
                <div class="npc-text">
                    <animated-text :text="dialogueResponse.text" :key="dialogueResponse.option">
                        <img v-if="dialogueResponse.icon" class="npc-icon" :src="dialogueResponse.icon">
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
                        <span>Exit</span>
                    </div>
                </div>
            </div>
        </template>
    </modal>
</div>
    `
});
