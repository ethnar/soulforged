const CopperEquipment = require("./.copper-equipment");

const COPPER_RATIO = 3;

class CopperSawBlade extends Item {}
Item.itemFactory(CopperSawBlade, {
  dynamicName: () => `${Nameable.getName("MeltedCopper")} Saw Blade`,
  order: ITEMS_ORDER.OTHER,
  weight: COPPER_RATIO,
  icon: `/${ICONS_PATH}/items/equipment/copper/saw_b_01_saw_blade_copper.png`,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      SawBladeMold: 1,
      MeltedCopper: COPPER_RATIO
    },
    result: {
      CopperSawBlade: 1,
      SawBladeMold: 1
    },
    building: ["Kiln"],
    skill: SKILLS.SMELTING,
    skillLevel: 1,
    baseTime: 15 * MINUTES
  }
});

class CopperSaw extends CopperEquipment {}
Item.itemFactory(CopperSaw, {
  dynamicName: () => `${Nameable.getName("MeltedCopper")} Saw`,
  order: ITEMS_ORDER.TOOLS,
  weight: COPPER_RATIO + 0.5,
  icon: `/${ICONS_PATH}/items/equipment/copper/saw_b_01_copper.png`,
  utility: {
    [TOOL_UTILS.SAWING]: 1
  },
  slots: {
    [EQUIPMENT_SLOTS.TOOL]: 1
  },
  crafting: {
    autoLearn: true,
    materials: {
      CopperSawBlade: 1,
      WoodenPlank: 1
    },
    skill: SKILLS.CARPENTRY,
    skillLevel: 1,
    toolUtility: TOOL_UTILS.SAWING,
    baseTime: 20 * MINUTES
  }
});

module.exports = global.CopperSaw = CopperSaw;
module.exports = global.CopperSawBlade = CopperSawBlade;
