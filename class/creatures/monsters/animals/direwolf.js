const Predator = require("./.predator");
const Corpse = require("../../../items/corpses/.corpse");
require("../../../buffs/buff-diminishing");

module.exports = Monster.factory(class Direwolf extends Predator {}, {
  name: "Direwolf",
  icon: `/${ICONS_PATH}/creatures/monsters/animals/dark_wolf_red_eyes.png`,
  travelSpeed: 1.1,
  bloodPool: 25,
  dodgeRating: 70,
  defaultArmor: {
    [DAMAGE_TYPES.BLUNT]: 11,
    [DAMAGE_TYPES.SLICE]: 12,
    [DAMAGE_TYPES.PIERCE]: 14
  },
  defaultWeapon: {
    name: "Claw",
    damage: {
      [DAMAGE_TYPES.BLUNT]: 4,
      [DAMAGE_TYPES.SLICE]: 11,
      [DAMAGE_TYPES.PIERCE]: 10
    },
    hitChance: 95
  },
  butcherable: {
    butcherTime: 30 * MINUTES,
    butcherSkillLevel: 3,
    produces: {
      WolfFang: 4,
      PungentMeat: 40,
      ToughMeat: 20,
      WolfHide: 50,
      Bone: 35
    }
  },
  placement: {
    [NODE_TYPES.PLAINS_SNOW]: 10,
    [NODE_TYPES.SNOW_FIELDS]: 10,
    [NODE_TYPES.BROADLEAF_FOREST]: 5,
    [NODE_TYPES.CONIFEROUS_FOREST]: 20,
    [NODE_TYPES.CONIFEROUS_FOREST_COLD]: 20,
    [NODE_TYPES.CONIFEROUS_FOREST_SNOWED]: 20
  },
  movementDelay: 8 * HOURS,
  threatLevel: 20,
  stats: {
    [STATS.STRENGTH]: 65,
    [STATS.DEXTERITY]: 63,
    [STATS.ENDURANCE]: 57,
    [STATS.PERCEPTION]: 55,
    [STATS.INTELLIGENCE]: 5
  },
  scouterMessages: [
    SCOUTER_MESSAGES.ANIMAL_POO,
    SCOUTER_MESSAGES.PAWS_REGULAR,
    SCOUTER_MESSAGES.SOUNDS_HOWLING,
    SCOUTER_MESSAGES.CARCASSES_MEDIUM,
    SCOUTER_MESSAGES.FUR_BLACK
  ],
  taming: {
    tool: "DirewolfTamingTool",
    food: "HeartyMeat",
    skillLevel: 5,
    tamenessGains: [4, 10],
    tamedCycle: (creature, seconds) => {
      creature.tryNuzzle(
        4,
        BuffDirewolfNuzzle,
        `${creature.getName()} is nuzzling you!`,
        seconds
      );
      creature.leaveDroppings(10, seconds);
      creature.doHunting(seconds);
    }
  }
});

class BuffDirewolfNuzzle extends BuffDiminishing {}
Object.assign(BuffDirewolfNuzzle.prototype, {
  name: "Nuzzled!",
  icon: Direwolf.prototype.icon,
  category: Buff.CATEGORIES.INTERACTION,
  diminishing: 1.8,
  duration: 3 * HOURS,
  effects: {
    [BUFFS.MOOD]: 5,
    [BUFFS.TRAVEL_SPEED]: 5,
    [BUFFS.SKILLS.TRACKING]: 0.6
  }
});
global.BuffDirewolfNuzzle = BuffDirewolfNuzzle;

Decoration.makeTrophy(
  Direwolf,
  [DECORATION_SLOTS.LARGE_HANGING_DECOR],
  {
    HardwoodBoard: 1,
    Clay: 10
  },
  {
    [BUFFS.SKILLS.PATHFINDING]: 0.5,
    [BUFFS.SKILLS.HUNTING]: 0.5
  }
);
