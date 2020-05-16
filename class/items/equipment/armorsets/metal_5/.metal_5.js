const ArmorSet_Piece = require("../.armorset-piece");
require("../../../../resources/popping/animals/elephant");

class ArmorSetsMetal5 extends ArmorSet_Piece {}
Object.assign(ArmorSetsMetal5.prototype, {
  name: `Stalwart`,
  expiresIn: 2 * YEARS,
  expiresIntegrity: true,
  armorTier: [8, ArmorSet_Piece.TYPES.METAL, "20:17:18"]
});

module.exports = global.ArmorSetsMetal5 = ArmorSetsMetal5;
