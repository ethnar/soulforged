const TrainingWeapon = require("./.training-weapon");

class TrainingAxe extends TrainingWeapon {}
Item.itemFactory(TrainingAxe, {
  name: "Sparring Axe",
  order: ITEMS_ORDER.WEAPONS,
  damage: {
    [DAMAGE_TYPES.BLUNT]: 1
  },
  hitChance: WeaponSystem.BASE_HIT.AXE,
  weaponSkill: SKILLS.FIGHTING_AXE,
  icon: `/${ICONS_PATH}/items/equipment/weapons/135_b_copper.png`,
  autoCalculateWeight: true,
  slots: {
    [EQUIPMENT_SLOTS.WEAPON]: 2
  },
  research: {
    sameAsCrafting: true,
    materials: {
      ResearchConcept_SparringWeapons_Axe: 0
    }
  },
  crafting: {
    materials: {
      WoodenPlank: 2,
      WoodenShaft: 2
    },
    skill: SKILLS.CARPENTRY,
    skillLevel: 1,
    toolUtility: TOOL_UTILS.SAWING,
    baseTime: 20 * MINUTES
  }
});

new ResearchConcept({
  name: "Sparring Axe",
  className: "ResearchConcept_SparringWeapons_Axe",
  tier: ResearchConcept.TIERS.CLAY,
  requirements: [ResearchConcept.hasSkillLevel(SKILLS.FIGHTING_AXE, 1)]
});
