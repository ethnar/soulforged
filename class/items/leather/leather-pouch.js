const Item = require("../.item");

class LeatherPouch extends Item {}
Item.itemFactory(LeatherPouch, {
  name: "Leather Pouch",
  icon: `/${ICONS_PATH}/items/alchemy/pouch_b_empty.png`,
  weight: 0.05,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      DeerLeather: 2,
      BarkThread: 4,
      BarkRope: 1
    },
    result: {
      LeatherPouch: 3
    },
    skill: SKILLS.LEATHERWORKING,
    skillLevel: 1,
    toolUtility: TOOL_UTILS.SEWING,
    baseTime: 60 * MINUTES
  }
});
module.exports = global.LeatherPouch = LeatherPouch;
