const Item = require("../.item");

class BarkCloth extends Item {}
Item.itemFactory(BarkCloth, {
  name: "Bark Cloth",
  order: ITEMS_ORDER.OTHER,
  icon: `/${ICONS_PATH}/items/cloth/cs_b_05.png`,
  weight: 0.4,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      BarkThread: 20
    },
    building: ["Loom"],
    skill: SKILLS.TAILORING,
    skillLevel: 1,
    baseTime: 45 * MINUTES
  }
});
module.exports = global.BarkCloth = BarkCloth;
