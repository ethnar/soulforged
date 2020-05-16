const Base_Treasury = require("../base/treasury");

class Tier4_Treasury extends Base_Treasury {}
Object.assign(Tier4_Treasury.prototype, {
  monstersTable: {
    10: {
      StoneGolem: "1-2"
    },
    15: {
      DesertSpider: "7-10"
    },
    20: {
      StoneGolem: "3"
    },
    80: {
      Lurker: "1-3",
      StoneGolem: "1"
    },
    100: {
      Muckworm: "3-6",
      FireDrake: "2-3"
    }
  },
  lootTable: Base_Treasury.getLootTable(4)
});

module.exports = global.Tier4_Treasury = Tier4_Treasury;
