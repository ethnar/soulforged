const Item = require("../.item");

class LimestoneBlock extends Item {}
Item.itemFactory(LimestoneBlock, {
  name: "Limestone Block",
  icon: `/${ICONS_PATH}/items/stone/st_b_05_limestone.png`,
  order: ITEMS_ORDER.OTHER,
  weight: 4,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      Limestone: 1
    },
    skill: SKILLS.CRAFTING,
    skillLevel: 0,
    toolUtility: TOOL_UTILS.CARVING,
    baseTime: 30 * MINUTES
  }
});
module.exports = global.LimestoneBlock = LimestoneBlock;
