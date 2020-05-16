const LeatherArmor = require("./.leather-armor");

class DeerLeatherCap extends LeatherArmor {}
Item.itemFactory(DeerLeatherCap, {
  name: "Leather Cap",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/leather/hlm_n3_b.png`,
  autoCalculateWeight: true,
  slots: {
    [EQUIPMENT_SLOTS.HEAD]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      BarkThread: 4,
      DeerLeather: 2
    },
    toolUtility: TOOL_UTILS.SEWING,
    skill: SKILLS.LEATHERWORKING,
    skillLevel: 2,
    baseTime: 1 * HOURS
  },
  buffs: {
    [BUFFS.ARMOR[DAMAGE_TYPES.BLUNT]]: 1,
    [BUFFS.ARMOR[DAMAGE_TYPES.SLICE]]: 1,
    [BUFFS.ARMOR[DAMAGE_TYPES.PIERCE]]: 1
  }
});
module.exports = global.DeerLeatherCap = DeerLeatherCap;
