const Item = require("../.item");

class BisonLeather extends Item {}
Item.itemFactory(BisonLeather, {
  dynamicName: () => `${Nameable.getName("BisonHerd")} Leather`,
  order: ITEMS_ORDER.OTHER,
  icon: `/${ICONS_PATH}/items/leather/huntingicons_118_b.png`,
  weight: 0.7,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      BisonHide: 1
    },
    skill: SKILLS.LEATHERWORKING,
    skillLevel: 3,
    building: ["TanningRack"],
    toolUtility: TOOL_UTILS.CUTTING,
    baseTime: 45 * MINUTES
  }
});
module.exports = global.BisonLeather = BisonLeather;
