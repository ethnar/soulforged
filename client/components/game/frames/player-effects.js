import { ServerService } from "../../../services/server.js";
import "../creature.js";
import "./creature-effects.js";
import { ContentFrameService } from "../../../services/content-frame.js";
import { DataService } from "../../../services/data.js";

Vue.component("player-effects", {
  props: {
    onlyIcons: Boolean,
    onlyHighSev: Boolean,
    size: String
  },

  subscriptions() {
    return {
      myCreature: DataService.getMyCreatureStream()
    };
  },

  methods: {
    onClick() {
      ContentFrameService.triggerShowPanel("effects");
    }
  },

  template: `
<creature-effects
    @click="onClick()"
    class="player-effects"
    :class="{ interactable: onlyIcons }"
    :size="size"
    :creature="myCreature"
    :only-icons="onlyIcons"
    :only-high-sev="onlyHighSev"
/>
    `
});

Vue.component("player-effects-full-panel", {
  props: {
    size: String
  },

  data: () => ({
    buffDetail: null
  }),

  computed: {
    buffDetailCreature() {
      return { buffs: this.buffDetail ? [this.buffDetail] : [] };
    }
  },

  subscriptions() {
    return {
      myCreature: DataService.getMyCreatureStream(),
      effectsGroups: DataService.getMyCreatureStream().map(creature => {
        const grouped = creature.buffs.reduce((acc, buff) => {
          acc[buff.category] = acc[buff.category] || { buffs: [] };
          acc[buff.category].buffs.push(buff);
          return acc;
        }, {});
        return Object.keys(grouped)
          .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
          .toObject(
            key => key.split(":")[1],
            key => grouped[key]
          );
      })
    };
  },

  template: `
<div>
    <div class="buff-tip panel-tip" @click="buffDetail = null" v-if="buffDetail">
        <creature-effects
            class="player-effects"
            :size="size"
            :creature="buffDetailCreature"
        />
    </div>
    <div class="player-effects-grouped">
        <section v-for="(creatureMock, category) in effectsGroups">
            <header class="secondary">{{category}}</header>
            <creature-effects
                class="player-effects"
                :size="size"
                :creature="creatureMock"
                @click="buffDetail = $event"
            />
        </section>
    </div>
<!--    <creature-effects-->
<!--        class="player-effects"-->
<!--        :size="size"-->
<!--        :creature="myCreature"-->
<!--    />-->
</div>
    `
});
