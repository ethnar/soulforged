const server = require("../../singletons/server");

const props = {
  source: undefined,
  icon: undefined,
  category: undefined,
  level: undefined,
  duration: undefined,
  name: undefined,
  severity: undefined,
  description: undefined,
  visible: undefined,
  stacks: undefined
};

class Buff {
  static applyBuff(creature, options = {}) {
    if (this.prototype.stackable) {
      const buffClass = this;
      options.stacks = options.stacks || 1;
      const existing = creature
        .getBuffs()
        .find(buff => buffClass === buff.constructor);

      if (existing) {
        existing.addStacks(options.stacks);
        return new buffClass(options);
      }
    }
    return creature.addBuff(this, options);
  }

  addStacks(value) {
    this.stacks = this.stacks || 1;
    this.stacks += value;
    if (this.maxStacks) {
      this.stacks = Math.min(this.stacks, this.maxStacks);
    }
    this.calculateEffects();
  }

  calculateEffects() {
    if (this.stacks < 0) {
      this.stacks = 0;
    }
    const base = this.constructor.prototype.effects;
    this.effects = Object.keys(base).toObject(
      stat => stat,
      stat => base[stat] * this.stacks
    );
  }

  constructor(args, creature) {
    this.creature = creature;
    Object.keys(props)
      .filter(p => args[p] || props[p])
      .forEach(p => (this[p] = args[p] || props[p]));
    Object.keys(args)
      .filter(p => !props[p])
      .forEach(p => (this[p] = args[p]));
  }

  isEqual(args) {
    return this.prototype === args.prototype;
  }

  setLevel(level) {
    this.level = level;
  }

  getCreature() {
    return this.creature;
  }

  getStacks() {
    return this.stacks;
  }

  getLevel() {
    return this.level || 1;
  }

  isVisible() {
    return this.visible;
  }

  isCategory(category) {
    return this.category === category;
  }

  getName(creature, appliedTo) {
    return this.dynamicName
      ? this.dynamicName(this, appliedTo, creature)
      : this.name
      ? this.name
      : this.source
      ? this.source.getName()
      : "NoName!";
  }

  getIcon(creature) {
    if (this.icon) {
      return server.getImage(creature, this.icon);
    }
    if (this.source && this.source.getIcon) {
      return this.source.getIcon(creature);
    }
    return server.getImage(creature, "/placeholder.png");
  }

  getEffects() {
    return Object.keys(utils.cleanup(this.effects)).toObject(
      stat => stat,
      stat => this.getStatBonus(stat)
    );
  }

  getStatBonus(stat) {
    if (MULTIPLIER_BUFFS[stat]) {
      return (
        Math.ceil(
          100 * (100 + (this.effects[stat] - 100) * (this.level || 1))
        ) / 100
      );
    }
    return Math.ceil(100 * this.effects[stat] * (this.level || 1)) / 100;
  }

  getEffectPayload() {
    const result = Object.keys(utils.cleanup(this.effects)).reduce((acc, e) => {
      const label = BUFF_LABELS[e];
      if (label === null) {
        return acc;
      }
      acc[label || e] = {
        value: this.getStatBonus(e),
        percentage: PERCENTAGE_BUFFS[e],
        discrete: DISCRETE_BUFFS[e],
        multiplier: MULTIPLIER_BUFFS[e]
      };
      return acc;
    }, {});
    if (this.hiddenBuff) {
      result.hidden = 1;
    }
    return result;
  }

  isHiddenBuff() {
    if (program.dev) {
      return false;
    }
    return this.hiddenBuff;
  }

  getPayload(creature, appliedTo) {
    return {
      name: this.getName(creature, appliedTo),
      icon: this.getIcon(creature),
      category: CATEGORY_LABELS[this.category],
      level: this.level ? Math.ceil(this.level * 100) : undefined,
      effects: this.getEffectPayload(),
      order: this.category,
      description: this.description,
      stacks: this.stacks,
      duration: Math.ceil(this.duration / 60) * 60,
      severity: this.severity,
      public: this.visible
    };
  }

  expiring(seconds) {
    if (this.duration !== undefined) {
      this.duration -= seconds;
      return this.duration <= 0;
    }
    return false;
  }

  expired() {
    return true;
  }
}
Object.assign(Buff.prototype, {
  effects: {}
});
Buff.CATEGORIES = {
  STATUS: 10,
  EQUIPMENT_AURA: 20,
  BUILDING_AURA: 25,
  FOOD: 30,
  TRINKET: 40,
  OTHER: 50,
  THERMAL: 60,
  PAIN: 70,
  WOUND: 80,
  ADDICTION: 82,
  AFFLICTION: 83,
  INJURY: 84,
  INTERACTION: 85,
  PERK: 90,
  AGE_INDICATOR: 100,
  TRACKS: 200
};
const CATEGORY_LABELS = (Buff.CATEGORY_LABELS = {
  10: "1:Status",
  20: "6:Equipment",
  25: "7:Structures",
  30: "5:Food",
  40: "4:Rested",
  50: "9:Other",
  60: "1:Status",
  70: "1:Status",
  80: "3:Wounds",
  82: "1:Status",
  83: "1:Status",
  84: "3:Wounds",
  85: "9:Other",
  90: "10:Traits",
  100: "9:Other",
  200: "11:Tracks"
});

module.exports = global.Buff = Buff;

require("./buff-poison");
