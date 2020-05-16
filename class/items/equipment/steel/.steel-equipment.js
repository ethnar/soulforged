const Item = require("../../.item");

class SteelEquipment extends Item {}
Object.assign(SteelEquipment.prototype, {
  durability: 3
});

module.exports = global.SteelEquipment = SteelEquipment;
