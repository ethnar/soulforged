const Base_GuardRoom = require("../base/guard-room");

class Tier2_GuardRoom extends Base_GuardRoom {}
Object.assign(Tier2_GuardRoom.prototype, {
  monstersTable: {
    4: {
      Muckworm: "1"
    },
    8: {
      Muckworm: "0:1"
    },
    60: {
      MoleRat: "1-1",
      CaveSpider: "0:1"
    },
    100: {
      CaveSpider: "2-3"
    }
  },
  lootTable: Base_GuardRoom.getLootTable(2)
});

module.exports = global.Tier2_GuardRoom = Tier2_GuardRoom;
