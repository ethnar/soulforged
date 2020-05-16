const TinEquipment = require("./.tin-equipment");

const TIN_RATIO = 3;

class TinSawBlade extends Item {}
Item.itemFactory(TinSawBlade, {
  dynamicName: () => `${Nameable.getName("MeltedTin")} Saw Blade`,
  order: ITEMS_ORDER.OTHER,
  weight: TIN_RATIO,
  icon: `/${ICONS_PATH}/items/equipment/tin/saw_b_01_saw_blade_tin.png`,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      SawBladeMold: 1,
      MeltedTin: TIN_RATIO
    },
    result: {
      TinSawBlade: 1,
      SawBladeMold: 1
    },
    building: ["Kiln"],
    skill: SKILLS.SMELTING,
    skillLevel: 2,
    baseTime: 15 * MINUTES
  }
});

class TinSaw extends TinEquipment {}
Item.itemFactory(TinSaw, {
  dynamicName: () => `${Nameable.getName("MeltedTin")} Saw`,
  order: ITEMS_ORDER.TOOLS,
  weight: TIN_RATIO + 0.5,
  icon: `/${ICONS_PATH}/items/equipment/tin/saw_b_01_tin.png`,
  utility: {
    [TOOL_UTILS.SAWING]: 1
  },
  slots: {
    [EQUIPMENT_SLOTS.TOOL]: 1
  },
  crafting: {
    autoLearn: true,
    materials: {
      TinSawBlade: 1,
      WoodenPlank: 1
    },
    skill: SKILLS.CARPENTRY,
    skillLevel: 1,
    toolUtility: TOOL_UTILS.SAWING,
    baseTime: 20 * MINUTES
  }
});

module.exports = global.TinSaw = TinSaw;
module.exports = global.TinSawBlade = TinSawBlade;
