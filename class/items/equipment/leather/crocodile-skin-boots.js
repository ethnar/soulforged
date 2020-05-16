const LeatherArmor = require("./.leather-armor");
require("../../../creatures/monsters/animals/crocodile");

class CrocodileSkinBoots extends LeatherArmor {}
Item.itemFactory(CrocodileSkinBoots, {
  dynamicName: () => `${Nameable.getName("Crocodile")} Skin Boots`,
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/leather/124b.png`,
  autoCalculateWeight: true,
  slots: {
    [EQUIPMENT_SLOTS.FEET]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      BarkThread: 6,
      CrocodileSkin: 3
    },
    toolUtility: TOOL_UTILS.SEWING,
    skill: SKILLS.LEATHERWORKING,
    skillLevel: 2,
    baseTime: 1.5 * HOURS
  },
  buffs: {
    [BUFFS.SKILLS.PATHFINDING]: 0.3,
    [BUFFS.ARMOR[DAMAGE_TYPES.BLUNT]]: 1,
    [BUFFS.ARMOR[DAMAGE_TYPES.SLICE]]: 1,
    [BUFFS.ARMOR[DAMAGE_TYPES.PIERCE]]: 1
  }
});
module.exports = global.CrocodileSkinBoots = CrocodileSkinBoots;
