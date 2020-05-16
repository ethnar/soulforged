const SteelEquipment = require("./.steel-equipment");

class SteelSawBlade extends Item {}
Item.itemFactory(SteelSawBlade, {
  dynamicName: () => `${Nameable.getName("MeltedSteel")} Saw Blade`,
  order: ITEMS_ORDER.OTHER,
  weight: 3,
  icon: `/${ICONS_PATH}/items/equipment/steel/saw_b_01_saw_blade_steel.png`,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      SteelPlate: 1
    },
    building: ["Forge"],
    skill: SKILLS.SMITHING,
    skillLevel: 5,
    toolUtility: TOOL_UTILS.HAMMER,
    baseTime: 60 * MINUTES
  }
});

class SteelSaw extends SteelEquipment {}
Item.itemFactory(SteelSaw, {
  dynamicName: () => `${Nameable.getName("MeltedSteel")} Saw`,
  order: ITEMS_ORDER.TOOLS,
  weight: 3.5,
  icon: `/${ICONS_PATH}/items/equipment/steel/saw_b_01_steel.png`,
  utility: {
    [TOOL_UTILS.SAWING]: 1.6
  },
  slots: {
    [EQUIPMENT_SLOTS.TOOL]: 1
  },
  crafting: {
    autoLearn: true,
    materials: {
      SteelSawBlade: 1,
      HardwoodPlank: 1
    },
    skill: SKILLS.CARPENTRY,
    skillLevel: 1,
    toolUtility: TOOL_UTILS.SAWING,
    baseTime: 20 * MINUTES
  }
});

module.exports = global.SteelSaw = SteelSaw;
module.exports = global.SteelSawBlade = SteelSawBlade;
