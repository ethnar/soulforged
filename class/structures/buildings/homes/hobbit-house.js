const Home = require("./.home");

class UndergroundHouse extends Home {}
Building.buildingFactory(UndergroundHouse, {
  name: "Hill House",
  icon: `/tiles/custom/homes/hobbit-house/icon.png`,
  deteriorationRate: 6 * MONTHS,
  baseTime: 8 * MINUTES,
  homeLevel: 5,
  storageCapacity: 300,
  availableDecorationSlots: {
    [DECORATION_SLOTS.FLOOR]: 2,
    [DECORATION_SLOTS.SEATS]: 2,
    [DECORATION_SLOTS.TABLE]: 2,
    [DECORATION_SLOTS.SMALL_STANDING_DECOR]: 1,
    [DECORATION_SLOTS.MEDIUM_STANDING_DECOR]: 1,
    [DECORATION_SLOTS.LARGE_STANDING_DECOR]: 2,
    [DECORATION_SLOTS.SMALL_HANGING_DECOR]: 1,
    [DECORATION_SLOTS.MEDIUM_HANGING_DECOR]: 1,
    [DECORATION_SLOTS.LARGE_HANGING_DECOR]: 2
  },
  buffs: {
    [BUFFS.HIDING_TIME]: 500,
    [BUFFS.TEMPERATURE_MIN]: 6,
    [BUFFS.TEMPERATURE_MAX]: 3
  },
  research: {
    sameAsCrafting: true,
    materials: {
      IronNails: 0
    }
  },
  materials: {
    Bricks: 15,
    GraniteBlock: 10,
    WoodenBoard: 10,
    HardwoodBoard: 6,
    HardwoodBeam: 20,
    BisonHide: 10,
    IronNails: 20,
    TrueIronNails: 30,
    LeatherRope: 20
  },
  mapGraphicHomePath: `tiles/custom/homes/hobbit-house/`,
  placement: [...Building.prototype.placement, NODE_TYPES.HILLS_GRASS]
});

module.exports = global.UndergroundHouse = UndergroundHouse;
