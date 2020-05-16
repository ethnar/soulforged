const Item = require("../.item");
require("../../resources/twigs");
require("../leather/bark-thread");

class FishingRod extends Item {}
Item.itemFactory(FishingRod, {
  name: "Fishing Rod",
  icon: `/${ICONS_PATH}/items/equipment/prehistoricicon_47_b.png`,
  order: ITEMS_ORDER.TOOLS,
  autoCalculateWeight: true,
  slots: {
    [EQUIPMENT_SLOTS.TOOL]: 1
  },
  utility: {
    [TOOL_UTILS.FISHING]: 1.5
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      Twig: 1,
      BarkThread: 1,
      BoneHook: 1
    },
    skill: SKILLS.CRAFTING,
    skillLevel: 0,
    baseTime: 2 * MINUTES
  }
});
module.exports = global.FishingRod = FishingRod;
