const Base_MessHall = require("../base/mess-hall");

class Tier4_MessHall extends Base_MessHall {}
Object.assign(Tier4_MessHall.prototype, {
  monstersTable: {
    15: {
      Muckworm: "1-2",
      CaveSpider: "1-2"
    },
    30: {
      DesertSpider: "1:1-2",
      CaveSpider: "1"
    },
    45: {
      Muckworm: "2-4"
    },
    65: {
      Screech: "1:1"
    },
    88: {
      FireDrake: "1:1"
    },
    100: {
      FireDrake: "2"
    }
  },
  lootTable: {
    5: {
      ApplePie: "3-4",
      DeerSkewer: "2-3",
      Flour: "50-80"
    },
    15: {
      DeerSkewer: "2-3",
      Broth: "2-4"
    },
    25: {
      DeerSkewer: "2-3",
      FowlSkewer: "2-3",
      Coconut: "3-8"
    },
    26: {
      WildberryPie: "2-4",
      FowlSkewer: "2-3",
      Flour: "80-160"
    },
    100: {
      WildberryPie: "1-3",
      ApplePie: "1-3",
      Flour: "20-40"
    }
  }
});

module.exports = global.Tier4_MessHall = Tier4_MessHall;
