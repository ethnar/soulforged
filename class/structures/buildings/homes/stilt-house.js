const Home = require("./.home");

class StiltHouse extends Home {}
Building.buildingFactory(StiltHouse, {
  name: "Stilt House",
  icon: `/tiles/custom/homes/stilt-house/icon.png`,
  deteriorationRate: 3 * MONTHS,
  baseTime: 3.5 * MINUTES,
  homeLevel: 3,
  storageCapacity: 120,
  availableDecorationSlots: {
    [DECORATION_SLOTS.FLOOR]: 1,
    [DECORATION_SLOTS.SEATS]: 1,
    [DECORATION_SLOTS.TABLE]: 1,
    [DECORATION_SLOTS.SMALL_STANDING_DECOR]: 2,
    [DECORATION_SLOTS.SMALL_HANGING_DECOR]: 2
  },
  buffs: {
    [BUFFS.HIDING_TIME]: 800,
    [BUFFS.TEMPERATURE_MIN]: 3,
    [BUFFS.TEMPERATURE_MAX]: 2.5
  },
  research: {
    sameAsCrafting: true
  },
  materials: {
    WillowWood: 30,
    HardwoodPlank: 25,
    HardwoodBoard: 2,
    LeatherRope: 15,
    Thatch: 8,
    IronNails: 30
  },
  placement: [NODE_TYPES.TROPICAL_PLAINS, NODE_TYPES.BOG],
  mapGraphicHomePath: `tiles/custom/homes/stilt-house/`
});

module.exports = global.StiltHouse = StiltHouse;
