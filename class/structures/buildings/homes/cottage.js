const Home = require("./.home");

class Thatch extends Item {}
Item.itemFactory(Thatch, {
  name: "Thatch",
  order: ITEMS_ORDER.OTHER,
  icon: `/${ICONS_PATH}/items/materials/thatch.png`,
  autoCalculateWeight: true,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      Wheat: 20
    },
    skill: SKILLS.CRAFTING,
    skillLevel: 3,
    baseTime: 2 * HOURS
  }
});

class Cottage extends Home {}
Building.buildingFactory(Cottage, {
  name: "Cottage",
  icon: `/${ICONS_PATH}/structures/buildings/homes/sgi_49.png`,
  deteriorationRate: 4 * MONTHS,
  baseTime: 2.2 * MINUTES,
  homeLevel: 3,
  storageCapacity: 250,
  availableDecorationSlots: {
    [DECORATION_SLOTS.FLOOR]: 1,
    [DECORATION_SLOTS.SEATS]: 1,
    [DECORATION_SLOTS.TABLE]: 1,
    [DECORATION_SLOTS.MEDIUM_STANDING_DECOR]: 1,
    [DECORATION_SLOTS.SMALL_HANGING_DECOR]: 2,
    [DECORATION_SLOTS.LARGE_HANGING_DECOR]: 1
  },
  buffs: {
    [BUFFS.HIDING_TIME]: 300,
    [BUFFS.TEMPERATURE_MIN]: 3,
    [BUFFS.TEMPERATURE_MAX]: 2.5
  },
  research: {
    sameAsCrafting: true
  },
  materials: {
    WoodenBeam: 15,
    WoodenPlank: 50,
    LeatherStraps: 30,
    Thatch: 10,
    IronNails: 30
  },
  mapGraphicHomePath: `tiles/custom/homes/cottage-new/`
});

module.exports = global.Cottage = Cottage;
