const HideArmor = require("./.hide-armor");
require("../../../creatures/monsters/animals/wolf");
require("../../../resources/popping/animals/turodo");

class TurodoHideGloves extends HideArmor {}
Item.itemFactory(TurodoHideGloves, {
  name: "Warm Gloves",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/hide/111b.png`,
  autoCalculateWeight: true,
  slots: {
    [EQUIPMENT_SLOTS.HANDS]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      TurodoHide: 2,
      WolfLeather: 2,
      BarkThread: 4
    },
    toolUtility: TOOL_UTILS.SEWING,
    skill: SKILLS.LEATHERWORKING,
    skillLevel: 4,
    baseTime: 1.5 * HOURS
  },
  buffs: {
    [BUFFS.TEMPERATURE_MIN]: 0.6,
    [BUFFS.ARMOR[DAMAGE_TYPES.BLUNT]]: 3,
    [BUFFS.ARMOR[DAMAGE_TYPES.SLICE]]: 1,
    [BUFFS.ARMOR[DAMAGE_TYPES.PIERCE]]: 1,
    [BUFFS.STATS.DEXTERITY]: -1,
    [BUFFS.STATS.ENDURANCE]: +3
  }
});
