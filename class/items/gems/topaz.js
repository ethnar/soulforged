const Item = require("../.item");

class Topaz extends Item {}
Item.itemFactory(Topaz, {
  nameable: true,
  name: "Topaz",
  order: ITEMS_ORDER.GEMS,
  icon: `/${ICONS_PATH}/items/gems/b_02_a_topaz_blue.png`,
  weight: 0.05
});

class CutTopaz extends Item {}
Item.itemFactory(CutTopaz, {
  dynamicName: () => `${Nameable.getName("Topaz")} (cut)`,
  order: ITEMS_ORDER.GEMS,
  icon: `/${ICONS_PATH}/items/gems/topaz_cut.png`,
  weight: 0.045,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      Topaz: 1
    },
    skill: SKILLS.JEWELCRAFTING,
    skillLevel: 2,
    toolUtility: TOOL_UTILS.GEMCUTTING,
    baseTime: 120 * MINUTES
  }
});
