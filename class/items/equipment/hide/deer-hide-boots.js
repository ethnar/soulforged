const HideArmor = require("./.hide-armor");
require("../../../resources/popping/animals/rabbits");
require("../../../resources/popping/animals/deers");

class DeerHideBoots extends HideArmor {}
Item.itemFactory(DeerHideBoots, {
  dynamicName: () => `${Nameable.getName("Deers")} Hide Boots`,
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/hide/prehistoricicon_109_b_noglow.png`,
  autoCalculateWeight: true,
  slots: {
    [EQUIPMENT_SLOTS.FEET]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      BarkRope: 1,
      DeerHide: 2,
      RabbitPelt: 1
    },
    toolUtility: TOOL_UTILS.CUTTING,
    skill: SKILLS.CRAFTING,
    skillLevel: 0,
    baseTime: 1 * HOURS
  },
  buffs: {
    [BUFFS.TEMPERATURE_MIN]: 0.2,
    [BUFFS.ARMOR[DAMAGE_TYPES.SLICE]]: 2,
    [BUFFS.SKILLS.PATHFINDING]: 0.3
  }
});
module.exports = global.DeerHideBoots = DeerHideBoots;
