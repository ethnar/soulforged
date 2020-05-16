const Item = require("../.item");

class Heckle extends Item {}
Item.itemFactory(Heckle, {
  name: "Heckle",
  icon: `/${ICONS_PATH}/items/equipment/cage_b_01_heckle.png`,
  order: ITEMS_ORDER.TOOLS,
  slots: {
    [EQUIPMENT_SLOTS.TOOL]: 1
  },
  utility: {
    [TOOL_UTILS.WEAVING]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      WoodenShaft: 5,
      WoodenPlank: 1,
      BarkThread: 3
    },
    skill: SKILLS.CARPENTRY,
    skillLevel: 2,
    baseTime: 1 * HOURS
  }
});
module.exports = global.Heckle = Heckle;
