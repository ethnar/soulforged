import "../game/current-action.js";
import "../generic/meter-orb.js";
import { ServerService } from "../../services/server.js";
import { DataService } from "../../services/data.js";

Vue.component("main-status", {
  data: () => ({
    playerActionsExpanded: false
  }),

  subscriptions() {
    return {
      myCreature: DataService.getMyCreatureStream(),
      inTutorial: DataService.getIsTutorialAreaStream()
    };
  },

  template: `
<div class="main-status" v-if="myCreature">
    <div class="top-left">
        <div v-if="!myCreature.looks" class="avatar-display image-only" :style="myCreature.icon && { 'background-image': 'url(' + myCreature.icon + ')' }"></div>
        <player-avatar
            v-else
            class="avatar-display"
            size="huge"
            :hair-color="myCreature.looks.hairColor"
            :hair-color-grayness="myCreature.looks.hairColorGrayness"
            :skin-color="myCreature.looks.skinColor"
            :hair-style="myCreature.looks.hairStyle"
            :head-only="true"
            :creature="myCreature"
        />
    </div>
    <current-action />
    <div class="player-effects-and-actions-wrapper">
        <div class="player-effects-wrapper">
            <player-effects
                size="small"
                :only-icons="true"
                :only-high-sev="true"
            />
        </div>
        <div class="player-actions-wrapper" v-if="!inTutorial" :class="{ expanded: playerActionsExpanded }">
            <actions
                class="actions"
                @action=""
                :icon="true"
                :text="false"
                :exclude="['Fight', 'Research', 'Sleep']"
                :target="myCreature"
            />
            <div v-if="playerActionsExpanded" class="collapse" @click="playerActionsExpanded = false"></div>
            <div v-else class="expand" @click="playerActionsExpanded = true"></div>
        </div>
    </div>
    
</div>
    `
});
