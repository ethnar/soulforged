const Prey = require("./.prey");
const Corpse = require("../../../items/corpses/.corpse");

class TurodoHide extends Item {}
Item.itemFactory(TurodoHide, {
  dynamicName: () => `${Nameable.getName("TurodoHerd")} Hide`,
  order: ITEMS_ORDER.OTHER,
  icon: `/${ICONS_PATH}/resources/popping/animals/lz_b_07.png`,
  weight: 1
});

class TurodoCorpse extends Corpse {}
Item.itemFactory(TurodoCorpse, {
  dynamicName: () => Nameable.getName("TurodoHerd"),
  icon: `/${ICONS_PATH}/resources/popping/animals/107_dead.png`,
  weight: 40,
  butcherName: () => `Butcher ${Nameable.getName("TurodoHerd")}`,
  butcherTime: 30 * MINUTES,
  butcherSkillLevel: 3,
  produces: {
    TurodoHide: 15,
    TenderMeat: 5,
    HeartyMeat: 15,
    Bone: 5
  }
});

class TurodoHerd extends Prey {}
Entity.factory(TurodoHerd, {
  name: "Turodo",
  icon: `/${ICONS_PATH}/resources/popping/animals/107.png`,
  skill: SKILLS.HUNTING,
  toolUtility: TOOL_UTILS.HUNTING,
  produces: TurodoCorpse,
  sizeRange: [3, 6],
  baseTime: 45 * MINUTES,
  skillLevel: 3,
  placement: {
    [NODE_TYPES.SNOW_FIELDS]: 9,
    [NODE_TYPES.PLAINS_SNOW]: 4,
    [NODE_TYPES.CONIFEROUS_FOREST_SNOWED]: 3,
    [NODE_TYPES.CONIFEROUS_FOREST_COLD]: 2
  },
  activeFor: 4 * DAYS
});

module.exports = global.TurodoCorpse = TurodoCorpse;
module.exports = global.TurodoHerd = TurodoHerd;
