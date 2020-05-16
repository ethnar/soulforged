const LeatherArmor = require("./.leather-armor");
require("../../../creatures/monsters/animals/snake");

class WolfSnakeTrousers extends LeatherArmor {}
Item.itemFactory(WolfSnakeTrousers, {
  name: "Rugged Pants",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/leather/pn_b_04.png`,
  autoCalculateWeight: true,
  slots: {
    [EQUIPMENT_SLOTS.TROUSERS]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      BarkThread: 8,
      SnakeSkin: 4,
      WolfLeather: 5
    },
    toolUtility: TOOL_UTILS.SEWING,
    skill: SKILLS.LEATHERWORKING,
    skillLevel: 2,
    baseTime: 1.5 * HOURS
  },
  buffs: {
    [BUFFS.ARMOR[DAMAGE_TYPES.BLUNT]]: 2,
    [BUFFS.ARMOR[DAMAGE_TYPES.SLICE]]: 4,
    [BUFFS.ARMOR[DAMAGE_TYPES.PIERCE]]: 2,
    [BUFFS.TEMPERATURE_MIN]: 0.4,
    [BUFFS.TEMPERATURE_MAX]: 0.4
  }
});
module.exports = global.WolfSnakeTrousers = WolfSnakeTrousers;
