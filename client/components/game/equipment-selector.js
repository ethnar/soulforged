import { ServerService } from "../../services/server.js";
import { Utils } from "../generic/utils.js";
import { DataService } from "../../services/data.js";

Vue.component("equipment-selector", {
  props: ["equipmentSlot"],

  data: () => ({
    expanded: false,
    equipActionFinder: () => false,
    unequipActionFinder: () => false
  }),

  subscriptions() {
    return {
      validItems: Rx.Observable.combineLatestMap({
        items: DataService.getMyInventoryStream().map(
          inventory => inventory.items
        ),
        equipActionFinder: this.stream("equipActionFinder")
      }).map(({ items, equipActionFinder }) =>
        items.filter(item => item.actions.some(equipActionFinder))
      ),
      equipment: DataService.getMyEquipmentStream().distinctUntilChanged(
        null,
        JSON.stringify
      )
    };
  },

  watch: {
    equipmentSlot: {
      handler() {
        this.equipActionFinder = a => a.id === `Equip: ${this.equipmentSlot}`;
        this.unequipActionFinder = a =>
          a.id === `Unequip: ${this.equipmentSlot}`;
      },
      immediate: true
    },
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
    border() {
      return Utils.equipmentSlotBorder(this.equipmentSlot);
    },

    showSelector() {
      return this.equippedItem || (this.validItems && this.validItems.length);
    },

    equippedItem() {
      if (!this.equipment) return null;
      const theSlot = this.equipment.find(
        slot => slot.slot === this.equipmentSlot
      );
      return theSlot && theSlot.item;
    }
  },

  methods: {
    equipItem(item) {
      const action = item.actions.find(this.equipActionFinder);
      ServerService.request("action", {
        action: action.id,
        target: item.id,
        context: action.context
      }).then(() => {
        this.expanded = false;
      });
    },

    unequipCurrent() {
      const item = this.equippedItem;
      const action = item.actions.find(this.unequipActionFinder);
      ServerService.request("action", {
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
    <label>Selection: {{equipmentSlot}}</label>
    <div class="selected-item" @click="expanded = !expanded">
        <item :border="border" :data="equippedItem" v-if="equippedItem" :interactable="false" />
        <item-icon :border="border" v-else="" @click="" class="empty" />
    </div>
    <div class="available-items" v-if="expanded">
        <div class="utility-button-item">
            <item-icon v-if="equippedItem" @click="unequipCurrent()" src="images/ui/checkbox_01.png"></item-icon>
        </div>
        <item v-for="(item, idx) in validItems" :interactable="false" :data="item" :key="'i' + idx" @click="equipItem(item)"></item>
    </div>
</div>
`
});
