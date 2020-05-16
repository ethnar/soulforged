const LeadEquipment = require("./.lead-equipment");

class LeadAxeHead extends Item {}
Item.itemFactory(LeadAxeHead, {
  dynamicName: () => `${Nameable.getName("MeltedLead")} Axe Head`,
  order: ITEMS_ORDER.OTHER,
  weight: 4,
  icon: `/${ICONS_PATH}/items/equipment/lead/nw_b_03_lead_head.png`,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      LeadIngot: 1
    },
    building: ["Forge"],
    skill: SKILLS.SMITHING,
    skillLevel: 2,
    toolUtility: TOOL_UTILS.HAMMER,
    baseTime: 60 * MINUTES
  }
});

class LeadAxe extends LeadEquipment {}
Item.itemFactory(LeadAxe, {
  dynamicName: () => `${Nameable.getName("MeltedLead")} Axe`,
  order: ITEMS_ORDER.TOOLS,
  autoCalculateWeight: true,
  autoCalculateWeightMult: 1,
  damage: {
    [DAMAGE_TYPES.SLICE]: 19,
    [DAMAGE_TYPES.PIERCE]: 7
  },
  hitChance: WeaponSystem.BASE_HIT.AXE,
  weaponSkill: SKILLS.FIGHTING_AXE,
  icon: `/${ICONS_PATH}/items/equipment/lead/nw_b_03_lead.png`,
  utility: {
    [TOOL_UTILS.WOODCUTTING]: 1.3
  },
  slots: {
    [EQUIPMENT_SLOTS.TOOL]: 1,
    [EQUIPMENT_SLOTS.WEAPON]: 2
  },
  crafting: {
    autoLearn: true,
    materials: {
      LeadAxeHead: 1,
      HardwoodShaft: 1
    },
    skill: SKILLS.CRAFTING,
    skillLevel: -1,
    baseTime: 15 * SECONDS
  }
});

module.exports = global.LeadAxe = LeadAxe;
module.exports = global.LeadAxeHead = LeadAxeHead;
