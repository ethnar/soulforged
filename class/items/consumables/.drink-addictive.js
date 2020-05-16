const Drink = require("./.drink");
const Buff = require("../../buffs/buff");

const MAX_LEVEL = 4;
const LEVEL_PROP = "internalLevel";

const levelLabels = {
  1: `initial`,
  2: `minor`,
  3: `severe`,
  4: `extreme`
};

function buffFactory(definition, className) {
  const addicting = utils.newClassExtending(`${className}Addicting`, Buff);
  const dependence = utils.newClassExtending(`${className}Dependence`, Buff);
  const withdrawalPrevention = utils.newClassExtending(
    `${className}WithdrawalRes`,
    Buff
  );
  const withdrawal = utils.newClassExtending(`${className}Withdrawal`, Buff);

  const itemName = () => global[className].getName();

  /**************  ADDICTING - CHANCE TO GROW DEPENDENCE ************/
  Object.assign(addicting, {
    applyBuff(creature) {
      // increase chances to get dependence
      creature.addBuff(addicting, {
        duration: definition.addictivenessTime
      });
      const count = creature.getBuffs().filter(b => b instanceof addicting)
        .length;

      // possibly apply dependence buff
      if (utils.chance(count * definition.addictiveness)) {
        dependence.applyBuff(creature);
      }

      // reset withdrawal prevention effect
      const existingPrevention = creature
        .getBuffs()
        .find(b => b instanceof withdrawalPrevention);
      if (existingPrevention) {
        creature.removeBuff(existingPrevention);
      }
      withdrawalPrevention.applyBuff(creature);

      // remove any withdrawal effects
      creature
        .getBuffs()
        .filter(b => b instanceof withdrawal)
        .forEach(b => creature.removeBuff(b));
    }
  });
  Object.assign(addicting.prototype, {
    name: "Addicting",
    category: Buff.CATEGORIES.ADDICTION,
    // icon: global[className].prototype.icon,
    hiddenBuff: true
  });

  /**************  DEPENDENCE - CAUSES WITHDRAWAL WHEN PREVENTION DROPS OFF ************/
  Object.assign(dependence, {
    applyBuff(creature) {
      const existing = creature
        .getBuffs()
        .find(buff => buff instanceof dependence);

      creature.logging(
        `You became increasingly dependent on ${itemName()}.`,
        LOGGING.WARN
      );
      if (existing) {
        existing[LEVEL_PROP] = Math.min(existing[LEVEL_PROP] + 1, MAX_LEVEL);
        existing.duration = definition.levelDownTime;
        return existing;
      }
      return creature.addBuff(dependence, {
        [LEVEL_PROP]: 1,
        duration: definition.levelDownTime
      });
    }
  });
  Object.assign(dependence.prototype, {
    getName() {
      return `${itemName()} Dependence (${levelLabels[this[LEVEL_PROP]]})`;
    },
    name: "Dependant",
    category: Buff.CATEGORIES.ADDICTION,
    icon: global[className].prototype.icon,
    expired() {
      this[LEVEL_PROP] -= 1;
      this.creature.logging(
        `You are now less dependent on ${itemName()}.`,
        LOGGING.GOOD
      );

      if (this[LEVEL_PROP] > 0) {
        this.duration = definition.levelDownTime;
        return false;
      } else {
        // remove any withdrawal effects
        this.creature
          .getBuffs()
          .filter(
            b =>
              // b instanceof withdrawalPrevention ||
              b instanceof withdrawal
          )
          .forEach(b => this.creature.removeBuff(b));
        return true;
      }
    }
  });

  /******************* WITHDRAWAL EFFECTS ********************/
  const effects = value =>
    utils.effectsCalculator(MAX_LEVEL)(definition.withdrawalEffect, value);

  Object.assign(withdrawal, {
    applyBuff(creature) {
      const existing = creature
        .getBuffs()
        .find(buff => buff instanceof withdrawal);

      creature.logging(
        `You developed withdrawal symptoms from ${itemName()}.`,
        LOGGING.WARN
      );
      if (existing) {
        existing[LEVEL_PROP] = Math.min(existing[LEVEL_PROP] + 1, MAX_LEVEL);
        existing.effects = effects(existing[LEVEL_PROP]);
        return existing;
      }
      return creature.addBuff(withdrawal, {
        [LEVEL_PROP]: 1,
        effects: effects(1)
      });
    }
  });
  Object.assign(withdrawal.prototype, {
    getName() {
      return `${itemName()} Withdrawal (${levelLabels[this[LEVEL_PROP]]})`;
    },
    name: "Withdrawal",
    category: Buff.CATEGORIES.ADDICTION,
    icon: global[className].prototype.icon
  });

  /******************* WITHDRAWAL PREVENTION EFFECTS ********************/
  Object.assign(withdrawalPrevention, {
    applyBuff(creature) {
      return creature.addBuff(withdrawalPrevention, {
        duration: definition.withdrawalKickInTime
      });
    }
  });
  Object.assign(withdrawalPrevention.prototype, {
    name: "WithdrawalRes",
    category: Buff.CATEGORIES.ADDICTION,
    hiddenBuff: true,
    expired() {
      // add withdrawal effects

      const dependenceBuff = this.creature
        .getBuffs()
        .find(buff => buff instanceof dependence);

      if (dependenceBuff) {
        withdrawal.applyBuff(this.creature);
        withdrawalPrevention.applyBuff(this.creature);
      }
      return true;
    }
  });

  return {
    addicting,
    dependence,
    withdrawal
  };
}

class DrinkAddictive extends Drink {
  consumed(creature) {
    this.applyAddictionBuff(creature);
    return super.consumed(creature);
  }

  applyAddictionBuff(creature) {
    this.addiction.buffClasses.addicting.applyBuff(creature);
  }

  static makeAddictive(definition) {
    Object.assign(this.prototype, {
      addiction: {
        ...definition,
        buffClasses: {
          ...buffFactory(definition, this.name)
        }
      }
    });
  }
}
Object.assign(DrinkAddictive.prototype, {
  name: "?DrinkAddictive?"
});
module.exports = global.DrinkAddictive = DrinkAddictive;
