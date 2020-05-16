require("../../../../resources/popping/animals/elephant");
const ArmorSet_Piece = require("../.armorset-piece");

class ArmorSetsMetal4 extends ArmorSet_Piece {}
Object.assign(ArmorSetsMetal4.prototype, {
  name: `Guardian's`,
  expiresIn: 1.5 * YEARS,
  expiresIntegrity: true,
  armorTier: [5, ArmorSet_Piece.TYPES.METAL, "15:12:17"]
});

module.exports = global.ArmorSetsMetal4 = ArmorSetsMetal4;
