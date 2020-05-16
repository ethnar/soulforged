const Item = require("../../.item");

class LeadSpearHead extends Item {}
Item.itemFactory(LeadSpearHead, {
  dynamicName: () => `${Nameable.getName("MeltedLead")} Spear Head`,
  order: ITEMS_ORDER.OTHER,
  weight: 2,
  icon: `/${ICONS_PATH}/items/equipment/lead/nw_b_04_head.png`,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      LeadRod: 1
    },
    result: {
      LeadSpearHead: 1
    },
    building: ["Forge"],
    skill: SKILLS.SMITHING,
    skillLevel: 2,
    toolUtility: TOOL_UTILS.HAMMER,
    baseTime: 60 * MINUTES
  }
});

class LeadSpear extends LeadEquipment {}
Item.itemFactory(LeadSpear, {
  dynamicName: () => `${Nameable.getName("MeltedLead")} Spear`,
  order: ITEMS_ORDER.TOOLS,
  damage: {
    [DAMAGE_TYPES.SLICE]: 4,
    [DAMAGE_TYPES.PIERCE]: 20
  },
  buffs: {
    [BUFFS.SKILLS.FIGHTING_DODGE]: 0.3
  },
  hitChance: WeaponSystem.BASE_HIT.POLEARM,
  autoCalculateWeight: true,
  autoCalculateWeightMult: 1,
  weaponSkill: SKILLS.FIGHTING_POLEARM,
  icon: `/${ICONS_PATH}/items/equipment/lead/nw_b_04.png`,
  slots: {
    [EQUIPMENT_SLOTS.TOOL]: 1,
    [EQUIPMENT_SLOTS.WEAPON]: 2
  },
  utility: {
    [TOOL_UTILS.HUNTING]: 1.3,
    [TOOL_UTILS.FISHING]: 0.5
  },
  crafting: {
    autoLearn: true,
    materials: {
      LeadSpearHead: 1,
      LeatherRope: 1,
      HardwoodShaft: 1
    },
    skill: SKILLS.CRAFTING,
    baseTime: 15 * SECONDS
  }
});
module.exports = global.LeadSpear = LeadSpear;
