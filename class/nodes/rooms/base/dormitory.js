const Room = require("../../room");

class Base_Dormitory extends Room {
  static getLootTable(tier, base = 100, mult = 0.66) {
    return () => {
      const chances = {
        13: {},
        25: {},
        36: {},
        46: {},
        55: {},
        63: {},
        70: {},
        78: {},
        85: {},
        91: {},
        96: {},
        98: {},
        100: {}
      };

      const list = {
        ClayPot: "2-4",
        BarkShirt: "1",
        BarkTrousers: "1",
        DeerSkinRug: "1", // tier 2
        Jerky: "8-14",
        FishingRod: "1",
        LinenTrousers: "1", // tier 3
        LinenWheatHat: "1",
        CuringBalm: "1-4",
        Glue: "3-7", // tier 4
        LionSkinRug: "1",
        LinenShirt: "1",
        WindChimes2: "1",
        ApplePie: "2-6",
        Standing1: "1",
        Bread: "3-5",
        StrengthUp1: "1-3",
        Mug: "2-8",
        EnduranceUp1: "1-3",
        Barrel: "2-4",
        LinenRug: "1",
        PlainChair: "1",
        Table1: "1"
      };

      const tierList = Object.keys(list).slice((tier - 1) * 3);

      Object.keys(chances).forEach(c => {
        const item = tierList.shift();
        chances[c] = {
          [item]: list[item]
        };
      });

      const results = {};

      let rollChance = base;
      while (utils.chance(rollChance)) {
        utils.applyTableChance(chances, (item, qty) => {
          results[item] = qty;
        });
        rollChance = rollChance * mult;
      }

      return results;
    };
  }
}
Object.assign(Base_Dormitory.prototype, {
  name: "Dormitory",
  unlisted: true,
  mapGraphic: (node, structure, tilesBase) => {
    return {
      5: node.oneOfImage(
        `tiles/dungeon/rooms/dormitory1.png`,
        `tiles/dungeon/rooms/dormitory2.png`
      )
    };
  }
});

module.exports = global.Base_Dormitory = Base_Dormitory;
