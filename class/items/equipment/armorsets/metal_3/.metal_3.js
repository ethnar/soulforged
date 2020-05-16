const ArmorSet_Piece = require("../.armorset-piece");

class ArmorSetsMetal3 extends ArmorSet_Piece {}
Object.assign(ArmorSetsMetal3.prototype, {
  name: `Safeguard`,
  expiresIn: 1.5 * YEARS,
  expiresIntegrity: true,
  armorTier: [4.5, ArmorSet_Piece.TYPES.METAL, "12:14:9"]
});

module.exports = global.ArmorSetsMetal3 = ArmorSetsMetal3;
