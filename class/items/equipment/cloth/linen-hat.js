const ClothArmor = require("./.cloth-armor");
require("../../../resources/popping/plants/wheat");

class LinenWheatHat extends ClothArmor {}
Item.itemFactory(LinenWheatHat, {
  name: "Straw Hat",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/cloth/144_b.png`,
  autoCalculateWeight: true,
  slots: {
    [EQUIPMENT_SLOTS.HEAD]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      LinenThread: 3,
      LinenCloth: 2,
      BarkRope: 1,
      Wheat: 15
    },
    toolUtility: TOOL_UTILS.SEWING,
    skill: SKILLS.TAILORING,
    skillLevel: 2,
    baseTime: 50 * MINUTES
  },
  buffs: {
    [BUFFS.TEMPERATURE_MIN]: 0.4,
    [BUFFS.TEMPERATURE_MAX]: 1.1,
    [BUFFS.SKILLS.FISHING]: 0.2,
    [BUFFS.SKILLS.FARMING]: 0.2
  }
});
