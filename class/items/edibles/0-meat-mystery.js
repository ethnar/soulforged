const afflictionFactory = require("../../buffs/afflictions/.affliction");
require("../equipment/medicine/.medical-item");

const name = "Rotting Sores";
afflictionFactory(name, {
  icon: `/${ICONS_PATH}/buffs/afflictions/red_19.png`,
  incubationPeriod: [4 * DAYS, 6 * DAYS],
  symptomaticPeriod: [10 * DAYS, 14 * DAYS],
  symptomaticLevels: true,
  lethal: true,
  effects: {
    [BUFFS.MOOD]: -50,
    [BUFFS.STATS.INTELLIGENCE]: -30,
    [BUFFS.INTERNAL_DAMAGE]: 90
  }
});

class MysteryMeat extends Edible {
  onEat(creature) {
    if (!creature.hasAffliction("Bloodthirst")) {
      const chance =
        20 / (creature.getStatPercentageEfficiency(STATS.ENDURANCE) / 100);
      if (utils.chance(chance)) {
        RottingSoresIncubation.applyBuff(creature);
      }
    }
  }
}
Edible.itemFactory(MysteryMeat, {
  nameable: true,
  name: "Mystery Meat",
  icon: `/${ICONS_PATH}/creatures/monsters/animals/huntingicons_15.png`,
  weight: 1,
  timeToEat: 3,
  nutrition: 10,
  calculateEffects: 1,
  buffs: {
    [BUFFS.STATS_GAINS.STRENGTH]: 1,
    [BUFFS.STATS_GAINS.ENDURANCE]: 1,
    [BUFFS.STATS_GAINS.INTELLIGENCE]: -2,
    [BUFFS.MOOD]: -35
  }
});
module.exports = global.MysteryMeat = MysteryMeat;

class RottingSoresCure extends MedicalItem {}
Item.itemFactory(RottingSoresCure, {
  name: `${name} Cure`,
  icon: `/${ICONS_PATH}/items/alchemy/bottle_02_purple.png`,
  order: ITEMS_ORDER.MEDICINE,
  weight: 0.25,
  containerItemType: ClayFlask,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      AlchemyIng2_1: 3,
      AlchemyIng3_2: 2,
      AlchemyIng3_4: 3,
      MysteryMeat: 1,
      ClayFlask: 1
    },
    skill: SKILLS.ALCHEMY,
    skillLevel: 3,
    // toolUtility: TOOL_UTILS.MILLING,
    baseTime: 20 * MINUTES
  },
  sourceBuff: "RottingSoresSymptomatic",
  applicationTime: 3 * SECONDS,
  maxBatch: 1,
  skillLevel: 5,
  skillGainMultiplier: 60,
  transformBuff: (creature, stacks, oldBuff) => {
    // RottingSoresImmune.applyBuff(creature, {
    //     duration: 2 * DAYS,
    // });
  }
});

Edible.makeCookedVersion(MysteryMeat, 1);
