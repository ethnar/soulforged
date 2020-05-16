const Item = require("../.item");

class Flour extends Item {}
Item.itemFactory(Flour, {
  name: "Flour",
  order: ITEMS_ORDER.OTHER,
  icon: `/${ICONS_PATH}/items/edibles/am_b_01.png`,
  weight: 0.15,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      Wheat: 4
    },
    skill: SKILLS.MILLING,
    skillLevel: 0,
    toolUtility: TOOL_UTILS.MILLING,
    baseTime: 5 * MINUTES
  }
});
module.exports = global.Flour = Flour;
