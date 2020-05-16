const Item = require("../../.item");

class TinEquipment extends Item {}
Object.assign(TinEquipment.prototype, {
  durability: 0.4
});

module.exports = global.TinEquipment = TinEquipment;
