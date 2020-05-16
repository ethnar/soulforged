const Monster = require("../.monster");

class BuffCrack extends Buff {}
Object.assign(BuffCrack.prototype, {
  name: "Crack",
  icon: `/${ICONS_PATH}/creatures/violet_07_recolor.png`,
  category: Buff.CATEGORIES.WOUND,
  visible: true,
  severity: 2
});
global.BuffCrack = BuffCrack;

module.exports = Monster.factory(
  class Unliving extends Monster {
    damageVenom(value) {}
    damageBrokenBone(value, time) {
      return this.damageInternal(value, time);
    }
    damageBruised(value, time) {
      return this.damageInternal(value, time);
    }
    damageCut(value, time) {
      return this.damageInternal(value, time);
    }
    damageInternal(value, time) {
      return this.damageCracked(value, time);
    }
    damageCracked(value, time) {
      time = time || this.damageTime[DAMAGE_TYPES.INTERNAL_DAMAGE];
      return this.addBuff(BuffCrack, {
        duration: time,
        stacks: value,
        effects: {
          [BUFFS.INTERNAL_DAMAGE]: value
        }
      });
    }
  },
  {
    name: "?Unliving?",
    damageTime: {
      [DAMAGE_TYPES.INTERNAL_DAMAGE]: 14 * DAYS
    }
  }
);
