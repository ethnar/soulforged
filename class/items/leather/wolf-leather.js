const Item = require("../.item");

class WolfLeather extends Item {}
Item.itemFactory(WolfLeather, {
  dynamicName: () => `${Nameable.getName("Wolf")} Leather`,
  order: ITEMS_ORDER.OTHER,
  icon: `/${ICONS_PATH}/items/leather/lz_b_04_gray.png`,
  weight: 0.7,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      WolfHide: 1
    },
    skill: SKILLS.LEATHERWORKING,
    skillLevel: 1,
    building: ["TanningRack"],
    toolUtility: TOOL_UTILS.CUTTING,
    baseTime: 30 * MINUTES
  }
});
module.exports = global.WolfLeather = WolfLeather;
