const Item = require("../../.item");

class TrainingWeapon extends Item {}
Object.assign(TrainingWeapon.prototype, {
  durability: 0.04
});
module.exports = global.TrainingWeapon = TrainingWeapon;
