const Base_Classroom = require("../base/classroom");
const Tier3_MessHall = require("./mess-hall");

class Tier3_Classroom extends Base_Classroom {}
Object.assign(Tier3_Classroom.prototype, {
  monstersTable: Tier3_MessHall.prototype.monstersTable,
  lootTable: Base_Classroom.getLootTable(3)
});

module.exports = global.Tier3_Classroom = Tier3_Classroom;
