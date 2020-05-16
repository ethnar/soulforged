import { ServerService } from "../../services/server.js";
import { Utils } from "../generic/utils.js";
import { ToastNotification } from "../generic/toast-notification.js";

Vue.component("perk-icon", {
  props: {
    src: String,
    small: Boolean,
    tiny: Boolean
  },

  template: `
<div
    class="item-icon perk-icon"
    :class="{ interactable: $listeners.click, small: small, tiny: tiny }"
    @click="$emit('click', $event)"
>
    <div class="slot">
        <img :src="src" v-if="src">
        <slot></slot>
    </div>
</div>
    `
});

Vue.component("perks", {
  data: () => ({
    pointBalance: 0
  }),

  computed: {
    soulLevelFull() {
      return Math.floor(this.soulLevel);
    }
  },

  subscriptions() {
    const soulInfoStream = Rx.Observable.fromPromise(
      ServerService.request("getSoulInfo")
    );

    return {
      soulPoints: soulInfoStream
        .pluck("soulPoints")
        .do(soulPoints => (this.pointBalance = soulPoints)),
      soulLevel: soulInfoStream.pluck("soulLevel"),
      perks: soulInfoStream.pluck("perks").map(perks =>
        perks.map(perk => ({
          ...perk,
          effectsText: Utils.formatEffects(perk)
            .filter(text => !!text)
            .join(", ")
        }))
      )
    };
  },

  methods: {
    togglePerk(perk) {
      if (!perk.selected && this.pointBalance < perk.pointCost) {
        ToastNotification.notify("Not enough perk points");
        return;
      }

      perk.selected = !perk.selected;

      const selected = this.perks.filter(p => p.selected);

      this.$emit("perks-selected", selected);

      this.pointBalance =
        this.soulPoints - selected.reduce((acc, i) => acc + i.pointCost, 0);
    },

    skillProgress(value) {
      return (value - Math.floor(value)) * 100;
    }
  },

  template: `
<section class="perks" v-if="perks && perks.length">
    <header>Traits ({{pointBalance}})</header>
    <div class="skill-indicator" v-if="soulLevel > 0">
        <div class="skill-level" :class="'skill-level-' + soulLevelFull">{{soulLevelFull}}</div>
        <div class="skill-name">Soul Level</div>
        <div class="skill-meter">
            <div class="background"></div>
            <div
                class="meter-clip"
                :style="{ width: (skillProgress(soulLevel) || 0) + '%' }"
            >
                <div class="meter-bar blue" :style="{ 'background-size': (1000 / (skillProgress(soulLevel) || 0)) + '% 100%' }"></div>
            </div>
        </div>
    </div>
    <div class="perks-list-wrapper">
        <div class="perks-list">
            <div v-for="perk in perks" class="list-item-with-props interactable perk-item" :class="{selected: perk.selected}" @click="togglePerk(perk)">
                <div class="main-icon">
                    <perk-icon :src="perk.icon"></perk-icon>
                </div>
                <div class="details">
                    <div class="label">
                        <div>{{perk.name}} ({{perk.pointCost}})</div>
                    </div>
                    <div class="description help-text">
                        {{perk.effectsText}}
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
    `
});
