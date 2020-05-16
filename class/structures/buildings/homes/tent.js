const Home = require("./.home");

class Tent extends Home {}
Building.buildingFactory(Tent, {
  name: "Tent",
  deteriorationRate: 3 * MONTHS,
  icon: `/${ICONS_PATH}/structures/buildings/homes/sgi_133_single_color.png`,
  baseTime: 3 * MINUTES,
  homeLevel: 2,
  storageCapacity: 150,
  availableDecorationSlots: {
    [DECORATION_SLOTS.FLOOR]: 1,
    [DECORATION_SLOTS.SEATS]: 1,
    [DECORATION_SLOTS.SMALL_HANGING_DECOR]: 1
  },
  buffs: {
    [BUFFS.HIDING_TIME]: 100,
    [BUFFS.TEMPERATURE_MIN]: 1.5,
    [BUFFS.TEMPERATURE_MAX]: 1.5
  },
  research: {
    sameAsCrafting: true
  },
  materials: {
    WoodenShaft: 10,
    DeerLeather: 20,
    BarkRope: 30
  },
  placement: [...LeanTo.prototype.placement],
  mapGraphicHomePath: node =>
    node.isForest() ? null : `tiles/custom/homes/tent/`
});

module.exports = global.Tent = Tent;
