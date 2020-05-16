const Base_Hallway = require("../base/hallway");

class Tier4_Hallway extends Base_Hallway {}
Object.assign(Tier4_Hallway.prototype, {
  monstersTable: {
    5: {
      MoleRat: "0:0-2"
    },
    10: {
      SwarmerBat: "0:3-6"
    },
    15: {
      Muckworm: "0:1"
    }
  },
  lootTable: {
    10: {
      Stone: "1-3"
    },
    15: {
      Clay: "1-3"
    },
    20: {
      BarkCloth: "1-3"
    },
    25: {
      LinenCloth: "1-3"
    }
  }
});

module.exports = global.Tier4_Hallway = Tier4_Hallway;
