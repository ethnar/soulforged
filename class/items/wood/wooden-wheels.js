const Item = require("../.item");
require("../../resources/regrowing/trees/mahogany");

class WoodenWheel extends Item {}
Item.itemFactory(WoodenWheel, {
  name: "Wooden Wheel",
  order: ITEMS_ORDER.OTHER,
  icon: `/${ICONS_PATH}/items/wood/sgi_153_black.png`,
  autoCalculateWeight: true,
  research: {
    sameAsCrafting: true,
    materials: {
      ResearchConcept_Machinery: 0
    }
  },
  crafting: {
    materials: {
      IronRod: 2,
      HardwoodShaft: 4,
      TrueIronNails: 8,
      MahoganyWood: 2
    },
    skill: SKILLS.CARPENTRY,
    skillLevel: 5,
    toolUtility: TOOL_UTILS.SAWING,
    baseTime: 3 * HOURS
  }
});
module.exports = global.WoodenWheel = WoodenWheel;
