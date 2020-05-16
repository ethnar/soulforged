function calculateMoodMod(factor) {
  const BASE = 4.5;
  const value = factor / 100;
  return -Math.round((1 - ((1 + BASE) * value) / (1 + BASE * value)) * 150);
}

class BuffHiding extends Buff {
  expired() {
    this.creature.protectionStatus = PROTECTION_STATUS.UNPROTECTED;
    return true;
  }
}
Object.assign(BuffHiding.prototype, {
  name: "Hiding",
  description: "Enemies cannot hit you",
  icon: `/${ICONS_PATH}/creatures/violet_02.png`,
  category: Buff.CATEGORIES.OTHER,
  severity: 3,
  visible: true
});
global.BuffHiding = BuffHiding;

class BuffBrokenBone extends Buff {
  expired() {
    this.getCreature().possibleInjury(BuffSwelling, 75);
    this.getCreature().possibleInjury(BuffBadKnee, 5);
    return true;
  }
}
Object.assign(BuffBrokenBone.prototype, {
  name: "Broken bone",
  icon: `/${ICONS_PATH}/creatures/spellbook01_43.png`,
  category: Buff.CATEGORIES.WOUND,
  visible: true
});
global.BuffBrokenBone = BuffBrokenBone;

class BuffBruise extends Buff {
  expired() {
    this.getCreature().possibleInjury(BuffSwelling, this.getStacks());
    return true;
  }
}
Object.assign(BuffBruise.prototype, {
  name: "Bruise",
  icon: `/${ICONS_PATH}/creatures/yellow_17.png`,
  category: Buff.CATEGORIES.WOUND,
  visible: true
});
global.BuffBruise = BuffBruise;

class BuffInternalDamage extends Buff {
  expired() {
    this.getCreature().possibleInjury(BuffHeartCondition, this.getStacks());
    return true;
  }
}
Object.assign(BuffInternalDamage.prototype, {
  name: "Stab",
  icon: `/${ICONS_PATH}/creatures/red_35.png`,
  category: Buff.CATEGORIES.WOUND,
  visible: true,
  severity: 3
});
global.BuffInternalDamage = BuffInternalDamage;

class BuffCut extends Buff {
  expired() {
    this.getCreature().possibleInjury(BuffScar, this.getStacks());
    return true;
  }
}
Object.assign(BuffCut.prototype, {
  name: "Cut",
  icon: `/${ICONS_PATH}/creatures/spellbook01_73.png`,
  category: Buff.CATEGORIES.WOUND,
  visible: true,
  severity: 3
});
global.BuffCut = BuffCut;

class BuffGushingCut extends Buff {
  expired() {
    this.getCreature().damageCut(this.getStacks(), undefined, false);
    return true;
  }
}
Object.assign(BuffGushingCut.prototype, {
  name: "Gushing Cut",
  icon: `/${ICONS_PATH}/creatures/spellbookpage09_42.png`,
  category: Buff.CATEGORIES.WOUND,
  visible: true,
  severity: 3
});
global.BuffGushingCut = BuffGushingCut;

class BuffBurn extends Buff {}
Object.assign(BuffBurn.prototype, {
  name: "Burn",
  icon: `/${ICONS_PATH}/creatures/spellbook01_58.png`,
  category: Buff.CATEGORIES.WOUND,
  visible: true
});
global.BuffBurn = BuffBurn;

class BuffVomited extends Buff {
  static applyBuff(creature, options) {
    creature.satiated -= Math.max(3, 0.35 * creature.satiated);
    super.applyBuff(creature, options);
  }
}
Object.assign(BuffVomited.prototype, {
  name: "Vomited",
  icon: `/${ICONS_PATH}/creatures/humanoids/addon_26.png`,
  category: Buff.CATEGORIES.AFFLICTION,
  severity: 2,
  duration: 30 * MINUTES,
  visible: true,
  effects: {
    [BUFFS.MOOD]: -30,
    [BUFFS.PAIN]: 30
  }
});
global.BuffVomited = BuffVomited;

