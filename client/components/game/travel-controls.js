import { ServerService } from "../../services/server.js";
import { DataService } from "../../services/data.js";
import { Utils } from "../generic/utils.js";
import { ToastNotification } from "../generic/toast-notification.js";

Vue.component("travel-controls", {
  data: () => ({
    enemyOption: "avoid",
    showTheConfirmationModal: false
  }),

  subscriptions() {
    return {
      currentAction: DataService.getCurrentActionStream().do(currentAction => {
        switch (true) {
          case !currentAction ||
            !currentAction.context ||
            currentAction.actionId !== "Travel":
            break;
          case currentAction.context.disregard:
            this.enemyOption = "disregard";
            break;
          case currentAction.context.assault:
            this.enemyOption = "engage";
            break;
          default:
            this.enemyOption = "avoid";
        }
      }),
      triggerTravelStream: ServerService.getTriggerTravelStream().do(nodeId => {
        this.targetNodeId = nodeId;
        if (this.willInterrupt) {
          this.showTheConfirmationModal = true;
        } else {
          this.triggerTravel();
        }
      })
    };
  },

  computed: {
    willInterrupt() {
      return (
        (this.currentAction &&
          this.currentAction.actionId !== "Travel" &&
          this.currentAction.actionId !== "Sleep") ||
        Utils.isDeepSleep(this.currentAction)
      );
    }
  },

  methods: {
    triggerTravel() {
      this.showTheConfirmationModal = false;
      console.log(this.targetNodeId);
      ServerService.request("travel-order", {
        nodeId: this.targetNodeId,
        context: ServerService.getTravelContext()
      }).then(response => {
        if (typeof response === "string") {
          ToastNotification.notify(response);
        }
      });
    },

    selectOption(option) {
      this.enemyOption = option;

      let { skipUnknowns, assault, disregard } = false;
      switch (option) {
        case "avoid":
          skipUnknowns = assault = disregard = false;
          break;
        case "engage":
          assault = true;
          skipUnknowns = disregard = false;
          break;
        case "disregard":
          skipUnknowns = assault = disregard = true;
          break;
      }

      const context = {
        skipUnknowns,
        assault,
        disregard
      };

      ServerService.setTravelContext(context);

      ServerService.request("travel-context", context);
    },

    formatTimeAgo: Utils.formatTimeAgo,

    actuallyTravel() {}
  },

  template: `
<div class="travel-controls-wrapper">
    <current-action />
    <section class="travel-controls">
        <header>Travel</header>
        <div class="enemy-options selection-button-row">
            <button :class="{ active: enemyOption === 'avoid'}" @click.prevent="selectOption('avoid')">Avoid</button>
            <button :class="{ active: enemyOption === 'engage'}" @click.prevent="selectOption('engage')">Ambush</button>
            <button :class="{ active: enemyOption === 'disregard'}" @click.prevent="selectOption('disregard')">Disregard</button>
        </div>
        <div class="estimated">
            <span>Estimate:</span>
            <span v-if="currentAction.actionId === 'Travel'" class="values">
                {{formatTimeAgo(currentAction.ETA)}}
                <span v-if="currentAction.allETA && currentAction.allETA !== currentAction.ETA" class="estimate total">
                    ({{formatTimeAgo(currentAction.allETA)}})
                </span>
            </span>
            <span v-else class="values">
                Not travelling
            </span>
        </div>
<!--        <div class="warning" v-if="willInterrupt">-->
<!--            <interruption-warning :action="{ quick: false }" />-->
<!--        </div>-->
    </section>
    <modal v-if="showTheConfirmationModal" @close="showTheConfirmationModal = false">
        <div slot="header">
            Confirm Travel
        </div>
        <div slot="main">
            <interruption-warning :action="{ quick: false }" />
            <confirm-with-wakeup-warning :action="{ quick: false }" @action="triggerTravel();" />
        </div>
    </modal>
</div>
    `
});
