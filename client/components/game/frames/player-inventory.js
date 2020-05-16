import { ServerService } from "../../../services/server.js";
import "../../game/carry-capacity-indicator.js";
import { DataService } from "../../../services/data.js";

Vue.component("player-inventory", {
  data: () => ({ showFilter: false, nameFilter: "" }),

  subscriptions() {
    return {
      inventory: DataService.getMyInventoryStream()
    };
  },

  computed: {
    itemFilter() {
      return item =>
        !this.nameFilter ||
        !this.showFilter ||
        item.name.toLowerCase().includes(this.nameFilter.toLowerCase());
    }
  },

  methods: {
    focusFilter() {
      setTimeout(() => {
        const filter = this.$refs.filter;
        if (filter) {
          filter.focus();
        }
      });
    }
  },

  template: `
<div class="player-inventory">
    <input ref="filter" class="full-width margin-bottom filter-input" v-if="showFilter" v-model="nameFilter" placeholder="Start typing to filter..." />
    <div class="inventory-wrapper">
        <section v-if="inventory">
            <header>
                <toggle-filter-button v-model="showFilter" @input="focusFilter()" />
                Inventory
            </header>
            <carry-capacity-indicator
                :current="inventory.weights.currentWeight"
                :thresholds="inventory.weights.thresholds"
            />
            <inventory :data="inventory.items" type="player" :filter="itemFilter"></inventory>
        </section>
        <storage-inventory :filter="itemFilter" />
    </div>
</div>
    `
});