class BuffNauseous extends Buff {
  expired() {
    const creature = this.getCreature();
    if (utils.chance(95)) {
      creature.logging(`You have vomited.`, LOGGING.FAIL);
      BuffVomited.applyBuff(creature);
    } else {
      creature.logging(`The nausea has passed.`, LOGGING.GOOD);
    }
    return true;
  }
}
Object.assign(BuffNauseous.prototype, {
  name: "Nauseous",
  icon: `/${ICONS_PATH}/creatures/humanoids/addon_26_dark.png`,
  category: Buff.CATEGORIES.AFFLICTION,
  severity: 2,
  duration: 10 * MINUTES,
  visible: true,
  effects: {
    [BUFFS.MOOD]: -5
  }
});
global.BuffNauseous = BuffNauseous;

class BuffSleeping extends Buff {}
Object.assign(BuffSleeping.prototype, {
  name: "Sleeping",
  icon: `/${ICONS_PATH}/creatures/violet_18_recolor.png`,
  category: Buff.CATEGORIES.STATUS,
  // visible: true,
  effects: {
    [BUFFS.BLEEDING_MULTIPLIER]: 20
  }
});
global.BuffSleeping = BuffSleeping;

const hungerNames = {
  1: "Slightly Hungry",
  2: "Hungry",
  3: "Very Hungry",
  4: "Starving"
};
class BuffHunger extends Buff {}
Object.assign(BuffHunger.prototype, {
  name: "?Hunger?",
  icon: `/${ICONS_PATH}/creatures/humanoids/meat_05_small.png`,
  category: Buff.CATEGORIES.STATUS,
  visible: true
});
Object.keys(hungerNames).forEach(severityText => {
  const severity = +severityText;
  const hungerClass = utils.newClassExtending(
    `BuffHunger${severity}`,
    BuffHunger
  );
  const tiered = (4 - severity) * 25;
  Object.assign(hungerClass.prototype, {
    name: hungerNames[severity],
    severity,
    effects: {
      [BUFFS.MOOD]: calculateMoodMod(tiered)
    }
  });
});

const malnourishmentProps = {
  1: {
    name: "Malnourished (initial)",
    effects: {
      [BUFFS.PAIN]: 5,
      [BUFFS.STATS.STRENGTH]: -5,
      [BUFFS.STATS.DEXTERITY]: -5,
      [BUFFS.STATS.ENDURANCE]: -5,
      [BUFFS.STATS.PERCEPTION]: -5,
      [BUFFS.STATS.INTELLIGENCE]: -5
    }
  },
  2: {
    name: "Malnourished (minor)",
    effects: {
      [BUFFS.PAIN]: 10,
      [BUFFS.STATS.STRENGTH]: -10,
      [BUFFS.STATS.DEXTERITY]: -10,
      [BUFFS.STATS.ENDURANCE]: -10,
      [BUFFS.STATS.PERCEPTION]: -10,
      [BUFFS.STATS.INTELLIGENCE]: -10
    }
  },
  3: {
    name: "Malnourished (severe)",
    effects: {
      [BUFFS.PAIN]: 25,
      [BUFFS.STATS.STRENGTH]: -25,
      [BUFFS.STATS.DEXTERITY]: -25,
      [BUFFS.STATS.ENDURANCE]: -25,
      [BUFFS.STATS.PERCEPTION]: -25,
      [BUFFS.STATS.INTELLIGENCE]: -25
    }
  },
  4: {
    name: "Malnourished (extreme)",
    effects: {
      [BUFFS.PAIN]: 40,
      [BUFFS.STATS.STRENGTH]: -40,
      [BUFFS.STATS.DEXTERITY]: -40,
      [BUFFS.STATS.ENDURANCE]: -40,
      [BUFFS.STATS.PERCEPTION]: -40,
      [BUFFS.STATS.INTELLIGENCE]: -40
    }
  }
};
class BuffMalnourishment extends Buff {}
Object.assign(BuffMalnourishment.prototype, {
  name: "?Malnourishment?",
  icon: `/${ICONS_PATH}/creatures/humanoids/meat_05_small_health.png`,
  category: Buff.CATEGORIES.STATUS,
  visible: true
});
Object.keys(malnourishmentProps).forEach(severityText => {
  const severity = +severityText;
  const malnourishmentClass = utils.newClassExtending(
    `BuffMalnourishment${severity}`,
    BuffMalnourishment
  );
  Object.assign(malnourishmentClass.prototype, {
    severity,
    ...malnourishmentProps[severity]
  });
});

