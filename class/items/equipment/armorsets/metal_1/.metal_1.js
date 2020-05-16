const ArmorSet_Piece = require("../.armorset-piece");

class ArmorSetsMetal1 extends ArmorSet_Piece {}
Object.assign(ArmorSetsMetal1.prototype, {
  name: `Protector's`,
  expiresIn: 240 * DAYS,
  expiresIntegrity: true,
  armorTier: [2, ArmorSet_Piece.TYPES.METAL, "9:4:5"]
});

module.exports = global.ArmorSetsMetal1 = ArmorSetsMetal1;
