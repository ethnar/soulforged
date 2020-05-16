const TrainingWeapon = require("./.training-weapon");
require("../../../resources/regrowing/trees/poplar");

class TrainingHammer extends TrainingWeapon {}
Item.itemFactory(TrainingHammer, {
  name: "Sparring Hammer",
  order: ITEMS_ORDER.WEAPONS,
  damage: {
    [DAMAGE_TYPES.BLUNT]: 1
  },
  hitChance: WeaponSystem.BASE_HIT.HAMMER,
  weaponSkill: SKILLS.FIGHTING_HAMMER,
  icon: `/${ICONS_PATH}/items/equipment/weapons/181_b.png`,
  autoCalculateWeight: true,
  slots: {
    [EQUIPMENT_SLOTS.WEAPON]: 2
  },
  research: {
    sameAsCrafting: true,
    materials: {
      ResearchConcept_SparringWeapons_Hammer: 0
    }
  },
  crafting: {
    materials: {
      WoodenShaft: 1,
      PoplarWood: 1
    },
    skill: SKILLS.CARPENTRY,
    skillLevel: 1,
    toolUtility: TOOL_UTILS.SAWING,
    baseTime: 20 * MINUTES
  }
});

new ResearchConcept({
  name: "Sparring Hammer",
  className: "ResearchConcept_SparringWeapons_Hammer",
  tier: ResearchConcept.TIERS.CLAY,
  requirements: [ResearchConcept.hasSkillLevel(SKILLS.FIGHTING_HAMMER, 1)]
});
