const Item = require("../.item");

class Diamond extends Item {}
Item.itemFactory(Diamond, {
  nameable: true,
  name: "Diamond",
  order: ITEMS_ORDER.GEMS,
  icon: `/${ICONS_PATH}/items/gems/35_white.png`,
  weight: 0.05
});

class CutDiamond extends Item {}
Item.itemFactory(CutDiamond, {
  dynamicName: () => `${Nameable.getName("Diamond")} (cut)`,
  order: ITEMS_ORDER.GEMS,
  icon: `/${ICONS_PATH}/items/gems/diamond_cut.png`,
  weight: 0.045,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      Diamond: 1
    },
    skill: SKILLS.JEWELCRAFTING,
    skillLevel: 5,
    toolUtility: TOOL_UTILS.GEMCUTTING,
    baseTime: 120 * MINUTES
  }
});
