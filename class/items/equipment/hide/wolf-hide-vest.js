const HideArmor = require("./.hide-armor");
require("../../../creatures/monsters/animals/wolf");

class WolfHideVest extends HideArmor {}
Item.itemFactory(WolfHideVest, {
  dynamicName: () => `${Nameable.getName("Wolf")} Hide Vest`,
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/hide/140_b_gray.png`,
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
      WolfHide: 6
    },
    toolUtility: TOOL_UTILS.CUTTING,
    skill: SKILLS.CRAFTING,
    baseTime: 1 * HOURS,
    skillLevel: 1
  },
  buffs: {
    [BUFFS.TEMPERATURE_MIN]: 0.4,
    [BUFFS.ARMOR[DAMAGE_TYPES.BLUNT]]: 1,
    [BUFFS.ARMOR[DAMAGE_TYPES.SLICE]]: 2,
    [BUFFS.ARMOR[DAMAGE_TYPES.PIERCE]]: 2
  }
});
module.exports = global.WolfHideVest = WolfHideVest;
