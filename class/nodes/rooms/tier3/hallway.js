const Base_Hallway = require("../base/hallway");

class Tier3_Hallway extends Base_Hallway {}
Object.assign(Tier3_Hallway.prototype, {
  monstersTable: {
    5: {
      Snake: "0:0-5"
    },
    10: {
      MoleRat: "0:1"
    },
    15: {
      CaveSpider: "0:0-1"
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
    },
    20: {
      BarkCloth: "1-3"
    }
  }
});

module.exports = global.Tier3_Hallway = Tier3_Hallway;
