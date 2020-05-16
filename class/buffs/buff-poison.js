class BuffVenom extends Buff {
  constructor(args, creature) {
    super(args, creature);

    if (creature) {
      this.stackExpiringIn = creature.damageTime[DAMAGE_TYPES.VENOM];
    }
    this.calculateEffects();
  }

  getStatBonus(stat) {
    return Math.ceil(100 * this.effects[stat] * (this.level || 1)) / 100;
  }

  expiring(seconds) {
    this.stackExpiringIn -= seconds;
    if (this.stackExpiringIn <= 0) {
      this.stackExpiringIn += this.creature.damageTime[DAMAGE_TYPES.VENOM];
      this.addStacks(-1);
    }
    this.duration =
      this.creature.damageTime[DAMAGE_TYPES.VENOM] * (this.stacks - 1) +
      this.stackExpiringIn;
    return this.stacks <= 0;
  }

  // calculateEffects() {
  //     if (this.stacks < 0) {
  //         this.stacks = 0;
  //     }
  //     this.effects = {
  //         [BUFFS.STATS.ENDURANCE]: -(this.stacks / 4),
  //         [BUFFS.STATS.DEXTERITY]: -(this.stacks / 4),
  //         [BUFFS.INTERNAL_DAMAGE]: this.stacks / 5,
  //         [BUFFS.NAUSEOUS]: this.stacks / 2,
  //     };
  // }

  static applyBuff(creature, value) {
    const existing = creature
      .getBuffs()
      .find(
        buff =>
          buff.name === this.prototype.name &&
          buff.category === this.prototype.category
      );

    if (existing) {
      existing.addStacks(value);
      return new BuffVenom({
        stacks: value
      });
    }
    return creature.addBuff(BuffVenom, {
      stacks: value
    });
  }
}
Object.assign(BuffVenom.prototype, {
  name: "Venom",
  icon: `/${ICONS_PATH}/creatures/green_30.png`,
  category: Buff.CATEGORIES.WOUND,
  visible: true,
  effects: {
    [BUFFS.STATS.ENDURANCE]: -(1 / 4),
    [BUFFS.STATS.DEXTERITY]: -(1 / 4),
    [BUFFS.INTERNAL_DAMAGE]: 1 / 5,
    [BUFFS.NAUSEOUS]: 1 / 2
  }
});

module.exports = global.BuffVenom = global.BuffPoison = BuffVenom;