const bloodLossProps = {
  1: {
    name: "Blood Loss (initial)",
    effects: {
      [BUFFS.STATS.STRENGTH]: -3,
      [BUFFS.STATS.DEXTERITY]: -5
    }
  },
  2: {
    name: "Blood Loss (minor)",
    effects: {
      [BUFFS.STATS.STRENGTH]: -10,
      [BUFFS.STATS.DEXTERITY]: -15,
      [BUFFS.STATS.INTELLIGENCE]: -5
    }
  },
  3: {
    name: "Blood Loss (severe)",
    effects: {
      [BUFFS.STATS.STRENGTH]: -20,
      [BUFFS.STATS.DEXTERITY]: -25,
      [BUFFS.STATS.INTELLIGENCE]: -15
    }
  },
  4: {
    name: "Blood Loss (extreme)",
    effects: {
      [BUFFS.STATS.STRENGTH]: -30,
      [BUFFS.STATS.DEXTERITY]: -45,
      [BUFFS.STATS.INTELLIGENCE]: -25
    }
  }
};
class BuffBloodLoss extends Buff {}
Object.assign(BuffBloodLoss.prototype, {
  name: "?BloodLoss?",
  icon: `/${ICONS_PATH}/creatures/red_21_health.png`,
  category: Buff.CATEGORIES.PAIN,
  visible: true
});
global.BuffBloodLoss = BuffBloodLoss;
Object.keys(malnourishmentProps).forEach(severityText => {
  const severity = +severityText;
  const malnourishmentClass = utils.newClassExtending(
    `BuffBloodLoss${severity}`,
    BuffBloodLoss
  );
  Object.assign(malnourishmentClass.prototype, {
    severity,
    ...bloodLossProps[severity]
  });
});

const buffHeatNames = {
  1: "Warm",
  2: "Sweating",
  3: "Hot",
  4: "Scorching"
};
class BuffHeat extends Buff {}
Object.assign(BuffHeat.prototype, {
  name: "?Heat?",
  icon: `/${ICONS_PATH}/creatures/humanoids/yellow_39.png`,
  category: Buff.CATEGORIES.THERMAL,
  visible: true
});
Object.keys(buffHeatNames).forEach(severityText => {
  const severity = +severityText;
  const heatClass = utils.newClassExtending(`BuffHeat${severity}`, BuffHeat);
  Object.assign(heatClass.prototype, {
    name: buffHeatNames[severity],
    severity: severity === 1 ? 0 : severity
  });
});

const heatStrokeProps = {
  1: {
    name: "Heat stroke (initial)",
    effects: {
      [BUFFS.PAIN]: 10,
      [BUFFS.STATS.STRENGTH]: -4,
      [BUFFS.STATS.INTELLIGENCE]: -2,
      [BUFFS.NAUSEOUS]: +1
    }
  },
  2: {
    name: "Heat stroke (minor)",
    effects: {
      [BUFFS.PAIN]: 20,
      [BUFFS.STATS.STRENGTH]: -8,
      [BUFFS.STATS.INTELLIGENCE]: -6,
      [BUFFS.NAUSEOUS]: +2
    }
  },
  3: {
    name: "Heat stroke (severe)",
    effects: {
      [BUFFS.PAIN]: 30,
      [BUFFS.STATS.STRENGTH]: -12,
      [BUFFS.STATS.INTELLIGENCE]: -12,
      [BUFFS.NAUSEOUS]: +10
    }
  },
  4: {
    name: "Heat stroke (extreme)",
    effects: {
      [BUFFS.PAIN]: 60,
      [BUFFS.STATS.STRENGTH]: -20,
      [BUFFS.STATS.INTELLIGENCE]: -30,
      [BUFFS.NAUSEOUS]: +30
    }
  }
};
class BuffHeatstroke extends Buff {}
Object.assign(BuffHeatstroke.prototype, {
  name: "?Heatstroke?",
  icon: `/${ICONS_PATH}/creatures/humanoids/yellow_39_health.png`,
  category: Buff.CATEGORIES.THERMAL,
  visible: true
});
Object.keys(heatStrokeProps).forEach(severityText => {
  const severity = +severityText;
  const malnourishmentClass = utils.newClassExtending(
    `BuffHeatstroke${severity}`,
    BuffHeatstroke
  );
  Object.assign(malnourishmentClass.prototype, {
    severity,
    ...heatStrokeProps[severity]
  });
});

