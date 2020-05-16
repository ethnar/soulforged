const Item = require("../.item");

class SilkCloth extends Item {}
Item.itemFactory(SilkCloth, {
  name: "Silk Cloth",
  order: ITEMS_ORDER.OTHER,
  icon: `/${ICONS_PATH}/items/cloth/165_b_recolor.png`,
  weight: 0.5,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      SilkThread: 10
    },
    building: ["BasicLoom"],
    skill: SKILLS.TAILORING,
    skillLevel: 3,
    baseTime: 1.5 * HOURS
  }
});
module.exports = global.SilkCloth = SilkCloth;
