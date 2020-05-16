const Item = require("../../.item");

class IronPickHead extends Item {}
Item.itemFactory(IronPickHead, {
  dynamicName: () => `${Nameable.getName("MeltedIron")} Pick Head`,
  order: ITEMS_ORDER.OTHER,
  weight: 3,
  icon: `/${ICONS_PATH}/items/equipment/iron/pick_b_02_iron_head.png`,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      IronRod: 3
    },
    building: ["Forge"],
    skill: SKILLS.SMITHING,
    skillLevel: 3,
    toolUtility: TOOL_UTILS.HAMMER,
    baseTime: 60 * MINUTES
  }
});

class IronPick extends IronEquipment {}
Item.itemFactory(IronPick, {
  dynamicName: () => `${Nameable.getName("MeltedIron")} Pick`,
  order: ITEMS_ORDER.TOOLS,
  autoCalculateWeight: true,
  autoCalculateWeightMult: 1,
  icon: `/${ICONS_PATH}/items/equipment/iron/pick_b_02_iron.png`,
  slots: {
    [EQUIPMENT_SLOTS.TOOL]: 1
  },
  utility: {
    [TOOL_UTILS.MINING]: 1.6,
    [TOOL_UTILS.CARVING]: 0.5
  },
  crafting: {
    autoLearn: true,
    materials: {
      IronPickHead: 1,
      WoodenShaft: 1
    },
    skill: SKILLS.CRAFTING,
    baseTime: 15 * SECONDS
  }
});
module.exports = global.IronPick = IronPick;
