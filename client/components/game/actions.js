import { ServerService } from "../../services/server.js";
import { DataService } from "../../services/data.js";
import { ToastNotification } from "../generic/toast-notification.js";
import "./carry-capacity-predictor.js";
import "../generic/loader-button.js";
import { Utils } from "../generic/utils.js";

const DEFAULT_REPETITIONS = 20;

const actionHintsName = {
  Flee: {
    label: "Fleeing",
    text: `While fleeing, your character will not retaliate to any attacks made, but has a very high chance of avoiding getting hit.`
  }
};
const actionHintsId = {
  Duel: {
    label: "Dueling",
    text: `Dueling enables you to fight other players, provided they accept the duel request.<br/>Once duel is started, it'll only end if both parties select to finish the duel.`
  }
};

function matchCurrentAction(targetStream) {
  return Rx.Observable.combineLatest([
    DataService.getCurrentActionStream(),
    targetStream
  ]).map(
    ([currentAction, target]) =>
      target &&
      currentAction &&
      currentAction.entityId === target.id &&
      target.actions &&
      target.actions.find(a => a.id === currentAction.actionId)
  );
}

Vue.component("confirm-with-wakeup-warning", {
  props: ["action", "promise"],

  data: () => ({
    confirmWakeUp: false
  }),

  subscriptions() {
    const currentActionStream = DataService.getCurrentActionStream();
    return {
      currentAction: currentActionStream
    };
  },

  computed: {
    resting() {
      return (
        Utils.isDeepSleep(this.currentAction) &&
        (!this.action || !this.action.quick)
      );
    }
  },

  methods: {
    formatTimeAgo: Utils.formatTimeAgo,

    wakeUpAndWork() {
      this.confirmWakeUp = false;
      setTimeout(() => {
        this.$emit("action");
      });
    }
  },

  template: `
<div>
    <button type="submit" v-if="resting" @click.prevent="confirmWakeUp = true;">Confirm</button>
    <loader-button v-else :promise="promise" @click.prevent="wakeUpAndWork();">Confirm</loader-button>
    <modal v-if="confirmWakeUp" @close="confirmWakeUp = false;">
        <template slot="header">
            Wake up
        </template>
        <template slot="main">
            <form>
                <div class="help-text">You are in deep sleep and not fully rested yet. Are you sure you want to wake up now?</div>
                <hr/>
                <div v-if="currentAction.ETA" class="help-text">
                    <span class="label">Estimated time till fully rested:</span> <span class="no-wrap">{{formatTimeAgo(currentAction.ETA)}}</span>
                </div>
                <button type="submit" @click.prevent="wakeUpAndWork();" class="secondary">Wake up</button>
                <button type="submit" @click.prevent="confirmWakeUp = false;">Keep resting</button>
            </form>
        </template>
    </modal>
</div>
    `
});

Vue.component("recipe-diagram", {
  props: {
    recipe: null,
    repetitions: null
  },

  subscriptions() {
    return {
      availableItemsCounts: DataService.getAvailableItemsCountsStream().startWith(
        {}
      )
    };
  },

  methods: {
    resultQty(result) {
      const qty = this.recipe.materials.reduce((acc, m) => {
        if (m.item.itemCode === result.item.itemCode) {
          return m.qty;
        }
        return acc;
      }, 0);
      const repetitions = this.repetitions || 1;
      return result.qty * repetitions - (repetitions - 1) * qty;
    },
    materialQty(material) {
      const qty = this.recipe.results.reduce((acc, t) => {
        if (t.item.itemCode === material.item.itemCode) {
          return t.qty;
        }
        return acc;
      }, 0);
      const repetitions = this.repetitions || 1;
      // recipe.results
      return material.qty * repetitions - (repetitions - 1) * qty;
    },
    materialDisplay(material) {
      let result = this.materialQty(material);
      if (this.repetitions) {
        result +=
          "/" + (this.availableItemsCounts[material.item.itemCode] || 0);
      }
      return result;
    }
  },

  template: `
<div class="recipe-diagram">
    <item-icon v-for="material in recipe.materials" :key="material.item.id" :details="material.item" :src="material.item.icon" :qty="materialDisplay(material)" :always-show-qty="true" />
    <div class="arrow"></div>
    <item-icon v-for="result in recipe.results" :key="result.item.id" :details="result.item" :src="result.item.icon" :qty="resultQty(result)" :always-show-qty="true" />
</div>    
    `
});

