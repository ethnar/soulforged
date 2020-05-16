import { ServerService } from "../../services/server.js";
import { Utils } from "../generic/utils.js";
import "../generic/animated-text.js";
import "../generic/help-icon.js";
import "../generic/number-selector.js";
import "../generic/modal.js";
import "../game/game-chat.js";
import "../ui-tutorial.js";
import "../game/item.js";
import "../game/creature.js";
import "../game/map.js";
import "../game/actions.js";
import "../game/main-status.js";
import "../game/main-controls.js";
import "../game/secondary-status.js";
import "../game/audio-player.js";
import { DataService } from "../../services/data.js";

window.creaturesSorter = (a, b) => {
  if (!a.self !== !b.self) {
    return a.self ? -1 : 1;
  }
  if (!a.dead !== !b.dead) {
    return a.dead ? 1 : -1;
  }
  if (!a.hostile !== !b.hostile) {
    return a.hostile ? -1 : 1;
  }
  if (!a.isPlayer !== !b.isPlayer) {
    return a.isPlayer ? -1 : 1;
  }
  if (a.relationship !== b.relationship) {
    switch (true) {
      case a.relationship === "friend":
        return -1;
      case a.relationship === "rival":
        return 1;
      case b.relationship === "friend":
        return 1;
      case b.relationship === "rival":
        return -1;
    }
  }
  if (a.name > b.name) {
    return 1;
  } else {
    return -1;
  }
};

export const MainView = {
  data: () => ({}),

  subscriptions() {
    return {
      travelMode: ServerService.getTravelModeStream(),
      tutorialArea: DataService.getIsTutorialAreaStream(),
      dead: ServerService.getDeadStream().do(data => {
        if (data.dead) {
          window.location.hash = "/dead";
        }
      }),
      acceptedLegalTerms: DataService.getAcceptedLegalTermsStream().do(
        acceptedLegalTerms => {
          if (!acceptedLegalTerms) {
            window.location.hash = "/register";
          }
        }
      )
    };
  },

  created() {
    ServerService.registerHandler("clientSideEvent", data => {
      eval(data)(this, window);
    });
  },

  methods: {
    ucfirst: Utils.ucfirst,
    linebreaks: Utils.linebreaks,
    formatNumber: Utils.formatNumber
  },

  template: `
<div class="main-container" :class="{ 'travel-mode': travelMode }">
    <world-map class="world-map-container"></world-map>
    <!--<dialogue-panel />-->
    <main-status />
<!--    
    <main-status-bar></main-status-bar>
    <game-chat :hidden="mode !== 'chat'" @new-messages="newChatMessage = $event" ref="gameChat"></game-chat>
-->
    <secondary-status />
    <main-controls :only-selected="travelMode" />
    <game-chat />
    <ui-tutorial v-if="tutorialArea" />
</div>
    `
};
