const ArmorSet_Piece = require("../.armorset-piece");
require("../../../../resources/popping/animals/goat");

class ArmorSetsCloth3 extends ArmorSet_Piece {}
Object.assign(ArmorSetsCloth3.prototype, {
  name: `Silk`,
  expiresIn: 140 * DAYS,
  expiresIntegrity: true,
  armorTier: [3, ArmorSet_Piece.TYPES.CLOTH, "1:1:1"]
});

module.exports = global.ArmorSetsCloth3 = ArmorSetsCloth3;
