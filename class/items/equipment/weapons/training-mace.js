const TrainingWeapon = require("./.training-weapon");

class TrainingMace extends TrainingWeapon {}
Item.itemFactory(TrainingMace, {
  name: "Sparring Mace",
  order: ITEMS_ORDER.WEAPONS,
  damage: {
    [DAMAGE_TYPES.BLUNT]: 1
  },
  hitChance: WeaponSystem.BASE_HIT.MACE,
  weaponSkill: SKILLS.FIGHTING_MACE,
  icon: `/${ICONS_PATH}/items/equipment/weapons/125_b_recolor.png`,
  autoCalculateWeight: true,
  slots: {
    [EQUIPMENT_SLOTS.WEAPON]: 2
  },
  research: {
    sameAsCrafting: true,
    materials: {
      ResearchConcept_SparringWeapons_Mace: 0
    }
  },
  crafting: {
    materials: {
      DeerHide: 2,
      WoodenShaft: 2
    },
    skill: SKILLS.CARPENTRY,
    skillLevel: 1,
    toolUtility: TOOL_UTILS.SAWING,
    baseTime: 20 * MINUTES
  }
});

new ResearchConcept({
  name: "Sparring Mace",
  className: "ResearchConcept_SparringWeapons_Mace",
  tier: ResearchConcept.TIERS.CLAY,
  requirements: [ResearchConcept.hasSkillLevel(SKILLS.FIGHTING_MACE, 1)]
});
