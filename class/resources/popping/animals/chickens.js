const Prey = require("./.prey");
const Corpse = require("../../../items/corpses/.corpse");

class ChickenEgg extends Edible {}
Object.assign(ChickenEgg.prototype, {
  dynamicName: () => `${Nameable.getName("Chickens")} Egg`,
  icon: `/${ICONS_PATH}/resources/popping/animals/119_t.png`,
  weight: 0.1,
  timeToEat: 3,
  nutrition: 6,
  expiresIn: 15 * DAYS,
  buffs: {
    // tier 0
    [BUFFS.MOOD]: -5
  }
});

class Chicken extends Corpse {}
Item.itemFactory(Chicken, {
  dynamicName: () => Nameable.getName("Chickens"),
  icon: `/${ICONS_PATH}/resources/popping/animals/chicken_01_dead.png`,
  weight: 8,
  butcherName: () => `Butcher ${Nameable.getName("Chickens")}`,
  butcherTime: 5 * MINUTES,
  butcherSkillLevel: 1,
  produces: {
    FowlMeat: 6,
    Bone: 2
  }
});

class CapturedChicken extends TrappedPrey {}
class Chickens extends Prey {}
Entity.factory(Chickens, {
  name: "Chicken",
  icon: `/${ICONS_PATH}/resources/popping/animals/chicken_01.png`,
  skill: SKILLS.HUNTING,
  toolUtility: TOOL_UTILS.HUNTING,
  sizeRange: [4, 10],
  skillLevel: 1,
  placement: {
    [NODE_TYPES.CONIFEROUS_FOREST]: 12,
    [NODE_TYPES.BROADLEAF_FOREST]: 6
  },
  trappable: {
    itemClass: CapturedChicken,
    difficultyModifier: 2
  },
  produces: (creature, core = false) => {
    if (!core && utils.chance(15)) {
      creature.addItemByType(ChickenEgg, utils.random(1, 4));
      return ChickenEgg;
    }
    return Chicken;
  },
  baseTime: 10 * MINUTES,
  activeFor: 4 * DAYS
});

Object.assign(CapturedChicken.prototype, {
  dynamicName: () => `${CageTrap.getName()} (${Nameable.getName("Chickens")})`,
  icon: `/${ICONS_PATH}/resources/popping/animals/chicken_01_cage.png`,
  order: ITEMS_ORDER.OTHER,
  sourceResource: Chickens,
  weight: CageTrap.prototype.weight + Chicken.prototype.weight,
  foodRequired: {
    Wheat: 10
  },
  containerItemType: CageTrap,
  expiresInto: {
    Chicken: 1
  }
});
global.CapturedChicken = CapturedChicken;

module.exports = global.ChickenEgg = ChickenEgg;
module.exports = global.Chicken = Chicken;
module.exports = global.Chickens = Chickens;
