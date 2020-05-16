const Buff = require("./buff");

class BuffDiminishing extends Buff {
  static applyBuff(creature, options = {}) {
    creature.addBuff(this, options);

    const existing = creature
      .getBuffs()
      .filter(buff => {
        return buff instanceof this;
      })
      .sort((a, b) => b.duration - a.duration);

    const base = this.prototype.effects;
    let level = 1;
    existing.forEach(b => {
      b.effects = {};
      this.effects = Object.keys(base).toObject(
        stat => stat,
        stat => {
          let nextValue;
          if (MULTIPLIER_BUFFS[stat]) {
            nextValue = (base[stat] - 100) / level + 100;
          } else {
            nextValue = base[stat] / level;
          }
          b.effects[stat] = nextValue;
        }
      );
      level = level * this.prototype.diminishing;
    });
  }
}
Object.assign(BuffDiminishing.prototype, {
  diminishing: 2
});

module.exports = global.BuffDiminishing = BuffDiminishing;
