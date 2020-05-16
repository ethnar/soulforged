const Base_Hallway = require("../base/hallway");

class Tier2_Hallway extends Base_Hallway {}
Object.assign(Tier2_Hallway.prototype, {
  monstersTable: {
    5: {
      Rat: "0:0-9"
    },
    10: {
      Snake: "0:0-3"
    },
    12: {
      MoleRat: "0:0-1"
    }
  },
  lootTable: {
    5: {
      Bone: "1"
    },
    10: {
      Stone: "1-3"
    },
    15: {
      Clay: "1-3"
    }
  }
});

module.exports = global.Tier2_Hallway = Tier2_Hallway;
