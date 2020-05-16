const Item = require("../../.item");

class BronzeEquipment extends Item {}
Object.assign(BronzeEquipment.prototype, {
  durability: 1.3
});

module.exports = global.BronzeEquipment = BronzeEquipment;
