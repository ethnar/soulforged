const Base_Storage = require("../base/storage");
const Tier3_MessHall = require("./mess-hall");

class Tier3_Storage extends Base_Storage {}
Object.assign(Tier3_Storage.prototype, {
  monstersTable: Tier3_MessHall.prototype.monstersTable,
  lootTable: Base_Storage.getLootTable(3)
});

module.exports = global.Tier3_Storage = Tier3_Storage;
