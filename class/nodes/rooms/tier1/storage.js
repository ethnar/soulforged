const Base_Storage = require("../base/storage");
const Tier1_MessHall = require("./mess-hall");

class Tier1_Storage extends Base_Storage {}
Object.assign(Tier1_Storage.prototype, {
  monstersTable: Tier1_MessHall.prototype.monstersTable,
  lootTable: Base_Storage.getLootTable(1)
});

module.exports = global.Tier1_Storage = Tier1_Storage;
