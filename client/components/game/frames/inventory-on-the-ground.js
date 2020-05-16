import { DataService } from "../../../services/data.js";

Vue.component("inventory-on-the-ground", {
  data: () => ({
    showFilter: false,
    nameFilter: ""
  }),

  subscriptions() {
    return {
      nodeInventory: DataService.getNodeItemsStream()
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
    <section v-if="nodeInventory">
        <input ref="filter" class="full-width margin-bottom" v-if="showFilter" v-model="nameFilter" placeholder="Start typing to filter..." />
        <header>
            <toggle-filter-button v-model="showFilter" @input="focusFilter()" />
            Items on the ground
            <help-icon title="Items on the ground" class="left-side">
                Item left on the ground will dissipate after some time.
            </help-icon>
        </header>
        <div v-if="!nodeInventory.length" class="empty-list"></div>
        <inventory :data="nodeInventory" :filter="itemFilter" />
    </section>
</div>
    `
});
