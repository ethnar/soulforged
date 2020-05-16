const Swarmer = require("./.swarmer");
require("./desert-spider");

class TickBloodSack extends Drink {
  consumed(creature) {
    const chance =
      50 / (creature.getStatPercentageEfficiency(STATS.ENDURANCE) / 100);
    if (utils.chance(chance)) {
      MarshFeverIncubation.applyBuff(creature);
    }
    return super.consumed(creature);
  }
}
Item.itemFactory(TickBloodSack, {
  name: "Tick Blood Sack",
  order: ITEMS_ORDER.OTHER,
  icon: `/${ICONS_PATH}/creatures/monsters/animals/huntingicons_70.png`,
  weight: 0.8,
  buffs: {
    [BUFFS.BLOOD]: +3
  }
});

module.exports = Monster.factory(
  class GiantTick extends Swarmer {
    dealDamage(enemy) {
      const damage = super.dealDamage(enemy);
      if (damage && damage.length) {
        const chance =
          2 / (enemy.getStatPercentageEfficiency(STATS.ENDURANCE) / 100);
        if (utils.chance(chance)) {
          MarshFeverIncubation.applyBuff(enemy);
        }
      }
      return damage;
    }
  },
  {
    name: "Giant Tick",
    icon: `/${ICONS_PATH}/creatures/monsters/animals/bug.png`,
    travelSpeed: 1.5,
    swarmerCount: () => utils.random(2, 4),
    bloodPool: 1,
    dodgeRating: 30,
    defaultArmor: {
      [DAMAGE_TYPES.BLUNT]: -4,
      [DAMAGE_TYPES.SLICE]: -4,
      [DAMAGE_TYPES.PIERCE]: -3
    },
    defaultWeapon: {
      name: "Bite",
      damage: {
        [DAMAGE_TYPES.SLICE]: 2,
        [DAMAGE_TYPES.PIERCE]: 2
      },
      hitChance: 35
    },
    butcherable: {
      butcherTime: 2 * MINUTES,
      butcherSkillLevel: 1,
      produces: {
        TickBloodSack: 2
      }
    },
    placement: {
      [NODE_TYPES.SWAMP]: 30,
      [NODE_TYPES.BOG]: 20
    },
    movementDelay: 30 * MINUTES,
    threatLevel: 0.5,
    stats: {
      [STATS.STRENGTH]: 33,
      [STATS.DEXTERITY]: 55,
      [STATS.ENDURANCE]: 35,
      [STATS.PERCEPTION]: 30,
      [STATS.INTELLIGENCE]: 5
    },
    scouterMessages: [
      SCOUTER_MESSAGES.INSECT_PIECES,
      SCOUTER_MESSAGES.SOUNDS_SKITTERING,
      SCOUTER_MESSAGES.FOOTPRINTS_TINY
    ]
  }
);
