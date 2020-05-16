const Item = require("../.item");

class Glue extends Item {}
Item.itemFactory(Glue, {
  name: "Glue",
  icon: `/${ICONS_PATH}/items/176_b.png`,
  order: ITEMS_ORDER.OTHER,
  weight: 0.5,
  research: {
    sameAsCrafting: true
  },
  containerItemType: ClayPot,
  crafting: {
    materials: {
      Bonemeal: 12,
      Lime: 1,
      ClayPot: 1
    },
    skill: SKILLS.CRAFTING,
    skillLevel: 1,
    toolUtility: TOOL_UTILS.HAMMER,
    baseTime: 20 * MINUTES
  }
});
module.exports = global.Glue = Glue;
