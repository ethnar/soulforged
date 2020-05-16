import { Utils } from "../../generic/utils.js";
import "../furnishing-selector.js";
import { DataService } from "../../../services/data.js";

Vue.component("house-decorations", {
  data: () => ({}),

  subscriptions() {
    return {
      furnishing: DataService.getMyFurnitureStream()
    };
  },

  methods: {
    getEffects(item) {
      return Utils.getEffectsText({
        effects: Object.keys(item.buffs).toObject(
          k => item.buffs[k].stat,
          k => item.buffs[k].value
        )
      });
    }
  },

  template: `
<div v-if="furnishing" class="house-decoration">
    <section>
        <header>
            Furnishing
            <help-icon title="Furniture & decorations">
                The items used to furnish the house provide a bonus that is accumulated by your character while sleeping and is gradually degrading during your character's activity.<br/>
                To gain the beneficial effects your character must be sleeping at the location of the building that contains the decorative items.<br/>
                Only one copy of each of the items can be placed as decorations in a house at a time.
            </help-icon>
        </header>
        <div v-for="slot in furnishing" class="list-item-with-props">
            <div class="main-icon">
                <furnishing-selector :furnishing-slot-number="slot.slotNumber" />
            </div>
            <div class="details">
                <div class="label">
                    <div>{{slot.slotType}}</div>
                </div>
                <div class="description help-text" v-if="slot.item">
                    {{slot.item.name}}, {{getEffects(slot.item)}}
                </div>
            </div>
        </div>
    </section>
</div>
    `
});
