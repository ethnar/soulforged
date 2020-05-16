const Item = require("../.item");

class BarkRope extends Item {}
Item.itemFactory(BarkRope, {
  name: "Bark Rope",
  order: ITEMS_ORDER.OTHER,
  icon: `/${ICONS_PATH}/items/186_b.png`,
  weight: 0.1,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      Twig: 1
    },
    result: {
      BarkRope: 3
    },
    skill: SKILLS.CRAFTING,
    skillLevel: 0,
    toolUtility: TOOL_UTILS.CUTTING,
    baseTime: 30
  }
});
module.exports = global.BarkRope = BarkRope;
