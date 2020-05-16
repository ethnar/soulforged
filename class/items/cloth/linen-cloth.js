const Item = require("../.item");

class LinenCloth extends Item {}
Item.itemFactory(LinenCloth, {
  name: "Linen Cloth",
  order: ITEMS_ORDER.OTHER,
  icon: `/${ICONS_PATH}/items/cloth/cs_b_01_linen.png`,
  weight: 1,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      LinenThread: 20
    },
    building: ["Loom"],
    skill: SKILLS.TAILORING,
    skillLevel: 1,
    baseTime: 1 * HOURS
  }
});
module.exports = global.LinenCloth = LinenCloth;
