const Item = require("../.item");

class ClayTablet extends Item {}
Item.itemFactory(ClayTablet, {
  name: "Clay Tablet",
  order: ITEMS_ORDER.OTHER,
  icon: `/${ICONS_PATH}/prehistoricicon_44_b_text_blank.png`,
  weight: 1,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      Clay: 1
    },
    toolUtility: TOOL_UTILS.HAMMER,
    skill: SKILLS.CRAFTING,
    skillLevel: 1,
    baseTime: 10 * MINUTES
  }
});
