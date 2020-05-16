const Base_Dormitory = require("../base/dormitory");
const Tier4_MessHall = require("./mess-hall");

class Tier4_Dormitory extends Base_Dormitory {}
Object.assign(Tier4_Dormitory.prototype, {
  monstersTable: Tier4_MessHall.prototype.monstersTable,
  lootTable: Base_Dormitory.getLootTable(4)
});

module.exports = global.Tier4_Dormitory = Tier4_Dormitory;
