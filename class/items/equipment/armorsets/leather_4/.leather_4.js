const ArmorSet_Piece = require("../.armorset-piece");
require("../../../../creatures/monsters/animals/bear");
require("../../../../resources/popping/animals/turodo");

class ArmorSetsLeather4 extends ArmorSet_Piece {}
Object.assign(ArmorSetsLeather4.prototype, {
  name: `Yeti Hunter's`,
  expiresIn: 240 * DAYS,
  expiresIntegrity: true,
  armorTier: [3, ArmorSet_Piece.TYPES.LEATHER, "5:4:4"]
});

module.exports = global.ArmorSetsLeather4 = ArmorSetsLeather4;
