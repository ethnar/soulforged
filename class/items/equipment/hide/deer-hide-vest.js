const HideArmor = require("./.hide-armor");

class DeerHideVest extends HideArmor {}
Item.itemFactory(DeerHideVest, {
  dynamicName: () => `${Nameable.getName("Deers")} Hide Vest`,
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/hide/140_b_brown.png`,
  autoCalculateWeight: true,
  slots: {
    [EQUIPMENT_SLOTS.CHEST]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      BarkRope: 4,
      DeerHide: 6
    },
    toolUtility: TOOL_UTILS.CUTTING,
    skill: SKILLS.CRAFTING,
    skillLevel: 1,
    baseTime: 1 * HOURS
  },
  buffs: {
    [BUFFS.TEMPERATURE_MIN]: 0.7,
    [BUFFS.TEMPERATURE_MAX]: 0.2,
    [BUFFS.ARMOR[DAMAGE_TYPES.BLUNT]]: 2,
    [BUFFS.ARMOR[DAMAGE_TYPES.SLICE]]: 1,
    [BUFFS.ARMOR[DAMAGE_TYPES.PIERCE]]: 1
  }
});
module.exports = global.DeerHideVest = DeerHideVest;
