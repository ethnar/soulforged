const Prey = require("./.prey");
const Corpse = require("../../../items/corpses/.corpse");

class RabbitPelt extends Item {}
Object.assign(RabbitPelt.prototype, {
  dynamicName: () => `${Nameable.getName("Rabbits")} Pelt`,
  order: ITEMS_ORDER.OTHER,
  icon: `/${ICONS_PATH}/resources/popping/animals/lz_b_06.png`,
  weight: 1
});
module.exports = global.RabbitPelt = RabbitPelt;

class Rabbit extends Corpse {}
Item.itemFactory(Rabbit, {
  dynamicName: () => Nameable.getName("Rabbits"),
  icon: `/${ICONS_PATH}/resources/popping/animals/rabbit7_dead.png`,
  weight: 5,
  butcherName: () => `Butcher ${Nameable.getName("Rabbits")}`,
  butcherTime: 600,
  butcherSkillLevel: 0,
  produces: {
    TenderMeat: 2,
    RabbitPelt: 2,
    Bone: 1
  }
});

class CapturedRabbit extends TrappedPrey {}
class Rabbits extends Prey {}
Entity.factory(Rabbits, {
  name: "Rabbit",
  icon: `/${ICONS_PATH}/resources/popping/animals/rabbit7.png`,
  skill: SKILLS.HUNTING,
  toolUtility: TOOL_UTILS.HUNTING,
  produces: Rabbit,
  sizeRange: [3, 8],
  skillLevel: 0.4,
  trappable: {
    itemClass: CapturedRabbit,
    difficultyModifier: 1
  },
  placement: {
    [NODE_TYPES.BROADLEAF_FOREST]: 20,
    [NODE_TYPES.PLAINS]: 8
  },
  baseTime: 20 * MINUTES,
  activeFor: 2 * DAYS
});

Object.assign(CapturedRabbit.prototype, {
  dynamicName: () => `${CageTrap.getName()} (${Nameable.getName("Rabbits")})`,
  icon: `/${ICONS_PATH}/resources/popping/animals/rabbit7_cage.png`,
  order: ITEMS_ORDER.OTHER,
  weight: CageTrap.prototype.weight + Rabbit.prototype.weight,
  sourceResource: Rabbits,
  foodRequired: {
    Carrot: 3
  },
  containerItemType: CageTrap,
  expiresInto: {
    Rabbit: 1
  }
});
global.CapturedRabbit = CapturedRabbit;

module.exports = global.Rabbit = Rabbit;
module.exports = global.Rabbits = Rabbits;
