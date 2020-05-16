const Swarmer = require("./.swarmer");
require("./desert-spider");

class BatWing extends Item {}
Item.itemFactory(BatWing, {
  name: "Bat Wing",
  order: ITEMS_ORDER.OTHER,
  icon: `/${ICONS_PATH}/creatures/monsters/animals/huntingicons_58.png`,
  weight: 0.2
});

module.exports = Monster.factory(
  class SwarmerBat extends Swarmer {
    dealDamage(enemy) {
      const damage = super.dealDamage(enemy);
      if (damage && damage.length) {
        const chance =
          0.2 / (enemy.getStatPercentageEfficiency(STATS.ENDURANCE) / 100);
        if (utils.chance(chance)) {
          BloodthirstIncubation.applyBuff(enemy);
        }
      }
      return damage;
    }
  },
  {
    name: "Swarmer Bat",
    icon: `/${ICONS_PATH}/creatures/monsters/animals/bat_01_recolor.png`,
    travelSpeed: 1.5,
    swarmerCount: () => utils.random(3, 6),
    bloodPool: 1,
    dodgeRating: 160,
    defaultArmor: {
      [DAMAGE_TYPES.BLUNT]: -7,
      [DAMAGE_TYPES.SLICE]: -4,
      [DAMAGE_TYPES.PIERCE]: -3
    },
    defaultWeapon: {
      name: "Bite",
      damage: {
        [DAMAGE_TYPES.SLICE]: 1,
        [DAMAGE_TYPES.PIERCE]: 0.5
      },
      hitChance: 70
    },
    butcherable: {
      butcherTime: 4 * MINUTES,
      butcherSkillLevel: 0,
      produces: {
        BatWing: 2,
        ToughMeat: 2
      }
    },
    placement: {
      [NODE_TYPES.UNDERGROUND_FLOOR]: 40,
      [NODE_TYPES.UNDERGROUND_CAVE]: 40
    },
    movementDelay: 4 * HOURS,
    threatLevel: 0.5,
    stats: {
      [STATS.STRENGTH]: 33,
      [STATS.DEXTERITY]: 55,
      [STATS.ENDURANCE]: 35,
      [STATS.PERCEPTION]: 30,
      [STATS.INTELLIGENCE]: 5
    },
    scouterMessages: [
      SCOUTER_MESSAGES.TINY_POO,
      SCOUTER_MESSAGES.FUR_BLACK,
      SCOUTER_MESSAGES.SOUNDS_SCREECHING
    ]
  }
);
