const afflictionFactory = require("./.affliction");

const name = "Marsh Fever";
afflictionFactory(name, {
  name: "Marsh Flu",
  icon: `/${ICONS_PATH}/buffs/afflictions/spellbookpage09_43.png`,
  incubationPeriod: [1 * DAYS, 2 * DAYS],
  symptomaticPeriod: [0.5 * DAYS, 1 * DAYS],
  immunePeriod: [2 * DAYS, 3 * DAYS],
  symptomaticLevels: true,
  lethal: false,
  spreading: (creature, level, incubation) => {
    creature
      .getNode()
      .getVisibleAliveCreatures()
      .filter(c => !(c instanceof Unliving))
      .forEach(c => {
        if (utils.chance(20)) {
          incubation.applyBuff(c);
        }
      });
  },
  effects: {
    [BUFFS.STATS.STRENGTH]: -5,
    [BUFFS.STATS.DEXTERITY]: -5,
    [BUFFS.STATS.ENDURANCE]: -5,
    [BUFFS.INTERNAL_DAMAGE]: 10
  }
});

class MarshFeverCure extends MedicalItem {}
Item.itemFactory(MarshFeverCure, {
  name: `Marsh Flu Cure`,
  icon: `/${ICONS_PATH}/items/alchemy/bottle_02_2_red.png`,
  order: ITEMS_ORDER.MEDICINE,
  weight: 0.25,
  containerItemType: ClayFlask,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      AlchemyIng2_1: 1,
      AlchemyIng2_3: 1,
      TickBloodSack: 1,
      ClayFlask: 1
    },
    skill: SKILLS.ALCHEMY,
    skillLevel: 3,
    // toolUtility: TOOL_UTILS.MILLING,
    baseTime: 20 * MINUTES
  },
  sourceBuff: "MarshFeverSymptomatic",
  applicationTime: 3 * SECONDS,
  maxBatch: 1,
  skillLevel: 1,
  skillGainMultiplier: 60,
  transformBuff: (creature, stacks, oldBuff) => {
    MarshFeverImmune.applyBuff(creature, {
      duration: 21 * DAYS
    });
  }
});

// const curedBuff = utils.newClassExtending(`Buff${name}Cured`, Buff);
// Object.assign(curedBuff.prototype, {
//     name: `${name} Cured`,
//     icon: `/${ICONS_PATH}/buffs/afflictions/red_31_healed.png`,
//     category: Buff.CATEGORIES.WOUND,
//     visible: true,
//     duration: 12 * DAYS,
//     effects: {
//         [BUFFS.STATS.STRENGTH]: -1,
//         [BUFFS.STATS.DEXTERITY]: -1,
//         [BUFFS.STATS.ENDURANCE]: -1,
//     },
// });
