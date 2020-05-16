const Base_MessHall = require("../base/mess-hall");

class Tier2_MessHall extends Base_MessHall {}
Object.assign(Tier2_MessHall.prototype, {
  monstersTable: {
    20: {
      DesertSpider: "1"
    },
    60: {
      MoleRat: "1"
    },
    100: {
      CaveSpider: "2-4"
    }
  },
  lootTable: {
    5: {
      ApplePie: "2-4",
      Apple: "4-10",
      Flour: "50-80"
    },
    15: {
      DeerSkewer: "2-4",
      Apple: "3-8"
    },
    25: {
      FowlSkewer: "2-4",
      Apple: "3-8",
      Hops: "50-80"
    },
    30: {
      BeerBarrel: "1-2"
    },
    100: {
      WildberryPie: "2-4",
      Apple: "3-8",
      Flour: "20-40"
    }
  }
});

module.exports = global.Tier2_MessHall = Tier2_MessHall;
