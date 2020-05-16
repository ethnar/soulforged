const Item = require("../.item");

class LinenThread extends Item {}
Item.itemFactory(LinenThread, {
  name: "Linen Thread",
  order: ITEMS_ORDER.OTHER,
  icon: `/${ICONS_PATH}/items/cloth/pt_b_08.png`,
  weight: 0.05,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      Spoolroot: 3
    },
    result: {
      LinenThread: 5
    },
    skill: SKILLS.TAILORING,
    skillLevel: 2,
    toolUtility: TOOL_UTILS.WEAVING,
    baseTime: 30 * MINUTES
  }
});
module.exports = global.LinenThread = LinenThread;
