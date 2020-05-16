const Item = require("../.item");

class SilkThread extends Item {}
Item.itemFactory(SilkThread, {
  name: "Silk Thread",
  order: ITEMS_ORDER.OTHER,
  icon: `/${ICONS_PATH}/items/cloth/152_b_recolor.png`,
  weight: 0.05,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      Webs: 3
    },
    result: {
      SilkThread: 5
    },
    skill: SKILLS.TAILORING,
    skillLevel: 5,
    toolUtility: TOOL_UTILS.WEAVING,
    baseTime: 45 * MINUTES
  }
});
module.exports = global.SilkThread = SilkThread;

class Webs extends ExpirableItem {}
Item.itemFactory(Webs, {
  name: "Webs",
  order: ITEMS_ORDER.OTHER,
  icon: `/${ICONS_PATH}/items/cloth/addon_08_recolor.png`,
  weight: 0.1,
  expiresIn: 7 * DAYS
});
module.exports = global.Webs = Webs;
