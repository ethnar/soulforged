const Base_PrisonCell = require("../base/prison-cell");

const baseLoot = {
  Bone: "0-6",
  Stone: "0-3",
  AncientBone: "0-8"
};

class TierSpecial_PrisonCell_Monster extends Base_PrisonCell {}
Object.assign(TierSpecial_PrisonCell_Monster.prototype, {
  monstersTable: {
    4: {
      Troll: "0:1"
    },
    8: {
      Nightcrawler: "0:1"
    },
    20: {
      FireDrake: "0:1"
    },
    26: {
      StoneGolem: "0:1"
    },
    36: {
      Plaguebeast: "0:1"
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

module.exports = global.TierSpecial_PrisonCell_Monster = TierSpecial_PrisonCell_Monster;
