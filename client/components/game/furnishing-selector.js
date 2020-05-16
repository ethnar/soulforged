import { ServerService } from "../../services/server.js";
import { DataService } from "../../services/data.js";

Vue.component("furnishing-selector", {
  props: ["furnishingSlotNumber"],

  data: () => ({
    expanded: false,
    fitActionFinder: () => false,
    unfitActionFinder: () => false,
    furnitureSlot: null
  }),

  subscriptions() {
    return {
      validItems: Rx.Observable.combineLatestMap({
        inventory: DataService.getMyHomeInventoryStream(),
        fitActionFinder: this.stream("fitActionFinder")
      }).map(({ inventory, fitActionFinder }) =>
        inventory.items.filter(item => item.actions.some(fitActionFinder))
      ),
      furnishing: Rx.Observable.combineLatestMap({
        furnishing: DataService.getMyFurnitureStream().distinctUntilChanged(
          null,
          JSON.stringify
        ),
        furnishingSlotNumber: this.stream("furnishingSlotNumber")
      }).do(({ furnishing, furnishingSlotNumber }) => {
        this.furnitureSlot = furnishing.find(
          slot => slot.slotNumber === furnishingSlotNumber
        );
      })
    };
  },

  watch: {
    expanded() {
      if (this.expanded) {
        if (window.expandedSelector && window.expandedSelector !== this) {
          window.expandedSelector.expanded = false;
        }
        window.expandedSelector = this;
      }
    }
  },

  computed: {
    furnitureSlotName() {
      const result = this.furnitureSlot && this.furnitureSlot.slotType;
      this.fitActionFinder = a => a.id === `Fit: ${result}`;
      this.unfitActionFinder = a => a.id === `Take down`;
      return result;
    },

    border() {
      switch (
        this.furnitureSlotName // TODO: possible discrepancy with other code
      ) {
        default:
          return "2 green";
      }
    },

    showSelector() {
      return this.fittedItem || (this.validItems && this.validItems.length);
    },

    fittedItem() {
      return this.furnitureSlot && this.furnitureSlot.item;
    }
  },

  methods: {
    fitItem(item) {
      this.unfitCurrent();

      this.stream("fittedItem")
        .filter(i => !i)
        .first()
        .toPromise()
        .then(() => {
          const action = item.actions.find(this.fitActionFinder);
          ServerService.request("action", {
            action: action.id,
            target: item.id,
            context: this.furnishingSlotNumber
          }).then(() => {
            this.expanded = false;
          });
        });
    },

    canFit(item) {
      const action = item.actions.find(this.fitActionFinder);
      return action && action.available;
    },

    unfitCurrent() {
      const item = this.fittedItem;
      if (!item) {
        return Promise.resolve();
      }
      const action = item.actions.find(this.unfitActionFinder);
      return ServerService.request("action", {
        action: action.id,
        target: item.id,
        context: action.context
      }).then(() => {
        this.expanded = false;
      });
    }
  },

  template: `
<div class="equipment-selector" :class="{ expanded: expanded }">
    <label>Selection: {{furnitureSlotName}}</label>
    <div class="selected-item" @click="expanded = !expanded">
        <item :border="border" :data="fittedItem" v-if="fittedItem" :interactable="false" />
        <item-icon :border="border" v-else="" @click="" class="empty" />
    </div>
    <div class="available-items" v-if="expanded">
        <div class="utility-button-item">
            <item-icon v-if="fittedItem" @click="unfitCurrent()" src="images/ui/checkbox_01.png"></item-icon>
        </div>
        <item v-for="(item, idx) in validItems" :interactable="false" :data="item" :key="'i' + idx" @click="fitItem(item)"></item>
    </div>
</div>
`
});
