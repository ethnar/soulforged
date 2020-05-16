const HideArmor = require("./.hide-armor");
require("../../../resources/popping/animals/rabbits");

class PeltLoincloth extends HideArmor {}
Item.itemFactory(PeltLoincloth, {
  name: "Pelt Loincloth",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/hide/cloth_b_03_white.png`,
  autoCalculateWeight: true,
  slots: {
    [EQUIPMENT_SLOTS.TROUSERS]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      BarkRope: 2,
      RabbitPelt: 2
    },
    toolUtility: TOOL_UTILS.CUTTING,
    skill: SKILLS.CRAFTING,
    skillLevel: -1,
    baseTime: 900
  },
  buffs: {
    [BUFFS.TEMPERATURE_MIN]: 0.2
  }
});
module.exports = global.PeltLoincloth = PeltLoincloth;
