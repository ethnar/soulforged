const TrainingWeapon = require("./.training-weapon");

class TrainingSword extends TrainingWeapon {}
Item.itemFactory(TrainingSword, {
  name: "Sparring Sword",
  order: ITEMS_ORDER.WEAPONS,
  damage: {
    [DAMAGE_TYPES.BLUNT]: 1
  },
  buffs: {
    [BUFFS.SKILLS.FIGHTING_DODGE]: 0.2
  },
  hitChance: WeaponSystem.BASE_HIT.SWORD,
  weaponSkill: SKILLS.FIGHTING_SWORD,
  icon: `/${ICONS_PATH}/items/equipment/weapons/150_b_wood.png`,
  autoCalculateWeight: true,
  slots: {
    [EQUIPMENT_SLOTS.WEAPON]: 2
  },
  research: {
    sameAsCrafting: true,
    materials: {
      ResearchConcept_SparringWeapons_Sword: 0
    }
  },
  crafting: {
    materials: {
      WoodenPlank: 2,
      WoodenShaft: 2,
      LeatherStraps: 2
    },
    skill: SKILLS.CARPENTRY,
    skillLevel: 1,
    toolUtility: TOOL_UTILS.SAWING,
    baseTime: 20 * MINUTES
  }
});

new ResearchConcept({
  name: "Sparring Sword",
  className: "ResearchConcept_SparringWeapons_Sword",
  tier: ResearchConcept.TIERS.CLAY,
  requirements: [ResearchConcept.hasSkillLevel(SKILLS.FIGHTING_SWORD, 1)]
});
