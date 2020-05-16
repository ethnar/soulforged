const Home = require("./.home");

class StoneHouse extends Home {}
Building.buildingFactory(StoneHouse, {
  name: "Stone House",
  icon: `/tiles/custom/homes/stone-house/icon.png`,
  deteriorationRate: 6 * MONTHS,
  baseTime: 3.5 * MINUTES,
  homeLevel: 4,
  storageCapacity: 300,
  availableDecorationSlots: {
    [DECORATION_SLOTS.FLOOR]: 1,
    [DECORATION_SLOTS.SEATS]: 1,
    [DECORATION_SLOTS.TABLE]: 1,
    [DECORATION_SLOTS.SMALL_STANDING_DECOR]: 1,
    [DECORATION_SLOTS.MEDIUM_STANDING_DECOR]: 3,
    [DECORATION_SLOTS.SMALL_HANGING_DECOR]: 1,
    [DECORATION_SLOTS.MEDIUM_HANGING_DECOR]: 1,
    [DECORATION_SLOTS.LARGE_HANGING_DECOR]: 1
  },
  buffs: {
    [BUFFS.HIDING_TIME]: 600,
    [BUFFS.TEMPERATURE_MIN]: 1.5,
    [BUFFS.TEMPERATURE_MAX]: 1.5
  },
  research: {
    sameAsCrafting: true,
    materials: {
      TabletWriting14338: 0
    }
  },
  materials: {
    HardwoodBeam: 8,
    LimestoneBlock: 20,
    GraniteBlock: 40,
    TrueIronNails: 30,
    BisonHide: 20
  },
  mapGraphicHomePath: `tiles/custom/homes/stone-house/`,
  placement: [NODE_TYPES.UNDERGROUND_FLOOR, NODE_TYPES.UNDERGROUND_LAVA_PLAINS]
});

module.exports = global.StoneHouse = StoneHouse;
