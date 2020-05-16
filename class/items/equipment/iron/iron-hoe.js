const Item = require("../../.item");

class IronHoeHead extends Item {}
Item.itemFactory(IronHoeHead, {
  dynamicName: () => `${Nameable.getName("MeltedIron")} Hoe Head`,
  order: ITEMS_ORDER.OTHER,
  weight: 2.4,
  icon: `/${ICONS_PATH}/items/equipment/iron/195_b_iron_head.png`,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      IronRod: 2,
      IronWire: 2
    },
    building: ["Forge"],
    skill: SKILLS.SMITHING,
    skillLevel: 4,
    toolUtility: TOOL_UTILS.HAMMER,
    baseTime: 60 * MINUTES
  }
});

class IronHoe extends IronEquipment {}
Item.itemFactory(IronHoe, {
  dynamicName: () => `${Nameable.getName("MeltedIron")} Hoe`,
  order: ITEMS_ORDER.TOOLS,
  autoCalculateWeight: true,
  autoCalculateWeightMult: 1,
  icon: `/${ICONS_PATH}/items/equipment/iron/195_b_iron.png`,
  slots: {
    [EQUIPMENT_SLOTS.TOOL]: 1
  },
  utility: {
    [TOOL_UTILS.HOE]: 1.4
  },
  crafting: {
    autoLearn: true,
    materials: {
      IronHoeHead: 1,
      WoodenShaft: 1
    },
    skill: SKILLS.CRAFTING,
    baseTime: 15 * SECONDS
  }
});
module.exports = global.IronHoe = IronHoe;
