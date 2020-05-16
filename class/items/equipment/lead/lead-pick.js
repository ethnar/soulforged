const Item = require("../../.item");

class LeadPickHead extends Item {}
Item.itemFactory(LeadPickHead, {
  dynamicName: () => `${Nameable.getName("MeltedLead")} Pick Head`,
  order: ITEMS_ORDER.OTHER,
  weight: 6,
  icon: `/${ICONS_PATH}/items/equipment/lead/pick_b_02_lead_head.png`,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      LeadRod: 3
    },
    building: ["Forge"],
    skill: SKILLS.SMITHING,
    skillLevel: 2,
    toolUtility: TOOL_UTILS.HAMMER,
    baseTime: 60 * MINUTES
  }
});

class LeadPick extends LeadEquipment {}
Item.itemFactory(LeadPick, {
  dynamicName: () => `${Nameable.getName("MeltedLead")} Pick`,
  order: ITEMS_ORDER.TOOLS,
  weight: 6.5,
  icon: `/${ICONS_PATH}/items/equipment/lead/pick_b_02_lead.png`,
  slots: {
    [EQUIPMENT_SLOTS.TOOL]: 1
  },
  utility: {
    [TOOL_UTILS.MINING]: 1.4,
    [TOOL_UTILS.CARVING]: 0.4
  },
  crafting: {
    autoLearn: true,
    materials: {
      LeadPickHead: 1,
      HardwoodShaft: 1
    },
    skill: SKILLS.CRAFTING,
    baseTime: 15 * SECONDS
  }
});
module.exports = global.LeadPick = LeadPick;
