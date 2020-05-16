const Prey = require("./.prey");
const Corpse = require("../../../items/corpses/.corpse");

class DeerHide extends Item {}
Object.assign(DeerHide.prototype, {
  dynamicName: () => `${Nameable.getName("Deers")} Hide`,
  order: ITEMS_ORDER.OTHER,
  icon: `/${ICONS_PATH}/resources/popping/animals/huntingicons_117_b.png`,
  weight: 1
});
module.exports = global.DeerHide = DeerHide;

class Deer extends Corpse {}
Item.itemFactory(Deer, {
  dynamicName: () => Nameable.getName("Deers"),
  icon: `/${ICONS_PATH}/resources/popping/animals/deer3_dead.png`,
  weight: 65,
  butcherName: () => `Butcher ${Nameable.getName("Deers")}`,
  butcherTime: 30 * MINUTES,
  butcherSkillLevel: 2,
  produces: {
    HeartyMeat: 40,
    DeerHide: 15,
    Bone: 10
  }
});

class Deers extends Prey {}
Entity.factory(Deers, {
  name: "Deer",
  icon: `/${ICONS_PATH}/resources/popping/animals/deer3.png`,
  skill: SKILLS.HUNTING,
  toolUtility: TOOL_UTILS.HUNTING,
  produces: Deer,
  sizeRange: [6, 20],
  skillLevel: 2,
  placement: {
    [NODE_TYPES.BROADLEAF_FOREST]: 18,
    [NODE_TYPES.CONIFEROUS_FOREST]: 30,
    [NODE_TYPES.PLAINS]: 8
  },
  baseTime: 1 * HOURS,
  activeFor: 2 * DAYS
});

module.exports = global.Deer = Deer;
module.exports = global.Deers = Deers;
