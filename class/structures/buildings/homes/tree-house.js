const Home = require("./.home");

class TreeHouse extends Home {}
Building.buildingFactory(TreeHouse, {
  name: "Tree House",
  icon: `/tiles/custom/homes/tree-house/icon.png`,
  deteriorationRate: 3 * MONTHS,
  baseTime: 3.5 * MINUTES,
  homeLevel: 3,
  storageCapacity: 180,
  availableDecorationSlots: {
    [DECORATION_SLOTS.FLOOR]: 1,
    [DECORATION_SLOTS.SEATS]: 1,
    [DECORATION_SLOTS.TABLE]: 1,
    [DECORATION_SLOTS.MEDIUM_STANDING_DECOR]: 2,
    [DECORATION_SLOTS.SMALL_HANGING_DECOR]: 2
  },
  buffs: {
    [BUFFS.HIDING_TIME]: 1100,
    [BUFFS.TEMPERATURE_MIN]: 3,
    [BUFFS.TEMPERATURE_MAX]: 2.5
  },
  research: {
    sameAsCrafting: true,
    materials: {
      TabletWriting14332: 0
    }
  },
  materials: {
    WoodenBeam: 8,
    WoodenPlank: 70,
    WoodenBoard: 4,
    LeatherRope: 30,
    IronNails: 30
  },
  placement: [
    NODE_TYPES.BROADLEAF_FOREST,
    NODE_TYPES.CONIFEROUS_FOREST,
    NODE_TYPES.CONIFEROUS_FOREST_COLD,
    NODE_TYPES.CONIFEROUS_FOREST_SNOWED
  ]
});

module.exports = global.TreeHouse = TreeHouse;
