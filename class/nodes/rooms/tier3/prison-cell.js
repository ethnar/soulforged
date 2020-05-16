const Base_PrisonCell = require("../base/prison-cell");

const baseLoot = {
  Bone: "0-6",
  Stone: "0-3"
};

class Tier3_PrisonCell extends Base_PrisonCell {}
Object.assign(Tier3_PrisonCell.prototype, {
  monstersTable: {
    1: {
      MoleRat: "0:1"
    },
    6: {
      Rat: "0:1",
      MoleRat: "1"
    },
    11: {
      Snake: "1"
    },
    90: {
      Rat: "1-3:1-2"
    }
  },
  lootTable: {
    1: {
      ...baseLoot,
      NormalLockpicks: "1-1"
    },
    4: {
      ...baseLoot,
      BasicLockpicks: "1-1"
    },
    8: {
      ...baseLoot,
      LinenCloth: "1-8"
    },
    12: {
      ...baseLoot,
      WoodenShaft: "1-3"
    },
    16: {
      ...baseLoot,
      WoodenPlank: "1-2"
    },
    20: {
      ...baseLoot,
      WolfHide: "3-8"
    },
    24: {
      ...baseLoot,
      CopperMetalRing: "1-1"
    },
    40: {
      ...baseLoot,
      VileMeat: "3-8"
    },
    90: {
      ...baseLoot
    }
  }
});

module.exports = global.Tier3_PrisonCell = Tier3_PrisonCell;
