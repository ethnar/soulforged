import "../carry-capacity-indicator.js";
import "../equipment-selector.js";
import { DataService } from "../../../services/data.js";

Vue.component("player-equipment", {
  data: () => ({}),

  subscriptions() {
    return {
      equipment: DataService.getMyEquipmentStream()
    };
  },

  template: `
<div class="player-equipment" v-if="equipment">
    <section>
        <header>Equipment</header>
        <div v-for="(slot, idx) in equipment" class="list-item-with-props">
            <div class="main-icon">
                <equipment-selector :equipment-slot="slot.slot"/>
            </div>
            <div class="details">
                <div class="label">
                    <div>{{slot.slot}}</div>
                </div>
                <div class="description help-text" v-if="slot.item">
                    {{slot.item.name}}
                </div>
            </div>
        </div>
    </section>
</div>
    `
});
