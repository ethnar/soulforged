const Item = require("../../.item");

class IronEquipment extends Item {}
Object.assign(IronEquipment.prototype, {
  durability: 1.5
});

module.exports = global.IronEquipment = IronEquipment;
