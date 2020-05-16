const Base_MessHall = require("../base/mess-hall");

class Tier1_MessHall extends Base_MessHall {}
Object.assign(Tier1_MessHall.prototype, {
  monstersTable: {
    20: {
      CaveSpider: "1"
    },
    60: {
      SwarmerBat: "1:1"
    },
    100: {
      Rat: "4-10"
    }
  },
  lootTable: {
    5: {
      ApplePie: "1-2",
      Apple: "4-10",
      Flour: "50-80"
    },
    15: {
      DeerSkewer: "1-3",
      Apple: "3-8"
    },
    25: {
      FowlSkewer: "1-3",
      Apple: "3-8",
      Flour: "50-80"
    },
    26: {
      Flour: "80-160"
    },
    100: {
      Bread: "0-4",
      Apple: "3-8",
      Flour: "20-40"
    }
  }
});

module.exports = global.Tier1_MessHall = Tier1_MessHall;
