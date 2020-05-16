const ClothArmor = require("./.cloth-armor");

class BarkShirt extends ClothArmor {}
Item.itemFactory(BarkShirt, {
  name: "Work Shirt",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/cloth/127_b.png`,
  autoCalculateWeight: true,
  slots: {
    [EQUIPMENT_SLOTS.CHEST]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      BarkThread: 4,
      BarkCloth: 2,
      BarkRope: 3
    },
    toolUtility: TOOL_UTILS.SEWING,
    skill: SKILLS.TAILORING,
    skillLevel: 3,
    baseTime: 50 * MINUTES
  },
  buffs: {
    [BUFFS.TEMPERATURE_MIN]: 0.2,
    [BUFFS.TEMPERATURE_MAX]: 0.8,
    [BUFFS.MOOD]: -3,
    [BUFFS.SKILLS.FARMING]: 0.4
  }
});
module.exports = global.BarkShirt = BarkShirt;
