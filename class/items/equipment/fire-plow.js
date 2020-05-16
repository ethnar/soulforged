const Item = require("../.item");

class FirePlow extends Item {}
Item.itemFactory(FirePlow, {
  name: "Fire Plow",
  icon: `/${ICONS_PATH}/items/equipment/foresticons_25_b_mod.png`,
  order: ITEMS_ORDER.TOOLS,
  weight: 0.4,
  slots: {
    [EQUIPMENT_SLOTS.TOOL]: 1
  },
  utility: {
    [TOOL_UTILS.FIRESTARTER]: 0.3
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      Twig: 1,
      PoplarWood: 1
    },
    skill: SKILLS.CRAFTING,
    skillLevel: 1,
    baseTime: 15
  }
});
module.exports = global.FirePlow = FirePlow;
