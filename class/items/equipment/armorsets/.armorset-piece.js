const ExpirableItem = require("../../.expirable-item");

const PARTS_MULTIPLIERS = {
  [EQUIPMENT_SLOTS.CHEST]: 1,
  [EQUIPMENT_SLOTS.HEAD]: 0.35,
  [EQUIPMENT_SLOTS.HANDS]: 0.41,
  [EQUIPMENT_SLOTS.FEET]: 0.44,
  [EQUIPMENT_SLOTS.TROUSERS]: 0.92
};

class ArmorSet_Piece extends ExpirableItem {
  static itemFactory(classCtr, props) {
    const armorTier = props.armorTier || classCtr.prototype.armorTier;
    if (armorTier) {
      props.buffs = props.buffs || {};
      const [tier, type, ratiosString] = armorTier;

      const ratios = ratiosString.split(":").map(n => +n);

      let total;
      switch (type) {
        case ArmorSet_Piece.TYPES.CLOTH:
          total = tier;
          break;
        case ArmorSet_Piece.TYPES.LEATHER:
          total = 7 + 3 * tier;
          break;
        case ArmorSet_Piece.TYPES.METAL:
          total = 7 + 6 * tier;
          break;
      }

      let ratioSum = ratios[0] + ratios[1] + ratios[2];
      const slot = Object.keys(props.slots).pop();

      const rounding = num => Math.round(num * 2) / 2;

      props.buffs = {
        ...props.buffs,
        [BUFFS.ARMOR[DAMAGE_TYPES.BLUNT]]: rounding(
          (props.buffs[BUFFS.ARMOR[DAMAGE_TYPES.BLUNT]] || 0) +
            (PARTS_MULTIPLIERS[slot] * total * ratios[0]) / ratioSum
        ),
        [BUFFS.ARMOR[DAMAGE_TYPES.SLICE]]: rounding(
          (props.buffs[BUFFS.ARMOR[DAMAGE_TYPES.SLICE]] || 0) +
            (PARTS_MULTIPLIERS[slot] * total * ratios[1]) / ratioSum
        ),
        [BUFFS.ARMOR[DAMAGE_TYPES.PIERCE]]: rounding(
          (props.buffs[BUFFS.ARMOR[DAMAGE_TYPES.PIERCE]] || 0) +
            (PARTS_MULTIPLIERS[slot] * total * ratios[2]) / ratioSum
        )
      };

      [DAMAGE_TYPES.BLUNT, DAMAGE_TYPES.SLICE, DAMAGE_TYPES.PIERCE].forEach(
        damageType => {
          if (!props.buffs[BUFFS.ARMOR[damageType]]) {
            delete props.buffs[BUFFS.ARMOR[damageType]];
          }
        }
      );
    }
    return super.itemFactory(classCtr, props);
  }

  static isKnownBy(creature) {
    if (!this.isKnownByFast) {
      const classes = utils.getClasses(global[this.name]);
      this.isKnownByFast = creature => {
        return classes.some(classProto =>
          creature.knowsItem(classProto.constructor.name)
        );
      };
    }
    return this.isKnownByFast(creature);
  }

  static nameableVoteWeight(creature, item) {
    if (!this.nameableVoteWeightFast) {
      const classes = utils.getClasses(global[this.name]);
      this.nameableVoteWeightFast = creature => {
        let i = 0;
        return classes
          .filter(classProto => creature.knowsItem(classProto.constructor.name))
          .reduce(acc => acc + ++i, 0);
      };
    }
    return this.nameableVoteWeightFast(creature, item);
  }
}
Object.assign(ArmorSet_Piece.prototype, {});
ArmorSet_Piece.TYPES = {
  CLOTH: 1,
  LEATHER: 2,
  METAL: 3
};

module.exports = global.ArmorSet_Piece = ArmorSet_Piece;
