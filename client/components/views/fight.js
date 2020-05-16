import { ServerService } from "../../services/server.js";
import { DataService } from "../../services/data.js";
import { Utils } from "../generic/utils.js";
import "../generic/animated-text.js";
import "../generic/help-icon.js";
import "../generic/toast-notification.js";
import "../generic/number-selector.js";
import "../generic/modal.js";
import "../ui-tutorial.js";
import "../game/game-chat.js";
import "../game/item.js";
import "../game/creature.js";
import "../game/map.js";
import "../game/actions.js";
import "../game/main-status.js";
import "../game/main-controls.js";
import "../game/secondary-status.js";
import "../game/audio-player.js";
import "../game/frames/fighting-screen.js";

export const FightView = {
  data: () => ({}),

  subscriptions() {
    return {
      chat: ServerService.getChatMessageStream(),
      currentNodeId: DataService.getCurrentNodeIdStream().do(currentNodeId => {
        ServerService.selectLiveUpdateNodeId(currentNodeId);
      }),
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
    formatNumber: Utils.formatNumber,

    forceReloadPage() {
      console.log("reload3");
      window.location.reload();
    }
  },

  template: `
<div class="main-container">
    <main-controls :only-selected="true" />
    <fighting-screen />
</div>
    `
};
