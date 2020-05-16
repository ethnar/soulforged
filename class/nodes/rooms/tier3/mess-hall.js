const Base_MessHall = require("../base/mess-hall");

class Tier3_MessHall extends Base_MessHall {}
Object.assign(Tier3_MessHall.prototype, {
  monstersTable: {
    20: {
      Muckworm: "1"
    },
    40: {
      DesertSpider: "2:1"
    },
    60: {
      MoleRat: "3-4:2-3"
    },
    100: {
      DesertSpider: "1-2",
      MoleRat: "1-3"
    }
  },
  lootTable: {
    5: {
      ApplePie: "3-4",
      Flour: "50-80"
    },
    15: {
      DeerSkewer: "2-3",
      Broth: "2-4"
    },
    25: {
      FowlSkewer: "2-3",
      Coconut: "3-8"
    },
    26: {
      Bread: "2-4",
      Flour: "80-160"
    },
    100: {
      WildberryPie: "1-3",
      ApplePie: "1-3",
      Flour: "20-40"
    }
  }
});

module.exports = global.Tier3_MessHall = Tier3_MessHall;