Vue.component("action-blocked-info", {
  props: {
    action: null
  },

  template: `
<div v-if="!action.available" class="help-text">
    <span class="error">Blocked: </span>{{action.message}}
</div>
    `
});

Vue.component("difficulty-indicator", {
  props: {
    action: null
  },

  template: `
<div class="help-text" v-if="action.difficulty">
    <span class="difficulty-indicator">
        Difficulty: 
        <span :class="action.difficulty">{{action.difficulty}}</span>
    </span>
</div>
    `
});

Vue.component("difficulty-help-icon", {
  props: {
    actionHint: null,
    action: null
  },

  template: `
<help-icon :title="actionHint ? actionHint.label : 'Difficulty'" class="action-help-icon" v-if="action.difficulty || actionHint">
    <div v-if="action.difficulty">
        The difficulty indicates chances of success of the action.<br/>
        If unsuccessful many tasks have a chance to waste some of the materials or products or cause an injury. The lower the chance of success is, the bigger the chance for an injury and the more serious the potential injuries.<br/>
        It also determines the amount of skill gained. Tasks marked as "Difficult" grant you the most experience, while tasks easier or harder than that grant less skill experience.
    </div>
    <div v-if="actionHint" v-html="actionHint.text"></div>
</help-icon>
    `
});

Vue.component("interruption-warning", {
  props: {
    action: null,
    target: null
  },

  computed: {
    isCurrentActionInterruptable() {
      return (
        this.currentAction &&
        !(
          this.currentAction.actionId === "Sleep" &&
          this.currentAction.progress <= 50
        )
      );
    },

    showWarning() {
      return (
        this.action &&
        !this.action.quick &&
        this.isCurrentActionInterruptable &&
        this.action !== this.matchCurrentAction
      );
    }
  },

  subscriptions() {
    const currentActionStream = DataService.getCurrentActionStream();
    const targetStream = this.stream("target");
    return {
      currentAction: currentActionStream,
      matchCurrentAction: matchCurrentAction(targetStream)
    };
  },

  template: `
<div v-if="showWarning" class="help-text"><span class="warning-text">Warning:</span> this will interrupt your current action.</div>
    `
});

