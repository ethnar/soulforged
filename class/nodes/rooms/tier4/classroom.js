const Base_Classroom = require("../base/classroom");
const Tier4_MessHall = require("./mess-hall");

class Tier4_Classroom extends Base_Classroom {}
Object.assign(Tier4_Classroom.prototype, {
  monstersTable: Tier4_MessHall.prototype.monstersTable,
  lootTable: Base_Classroom.getLootTable(4)
});

module.exports = global.Tier4_Classroom = Tier4_Classroom;
