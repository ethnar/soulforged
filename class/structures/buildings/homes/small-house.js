const Home = require("./.home");

class SmallHouse extends Home {}
Building.buildingFactory(SmallHouse, {
  name: "House",
  icon: `/tiles/custom/homes/house/icon.png`,
  deteriorationRate: 5 * MONTHS,
  baseTime: 4.5 * MINUTES,
  homeLevel: 4,
  storageCapacity: 400,
  availableDecorationSlots: {
    [DECORATION_SLOTS.FLOOR]: 1,
    [DECORATION_SLOTS.SEATS]: 1,
    [DECORATION_SLOTS.TABLE]: 1,
    [DECORATION_SLOTS.SMALL_STANDING_DECOR]: 1,
    [DECORATION_SLOTS.MEDIUM_STANDING_DECOR]: 1,
    [DECORATION_SLOTS.LARGE_STANDING_DECOR]: 2,
    [DECORATION_SLOTS.SMALL_HANGING_DECOR]: 1,
    [DECORATION_SLOTS.MEDIUM_HANGING_DECOR]: 1,
    [DECORATION_SLOTS.LARGE_HANGING_DECOR]: 2
  },
  buffs: {
    [BUFFS.HIDING_TIME]: 400,
    [BUFFS.TEMPERATURE_MIN]: 5,
    [BUFFS.TEMPERATURE_MAX]: 5
  },
  research: {
    sameAsCrafting: true
  },
  materials: {
    Bricks: 40,
    WoodenBoard: 4,
    HardwoodBeam: 15,
    BisonHide: 20,
    TrueIronNails: 20
  },
  mapGraphicHomePath: `tiles/custom/homes/house/`
});

module.exports = global.SmallHouse = SmallHouse;
