const TrainingWeapon = require("./.training-weapon");

class TrainingSpear extends TrainingWeapon {}
Item.itemFactory(TrainingSpear, {
  name: "Sparring Spear",
  order: ITEMS_ORDER.WEAPONS,
  damage: {
    [DAMAGE_TYPES.BLUNT]: 1
  },
  buffs: {
    [BUFFS.SKILLS.FIGHTING_DODGE]: 0.2
  },
  hitChance: WeaponSystem.BASE_HIT.POLEARM,
  weaponSkill: SKILLS.FIGHTING_POLEARM,
  icon: `/${ICONS_PATH}/items/equipment/weapons/03_b.png`,
  autoCalculateWeight: true,
  slots: {
    [EQUIPMENT_SLOTS.WEAPON]: 2
  },
  research: {
    sameAsCrafting: true,
    materials: {
      ResearchConcept_SparringWeapons_Spear: 0
    }
  },
  crafting: {
    materials: {
      WoodenShaft: 2
    },
    skill: SKILLS.CARPENTRY,
    skillLevel: 1,
    toolUtility: TOOL_UTILS.SAWING,
    baseTime: 20 * MINUTES
  }
});

new ResearchConcept({
  name: "Sparring Spear",
  className: "ResearchConcept_SparringWeapons_Spear",
  tier: ResearchConcept.TIERS.CLAY,
  requirements: [ResearchConcept.hasSkillLevel(SKILLS.FIGHTING_POLEARM, 1)]
});
