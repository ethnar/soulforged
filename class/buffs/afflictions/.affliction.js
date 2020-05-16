const Buff = require("../buff");

const LEVEL_PROP = "internalLevel";

const levelLabels = {
  1: `initial`,
  2: `minor`,
  3: `severe`,
  4: `extreme`,
  5: `recovering`
};

function afflictionFactory(name, definition) {
  const className = name.replace(/[^A-Za-z]/g, "");
  const illnessName = definition.name || name;
  const incubation = utils.newClassExtending(`${className}Incubation`, Buff);
  const symptomatic = utils.newClassExtending(`${className}Symptomatic`, Buff);
  const immune = utils.newClassExtending(`${className}Immune`, Buff);

  global.ILLNESSES = global.ILLNESSES || [];
  global.ILLNESSES.push(`${className}Symptomatic`);

  /**************  INCUBATION - THE UNCERTAINTY OF BEING ILL ************/
  Object.assign(incubation, {
    applyBuff(creature) {
      creature.recalculateBuffs();
      if (
        creature.hasBuff(immune) ||
        creature.hasBuff(symptomatic) ||
        creature.hasBuff(incubation)
      ) {
        return;
      }
      creature.addBuff(incubation, {
        duration: utils.randomFromRange(definition.incubationPeriod)
      });
    }
  });
  Object.assign(incubation.prototype, {
    name: `${illnessName} Incubating`,
    category: Buff.CATEGORIES.AFFLICTION,
    hiddenBuff: true,
    visible: true,
    expired() {
      symptomatic.applyBuff(this.creature);
      this.creature.logging(
        `You are now afflicted by ${illnessName}.`,
        LOGGING.WARN
      );
      return true;
    }
  });

  /**************  SYMPTOMATIC - HAVING AFFLICTION ************/
  const effects = utils.effectsCalculator(4);

  Object.assign(symptomatic, {
    applyBuff(creature, level = 1) {
      let targetLevel;

      if (level >= 5 && definition.lethal) {
        creature.die(`You died from ${illnessName}`);
      }

      switch (level) {
        case 1:
        case 2:
        case 3:
        case 4:
          targetLevel = level;
          break;
        case 5:
          targetLevel = 2;
          break;
        case 6:
          return immune.applyBuff(creature);
      }
      return creature.addBuff(symptomatic, {
        [LEVEL_PROP]: level,
        duration: utils.randomFromRange(definition.symptomaticPeriod),
        effects: effects(
          definition.effects,
          targetLevel,
          100 / creature.getStatPercentageEfficiency(STATS.ENDURANCE)
        )
      });
    }
  });
  Object.assign(symptomatic.prototype, {
    getName() {
      return definition.symptomaticLevels
        ? `${illnessName} (${levelLabels[this[LEVEL_PROP]]})`
        : illnessName;
    },
    name: illnessName,
    category: Buff.CATEGORIES.AFFLICTION,
    icon: definition.icon,
    visible: !definition.hidden,
    severity: 1,
    expiring(seconds) {
      const expiring = Buff.prototype.expiring.call(this, seconds);
      if (expiring) {
        if (definition.symptomaticLevels) {
          symptomatic.applyBuff(this.creature, this[LEVEL_PROP] + 1);
        } else {
          symptomatic.applyBuff(this.creature, 6);
        }
      }
      if (definition.spreading && TimeCheck.onTheHour(seconds)) {
        definition.spreading(this.creature, this[LEVEL_PROP], incubation);
      }
      return expiring;
    }
  });

  /******************* IMMUNE PERIOD ********************/
  Object.assign(immune, {
    applyBuff(creature, options = {}) {
      return creature.addBuff(immune, {
        duration: utils.randomFromRange(definition.immunePeriod),
        ...options
      });
    }
  });
  Object.assign(immune.prototype, {
    name: `${illnessName} Immune`,
    category: Buff.CATEGORIES.AFFLICTION,
    visible: true,
    hiddenBuff: true
  });

  return {
    incubation,
    symptomatic,
    immune
  };
}

module.exports = afflictionFactory;
