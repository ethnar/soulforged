const Item = require("../.item");

class BearLeather extends Item {}
Item.itemFactory(BearLeather, {
  dynamicName: () => `${Nameable.getName("Bear")} Leather`,
  order: ITEMS_ORDER.OTHER,
  icon: `/${ICONS_PATH}/items/leather/lz_b_02.png`,
  weight: 0.7,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      BearHide: 1
    },
    skill: SKILLS.LEATHERWORKING,
    skillLevel: 2,
    building: ["TanningRack"],
    toolUtility: TOOL_UTILS.CUTTING,
    baseTime: 30 * MINUTES
  }
});
module.exports = global.BearLeather = BearLeather;
