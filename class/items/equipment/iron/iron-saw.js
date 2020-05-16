const IronEquipment = require("./.iron-equipment");

class IronSawBlade extends Item {}
Item.itemFactory(IronSawBlade, {
  dynamicName: () => `${Nameable.getName("MeltedIron")} Saw Blade`,
  order: ITEMS_ORDER.OTHER,
  weight: 2,
  icon: `/${ICONS_PATH}/items/equipment/iron/saw_b_01_saw_blade_iron.png`,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      IronPlate: 1
    },
    building: ["Forge"],
    skill: SKILLS.SMITHING,
    skillLevel: 4,
    toolUtility: TOOL_UTILS.HAMMER,
    baseTime: 60 * MINUTES
  }
});

class IronSaw extends IronEquipment {}
Item.itemFactory(IronSaw, {
  dynamicName: () => `${Nameable.getName("MeltedIron")} Saw`,
  order: ITEMS_ORDER.TOOLS,
  weight: 2.5,
  icon: `/${ICONS_PATH}/items/equipment/iron/saw_b_01_iron.png`,
  utility: {
    [TOOL_UTILS.SAWING]: 1.4
  },
  slots: {
    [EQUIPMENT_SLOTS.TOOL]: 1
  },
  crafting: {
    autoLearn: true,
    materials: {
      IronSawBlade: 1,
      WoodenPlank: 1
    },
    skill: SKILLS.CARPENTRY,
    skillLevel: 1,
    toolUtility: TOOL_UTILS.SAWING,
    baseTime: 20 * MINUTES
  }
});

module.exports = global.IronSaw = IronSaw;
module.exports = global.IronSawBlade = IronSawBlade;
