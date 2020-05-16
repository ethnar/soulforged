const LeadEquipment = require("./.lead-equipment");

class LeadHammerHead extends Item {}
Item.itemFactory(LeadHammerHead, {
  dynamicName: () => `${Nameable.getName("MeltedLead")} Hammer Head`,
  order: ITEMS_ORDER.OTHER,
  weight: 4,
  icon: `/${ICONS_PATH}/items/equipment/lead/ni_b_03_lead_head.png`,
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

class LeadHammer extends LeadEquipment {}
Item.itemFactory(LeadHammer, {
  dynamicName: () => `${Nameable.getName("MeltedLead")} Hammer`,
  order: ITEMS_ORDER.TOOLS,
  autoCalculateWeight: true,
  autoCalculateWeightMult: 1,
  damage: {
    [DAMAGE_TYPES.BLUNT]: 27
  },
  hitChance: WeaponSystem.BASE_HIT.HAMMER,
  weaponSkill: SKILLS.FIGHTING_HAMMER,
  icon: `/${ICONS_PATH}/items/equipment/lead/ni_b_03_lead.png`,
  utility: {
    [TOOL_UTILS.HAMMER]: 1.9
  },
  slots: {
    [EQUIPMENT_SLOTS.TOOL]: 1,
    [EQUIPMENT_SLOTS.WEAPON]: 2
  },
  crafting: {
    autoLearn: true,
    materials: {
      LeadHammerHead: 1,
      HardwoodShaft: 1
    },
    skill: SKILLS.CRAFTING,
    skillLevel: -1,
    baseTime: 15 * SECONDS
  }
});

module.exports = global.LeadHammer = LeadHammer;
module.exports = global.LeadHammerHead = LeadHammerHead;
