const ClothArmor = require("./.cloth-armor");

class LinenShirt extends ClothArmor {}
Item.itemFactory(LinenShirt, {
  name: "Pocketed Shirt",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/cloth/070_b.png`,
  autoCalculateWeight: true,
  slots: {
    [EQUIPMENT_SLOTS.CHEST]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      LinenThread: 4,
      LinenCloth: 3,
      BarkRope: 3
    },
    toolUtility: TOOL_UTILS.SEWING,
    skill: SKILLS.TAILORING,
    skillLevel: 3,
    baseTime: 50 * MINUTES
  },
  buffs: {
    [BUFFS.TEMPERATURE_MIN]: 0.3,
    [BUFFS.TEMPERATURE_MAX]: 1,
    [BUFFS.SKILLS.COOKING]: 0.4,
    [BUFFS.SKILLS.FISHING]: 0.4,
    [BUFFS.SKILLS.LEATHERWORKING]: 0.4
  }
});
module.exports = global.LinenShirt = LinenShirt;
