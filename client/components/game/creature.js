import { ServerService } from "../../services/server.js";
import { Utils } from "../generic/utils.js";
import { ContentFrameService } from "../../services/content-frame.js";
import "./frames/creature-effects.js";
import "./entity-name.js";
import { DataService } from "../../services/data.js";

Vue.component("threat-level-indicator", {
  props: ["threatLevel", "noLabel", "friendly", "hostile"],

  computed: {
    threatLevelFormatted() {
      return this.threatLevel ? Utils.formatNumber(this.threatLevel) : "";
    }
  },

  template: `
<div
    class="threat-level-indicator"
    :class="{ hostile: hostile, friendly: friendly, unknown: (!friendly && !hostile) }"
    v-if="false && (threatLevel || (!friendly && !hostile) || hostile)"
>
    <div class="icon"></div>
    <div class="label" v-if="!noLabel">Threat</div>
    <div class="level">
        <div v-if="!threatLevel">??</div>
        <div v-else>{{threatLevelFormatted}}</div>
<!--        <decimal-secondary v-else :value="threatLevelFormatted" />-->
    </div>
    <div class="right"></div>
</div>
`
});

const animRegister = [];
const registerAnimatedIcon = vm => {
  animRegister.push(vm);
};
const deregisterAnimatedIcon = vm => {
  const idx = animRegister.indexOf(vm);
  if (idx !== -1) {
    animRegister.splice(idx, 1);
  }
};
setInterval(() => {
  animRegister.forEach(vm => vm.flip());
}, 1500);

Vue.component("creature-icon", {
  props: {
    creature: null,
    withTracks: {
      default: false
    },
    size: {
      default: "normal"
    }
  },

  data: () => ({
    frame: 0
  }),

  created() {
    registerAnimatedIcon(this);
  },

  destroyed() {
    deregisterAnimatedIcon(this);
  },

  methods: {
    flip() {
      if (this.withTracks && this.creature.unknown) {
        this.frame = (this.frame + 1) % (this.creature.tracks.length + 1);
      }
    }
  },

  template: `
<div class="creature-wrapper" :class="[size, { dead: creature.dead, hostile: creature.hostile, friendly: creature.friendly, self: creature.self }]" v-if="creature">
    <div class="main-icon">
        <div class="avatar-icon">
            <div class="border"></div>
            <div v-if="!creature.looks" class="img" :style="creature.icon && { 'background-image': 'url(' + creature.icon + ')' }"></div>
            <player-avatar v-else
                class="creature-avatar"
                :hair-color="creature.looks.hairColor"
                :hair-color-grayness="creature.looks.hairColorGrayness"
                :skin-color="creature.looks.skinColor"
                :hair-style="creature.looks.hairStyle"
                :head-only="true"
                :size="size"
                :creature="creature"
            />
            <div
                v-for="(trackIcon, idx) in creature.tracks"
                v-if="creature.unknown && withTracks"
                class="track"
                :class="{ shown: idx === frame }"
                :style="{ 'background-image': 'url(' + trackIcon + ')' }" 
            />
        </div>
    </div>
</div>
    `
});

