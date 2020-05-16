import { ContentFrameService } from "../../services/content-frame.js";
import { DataService } from "../../services/data.js";

Vue.component("quest-notification", {
  subscriptions() {
    return {
      hasNewQuest: DataService.getMyQuestsStream().map(quests =>
        quests.some(q => !q.reviewed)
      )
    };
  },

  methods: {
    openQuestPanel() {
      ContentFrameService.triggerShowPanel("quest");
    }
  },

  template: `
<div
    v-if="hasNewQuest"
    class="quest-notification"
    @click="openQuestPanel"
>
    <div class="icon"></div>
</div>
    `
});
