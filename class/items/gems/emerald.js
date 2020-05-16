const Item = require("../.item");

class Emerald extends Item {}
Item.itemFactory(Emerald, {
  nameable: true,
  name: "Emerald",
  order: ITEMS_ORDER.GEMS,
  icon: `/${ICONS_PATH}/items/gems/gmn1_b_saturated.png`,
  weight: 0.05
});

class CutEmerald extends Item {}
Item.itemFactory(CutEmerald, {
  dynamicName: () => `${Nameable.getName("Emerald")} (cut)`,
  order: ITEMS_ORDER.GEMS,
  icon: `/${ICONS_PATH}/items/gems/emerald_cut.png`,
  weight: 0.045,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      Emerald: 1
    },
    skill: SKILLS.JEWELCRAFTING,
    skillLevel: 4,
    toolUtility: TOOL_UTILS.GEMCUTTING,
    baseTime: 120 * MINUTES
  }
});
