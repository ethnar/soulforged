import { ServerService } from "../../../services/server.js";
import { Utils } from "../../generic/utils.js";
import "../creature.js";
import "./creature-effects.js";
import { ContentFrameService } from "../../../services/content-frame.js";
import { DataService } from "../../../services/data.js";

Vue.component("player-effects-summary", {
  subscriptions() {
    return {
      effectsSummary: DataService.getEffectsSummaryStream(),
      effectsGroups: DataService.getEffectsSummaryStream().map(
        effectsSummary => {
          const grouped = Object.keys(effectsSummary).reduce((acc, stat) => {
            const buff = effectsSummary[stat];
            acc[buff.group] = acc[buff.group] || {};
            acc[buff.group][stat] = buff;
            return acc;
          }, {});
          return Object.keys(grouped)
            .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
            .toObject(
              key => key.split(":")[1],
              key => grouped[key]
            );
        }
      )
    };
  },

  template: `
<div class="item-properties player-effects-summary" v-if="effectsSummary">
    <section v-for="(effects, label) in effectsGroups">
        <header class="secondary">{{label}}</header>
        <div v-for="(buff, stat) in effects" class="value" v-if="buff.value !== 0">
            {{stat}}: <buff-value :buff="buff" />
        </div>
    </section>
</div>
    `
});
