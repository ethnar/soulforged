const Room = require("../../room");

class Base_Storage extends Room {
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
        Bonemeal: "20-40",
        Crucible: "1-3",
        WoodenPlank: "4-8",
        BarkCloth: "3-6",
        FishingRod: "1",
        MortarPestle: "1",
        LinenWheatHat: "1",
        CuringBalm: "1-4",
        Glue: "3-7",
        LeatherPouch: "2-5",
        Parchment: "1-3",
        NormalLockpicks: "1-2",
        SoothingBalm: "1-4",
        Ricine: "2-3",
        Bread: "3-5",
        HealingPowder: "2-3",
        SimpleBandage: "2-3",
        HardwoodPlank: "4-8",
        IronNails: "15-30",
        CopperWire: "5-15",
        LeatherRope: "1-4",
        LinenCloth: "5-20"
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
Object.assign(Base_Storage.prototype, {
  name: "Storage",
  unlisted: true,
  mapGraphic: (node, structure, tilesBase) => {
    return {
      5: node.oneOfImage(
        `tiles/dungeon/rooms/storage-01.png`,
        `tiles/dungeon/rooms/storage-02.png`,
        `tiles/dungeon/rooms/storage-03.png`
      )
    };
  }
});

module.exports = global.Base_Storage = Base_Storage;
