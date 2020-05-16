const Home = require("./.home");

class LeanTo extends Home {}
Building.buildingFactory(LeanTo, {
  name: "Lean-To",
  icon: `/${ICONS_PATH}/structures/buildings/homes/leanto.png`,
  baseTime: 1 * MINUTES,
  homeLevel: 1,
  storageCapacity: 30,
  availableDecorationSlots: {
    [DECORATION_SLOTS.SMALL_HANGING_DECOR]: 1
  },
  research: {
    sameAsCrafting: true
  },
  toolUtility: TOOL_UTILS.CUTTING,
  materials: {
    WoodenShaft: 12,
    Twig: 60,
    BarkRope: 10
  },
  buffs: {
    [BUFFS.TEMPERATURE_MIN]: 0.2,
    [BUFFS.TEMPERATURE_MAX]: 0.8
  },
  placement: [
    ...Building.prototype.placement,
    NODE_TYPES.UNDERGROUND_FLOOR,
    NODE_TYPES.UNDERGROUND_LAVA_PLAINS,
    NODE_TYPES.BROADLEAF_FOREST,
    NODE_TYPES.CONIFEROUS_FOREST,
    NODE_TYPES.CONIFEROUS_FOREST_COLD,
    NODE_TYPES.CONIFEROUS_FOREST_SNOWED
  ],
  mapGraphicHomePath: node =>
    node.isForest() ? null : `tiles/custom/homes/lean-to/`
});

module.exports = global.LeanTo = LeanTo;
