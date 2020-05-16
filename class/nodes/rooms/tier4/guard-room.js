const Base_GuardRoom = require("../base/guard-room");

class Tier4_GuardRoom extends Base_GuardRoom {}
Object.assign(Tier4_GuardRoom.prototype, {
  monstersTable: {
    15: {
      Lurker: "0:2"
    },
    25: {
      MoleRat: "3-4:2-3"
    },
    40: {
      FireDrake: "1-2",
      MoleRat: "0:1-2"
    },
    75: {
      DesertSpider: "1",
      Muckworm: "1-2"
    },
    100: {
      Muckworm: "1-3"
    }
  },
  lootTable: Base_GuardRoom.getLootTable(4)
});

module.exports = global.Tier4_GuardRoom = Tier4_GuardRoom;
