const LeatherArmor = require("./.leather-armor");

class DeerLeatherVest extends LeatherArmor {}
Item.itemFactory(DeerLeatherVest, {
  name: "Leather Vest",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/leather/37b.png`,
  autoCalculateWeight: true,
  slots: {
    [EQUIPMENT_SLOTS.CHEST]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      BarkThread: 10,
      DeerLeather: 4
    },
    toolUtility: TOOL_UTILS.SEWING,
    skill: SKILLS.LEATHERWORKING,
    skillLevel: 1,
    baseTime: 1 * HOURS
  },
  buffs: {
    [BUFFS.TEMPERATURE_MIN]: 0.3,
    [BUFFS.ARMOR[DAMAGE_TYPES.BLUNT]]: 3,
    [BUFFS.ARMOR[DAMAGE_TYPES.SLICE]]: 2,
    [BUFFS.ARMOR[DAMAGE_TYPES.PIERCE]]: 2
  }
});
module.exports = global.DeerHideVest = DeerHideVest;
