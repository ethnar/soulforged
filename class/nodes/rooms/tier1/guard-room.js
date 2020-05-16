const Base_GuardRoom = require("../base/guard-room");

class Tier1_GuardRoom extends Base_GuardRoom {}
Object.assign(Tier1_GuardRoom.prototype, {
  monstersTable: {
    60: {
      MoleRat: "1"
    },
    100: {
      CaveSpider: "1"
    }
  },
  lootTable: Base_GuardRoom.getLootTable(1)
});

module.exports = global.Tier1_GuardRoom = Tier1_GuardRoom;
