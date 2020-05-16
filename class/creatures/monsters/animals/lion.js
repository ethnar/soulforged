const Predator = require("./.predator");
const Corpse = require("../../../items/corpses/.corpse");
require("../../../items/decorations/.decoration");
require("../../../buffs/buff-diminishing");

class LionSkin extends Item {}
Item.itemFactory(LionSkin, {
  dynamicName: () => `${Nameable.getName("Lion")} Skin`,
  order: ITEMS_ORDER.OTHER,
  icon: `/${ICONS_PATH}/creatures/monsters/animals/gmn10_b.png`,
  weight: 1
});

class LionHeart extends Item {}
Item.itemFactory(LionHeart, {
  dynamicName: () => `${Nameable.getName("Lion")} Heart`,
  order: ITEMS_ORDER.OTHER,
  icon: `/${ICONS_PATH}/creatures/monsters/animals/heart_b_01.png`,
  weight: 4
});

module.exports = Monster.factory(class Lion extends Predator {}, {
  name: "Lion",
  icon: `/${ICONS_PATH}/creatures/monsters/animals/lion_01.png`,
  travelSpeed: 0.8,
  bloodPool: 35,
  defaultArmor: {
    [DAMAGE_TYPES.BLUNT]: 10,
    [DAMAGE_TYPES.SLICE]: 14,
    [DAMAGE_TYPES.PIERCE]: 20
  },
  dodgeRating: 50,
  defaultWeapon: {
    name: "Claw",
    damage: {
      [DAMAGE_TYPES.BLUNT]: 12,
      [DAMAGE_TYPES.SLICE]: 23,
      [DAMAGE_TYPES.PIERCE]: 14
    },
    hitChance: 85
  },
  butcherable: {
    butcherTime: 1 * HOURS,
    butcherSkillLevel: 2,
    produces: {
      ToughMeat: 50,
      PungentMeat: 30,
      LionSkin: 30,
      Bone: 36,
      LionHeart: 1
    }
  },
  placement: {
    [NODE_TYPES.DESERT_SAND]: 10,
    [NODE_TYPES.DESERT_PALMS]: 20,
    [NODE_TYPES.SAVANNAH]: 40,
    [NODE_TYPES.CACTI]: 15,
    [NODE_TYPES.DESERT_GRASS]: 25,
    [NODE_TYPES.SCRUB_LAND]: 15
  },
  movementDelay: 7 * HOURS,
  threatLevel: 35,
  stats: {
    [STATS.STRENGTH]: 72,
    [STATS.DEXTERITY]: 65,
    [STATS.ENDURANCE]: 67,
    [STATS.PERCEPTION]: 55,
    [STATS.INTELLIGENCE]: 5
  },
  taming: {
    tool: "LionTamingTool",
    food: "ToughMeat",
    skillLevel: 3,
    tamenessGains: [4, 12],
    tamedCycle: (creature, seconds) => {
      creature.tryNuzzle(
        10,
        BuffLionNuzzle,
        `${creature.getName()} is nuzzling you!`,
        seconds
      );
      creature.leaveDroppings(8, seconds);
      creature.wanderOff(9, seconds);
      creature.doHunting(seconds);
    }
  },
  scouterMessages: [
    SCOUTER_MESSAGES.FUR_TAN,
    SCOUTER_MESSAGES.ANIMAL_POO,
    SCOUTER_MESSAGES.PAWS_REGULAR,
    SCOUTER_MESSAGES.CARCASSES_MEDIUM,
    SCOUTER_MESSAGES.SOUNDS_ROARING
  ]
});

class BuffLionNuzzle extends BuffDiminishing {}
Object.assign(BuffLionNuzzle.prototype, {
  name: "Nuzzled!",
  icon: Lion.prototype.icon,
  category: Buff.CATEGORIES.INTERACTION,
  diminishing: 1.8,
  duration: 3 * HOURS,
  effects: {
    [BUFFS.MOOD]: 5,
    [BUFFS.COMBAT_STRENGTH]: 105
  }
});
global.BuffLionNuzzle = BuffLionNuzzle;

Decoration.makeTrophy(
  Lion,
  [DECORATION_SLOTS.LARGE_HANGING_DECOR],
  {
    WoodenBoard: 1,
    Clay: 13
  },
  {
    [BUFFS.SKILLS.TAMING]: 0.5,
    [BUFFS.SKILLS.LEATHERWORKING]: 0.3
  }
);
