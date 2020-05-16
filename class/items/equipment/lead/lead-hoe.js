const Item = require("../../.item");

const LEAD_RATIO = 4;

class LeadHoeHead extends Item {}
Item.itemFactory(LeadHoeHead, {
  dynamicName: () => `${Nameable.getName("MeltedLead")} Hoe Head`,
  order: ITEMS_ORDER.OTHER,
  weight: LEAD_RATIO,
  icon: `/${ICONS_PATH}/items/equipment/lead/195_b_lead_head.png`,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      LeadRod: 2,
      LeadWire: 2
    },
    building: ["Forge"],
    skill: SKILLS.SMITHING,
    skillLevel: 3,
    toolUtility: TOOL_UTILS.HAMMER,
    baseTime: 60 * MINUTES
  }
});

class LeadHoe extends LeadEquipment {}
Item.itemFactory(LeadHoe, {
  dynamicName: () => `${Nameable.getName("MeltedLead")} Hoe`,
  order: ITEMS_ORDER.TOOLS,
  autoCalculateWeight: true,
  autoCalculateWeightMult: 1,
  icon: `/${ICONS_PATH}/items/equipment/lead/195_b_lead.png`,
  slots: {
    [EQUIPMENT_SLOTS.TOOL]: 1
  },
  utility: {
    [TOOL_UTILS.HOE]: 1.5
  },
  crafting: {
    autoLearn: true,
    materials: {
      LeadHoeHead: 1,
      HardwoodShaft: 1
    },
    skill: SKILLS.CRAFTING,
    baseTime: 15 * SECONDS
  }
});
module.exports = global.LeadHoe = LeadHoe;
