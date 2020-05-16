const Item = require("../.item");

class CageTrap extends Item {}
Item.itemFactory(CageTrap, {
  name: "Cage Trap",
  icon: `/${ICONS_PATH}/items/equipment/cage_b_01_dark.png`,
  order: ITEMS_ORDER.OTHER,
  weight: 3,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      LeatherRope: 2,
      WoodenShaft: 6,
      WoodenPlank: 2
    },
    skill: SKILLS.CARPENTRY,
    skillLevel: 2,
    toolUtility: TOOL_UTILS.SAWING,
    baseTime: 1 * HOURS
  }
});
module.exports = global.CageTrap = CageTrap;
