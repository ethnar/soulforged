const Item = require("../../.item");

class BoneEquipment extends Item {}
Object.assign(BoneEquipment.prototype, {
  durability: 0.3
});

module.exports = global.BoneEquipment = BoneEquipment;
