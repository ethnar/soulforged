const Prey = require("./.prey");
const Corpse = require("../../../items/corpses/.corpse");

class GoatHide extends Item {}
Item.itemFactory(GoatHide, {
  dynamicName: () => `${Nameable.getName("GoatHerd")} Hide`,
  order: ITEMS_ORDER.OTHER,
  icon: `/${ICONS_PATH}/resources/popping/animals/huntingicons_119_b.png`,
  weight: 1
});

class GoatCorpse extends Corpse {}
Item.itemFactory(GoatCorpse, {
  dynamicName: () => Nameable.getName("GoatHerd"),
  icon: `/${ICONS_PATH}/resources/popping/animals/goat_01_dead.png`,
  weight: 90,
  butcherName: () => `Butcher ${Nameable.getName("GoatHerd")}`,
  butcherTime: 40 * MINUTES,
  butcherSkillLevel: 3,
  produces: {
    GoatHide: 20,
    TenderMeat: 30,
    ToughMeat: 25,
    Bone: 15
  }
});

class GoatHerd extends Prey {}
Entity.factory(GoatHerd, {
  name: "Goat",
  icon: `/${ICONS_PATH}/resources/popping/animals/goat_01.png`,
  skill: SKILLS.HUNTING,
  toolUtility: TOOL_UTILS.HUNTING,
  produces: GoatCorpse,
  sizeRange: [4, 9],
  baseTime: 1.5 * HOURS,
  skillLevel: 1,
  placement: {
    [NODE_TYPES.CONIFEROUS_FOREST]: 3,
    [NODE_TYPES.CONIFEROUS_FOREST_SNOWED]: 5,
    [NODE_TYPES.CONIFEROUS_FOREST_COLD]: 6,
    [NODE_TYPES.HILLS_COLD]: 8,
    [NODE_TYPES.HILLS_SNOW]: 12,
    [NODE_TYPES.MOUNTAINS_SNOW]: 14
  },
  activeFor: 4 * DAYS
});

module.exports = global.GoatCorpse = GoatCorpse;
module.exports = global.GoatHerd = GoatHerd;
