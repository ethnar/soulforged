const Item = require("../.item");

class Amethyst extends Item {}
Item.itemFactory(Amethyst, {
  nameable: true,
  name: "Amethyst",
  order: ITEMS_ORDER.GEMS,
  icon: `/${ICONS_PATH}/items/gems/necromancericons_15_b_purple.png`,
  weight: 0.05
});

class CutAmethyst extends Item {}
Item.itemFactory(CutAmethyst, {
  dynamicName: () => `${Nameable.getName("Amethyst")} (cut)`,
  order: ITEMS_ORDER.GEMS,
  icon: `/${ICONS_PATH}/items/gems/amethyst_cut.png`,
  weight: 0.045,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      Amethyst: 1
    },
    skill: SKILLS.JEWELCRAFTING,
    skillLevel: 6,
    toolUtility: TOOL_UTILS.GEMCUTTING,
    baseTime: 120 * MINUTES
  }
});
