const Predator = require("./.predator");
const Corpse = require("../../../items/corpses/.corpse");
require("../../../buffs/buff-diminishing");

class BearHide extends Item {}
Object.assign(BearHide.prototype, {
  dynamicName: () => `${Nameable.getName("Bear")} Hide`,
  order: ITEMS_ORDER.OTHER,
  icon: `/${ICONS_PATH}/creatures/monsters/animals/huntingicons_01.png`,
  weight: 1
});
module.exports = global.BearHide = BearHide;

module.exports = Monster.factory(class Bear extends Predator {}, {
  name: "Bear",
  icon: `/${ICONS_PATH}/creatures/monsters/animals/bear_01.png`,
  travelSpeed: 0.8,
  dodgeRating: 50,
  bloodPool: 35,
  defaultArmor: {
    [DAMAGE_TYPES.BLUNT]: 8,
    [DAMAGE_TYPES.SLICE]: 12,
    [DAMAGE_TYPES.PIERCE]: 14
  },
  defaultWeapon: {
    name: "Maul",
    damage: {
      [DAMAGE_TYPES.BLUNT]: 42,
      [DAMAGE_TYPES.SLICE]: 26,
      [DAMAGE_TYPES.PIERCE]: 5
    },
    hitChance: 60
  },
  butcherable: {
    butcherTime: 1 * HOURS,
    butcherSkillLevel: 3,
    produces: {
      ToughMeat: 70,
      BearHide: 30,
      Bone: 40
    }
  },
  placement: {
    [NODE_TYPES.BROADLEAF_FOREST]: 70,
    [NODE_TYPES.CONIFEROUS_FOREST]: 80,
    [NODE_TYPES.CONIFEROUS_FOREST_COLD]: 60,
    [NODE_TYPES.CONIFEROUS_FOREST_SNOWED]: 30
  },
  movementDelay: 10 * HOURS,
  threatLevel: 25,
  stats: {
    [STATS.STRENGTH]: 65,
    [STATS.DEXTERITY]: 50,
    [STATS.ENDURANCE]: 70,
    [STATS.PERCEPTION]: 35,
    [STATS.INTELLIGENCE]: 5
  },
  scouterMessages: [
    SCOUTER_MESSAGES.FUR_TAN,
    SCOUTER_MESSAGES.ANIMAL_POO,
    SCOUTER_MESSAGES.PAWS_REGULAR,
    SCOUTER_MESSAGES.SOUNDS_ROARING
  ],
  taming: {
    tool: "BearTamingTool",
    food: "TenderMeat",
    skillLevel: 2,
    tamenessGains: [4, 16],
    tamedCycle: (creature, seconds) => {
      creature.tryNuzzle(
        12,
        BuffBearNuzzle,
        `${creature.getName()} is nuzzling you!`,
        seconds
      );
      creature.leaveDroppings(6, seconds);
      creature.doHunting(seconds);
    }
  }
});

class BuffBearNuzzle extends BuffDiminishing {}
Object.assign(BuffBearNuzzle.prototype, {
  name: "Nuzzled!",
  icon: Bear.prototype.icon,
  category: Buff.CATEGORIES.INTERACTION,
  diminishing: 1.8,
  duration: 3 * HOURS,
  effects: {
    [BUFFS.MOOD]: 5,
    [BUFFS.CARRY_CAPACITY]: 120
  }
});
global.BuffBearNuzzle = BuffBearNuzzle;
