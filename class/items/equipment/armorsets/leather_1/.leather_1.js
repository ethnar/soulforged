const ArmorSet_Piece = require("../.armorset-piece");
require("../../../../creatures/monsters/animals/wolf");
require("../../../../resources/popping/animals/deers");

class ArmorSetsLeather1 extends ArmorSet_Piece {}
Object.assign(ArmorSetsLeather1.prototype, {
  name: `Tracker's`,
  expiresIn: 240 * DAYS,
  expiresIntegrity: true,
  armorTier: [1, ArmorSet_Piece.TYPES.LEATHER, "4:2:3"]
});

module.exports = global.ArmorSetsLeather1 = ArmorSetsLeather1;
