const TrainingWeapon = require("./.training-weapon");

class TrainingKnife extends TrainingWeapon {}
Item.itemFactory(TrainingKnife, {
  name: "Sparring Knife",
  order: ITEMS_ORDER.WEAPONS,
  damage: {
    [DAMAGE_TYPES.BLUNT]: 1
  },
  buffs: {
    [BUFFS.SKILLS.FIGHTING_DODGE]: 0.5
  },
  hitChance: WeaponSystem.BASE_HIT.KNIFE,
  weaponSkill: SKILLS.FIGHTING_KNIFE,
  icon: `/${ICONS_PATH}/items/equipment/weapons/prehistoricicon_119_b.png`,
  autoCalculateWeight: true,
  slots: {
    [EQUIPMENT_SLOTS.WEAPON]: 2
  },
  research: {
    sameAsCrafting: true,
    materials: {
      ResearchConcept_SparringWeapons_Knife: 0
    }
  },
  crafting: {
    materials: {
      LeatherStraps: 2,
      WoodenShaft: 1
    },
    skill: SKILLS.CARPENTRY,
    skillLevel: 1,
    toolUtility: TOOL_UTILS.SAWING,
    baseTime: 20 * MINUTES
  }
});

new ResearchConcept({
  name: "Sparring Knife",
  className: "ResearchConcept_SparringWeapons_Knife",
  tier: ResearchConcept.TIERS.CLAY,
  requirements: [ResearchConcept.hasSkillLevel(SKILLS.FIGHTING_KNIFE, 1)]
});
