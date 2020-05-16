const ClothArmor = require("./.cloth-armor");

class LinenTrousers extends ClothArmor {}
Item.itemFactory(LinenTrousers, {
  name: "Farming Slacks",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/cloth/143_b.png`,
  autoCalculateWeight: true,
  slots: {
    [EQUIPMENT_SLOTS.TROUSERS]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      LinenThread: 4,
      LinenCloth: 3
    },
    toolUtility: TOOL_UTILS.SEWING,
    skill: SKILLS.TAILORING,
    skillLevel: 1,
    baseTime: 50 * MINUTES
  },
  buffs: {
    [BUFFS.TEMPERATURE_MIN]: 0.3,
    [BUFFS.TEMPERATURE_MAX]: 0.5,
    [BUFFS.SKILLS.FARMING]: 0.5
  }
});
module.exports = global.LinenTrousers = LinenTrousers;