const buffColdNames = {
  1: "Chilly",
  2: "Shivering",
  3: "Cold",
  4: "Freezing"
};
class BuffCold extends Buff {}
Object.assign(BuffCold.prototype, {
  name: "?Cold?",
  icon: `/${ICONS_PATH}/creatures/humanoids/blue_04_nobg.png`,
  category: Buff.CATEGORIES.THERMAL,
  visible: true
});
Object.keys(buffColdNames).forEach(severityText => {
  const severity = +severityText;
  const coldClass = utils.newClassExtending(`BuffCold${severity}`, BuffCold);
  Object.assign(coldClass.prototype, {
    name: buffColdNames[severity],
    severity: severity === 1 ? 0 : severity
  });
});

const hypothermiaProps = {
  1: {
    name: "Hypothermia (initial)",
    effects: {
      [BUFFS.STATS.DEXTERITY]: -5,
      [BUFFS.HUNGER_RATE]: +10
    }
  },
  2: {
    name: "Hypothermia (minor)",
    effects: {
      [BUFFS.STATS.DEXTERITY]: -10,
      [BUFFS.STATS.ENDURANCE]: -5,
      [BUFFS.HUNGER_RATE]: +25
    }
  },
  3: {
    name: "Hypothermia (severe)",
    effects: {
      [BUFFS.STATS.DEXTERITY]: -20,
      [BUFFS.STATS.ENDURANCE]: -10,
      [BUFFS.HUNGER_RATE]: +50
    }
  },
  4: {
    name: "Hypothermia (extreme)",
    effects: {
      [BUFFS.STATS.DEXTERITY]: -30,
      [BUFFS.STATS.ENDURANCE]: -15,
      [BUFFS.HUNGER_RATE]: +100
    }
  }
};
class BuffHypothermia extends Buff {}
Object.assign(BuffHypothermia.prototype, {
  name: "?Hypothermia?",
  icon: `/${ICONS_PATH}/creatures/humanoids/blue_04_nobg_health.png`,
  category: Buff.CATEGORIES.THERMAL,
  visible: true
});
Object.keys(hypothermiaProps).forEach(severityText => {
  const severity = +severityText;
  const malnourishmentClass = utils.newClassExtending(
    `BuffHypothermia${severity}`,
    BuffHypothermia
  );
  Object.assign(malnourishmentClass.prototype, {
    severity,
    ...hypothermiaProps[severity]
  });
});

const painNames = {
  1: "Minor pain",
  2: "Pain",
  3: "Major pain",
  4: "Extreme pain"
};
class BuffPain extends Buff {}
Object.assign(BuffPain.prototype, {
  name: "?Pain?",
  icon: `/${ICONS_PATH}/creatures/tooth_t_nobg.png`,
  category: Buff.CATEGORIES.PAIN,
  visible: true
});
global.BuffPain = BuffPain;
Object.keys(painNames).forEach(severityText => {
  const severity = +severityText;
  const painClass = utils.newClassExtending(`BuffPain${severity}`, BuffPain);
  const tiered = (4 - severity) * 25;
  Object.assign(painClass.prototype, {
    name: painNames[severity],
    severity,
    effects: {
      [BUFFS.MOOD]: calculateMoodMod(tiered)
    }
  });
});

const tiredNames = {
  1: "Slightly Tired",
  2: "Tired",
  3: "Very Tired",
  4: "Exhausted"
};
class BuffTired extends Buff {}
Object.assign(BuffTired.prototype, {
  name: "?Tired?",
  icon: `/${ICONS_PATH}/creatures/humanoids/lightning_t_nobg.png`,
  category: Buff.CATEGORIES.STATUS,
  visible: true
});
Object.keys(tiredNames).forEach(severityText => {
  const severity = +severityText;
  const tiredClass = utils.newClassExtending(`BuffTired${severity}`, BuffTired);
  const tiered = (4 - severity) * 25;
  Object.assign(tiredClass.prototype, {
    name: tiredNames[severity],
    severity,
    effects: {
      [BUFFS.MOOD]: calculateMoodMod(tiered)
    }
  });
});

class BuffFullyRested extends BuffTired {}
Object.assign(BuffFullyRested.prototype, {
  name: "Fully rested",
  severity: -5,
  visible: false
});
global.BuffFullyRested = BuffFullyRested;

