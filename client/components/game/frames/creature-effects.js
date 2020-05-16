import { Utils } from "../../generic/utils.js";

Vue.component("creature-effects", {
  props: {
    creature: null,
    size: {
      default: "normal"
    },
    onlyIcons: Boolean,
    onlyHighSev: Boolean,
    publicOnly: Boolean,
    primaryOnly: Boolean,
    effectsFilter: {
      default: () => () => true
    }
  },

  data: () => ({}),

  subscriptions() {
    const creatureStream = this.stream("creature").filter(c => !!c);

    return {
      buffs: creatureStream
        .filter(player => !!player.buffs)
        .map(player =>
          player.buffs
            .map(buff => ({
              ...buff,
              duration: buff.duration && this.formatDuration(buff.duration),
              effectsText: Utils.getEffectsText(buff)
            }))
            .sort(Utils.buffSorter)
        )
    };
  },

  methods: {
    ucfirst: Utils.ucfirst,
    formatTime: Utils.formatTime,

    buffClick(buff) {
      this.$emit("click", buff);
    },

    formatDuration(duration) {
      if (duration && typeof duration === "string") {
        return duration;
      }
      if (!duration.min && !duration.max) {
        return null;
      }
      const min = Utils.formatTime(duration.min, 2);
      const max = Utils.formatTime(duration.max, 2);
      if (min === max) {
        return min;
      }
      return `${min} ~ ${max}`;
    }
  },

  template: `
<div class="creature-effects" :class="{ 'only-icons': onlyIcons }" v-if="creature">
    <section v-if="buffs && buffs.length">
        <div
            v-for="buff in buffs"
            v-if="(!onlyHighSev || buff.severity) && (!publicOnly || buff.public) && (!primaryOnly || !buff.secondary) && effectsFilter(buff)"
            class="buff"
            :class="[ buff.name, 'severity-' + buff.severity, { 'list-item-with-props': !onlyIcons }]"
            @click="buffClick(buff)"
        >
            <div class="main-icon">
                <item-icon :size="size" :src="buff.icon" :qty="buff.stacked" :level="buff.level"></item-icon>
            </div>
            <div class="details" v-if="!onlyIcons">
                <div class="label">
                    {{buff.name}} <template v-if="buff.duration" class="nowrap">({{buff.duration}})</template>
                </div>
                <div class="description help-text">
                    {{buff.effectsText}}
                </div>
            </div>
        </div>        
    </section>
</div>
    `
});
