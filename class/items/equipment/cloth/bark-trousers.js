const ClothArmor = require("./.cloth-armor");

class BarkTrousers extends ClothArmor {}
Item.itemFactory(BarkTrousers, {
  name: "Work Pants",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/cloth/pn_l_01_b_brown.png`,
  autoCalculateWeight: true,
  slots: {
    [EQUIPMENT_SLOTS.TROUSERS]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      BarkThread: 4,
      BarkCloth: 2
    },
    toolUtility: TOOL_UTILS.SEWING,
    skill: SKILLS.TAILORING,
    skillLevel: 1,
    baseTime: 50 * MINUTES
  },
  buffs: {
    [BUFFS.TEMPERATURE_MIN]: 0.2,
    [BUFFS.TEMPERATURE_MAX]: 0.2,
    [BUFFS.MOOD]: -3,
    [BUFFS.SKILLS.MINING]: 0.3,
    [BUFFS.SKILLS.FORAGING]: 0.3,
    [BUFFS.SKILLS.WOODCUTTING]: 0.3
  }
});
module.exports = global.BarkTrousers = BarkTrousers;
