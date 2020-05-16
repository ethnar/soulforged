const HideArmor = require("./.hide-armor");
require("../../../creatures/monsters/animals/bear");
require("../../../resources/popping/animals/rabbits");

class BearHideGloves extends HideArmor {}
Item.itemFactory(BearHideGloves, {
  dynamicName: () => `${Nameable.getName("Bear")} Hide Gloves`,
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/hide/gl_b_03.png`,
  autoCalculateWeight: true,
  slots: {
    [EQUIPMENT_SLOTS.HANDS]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      BarkRope: 1,
      BearHide: 2,
      RabbitPelt: 1
    },
    toolUtility: TOOL_UTILS.CUTTING,
    skill: SKILLS.CRAFTING,
    skillLevel: 2,
    baseTime: 1.5 * HOURS
  },
  buffs: {
    [BUFFS.TEMPERATURE_MIN]: 0.3,
    [BUFFS.ARMOR[DAMAGE_TYPES.SLICE]]: 2,
    [BUFFS.STATS.DEXTERITY]: -1,
    [BUFFS.STATS.STRENGTH]: +4
  }
});
module.exports = global.BearHideGloves = BearHideGloves;
