const Drink = require("./.drink");
const Barrel = require("../materials/barrel");
const Mug = require("../materials/mug");

const RATIO = 8;
const BEER_SERVING = 0.1;

class BeerMug extends Drink {}
Item.itemFactory(BeerMug, {
  name: "Mug (Beer)",
  icon: `/${ICONS_PATH}/items/alchemy/beer.png`,
  timeToDrink: 1,
  weight: Mug.prototype.weight + BEER_SERVING,
  buffs: {
    [BUFFS.ENERGY]: -10
  },
  containerItemType: Mug,
  timedBuff: [
    {
      duration: 24 * HOURS,
      diminishingReturn: 0.75,
      effects: {
        [BUFFS.MOOD]: +15
      }
    }
  ],
  crafting: {
    name: "Pour Beer",
    autoLearn: true,
    result: {
      BeerMug: RATIO,
      Barrel: 1
    },
    materials: {
      BeerBarrel: 1,
      Mug: RATIO
    },
    baseTime: 10 * SECONDS
  }
});

class BeerBarrel extends Item {}
Item.itemFactory(BeerBarrel, {
  name: "Barrel (Beer)",
  icon: `/${ICONS_PATH}/items/materials/barrel_beer.png`,
  nonResearchable: true,
  order: ITEMS_ORDER.OTHER,
  weight: Barrel.prototype.weight + BEER_SERVING * RATIO
  // containerItemType: Barrel,
});

class WortBarrel extends ExpirableItem {}
Item.itemFactory(WortBarrel, {
  name: "Barrel (Wort)",
  icon: `/${ICONS_PATH}/items/materials/barrel_wort.png`,
  nonResearchable: true,
  order: ITEMS_ORDER.OTHER,
  expiresIn: 4 * DAYS,
  expiresInto: {
    BeerBarrel: 1
  },
  weight: Barrel.prototype.weight + BEER_SERVING * RATIO,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      Barrel: 1,
      Hops: 50,
      Wheat: 40
    },
    skill: SKILLS.COOKING,
    skillLevel: 2,
    baseTime: 20 * MINUTES
  }
});