const badMoodNames = {
  1: "Slightly Sad",
  2: "Sad",
  3: "Very Sad",
  4: "Gloomy"
};
class BuffMoodBad extends Buff {}
Object.assign(BuffMoodBad.prototype, {
  name: "?MoodBad?",
  icon: `/${ICONS_PATH}/creatures/humanoids/mood.png`,
  category: Buff.CATEGORIES.STATUS,
  visible: true
});
Object.keys(badMoodNames).forEach(severityText => {
  const severity = +severityText;
  const badMoodClass = utils.newClassExtending(
    `BuffMoodBad${severity}`,
    BuffMoodBad
  );
  const tiered = (4 - severity) * 25;
  const value = Math.round(tiered * 0.95 + 5);
  Object.assign(badMoodClass.prototype, {
    name: badMoodNames[severity],
    severity,
    effects: {
      [BUFFS.ACTION_SPEED]: value,
      [BUFFS.COMBAT_STRENGTH]: value,
      [BUFFS.ACTION_STAT_GAINS]: value
    }
  });
});

const burdenLevels = {
  1: "Burdened",
  2: "Heavily Burdened",
  3: "Overburdened"
};
class BuffBurdened extends Buff {}
Object.assign(BuffBurdened.prototype, {
  name: "?Burdened?",
  icon: `/${ICONS_PATH}/creatures/humanoids/anvil_t_no_bg.png`,
  category: Buff.CATEGORIES.STATUS,
  visible: true
});
Object.keys(burdenLevels).forEach(levelText => {
  const level = +levelText;
  const burdenedClass = utils.newClassExtending(
    `BuffBurdened${level}`,
    BuffBurdened
  );
  // const tiered = (4 - severity) * 25;
  let effects = {},
    description;
  switch (level) {
    case 1:
      effects = {
        [BUFFS.TRAVEL_SPEED]: -20,
        [BUFFS.DODGE_MULTIPLIER]: 50
      };
      break;
    case 2:
      effects = {
        [BUFFS.TRAVEL_SPEED]: -50,
        [BUFFS.DODGE_MULTIPLIER]: 20
      };
      break;
    case 3:
      description = "Unable to travel";
      effects = {
        [BUFFS.TRAVEL_SPEED]: -50,
        [BUFFS.DODGE_MULTIPLIER]: 0
      };
      break;
  }
  Object.assign(burdenedClass.prototype, {
    name: burdenLevels[level],
    severity: level,
    effects,
    description
  });
});

class BuffMoodContent extends Buff {}
Object.assign(BuffMoodContent.prototype, {
  name: "Content",
  icon: `/${ICONS_PATH}/creatures/humanoids/mood_plus.png`,
  description: "",
  visible: true,
  category: Buff.CATEGORIES.STATUS,
  severity: 0,
  effects: {
    [BUFFS.ACTION_SPEED]: 100,
    [BUFFS.COMBAT_STRENGTH]: 100,
    [BUFFS.ACTION_STAT_GAINS]: 100
  }
});
global.BuffMoodContent = BuffMoodContent;

const happinessLevels = {
  1: "Glad",
  2: "Happy",
  3: "Cheerful",
  4: "Overjoyed",
  5: "Ecstatic"
};
class BuffMoodGood extends Buff {}
Object.assign(BuffMoodGood.prototype, {
  name: "?BuffMoodGood?",
  icon: `/${ICONS_PATH}/creatures/humanoids/mood_plus.png`,
  visible: true,
  category: Buff.CATEGORIES.STATUS
});
Object.keys(happinessLevels).forEach(levelText => {
  const level = +levelText;
  const happinessClass = utils.newClassExtending(
    `BuffMoodGood${level}`,
    BuffMoodGood
  );
  // const tiered = (4 - severity) * 25;
  const value = 100 + 10 * level;
  Object.assign(happinessClass.prototype, {
    name: happinessLevels[level],
    severity: -level,
    effects: {
      [BUFFS.ACTION_SPEED]: value,
      [BUFFS.COMBAT_STRENGTH]: value,
      [BUFFS.ACTION_STAT_GAINS]: value
    }
  });
});

class BuffAge1 extends Buff {
  static applyBuff(creature) {
    const ageLevels = Object.keys(creature.agingTiers);
    const adolescenceMaxAge = +ageLevels[1];
    const wayThere = creature.age / adolescenceMaxAge;

    const effects = {};
    if (!creature.noYoungPenalty) {
      effects[BUFFS.COMBAT_STRENGTH] = Math.min(
        5 + Math.ceil(95 * (1 - Math.pow(1 - wayThere, 2))),
        100
      );
    }

    return creature.addBuff(BuffAge1, {
      effects
    });
  }
}
Object.assign(BuffAge1.prototype, {
  name: "Adolescence",
  category: Buff.CATEGORIES.AGE_INDICATOR,
  description: "Growing up",
  visible: true,
  icon: `/${ICONS_PATH}/creatures/humanoids/sgi_48.png`
});
global.BuffAge1 = BuffAge1;

