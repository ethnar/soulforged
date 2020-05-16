const Item = require("../.item");

class Amber extends Item {}
Item.itemFactory(Amber, {
  nameable: true,
  name: "Amber",
  order: ITEMS_ORDER.GEMS,
  icon: `/${ICONS_PATH}/items/gems/amber_stone.png`,
  weight: 0.05
});

class CutAmber extends Item {}
Item.itemFactory(CutAmber, {
  dynamicName: () => `${Nameable.getName("Amber")} (cut)`,
  order: ITEMS_ORDER.GEMS,
  icon: `/${ICONS_PATH}/items/gems/amber_cut.png`,
  weight: 0.045,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      Amber: 1
    },
    skill: SKILLS.JEWELCRAFTING,
    skillLevel: 1,
    toolUtility: TOOL_UTILS.GEMCUTTING,
    baseTime: 120 * MINUTES
  }
});
