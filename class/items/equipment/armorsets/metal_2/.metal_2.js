const ArmorSet_Piece = require("../.armorset-piece");

class ArmorSetsMetal2 extends ArmorSet_Piece {}
Object.assign(ArmorSetsMetal2.prototype, {
  name: `Raider's`,
  expiresIn: 1 * YEARS,
  expiresIntegrity: true,
  armorTier: [4, ArmorSet_Piece.TYPES.METAL, "7:7:11"]
});

module.exports = global.ArmorSetsMetal2 = ArmorSetsMetal2;
