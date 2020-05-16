const TrainingDummy = require("./.training-dummy");

const icon = `/${ICONS_PATH}/creatures/monsters/dummy_01.png`;

class PrimitiveTrainingDummy extends TrainingDummy {}
Object.assign(PrimitiveTrainingDummy.prototype, {
  name: "Primitive Training Dummy",
  icon,
  trainingLevel: 25,
  defaultArmor: {
    [DAMAGE_TYPES.BLUNT]: 150,
    [DAMAGE_TYPES.SLICE]: 150,
    [DAMAGE_TYPES.PIERCE]: 150
  }
});

class PrimitiveTrainingDummyItem extends TrainingDummyItem {}
Item.itemFactory(PrimitiveTrainingDummyItem, {
  name: "Primitive Training Dummy",
  icon,
  autoCalculateWeight: true,
  trainingDummyCreature: PrimitiveTrainingDummy,
  research: {
    sameAsCrafting: true,
    materials: {
      ResearchConcept_TrainingDummy1: 0
    }
  },
  crafting: {
    materials: {
      WolfHideVest: 1,
      Wheat: 60,
      WoodenBeam: 2,
      WoodenShaft: 6
    },
    toolUtility: TOOL_UTILS.SAWING,
    skill: SKILLS.CARPENTRY,
    skillLevel: 3,
    baseTime: 40 * MINUTES
  }
});

new ResearchConcept({
  name: "Training Dummies",
  className: "ResearchConcept_TrainingDummy1",
  tier: ResearchConcept.TIERS.CLAY,
  requirements: [
    utils.xOf(
      2,
      ResearchConcept.hasSkillLevel(SKILLS.FIGHTING_UNARMED, 1),
      ResearchConcept.hasSkillLevel(SKILLS.FIGHTING_IMPROVISED, 1),
      ResearchConcept.hasSkillLevel(SKILLS.FIGHTING_SWORD, 1),
      ResearchConcept.hasSkillLevel(SKILLS.FIGHTING_KNIFE, 1),
      ResearchConcept.hasSkillLevel(SKILLS.FIGHTING_AXE, 1),
      ResearchConcept.hasSkillLevel(SKILLS.FIGHTING_HAMMER, 1),
      ResearchConcept.hasSkillLevel(SKILLS.FIGHTING_POLEARM, 1),
      ResearchConcept.hasSkillLevel(SKILLS.FIGHTING_MACE, 1)
    )
  ]
});

module.exports = global.PrimitiveTrainingDummy = PrimitiveTrainingDummy;
