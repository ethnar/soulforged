const Item = require("../.item");

class Barrel extends Item {}
Item.itemFactory(Barrel, {
  name: "Barrel",
  order: ITEMS_ORDER.OTHER,
  icon: `/${ICONS_PATH}/items/materials/barrel.png`,
  weight: 4,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      HardwoodPlank: 4,
      IronNails: 12,
      IronWire: 3
    },
    skill: SKILLS.CARPENTRY,
    skillLevel: 2,
    toolUtility: TOOL_UTILS.SAWING,
    baseTime: 2 * HOURS
  }
});
module.exports = global.Barrel = Barrel;
