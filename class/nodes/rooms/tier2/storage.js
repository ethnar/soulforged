const Base_Storage = require("../base/storage");
const Tier2_MessHall = require("./mess-hall");

class Tier2_Storage extends Base_Storage {}
Object.assign(Tier2_Storage.prototype, {
  monstersTable: Tier2_MessHall.prototype.monstersTable,
  lootTable: Base_Storage.getLootTable(2)
});

module.exports = global.Tier2_Storage = Tier2_Storage;