class BuffAge2 extends Buff {}
Object.assign(BuffAge2.prototype, {
  name: "Adulthood",
  category: Buff.CATEGORIES.AGE_INDICATOR,
  description: "You are in your prime",
  visible: true,
  icon: `/${ICONS_PATH}/creatures/humanoids/trophyicons_72_b.png`
});
global.BuffAge2 = BuffAge2;

class BuffAge3 extends Buff {}
Object.assign(BuffAge3.prototype, {
  name: "Elderly",
  category: Buff.CATEGORIES.AGE_INDICATOR,
  description: "Getting old",
  visible: true,
  icon: `/${ICONS_PATH}/creatures/humanoids/sgi_114.png`
});
global.BuffAge3 = BuffAge3;

class BuffAge4 extends Buff {}
Object.assign(BuffAge4.prototype, {
  name: "Old age",
  category: Buff.CATEGORIES.AGE_INDICATOR,
  description: "You life will end any day now",
  visible: true,
  icon: `/${ICONS_PATH}/creatures/humanoids/necromancericons_02_b.png`
});
global.BuffAge4 = BuffAge4;

global.BuffScar = utils.registerClass(Buff, "BuffScar", {
  name: "Scar",
  category: Buff.CATEGORIES.INJURY,
  visible: true,
  stackable: true,
  effects: {
    [BUFFS.PAIN]: 1,
    [BUFFS.ARMOR[DAMAGE_TYPES.SLICE]]: 0.05,
    [BUFFS.ARMOR[DAMAGE_TYPES.PIERCE]]: 0.05
  },
  icon: `/${ICONS_PATH}/creatures/injuries/red_09_recolor.png`
});

global.BuffBadKnee = utils.registerClass(Buff, "BuffBadKnee", {
  name: "Bad Knee",
  category: Buff.CATEGORIES.INJURY,
  // visible: true,
  stackable: true,
  maxStacks: 2,
  effects: {
    [BUFFS.PAIN]: 2,
    [BUFFS.TRAVEL_SPEED]: -1
  },
  icon: `/${ICONS_PATH}/creatures/injuries/yellow_05.png`
});

global.BuffHeartCondition = utils.registerClass(Buff, "BuffHeartCondition", {
  name: "Heart Condition",
  category: Buff.CATEGORIES.INJURY,
  // visible: true,
  stackable: true,
  maxStacks: 100,
  effects: {
    [BUFFS.PAIN]: 0.5,
    [BUFFS.STATS.STRENGTH]: -0.5,
    [BUFFS.STATS.ENDURANCE]: -0.5
  },
  icon: `/${ICONS_PATH}/creatures/injuries/red_17.png`
});

global.BuffSwelling = utils.registerClass(Buff, "BuffSwelling", {
  name: "Swelling",
  category: Buff.CATEGORIES.INJURY,
  // visible: true,
  stackable: true,
  maxStacks: 100,
  duration: 15 * DAYS,
  effects: {
    [BUFFS.PAIN]: 0.3,
    [BUFFS.STATS.DEXTERITY]: -0.3
  },
  icon: `/${ICONS_PATH}/creatures/injuries/addon_19_recolor.png`
});

global.BuffTutorialBlessing = utils.registerClass(
  Buff,
  "BuffTutorialBlessing",
  {
    name: `Aymar's Blessing`,
    category: Buff.CATEGORIES.OTHER,
    effects: {
      [BUFFS.SKILLS.TRACKING]: 2
    },
    icon: `/${ICONS_PATH}/creatures/blue_01.png`
  }
);

global.BuffMonsterVeteran = utils.registerClass(Buff, "BuffMonsterVeteran", {
  name: `Taste for Blood`,
  category: Buff.CATEGORIES.OTHER,
  effects: {
    [BUFFS.COMBAT_STRENGTH]: 120
  },
  visible: true,
  description: "Increased resistances",
  icon: `/${ICONS_PATH}/creatures/monsters/red_01.png`
});
