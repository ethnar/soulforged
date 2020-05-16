const IndestructibleItem = require("../.indestructible-item");

const actions = Action.groupById([
  new Action({
    name: "Make a copy",
    icon: "/actions/icons8-key-2-100.png",
    valid(key, creature) {
      if (!creature.knowsItem("KeyMold")) {
        return false;
      }
      if (!creature.hasItem(key)) {
        return false;
      }
      return true;
    },
    runCheck(key, creature) {
      const materials = {
        MeltedCopper: 1,
        KeyMold: 1
      };
      if (key.name.includes("(copy)")) {
        return "You can only make copies from the original.";
      }
      if (!creature.hasMaterials(materials)) {
        return "You need melted copper and key mold to do this.";
      }
      return true;
    },
    run(key, creature, seconds) {
      if (creature.progressingAction(seconds, 5 * MINUTES, SKILLS.SMELTING)) {
        creature.spendMaterials({
          MeltedCopper: 1
        });

        creature.addItem(
          new Key({
            name: `${key.getName()} (copy)`,
            keyId: key.keyId,
            icon: key.icon,
            indestructible: false
          })
        );

        creature.reStackItems();

        return false;
      }
      return true;
    }
  })
]);

class Key extends IndestructibleItem {
  static actions() {
    return { ...actions, ...IndestructibleItem.actions() };
  }

  getTradeId() {
    return [...super.getTradeId(), this.keyId, this.name, this.icon];
  }

  split(qty) {
    const newStack = new this.constructor({
      qty: qty,
      name: this.name,
      icon: this.icon,
      keyId: this.keyId,
      indestructible: this.indestructible
    });
    this.getContainer().addItem(newStack);
    this.qty = this.qty - qty;
    return newStack;
  }

  static inferPayload(creature, tradeId) {
    const result = Item.inferPayload(creature, tradeId);
    result.name = tradeId[4];
    result.icon = server.getImage(creature, tradeId[5]);
    return result;
  }

  static getTradeId() {
    return null;
  }
}
Object.assign(Key.prototype, {
  name: "Key",
  order: ITEMS_ORDER.KEYS,
  weight: 0.2
  // stackable: false,
});

class KeyMold extends Item {}
Item.itemFactory(KeyMold, {
  name: "Key mold",
  order: ITEMS_ORDER.OTHER,
  weight: 5,
  icon: `/${ICONS_PATH}/items/molds/155_b_key.png`,
  crafting: {
    materials: {
      Clay: 3,
      Sand: 2
    },
    building: ["Kiln"],
    skill: SKILLS.CRAFTING,
    skillLevel: 2,
    baseTime: 40 * MINUTES
  }
});

new Inspiration({
  name: `KeyMold`,
  requirements: [
    ResearchConcept.knownItem("ResearchConcept_MetalCasting"),
    ResearchConcept.knownItem("Key")
  ],
  onInspire: player => {
    player.getCreature().learnCrafting(Recipe.getRecipeById("KeyMold"));
  }
});

module.exports = global.Key = Key;