Vue.component("actions", {
  props: {
    target: null,
    id: null,
    exclude: null,
    include: null,
    icon: null,
    quick: false,
    context: {},
    text: {
      default: true
    }
  },

  data: () => ({
    advanced: null,
    repetitions: DEFAULT_REPETITIONS,
    executingPromise: {},
    lastIdx: null
  }),

  subscriptions() {
    const currentActionStream = DataService.getCurrentActionStream();
    const targetStream = this.stream("target");
    return {
      currentAction: currentActionStream,
      matchCurrentAction: matchCurrentAction(targetStream)
    };
  },

  computed: {
    selected() {
      return this.actions[this.advanced];
    },
    actions() {
      return this.target.actions || [];
    },
    actionHint() {
      return (
        actionHintsName[this.selected && this.selected.name] ||
        actionHintsId[this.selected && this.selected.id]
      );
    },
    repetitionChoices() {
      const maxRepetitions = this.selected && this.selected.maxRepetitions;
      if (maxRepetitions) {
        const mid = Math.round((1 + maxRepetitions) / 2);
        if (mid > 1 && mid < maxRepetitions) {
          return [1, mid, maxRepetitions];
        }
        if (maxRepetitions === 1) {
          return [];
        }
        return [1, maxRepetitions];
      }
      return [1, 20, 100];
    }
  },

  methods: {
    formatTimeAgo: Utils.formatTimeAgo,

    actionTriggered(actionId) {
      this.advanced = null;
      this.$emit("action", actionId);
    },

    selectAction(action, targetId, repetitions = null, queue = false) {
      if (Math.abs(repetitions) === Infinity) {
        repetitions = Number.MAX_SAFE_INTEGER;
      }
      this.executingPromise = ServerService.request("action", {
        action: action.id,
        target: targetId,
        context: this.context ? this.context : action.context,
        repetitions: action.repeatable ? +repetitions : 1,
        queue
      }).then(response => {
        if (response === true) {
          this.actionTriggered(action.id);
        }
      });
    },

    triggerAction(actionId, $event) {
      const idx = this.target.actions.findIndex(
        action => action.id === actionId
      );
      if (idx !== -1) {
        this.advancedAction(idx, $event);
      }
    },

    advancedAction(idx, event) {
      const action = this.target.actions[idx];

      if (!action.available && action.quick) {
        ToastNotification.notify(action.message);
        return;
      }

      if (
        this.quick ||
        (action.quick && !action.repeatable && !action.actionJs)
      ) {
        this.lastIdx = idx;
        this.selectAction(action, this.target.id);
        return;
      }

      if (action.id === "Craft") {
        this.repetitions = 1;
      } else if (action.defaultRepetitions) {
        this.repetitions = action.defaultRepetitions;
      } else if (this.target.qty) {
        this.repetitions = this.target.qty;
      } else {
        this.repetitions = DEFAULT_REPETITIONS;
      }
      event.preventDefault();
      this.advanced = idx;

      if (action.actionJs) {
        ServerService.loadDynamicComponent(action.actionJs).then(
          componentName => {
            const component = Vue.component(componentName);
            if (this.lastComponent) {
              this.lastComponent.$destroy();
            }
            this.lastComponent = new component({
              propsData: {
                actionTarget: this.target,
                action: action
              }
            });
            this.lastComponent.$mount();

            const interval = setInterval(() => {
              if (this.$refs.dynamicComponentContainer) {
                if (!this.lastComponent) {
                  throw new Error("lastComponent is falsy!");
                }
                this.$refs.dynamicComponentContainer.appendChild(
                  this.lastComponent.$el
                );
                this.lastComponent.$on("close", () => {
                  this.actionTriggered(action.id);
                });
                clearInterval(interval);
              }
            }, 80);

            this.lastComponent.$on("close", () => {
              this.actionTriggered(action.id);
              clearInterval(interval);
            });
          }
        );
      }
    }
  },

  destroy() {
    this.lastComponent.$destroy();
  },

  template: `
<div class="actions-list" v-if="target">
    <div v-for="(action, idx) in actions" v-if="(!id || action.id === id) && (!exclude || !exclude.includes(action.id)) && (!include || include.includes(action.id)) && (text || !action.secondaryAction)">
        <loader-button
            :promise="lastIdx === idx && executingPromise"
            class="action"
            @click="advancedAction(idx, $event);"
            :class="[{ current: matchCurrentAction === action, disabled: !action.available && action.quick, icon: icon, text: text }, action.id]"
        >
            <slot :name="action.name">
                <div :hidden="!icon" :style="{ 'background-image': 'url(' + action.icon + ')' }" class="icon"></div>
                <div :hidden="!text" class="text">{{action.name}}</div>
<!--                <div class="difficulty-indicator" v-if="action.difficulty"><div class="icon" :class="action.difficulty"></div></div>-->
                <div class="difficulty-indicator-border" :class="action.difficulty" v-if="action.difficulty"></div>
            </slot>
        </loader-button>
    </div>
    <slot></slot>
    <modal v-if="selected" @close="advanced = null;" class="action-modal">
        <template slot="header">
            {{selected.name}}
            <span v-if="selected.id === 'Craft'"> - {{target.name}}</span>
        </template>
        <template v-if="selected.actionJs" slot="main">
            <tool-selector />
            <div ref="dynamicComponentContainer"></div>
        </template>
        <template v-else slot="main">
            <tool-selector />
            <form>
                <action-blocked-info :action="selected" />
                <difficulty-help-icon :action-hint="actionHint" :action="selected" />
                <interruption-warning :action="selected" :target="target" />
                <carry-capacity-predictor :action="selected" :target="target" :qty="repetitions" />
                <recipe-diagram :recipe="target" :repetitions="repetitions" v-if="selected.id === 'Craft'" />
                <div class="help-text" v-if="selected.difficulty">
                    <span class="difficulty-indicator">
                        Difficulty: 
                        <span :class="selected.difficulty">{{selected.difficulty}}</span>
<!--                        <div class="icon inline"></div>-->
                    </span>
                </div>
                <div v-if="selected.repeatable" class="repetition-selector">
                    <div class="intro-text">How many?</div>
                    <number-selector class="number-select" v-model="repetitions" :min="1" :max="selected.maxRepetitions" :choices="repetitionChoices" />
                </div>
                <confirm-with-wakeup-warning :promise="executingPromise" :action="selected" @action="selectAction(selected, target.id, repetitions);" />
                <button type="submit" @click.prevent="selectAction(selected, target.id, repetitions, true);" v-if="selected.queueable && currentAction && currentAction.actionId !== 'Sleep'">Queue next</button>
            </form>
        </template>
    </modal>
</div>
    `
});
