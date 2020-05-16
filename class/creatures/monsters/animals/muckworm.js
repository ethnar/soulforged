const Predator = require("./.predator");
require("./forest-spider");

class MuckEgg extends Edible {
  expire() {
    const qty = this.qty;
    const node = this.getNode();
    super.expire();
    if (this.expired) {
      for (let i = 0; i < qty; i += 1) {
        if (utils.chance(8)) {
          node.spawnCreature(MuckParasite);
        }
      }
      this.destroy();
    }
  }
}
Item.itemFactory(MuckEgg, {
  dynamicName: () => `${Nameable.getName("Muckworm")} Egg`,
  order: ITEMS_ORDER.OTHER,
  icon: `/${ICONS_PATH}/creatures/monsters/animals/prehistoricicon_129_b_recolor.png`,
  timeToEat: 3,
  nutrition: 6,
  weight: 0.5,
  expiresIn: 15 * DAYS,
  expiresIntegrity: true,
  buffs: {
    [BUFFS.MOOD]: -10,
    [BUFFS.SKILLS.SPELUNKING]: 0.5
  }
});

module.exports = Monster.factory(class MuckParasite extends Predator {}, {
  name: "Muck Squiggling",
  icon: `/${ICONS_PATH}/creatures/monsters/animals/am_b_04.png`,
  travelSpeed: 0.1,
  bloodPool: 1,
  dodgeRating: 200,
  defaultArmor: {
    [DAMAGE_TYPES.BLUNT]: -1,
    [DAMAGE_TYPES.SLICE]: 1,
    [DAMAGE_TYPES.PIERCE]: 8
  },
  defaultWeapon: {
    name: "Bite",
    damage: {
      [DAMAGE_TYPES.SLICE]: 3,
      [DAMAGE_TYPES.PIERCE]: 3,
      [DAMAGE_TYPES.VENOM]: 0
    },
    hitChance: 40
  },
  butcherable: {
    butcherTime: 1 * MINUTES,
    butcherSkillLevel: 1,
    produces: {
      VileMeat: 1
    }
  },
  placement: {},
  movementDelay: 24 * HOURS,
  threatLevel: 1,
  stats: {
    [STATS.STRENGTH]: 35,
    [STATS.DEXTERITY]: 35,
    [STATS.ENDURANCE]: 35,
    [STATS.PERCEPTION]: 20,
    [STATS.INTELLIGENCE]: 5
  },
  scouterMessages: [
    SCOUTER_MESSAGES.TINY_POO,
    SCOUTER_MESSAGES.SLIME,
    SCOUTER_MESSAGES.EGG_SHELLS
  ]
});

module.exports = Monster.factory(class Muckworm extends Predator {}, {
  name: "Muckworm",
  icon: `/${ICONS_PATH}/creatures/monsters/animals/parasit_02.png`,
  travelSpeed: 0.4,
  bloodPool: 15,
  dodgeRating: 160,
  defaultArmor: {
    [DAMAGE_TYPES.BLUNT]: 24,
    [DAMAGE_TYPES.SLICE]: 30,
    [DAMAGE_TYPES.PIERCE]: 36
  },
  defaultWeapon: {
    name: "Bite",
    damage: {
      [DAMAGE_TYPES.SLICE]: 19,
      [DAMAGE_TYPES.PIERCE]: 23,
      [DAMAGE_TYPES.VENOM]: 12
    },
    hitChance: 45
  },
  butcherable: {
    butcherTime: 20 * MINUTES,
    butcherSkillLevel: 1,
    produces: {
      MuckEgg: 3,
      VileMeat: 25
    }
  },
  placement: {
    [NODE_TYPES.UNDERGROUND_FLOOR]: 5,
    [NODE_TYPES.UNDERGROUND_CAVE]: 12
  },
  movementDelay: 8 * HOURS,
  threatLevel: 17,
  stats: {
    [STATS.STRENGTH]: 45,
    [STATS.DEXTERITY]: 45,
    [STATS.ENDURANCE]: 45,
    [STATS.PERCEPTION]: 50,
    [STATS.INTELLIGENCE]: 5
  },
  scouterMessages: [
    SCOUTER_MESSAGES.ANIMAL_POO,
    SCOUTER_MESSAGES.SLIME,
    SCOUTER_MESSAGES.EGG_SHELLS
  ]
});
