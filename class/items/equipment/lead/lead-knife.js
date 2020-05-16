const Item = require("../../.item");

class LeadKnife extends Item {}
Item.itemFactory(LeadKnife, {
  dynamicName: () => `${Nameable.getName("MeltedLead")} Knife`,
  order: ITEMS_ORDER.TOOLS,
  damage: {
    [DAMAGE_TYPES.SLICE]: 20,
    [DAMAGE_TYPES.PIERCE]: 4
  },
  buffs: {
    [BUFFS.SKILLS.FIGHTING_DODGE]: 0.5
  },
  hitChance: WeaponSystem.BASE_HIT.KNIFE,
  weaponSkill: SKILLS.FIGHTING_KNIFE,
  icon: `/${ICONS_PATH}/items/equipment/lead/kn_b_11_lead.png`,
  weight: 2,
  slots: {
    [EQUIPMENT_SLOTS.TOOL]: 1,
    [EQUIPMENT_SLOTS.WEAPON]: 2
  },
  utility: {
    [TOOL_UTILS.ETCHING]: 1,
    [TOOL_UTILS.CUTTING]: 1.4,
    [TOOL_UTILS.SAWING]: 0.3
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      LeadIngot: 1
    },
    result: {
      LeadKnife: 2
    },
    building: ["Forge"],
    skill: SKILLS.SMITHING,
    skillLevel: 2,
    toolUtility: TOOL_UTILS.HAMMER,
    baseTime: 60 * MINUTES
  }
});
module.exports = global.LeadKnife = LeadKnife;
