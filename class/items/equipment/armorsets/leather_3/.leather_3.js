const ArmorSet_Piece = require("../.armorset-piece");
require("../../../../creatures/monsters/animals/wolf");
require("../../../../resources/popping/animals/goat");
require("../../../../resources/popping/animals/deers");

class ArmorSetsLeather3 extends ArmorSet_Piece {}
Object.assign(ArmorSetsLeather3.prototype, {
  name: `Brumal`,
  expiresIn: 240 * DAYS,
  expiresIntegrity: true,
  armorTier: [2, ArmorSet_Piece.TYPES.LEATHER, "4:3:4"]
});

module.exports = global.ArmorSetsLeather3 = ArmorSetsLeather3;
