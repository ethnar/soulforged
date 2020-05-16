const Predator = require("./.predator");
const Corpse = require("../../../items/corpses/.corpse");
require("../../../buffs/buff-diminishing");

class WolfHide extends Item {}
Item.itemFactory(WolfHide, {
  dynamicName: () => `${Nameable.getName("Wolf")} Hide`,
  order: ITEMS_ORDER.OTHER,
  icon: `/${ICONS_PATH}/creatures/monsters/animals/lz_b_03_gray.png`,
  weight: 1
});

class WolfFang extends Item {}
Item.itemFactory(WolfFang, {
  dynamicName: () => `${Nameable.getName("Wolf")} Fang`,
  order: ITEMS_ORDER.OTHER,
  icon: `/${ICONS_PATH}/creatures/monsters/animals/huntingicons_124_b.png`,
  weight: 0.2
});

module.exports = Monster.factory(class Wolf extends Predator {}, {
  name: "Wolf",
  icon: `/${ICONS_PATH}/creatures/monsters/animals/arctic_wolf.png`,
  travelSpeed: 1.1,
  bloodPool: 18,
  butcherable: {
    butcherTime: 30 * MINUTES,
    butcherSkillLevel: 2,
    produces: {
      WolfFang: 2,
      PungentMeat: 22,
      WolfHide: 30,
      Bone: 15
    }
  },
  dodgeRating: 40,
  defaultArmor: {
    [DAMAGE_TYPES.BLUNT]: 2,
    [DAMAGE_TYPES.SLICE]: 9,
    [DAMAGE_TYPES.PIERCE]: 12
  },
  defaultWeapon: {
    name: "Claw",
    damage: {
      [DAMAGE_TYPES.BLUNT]: 2,
      [DAMAGE_TYPES.SLICE]: 8,
      [DAMAGE_TYPES.PIERCE]: 4
    },
    hitChance: 90
  },
  lootTable: {
    100: {
      WolfCorpse: "1-1"
    }
  },
  placement: {
    [NODE_TYPES.PLAINS]: 5,
    [NODE_TYPES.PLAINS_SNOW]: 10,
    [NODE_TYPES.SNOW_FIELDS]: 15,
    [NODE_TYPES.BROADLEAF_FOREST]: 100,
    [NODE_TYPES.CONIFEROUS_FOREST]: 90,
    [NODE_TYPES.CONIFEROUS_FOREST_COLD]: 60,
    [NODE_TYPES.CONIFEROUS_FOREST_SNOWED]: 30
  },
  movementDelay: 8 * HOURS,
  threatLevel: 4,
  stats: {
    [STATS.STRENGTH]: 55,
    [STATS.DEXTERITY]: 60,
    [STATS.ENDURANCE]: 50,
    [STATS.PERCEPTION]: 55,
    [STATS.INTELLIGENCE]: 5
  },
  scouterMessages: [
    SCOUTER_MESSAGES.ANIMAL_POO,
    SCOUTER_MESSAGES.FUR_GREY,
    SCOUTER_MESSAGES.PAWS_REGULAR,
    SCOUTER_MESSAGES.SOUNDS_HOWLING,
    SCOUTER_MESSAGES.CARCASSES_MEDIUM
  ],
  taming: {
    tool: "WolfTamingTool",
    food: "HeartyMeat",
    skillLevel: 1,
    tamenessGains: [5, 20],
    tamedCycle: (creature, seconds) => {
      creature.tryNuzzle(
        10,
        BuffWolfNuzzle,
        `${creature.getName()} is nuzzling you!`,
        seconds
      );
      creature.leaveDroppings(8, seconds);
      creature.doHunting(seconds);
    }
  }
});

class BuffWolfNuzzle extends BuffDiminishing {}
Object.assign(BuffWolfNuzzle.prototype, {
  name: "Nuzzled!",
  icon: Wolf.prototype.icon,
  category: Buff.CATEGORIES.INTERACTION,
  diminishing: 1.8,
  duration: 3 * HOURS,
  effects: {
    [BUFFS.MOOD]: 5,
    [BUFFS.TRAVEL_SPEED]: 10
  }
});
global.BuffWolfNuzzle = BuffWolfNuzzle;

Decoration.makeTrophy(
  Wolf,
  [DECORATION_SLOTS.MEDIUM_HANGING_DECOR, DECORATION_SLOTS.LARGE_HANGING_DECOR],
  {
    WoodenBoard: 1,
    Clay: 6
  },
  {
    [BUFFS.SKILLS.PATHFINDING]: 0.3,
    [BUFFS.SKILLS.HUNTING]: 0.3
  }
);
