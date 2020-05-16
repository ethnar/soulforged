import { ServerService } from "../../services/server.js";
import { DataService } from "../../services/data.js";
import { Utils } from "../generic/utils.js";

const interval = 50;
Vue.component("current-action", {
  props: {
    passCurrentAction: null,
    interactable: {
      default: true
    }
  },

  data: () => ({
    showDetails: false,
    changeRepetitions: false,
    repetitions: 0,
    cancelling: false
    // progressSmooth: 0,
  }),

  computed: {
    displayRepetitions() {
      if (this.currentAction.repetitions > 9000) {
        return "∞";
      }
      if (this.currentAction.repetitions === 1) {
        return "";
      }
      return this.currentAction.repetitions;
    },
    firstRotation() {
      return (Math.min(this.progress, 50) / 50) * 180 - 180;
      // return Math.min(this.progressSmooth, 50) / 50 * 180 - 180;
    },
    secondRotation() {
      return ((this.progress - 50) / 50) * 180 - 180;
      // return (this.progressSmooth - 50) / 50 * 180 - 180;
    }
  },

  subscriptions() {
    const currentActionStream = Rx.Observable.combineLatestMap({
      passCurrentAction: this.stream("passCurrentAction"),
      selfCurrentAction: DataService.getCurrentActionStream()
    }).map(
      ({ passCurrentAction, selfCurrentAction }) =>
        passCurrentAction || selfCurrentAction
    );

    return {
      currentAction: currentActionStream,
      progress: currentActionStream
        .pluck("progress")
        .distinctUntilChanged()
        .do(progress => {
          // const time = new Date().getTime();
          // if (this.last) {
          //     this.jumps = (progress - this.last.progress) /
          //         ((time - this.last.time) / interval);
          // } else {
          //     this.jumps = 0;
          // }
          // this.last = { time, progress };
        })
    };
  },

  mounted() {
    // setInterval(() => {
    //     if (this.progressSmooth >= this.progress || this.jumps <= 0) {
    //         this.progressSmooth = this.progress;
    //     } else {
    //         this.progressSmooth += this.jumps;
    //     }
    // }, interval);
  },

  methods: {
    unblockAction() {
      ServerService.request("unblock-action").then(() => {
        this.showDetails = false;
      });
    },
    stopAction() {
      this.cancelling = ServerService.request("stop-action").then(() => {
        this.showDetails = false;
      });
    },
    openMiniGame() {
      window.location.hash = "/fight";
    },
    onClick(event) {
      if (this.interactable) {
        this.showDetails = true;
        this.changeRepetitions = false;
      }
      this.$emit("click", event);
    },
    updateRepetitions() {
      ServerService.request("action", {
        action: this.currentAction.actionId,
        target: this.currentAction.entityId,
        context: this.currentAction.context,
        repetitions: +this.repetitions
      }).then(() => {
        this.changeRepetitions = false;
      });
    },
    decimalTwo: Utils.decimalTwo,
    formatTimeAgo: Utils.formatTimeAgo
  },

  watch: {
    showDetails(value) {
      this.$emit(value ? "details-open" : "details-close");
    }
  },

  template: `
<div class="current-action-wrapper" v-if="currentAction">
    <div class="current-action" @click="onClick($event);" :class="{ blocked: currentAction.blocked, interactable: interactable }">
        <div class="current-action-wrapper">
            <div class="half first-container">
                <div class="half first" :style="{ 'transform': 'rotate(' + firstRotation + 'deg)' }"></div>
            </div>
            <div class="half second-container">
                <div class="half second" :style="{ 'transform': 'rotate(' + secondRotation + 'deg)' }" v-if="progress > 50"></div>
                <!--<div class="half second" :style="{ 'transform': 'rotate(' + secondRotation + 'deg)' }" v-if="progressSmooth > 50"></div>-->
            </div>
            <div class="mid-cover">
                <img v-if="currentAction && currentAction.icon" :src="currentAction.icon" class="icon">
                <div class="repetitions">{{displayRepetitions}}</div>
            </div>
            <div class="border"></div>
        </div>
    </div>
    <modal v-if="showDetails" @close="showDetails = false" class="current-action-modal">
        <template slot="header">
            {{currentAction.name}}
            <span v-if="currentAction.actionTargetName">- {{currentAction.actionTargetName}}</span>
        </template>
        <template slot="main">
            <tool-selector />
            <div v-if="currentAction.unblockOptionLabel">
                <button class="button" @click="unblockAction()">Continue - {{currentAction.unblockOptionLabel}}</button>
            </div>
            <div v-if="currentAction.blocked" class="help-text">
                <span class="error">Blocked: </span>{{currentAction.blocked}}
            </div>
            <div class="help-text" v-if="currentAction.efficiency">
                <button v-if="!changeRepetitions && currentAction.repeatable" class="action icon edit edit-repetitions" @click="repetitions = currentAction.repetitions;changeRepetitions = true;">
                    <div class="icon"></div>
                </button>
                <div v-if="currentAction.repeatable" class="repeatable">
                    <span class="label">How many times:</span> <span v-if="!changeRepetitions">{{currentAction.repetitions}}</span>
                </div>
            </div>
            <div v-if="changeRepetitions">
                <number-selector class="number-select centered" v-model="repetitions" :min="1" :choices="[1, 20, 100]" />
                <div class="action centered">
                    <div class="button" @click="updateRepetitions()">Confirm</div>
                    <div class="button" @click="changeRepetitions = false">Back</div>
                </div>
            </div>
            <div v-else>
                <div class="help-text" v-if="currentAction.efficiency">
                    <help-icon title="Action speed" class="action-help-icon">
                        Action that is currently in progress. Your character's speed depends on their mood, related skill and tool and other effects, positive and negative.<br/>
                        The estimated time shown is the approximate amount of time needed to complete the current action, including repetitions. The exact time may be different, based on your character changing status (tired, hungry, etc).
                    </help-icon>
                    <div>
                        <span class="label">Speed:</span> {{decimalTwo(currentAction.efficiency * 100)}}%
                    </div>
                    <div v-if="currentAction.difficulty" class="difficulty-indicator"><span class="label">Difficulty:</span> <span :class="currentAction.difficulty">{{currentAction.difficulty}}</span></div>
    <!--                <div v-if="currentAction.ETA" class="estimate">-->
    <!--                    Estimated: {{formatTimeAgo(currentAction.ETA)}}-->
    <!--                </div>  -->
    <!--                <div v-if="currentAction.repeatable && currentAction.repetitions > 1 && currentAction.allETA" class="estimate total">-->
    <!--                    Estimated (Total): {{formatTimeAgo(currentAction.allETA)}}-->
    <!--                </div>-->
                    <div v-if="currentAction.timeSpent" class="estimate">
                        <span class="label">Time spent:</span> {{currentAction.timeSpent}} seconds
                    </div>
                    <div v-if="currentAction.ETA" class="estimate">
                        <span class="label">Estimated:</span> {{formatTimeAgo(currentAction.ETA)}}
                        <span v-if="currentAction.allETA && currentAction.allETA !== currentAction.ETA" class="estimate total">
                            ({{formatTimeAgo(currentAction.allETA)}})
                        </span>
                    </div>  
                </div>
                <div class="help-text" v-if="currentAction.name === 'Sleep'">
                    <help-icon title="Sleeping" class="action-help-icon">
                        Quality of the sleep impacts how quickly your character regains energy and also reduces food consumption. The quality of the sleep increases over time during an uninterrupted sleep.
                    </help-icon>
                    <span class="label">Sleep quality:</span> {{currentAction.progress}}%
                    <div v-if="currentAction.ETA" class="estimate">
                        <span class="label">Estimated time till fully rested:</span> <span class="no-wrap">{{formatTimeAgo(currentAction.ETA)}}</span>
                    </div>
                </div>
                <loader-button class="button" v-if="currentAction.cancellable" @click="stopAction()" :promise="cancelling">Cancel action</loader-button>
            </div>
        </template>
    </modal>
</div>
    `
});
