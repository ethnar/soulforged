const Base_Hallway = require("../base/hallway");

class Tier1_Hallway extends Base_Hallway {}
Object.assign(Tier1_Hallway.prototype, {
  monstersTable: {
    5: {
      Rat: "0:1"
    },
    10: {
      Snake: "0:1"
    }
  },
  lootTable: {
    5: {
      Bone: "1"
    },
    10: {
      Stone: "1-3"
    }
  }
});

module.exports = global.Tier1_Hallway = Tier1_Hallway;
