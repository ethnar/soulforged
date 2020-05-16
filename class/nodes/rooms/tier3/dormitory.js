const Base_Dormitory = require("../base/dormitory");
const Tier3_MessHall = require("./mess-hall");

class Tier3_Dormitory extends Base_Dormitory {}
Object.assign(Tier3_Dormitory.prototype, {
  monstersTable: Tier3_MessHall.prototype.monstersTable,
  lootTable: Base_Dormitory.getLootTable(3)
});

module.exports = global.Tier3_Dormitory = Tier3_Dormitory;
