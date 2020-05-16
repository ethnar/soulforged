const Item = require("../../.item");

class SteelPickHead extends Item {}
Item.itemFactory(SteelPickHead, {
  dynamicName: () => `${Nameable.getName("MeltedSteel")} Pick Head`,
  order: ITEMS_ORDER.OTHER,
  weight: 3,
  icon: `/${ICONS_PATH}/items/equipment/steel/pick_b_02_steel_head.png`,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      SteelRod: 3
    },
    building: ["Forge"],
    skill: SKILLS.SMITHING,
    skillLevel: 4,
    toolUtility: TOOL_UTILS.HAMMER,
    baseTime: 60 * MINUTES
  }
});

class SteelPick extends SteelEquipment {}
Item.itemFactory(SteelPick, {
  dynamicName: () => `${Nameable.getName("MeltedSteel")} Pick`,
  order: ITEMS_ORDER.TOOLS,
  weight: 3.5,
  icon: `/${ICONS_PATH}/items/equipment/steel/pick_b_02_steel.png`,
  slots: {
    [EQUIPMENT_SLOTS.TOOL]: 1
  },
  utility: {
    [TOOL_UTILS.MINING]: 1.8,
    [TOOL_UTILS.CARVING]: 0.7
  },
  crafting: {
    autoLearn: true,
    materials: {
      SteelPickHead: 1,
      HardwoodShaft: 1
    },
    skill: SKILLS.CRAFTING,
    baseTime: 15 * SECONDS
  }
});
module.exports = global.SteelPick = SteelPick;
