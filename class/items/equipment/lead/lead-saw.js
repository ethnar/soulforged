const LeadEquipment = require("./.lead-equipment");

class LeadSawBlade extends Item {}
Item.itemFactory(LeadSawBlade, {
  dynamicName: () => `${Nameable.getName("MeltedLead")} Saw Blade`,
  order: ITEMS_ORDER.OTHER,
  weight: 3,
  icon: `/${ICONS_PATH}/items/equipment/lead/saw_b_01_saw_blade_lead.png`,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      LeadPlate: 1
    },
    building: ["Forge"],
    skill: SKILLS.SMITHING,
    skillLevel: 3,
    toolUtility: TOOL_UTILS.HAMMER,
    baseTime: 60 * MINUTES
  }
});

class LeadSaw extends LeadEquipment {}
Item.itemFactory(LeadSaw, {
  dynamicName: () => `${Nameable.getName("MeltedLead")} Saw`,
  order: ITEMS_ORDER.TOOLS,
  weight: 3.5,
  icon: `/${ICONS_PATH}/items/equipment/lead/saw_b_01_lead.png`,
  utility: {
    [TOOL_UTILS.SAWING]: 1.2
  },
  slots: {
    [EQUIPMENT_SLOTS.TOOL]: 1
  },
  crafting: {
    autoLearn: true,
    materials: {
      LeadSawBlade: 1,
      HardwoodPlank: 1
    },
    skill: SKILLS.CARPENTRY,
    skillLevel: 1,
    toolUtility: TOOL_UTILS.SAWING,
    baseTime: 20 * MINUTES
  }
});

module.exports = global.LeadSaw = LeadSaw;
module.exports = global.LeadSawBlade = LeadSawBlade;
