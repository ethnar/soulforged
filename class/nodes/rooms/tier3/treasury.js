const Base_Treasury = require("../base/treasury");

class Tier3_Treasury extends Base_Treasury {}
Object.assign(Tier3_Treasury.prototype, {
  monstersTable: {
    10: {
      Plaguebeast: "1"
    },
    70: {
      FireDrake: "2"
    },
    80: {
      FireDrake: "1:1"
    },
    100: {
      StoneGolem: "1"
    }
  },
  lootTable: Base_Treasury.getLootTable(3)
});

module.exports = global.Tier3_Treasury = Tier3_Treasury;
