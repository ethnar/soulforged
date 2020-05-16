const Item = require("../.item");

class Mug extends Item {}
Item.itemFactory(Mug, {
  name: "Mug",
  order: ITEMS_ORDER.OTHER,
  icon: `/${ICONS_PATH}/items/materials/mug.png`,
  weight: 0.4,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      HardwoodPlank: 1,
      IronWire: 2
    },
    skill: SKILLS.CARPENTRY,
    skillLevel: 2,
    toolUtility: TOOL_UTILS.SAWING,
    baseTime: 1 * HOURS
  }
});
module.exports = global.Mug = Mug;
