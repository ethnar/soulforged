const ArmorSet_Piece = require("../.armorset-piece");
require("../../../../resources/popping/animals/goat");

class ArmorSetsCloth2 extends ArmorSet_Piece {}
Object.assign(ArmorSetsCloth2.prototype, {
  name: `Thaumaturge's`,
  expiresIn: 140 * DAYS,
  expiresIntegrity: true,
  armorTier: [2, ArmorSet_Piece.TYPES.CLOTH, "1:1:1"]
});

module.exports = global.ArmorSetsCloth2 = ArmorSetsCloth2;