Vue.component("creature-list-item", {
  props: {
    creature: Object,
    includeActions: {
      type: Boolean,
      default: true
    },
    effectsFilter: {
      default: () => () => true
    }
  },

  data: () => ({
    showDetails: false
  }),

  subscriptions() {
    return {
      myself: DataService.getMyCreatureStream(),
      excludedActions: DataService.getIsTutorialAreaStream()
        .map(tutorialArea => (tutorialArea ? ["Trade"] : []))
        .startWith([])
    };
  },

  methods: {
    equipmentSlotBorder: Utils.equipmentSlotBorder,

    onAction(actionId) {
      if (actionId === "Trade") {
        setTimeout(() => {
          // to give time for the modal to close
          ContentFrameService.triggerShowPanel("activeTrades");
        });
      }
    },

    onClick() {
      if (this.includeActions) {
        this.showDetails = true;
        ServerService.request("creature-details", this.creature.id);
      }
    },

    closeDetails() {
      this.showDetails = false;
      ServerService.request("creature-details", null);
    }
  },

  template: `
<div class="list-item-with-props creature-list-item" v-if="creature">
    <div @click="onClick()" :class="{ interactable: includeActions }" class="creature-short-display">
        <div class="main-icon">
            <creature-icon :creature="creature" size="normal"></creature-icon>
        </div>
        <div class="details">
            <div class="label" :class="[{ player: creature.isPlayer, self: creature.self }, creature.relationship]">
                <div class="nowrap"><entity-name :entity="creature" /></div>
            </div>
            <div class="item-list">
                <current-action v-if="creature.self" class="creature-list" />
                <div v-else class="current-action creature-list">
                    <div class="current-action-wrapper">
                        <div class="mid-cover">
                            <img v-if="creature.currentAction && creature.currentAction.icon" :src="creature.currentAction.icon" class="icon" />
                        </div>
                        <div class="border"></div>
                    </div>
                </div>
                <div class="creature-effects-wrapper">
                    <creature-effects
                        class="creature-list-effects"
                        :creature="creature"
                        :only-icons="true"
                        :public-only="true"
                        :primary-only="true"
                        :effects-filter="effectsFilter"
                        size="tiny"
                    />
                </div>
            </div>
        </div>
        <threat-level-indicator :threat-level="creature.threatLevel" :no-label="true" :friendly="creature.friendly" :hostile="creature.hostile" />
    </div>
    <div class="controls">
        <slot></slot>
        <actions
            v-if="includeActions && creature && myself && creature.id !== myself.id"
            @action="onAction($event)"
            :icon="true"
            :text="false"
            :target="creature"
            :exclude="excludedActions"
        />
    </div>
    <modal v-if="showDetails" @close="closeDetails()" class="creature-details-modal">
        <template slot="header">
            <entity-name :entity="creature" :editable="true" /> 
            <span v-if="creature.isPlayer">(Soul)</span> 
            <span v-if="creature.dead">(Dead)</span>
        </template>
        <template slot="main">
            <div class="main-section">
                <creature-icon :creature="creature" size="large" />
                <!--<creature-effects :creature="creature" />-->
                <div class="creature-info">
                    <div class="currentAction" v-if="creature.currentAction && creature.currentAction.name">
                        <div class="help-text">Action</div>                       
                        <div class="value-text">
                            <current-action :pass-current-action="creature.currentAction" :interactable="false" class="creature-list" />
                            <span> {{creature.currentAction.name}}</span>
                            <span v-if="creature.currentAction.targetName">&nbsp;- {{creature.currentAction.actionTargetName}}</span>
                            <span>&nbsp;({{creature.currentAction.progress}}%)</span>
                        </div>
                    </div>
                    <div class="equipment-display" v-if="creature.equipment">
                        <div class="help-text">Equipment</div>
                        <div class="equipment-list">
                            <item-icon v-for="(eq, slot) in creature.equipment" :key="slot" :src="eq" :border="equipmentSlotBorder(slot)" />
                        </div>
                    </div>
                    <div v-if="creature.bondLevel">
                        <div class="help-text">
                            Bond level: <span class="bond-level">{{creature.bondLevel}}</span>
                        </div>
                    </div>
                    <div class="trainings-display" v-if="creature.trainings && creature.trainings.length">
                        <div class="help-text">Training</div>
                        <div v-for="training in creature.trainings" class="training-container">
                            <div class="training-name value-text">{{training.name}}</div>
                            <help-icon :title="training.name">
                                {{training.description}}
                            </help-icon>
                        </div>
                    </div>
                    <div class="help-text" v-if="creature.buffs && creature.buffs.length">Effects</div>
                    <creature-effects :creature="creature" :public-only="true" />
                </div>
            </div>
            <section v-if="creature.isPlayer && myself.id !== creature.id">
                <header>Relationship</header>
                <relationship-picker :creature="creature" />
            </section>

            <actions
                class="actions"
                @action="closeDetails();onAction($event);"
                :icon="true"
                :exclude="['Sleep', 'Fight', 'Research', ...excludedActions]"
                :target="creature"
            />
        </template>
    </modal>
</div>
    `
});
