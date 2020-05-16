const ArmorSet_Piece = require("../.armorset-piece");
require("../../../../creatures/monsters/animals/swarmer-bat");
require("../../../../resources/popping/animals/deers");

class ArmorSetsLeather2 extends ArmorSet_Piece {}
Object.assign(ArmorSetsLeather2.prototype, {
  name: `Troglodyte's`,
  expiresIn: 240 * DAYS,
  expiresIntegrity: true,
  armorTier: [1.2, ArmorSet_Piece.TYPES.LEATHER, "2:4:3"]
});

module.exports = global.ArmorSetsLeather2 = ArmorSetsLeather2;
