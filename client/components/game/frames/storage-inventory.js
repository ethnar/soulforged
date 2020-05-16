import "../../game/carry-capacity-indicator.js";
import { DataService } from "../../../services/data.js";

Vue.component("storage-inventory", {
  props: ["filter"],

  subscriptions() {
    return {
      homeInventory: DataService.getMyHomeInventoryStream()
    };
  },

  template: `
<div v-if="homeInventory">
    <section>
        <header class="secondary">
            Storage
        </header>
        <carry-capacity-indicator
            :current="homeInventory.weight"
            :max="homeInventory.weightLimit"
        />
        <inventory :data="homeInventory.items" type="storage" :filter="filter"></inventory>
    </section>
</div>
    `
});
