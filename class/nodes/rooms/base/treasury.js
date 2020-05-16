const Room = require("../../room");

class Base_Treasury extends Room {
  static getLootTable(tier, base = 300, mult = 0.6) {
    return () => {
      const lists = [
        {
          CopperCoins: "200-500",
          Amber: "1-3"
        },
        {
          CopperIngot: "3-8",
          TinCoins: "200-500",
          Topaz: "1-3"
        },
        {
          TinIngot: "3-8",
          BronzeCoins: "200-500",
          Emerald: "1-3"
        },
        {
          BronzeIngot: "3-8",
          IronCoins: "200-500",
          Ruby: "1-3"
        },
        {
          IronIngot: "3-8",
          LeadCoins: "200-600",
          SilverCoins: "200-500",
          Diamond: "1-3"
        },
        {
          LeadIngot: "3-8",
          SteelCoins: "200-500",
          GoldCoins: "200-500",
          Amethyst: "1-3"
        },
        {
          SteelIngot: "3-8"
        }
      ];

      let results = {};

      let rollChance = base;
      while (utils.chance(rollChance)) {
        const roll = utils.random(1, 100);
        switch (true) {
          case roll <= 12:
            results = {
              ...results,
              ...Base_GuardRoom.getLootTable(tier, 100, 0)()
            };
            break;
          case roll <= 30:
            results = {
              ...results,
              ...Base_Storage.getLootTable(tier + 1, 100, 0)()
            };
            break;
          default:
            const subRoll = utils.random(1, 100);

            let targetTier;
            switch (true) {
              case subRoll <= 5:
                targetTier = tier + 2;
                break;
              case subRoll <= 15:
                targetTier = tier + 1;
                break;
              case subRoll <= 50:
                targetTier = tier;
                break;
              default:
                targetTier = tier - 1;
            }

            const item = utils.randomItem(Object.keys(lists[targetTier]));
            results[item] = results[item] || 0;
            results[item] += utils.random(
              ...lists[targetTier][item].split("-").map(v => +v)
            );
        }
        rollChance = rollChance * mult;
      }

      return results;
    };
  }
}
Object.assign(Base_Treasury.prototype, {
  name: "Treasury",
  unlisted: true,
  mapGraphic: (node, structure, tilesBase) => {
    return {
      5: `tiles/dungeon/rooms/${tilesBase}-treasury00.png`
    };
  }
});

module.exports = global.Base_Treasury = Base_Treasury;
