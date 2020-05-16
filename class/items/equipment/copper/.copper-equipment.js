const Item = require("../../.item");

class CopperEquipment extends Item {}
Object.assign(CopperEquipment.prototype, {
  durability: 0.7
});

module.exports = global.CopperEquipment = CopperEquipment;
