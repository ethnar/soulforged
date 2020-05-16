const ArmorSet_Piece = require("../.armorset-piece");
require("../../../../creatures/monsters/animals/bear");
require("../../../../creatures/monsters/animals/fire-drake");
require("../../../../resources/popping/animals/turodo");

class ArmorSetsLeather5 extends ArmorSet_Piece {}
Object.assign(ArmorSetsLeather5.prototype, {
  expiresIn: 240 * DAYS,
  expiresIntegrity: true,
  armorTier: [5, ArmorSet_Piece.TYPES.LEATHER, "4:4:6"]
});

module.exports = global.ArmorSetsLeather5 = ArmorSetsLeather5;
