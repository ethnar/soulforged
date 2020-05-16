const ArmorSet_Piece = require("../.armorset-piece");

class ArmorSetsCloth1 extends ArmorSet_Piece {}
Object.assign(ArmorSetsCloth1.prototype, {
  name: `Craggy`,
  expiresIn: 120 * DAYS,
  expiresIntegrity: true,
  armorTier: [1, ArmorSet_Piece.TYPES.CLOTH, "1:1:1"]
});

module.exports = global.ArmorSetsCloth1 = ArmorSetsCloth1;
