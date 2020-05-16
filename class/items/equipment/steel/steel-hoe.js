const Item = require("../../.item");

const STEEL_RATIO = 4;

class SteelHoeHead extends Item {}
Item.itemFactory(SteelHoeHead, {
  dynamicName: () => `${Nameable.getName("MeltedSteel")} Hoe Head`,
  order: ITEMS_ORDER.OTHER,
  weight: 3.6,
  icon: `/${ICONS_PATH}/items/equipment/steel/195_b_steel_head.png`,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      SteelRod: 2,
      SteelWire: 2
    },
    building: ["Forge"],
    skill: SKILLS.SMITHING,
    skillLevel: 5,
    toolUtility: TOOL_UTILS.HAMMER,
    baseTime: 60 * MINUTES
  }
});

class SteelHoe extends SteelEquipment {}
Item.itemFactory(SteelHoe, {
  dynamicName: () => `${Nameable.getName("MeltedSteel")} Hoe`,
  order: ITEMS_ORDER.TOOLS,
  autoCalculateWeight: true,
  autoCalculateWeightMult: 1,
  icon: `/${ICONS_PATH}/items/equipment/steel/195_b_steel.png`,
  slots: {
    [EQUIPMENT_SLOTS.TOOL]: 1
  },
  utility: {
    [TOOL_UTILS.HOE]: 1.6
  },
  crafting: {
    autoLearn: true,
    materials: {
      SteelHoeHead: 1,
      HardwoodShaft: 1
    },
    skill: SKILLS.CRAFTING,
    baseTime: 15 * SECONDS
  }
});
module.exports = global.SteelHoe = SteelHoe;
