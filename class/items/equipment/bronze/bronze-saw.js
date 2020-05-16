const BronzeEquipment = require("./.bronze-equipment");

const BRONZE_RATIO = 3;

class BronzeSawBlade extends Item {}
Item.itemFactory(BronzeSawBlade, {
  dynamicName: () => `${Nameable.getName("MeltedBronze")} Saw Blade`,
  order: ITEMS_ORDER.OTHER,
  weight: BRONZE_RATIO,
  icon: `/${ICONS_PATH}/items/equipment/bronze/saw_b_01_saw_blade_bronze.png`,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      SawBladeMold: 1,
      MeltedBronze: BRONZE_RATIO
    },
    result: {
      BronzeSawBlade: 1,
      SawBladeMold: 1
    },
    building: ["Kiln"],
    skill: SKILLS.SMELTING,
    skillLevel: 3,
    baseTime: 15 * MINUTES
  }
});

class BronzeSaw extends BronzeEquipment {}
Item.itemFactory(BronzeSaw, {
  dynamicName: () => `${Nameable.getName("MeltedBronze")} Saw`,
  order: ITEMS_ORDER.TOOLS,
  weight: BRONZE_RATIO + 0.5,
  icon: `/${ICONS_PATH}/items/equipment/bronze/saw_b_01_bronze.png`,
  utility: {
    [TOOL_UTILS.SAWING]: 1.2
  },
  slots: {
    [EQUIPMENT_SLOTS.TOOL]: 1
  },
  crafting: {
    autoLearn: true,
    materials: {
      BronzeSawBlade: 1,
      WoodenPlank: 1
    },
    skill: SKILLS.CARPENTRY,
    skillLevel: 1,
    toolUtility: TOOL_UTILS.SAWING,
    baseTime: 20 * MINUTES
  }
});

module.exports = global.BronzeSaw = BronzeSaw;
module.exports = global.BronzeSawBlade = BronzeSawBlade;
