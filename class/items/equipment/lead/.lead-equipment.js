const Item = require("../../.item");

class LeadEquipment extends Item {}
Object.assign(LeadEquipment.prototype, {
  durability: 0.75
});

module.exports = global.LeadEquipment = LeadEquipment;
