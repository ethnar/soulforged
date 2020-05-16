const Item = require("../.item");
require("./leather-straps");

class LeatherRope extends Item {}
Item.itemFactory(LeatherRope, {
  name: "Leather Rope",
  order: ITEMS_ORDER.OTHER,
  icon: `/${ICONS_PATH}/items/leather/pt_b_06.png`,
  autoCalculateWeight: true,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      LeatherStraps: 3
    },
    skill: SKILLS.LEATHERWORKING,
    skillLevel: 1,
    baseTime: 1 * HOURS
  }
});
module.exports = global.LeatherRope = LeatherRope;
