const ArmorSet_Piece = require("../.armorset-piece");

class ArmorSetsMetal0 extends ArmorSet_Piece {}
Object.assign(ArmorSetsMetal0.prototype, {
  name: `Bulwark`,
  expiresIn: 180 * DAYS,
  expiresIntegrity: true,
  armorTier: [1, ArmorSet_Piece.TYPES.METAL, "3:6:4"]
});

module.exports = global.ArmorSetsMetal0 = ArmorSetsMetal0;
