const Base_Storage = require("../base/storage");
const Tier4_MessHall = require("./mess-hall");

class Tier4_Storage extends Base_Storage {}
Object.assign(Tier4_Storage.prototype, {
  monstersTable: Tier4_MessHall.prototype.monstersTable,
  lootTable: Base_Storage.getLootTable(4)
});

module.exports = global.Tier4_Storage = Tier4_Storage;
