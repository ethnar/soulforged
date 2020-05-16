const Item = require("../.item");

class DeerLeather extends Item {}
Item.itemFactory(DeerLeather, {
  dynamicName: () => `${Nameable.getName("Deers")} Leather`,
  order: ITEMS_ORDER.OTHER,
  icon: `/${ICONS_PATH}/items/leather/b_03_a_brown.png`,
  weight: 0.7,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      DeerHide: 1
    },
    skill: SKILLS.LEATHERWORKING,
    skillLevel: 1,
    building: ["TanningRack"],
    toolUtility: TOOL_UTILS.CUTTING,
    baseTime: 30 * MINUTES
  }
});
module.exports = global.DeerLeather = DeerLeather;
