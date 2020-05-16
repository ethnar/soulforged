const Base_GuardRoom = require("../base/guard-room");

class Tier3_GuardRoom extends Base_GuardRoom {}
Object.assign(Tier3_GuardRoom.prototype, {
  monstersTable: {
    15: {
      Lurker: "0:1"
    },
    25: {
      MoleRat: "2-3:1-2"
    },
    40: {
      FireDrake: "1"
    },
    65: {
      DesertSpider: "1:1"
    },
    100: {
      Muckworm: "2"
    }
  },
  lootTable: Base_GuardRoom.getLootTable(3)
});

module.exports = global.Tier3_GuardRoom = Tier3_GuardRoom;
