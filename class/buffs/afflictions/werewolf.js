// Number of factors requires to catch
// Player looses control for Full moon

const name = "Moonrage";

const BuffMoonrage = utils.newClassExtending(`BuffMoonrage`, Buff);
Object.assign(BuffMoonrage.prototype, {
  name: `${name}`,
  icon: `/${ICONS_PATH}/creatures/monsters/animals/grey_wolf_02.png`,
  description: `Filled with uncontrollable rage`,
  public: true,
  visible: true
});

const BuffSomethingHappening1 = utils.newClassExtending(
  `BuffSomethingHappening1`,
  Buff
);
Object.assign(BuffSomethingHappening1.prototype, {
  name: `Goosebumps`,
  description: `Something is coming...`,
  icon: `/${ICONS_PATH}/buffs/addon_14.png`
});

const BuffMoonrageHidden = utils.newClassExtending(`BuffMoonrageHidden`, Buff);
Object.assign(BuffMoonrageHidden.prototype, {
  name: `${name} hidden`,
  hidden: true
});

const BuffWerewolfChance = utils.newClassExtending(`BuffWerewolfChance`, Buff);
Object.assign(BuffWerewolfChance.prototype, {
  name: `Werewolf curse hidden`,
  hidden: true,
  duration: 90 * DAYS
});

const STATS_CHANGE = {
  [STATS.STRENGTH]: 25,
  [STATS.DEXTERITY]: 25,
  [STATS.ENDURANCE]: 80,
  [STATS.PERCEPTION]: 20,
  [STATS.INTELLIGENCE]: -40
};

class Werewolf extends Humanoid {
  getName() {
    return Entity.getName.apply(this.constructor);
  }

  static actionPriority() {
    return [
      Monster.prototype.actionPriorities.fight,
      Monster.prototype.actionPriorities.chaser,
      Monster.prototype.actionPriorities.wander
    ];
  }
  actionPriority() {
    return this.constructor.actionPriority();
  }

  cycle(seconds) {
    super.cycle(seconds);

    if (this.isDead()) {
      return;
    }

    const doNext = this.actionPriority().find(potential =>
      potential.condition(this)
    );
    if (doNext && doNext.trigger(this)) {
      doNext.action(this, seconds);
    }
  }

  die(...args) {
    Werewolf.turnBack(this);
    super.die(...args);
  }

  getPlacementChance(node) {
    return node.getTravelTime(this) < 30 * MINUTES ? 100 : 0;
  }

  static turnInto(creature) {
    if (!(creature instanceof Humanoid) || creature instanceof Werewolf) {
      return;
    }

    if (creature.transformed) {
      return;
    }

    creature.transformed = {
      type: "Werewolf",
      baseClass: creature.constructor.name,
      faction: creature.getFaction().getName(),
      looks: creature.looks,
      icon: creature.icon
    };

    creature.addBuff(BuffMoonrage);

    utils.changeObjectClass(creature, Werewolf);
    creature.faction = "AllHostile_" + creature.getEntityId();
    delete creature.looks;
    creature.icon = `/${ICONS_PATH}/creatures/monsters/animals/grey_wolf_02.png`;

    creature.energy = 100;
    creature.noControl = true;

    creature.stopAction(false, true);

    [...creature.getItems()].forEach(i => {
      creature.drop(i, Infinity);
    });

    Object.keys(STATS_CHANGE).forEach(stat => {
      creature.stats[stat] += STATS_CHANGE[stat];
    });
  }

  static turnBack(creature) {
    if (!creature.transformed || creature.transformed.type !== "Werewolf") {
      return;
    }

    utils.changeObjectClass(creature, global[creature.transformed.baseClass]);
    creature.faction = creature.transformed.faction;
    creature.looks = creature.transformed.looks;
    creature.icon = creature.transformed.icon;

    creature.removeBuff("BuffMoonrage");

    creature.energy = 90;
    delete creature.noControl;

    Object.keys(STATS_CHANGE).forEach(stat => {
      creature.stats[stat] -= STATS_CHANGE[stat];
    });

    delete creature.transformed;
  }

  getSimplePayload(creature) {
    const result = super.getSimplePayload(creature);
    delete result.relationship;
    return result;
  }
}
Entity.factory(Werewolf, {
  nameable: true,
  movementDelay: 1,
  dodgeRating: 50,
  defaultArmor: {
    [DAMAGE_TYPES.BLUNT]: 30,
    [DAMAGE_TYPES.SLICE]: 42,
    [DAMAGE_TYPES.PIERCE]: 45,
    [DAMAGE_TYPES.BURN]: -20,
    [DAMAGE_TYPES.VENOM]: -15
  },
  defaultWeapon: [
    {
      name: "Claw",
      damage: {
        [DAMAGE_TYPES.SLICE]: 25,
        [DAMAGE_TYPES.PIERCE]: 20,
        [DAMAGE_TYPES.BLUNT]: 10
      },
      hitChance: 90
    }
  ],
  damageTime: {
    [DAMAGE_TYPES.SLICE]: 3 * HOURS,
    [DAMAGE_TYPES.INTERNAL_DAMAGE]: 4 * HOURS,
    [DAMAGE_TYPES.BLUNT]: 30 * HOURS,
    [DAMAGE_TYPES.VENOM]: 50 * MINUTES,
    [DAMAGE_TYPES.BURN]: 12 * DAYS
  }
});

global.Werewolf = Werewolf;

/****** CURES *******/

class MoonrageCure extends MedicalItem {
  canApplyMedication() {
    return true;
  }

  applyMedication(target, successLevel, physician) {
    let targetName, targetAdj;
    if (target === physician) {
      targetName = `yourself`;
      targetAdj = `you`;
    } else {
      targetName = target.getName();
      targetAdj = `they`;
    }

    if (target.hasBuff(`BuffMoonrageHidden`)) {
      // cure
      target.removeBuff(`BuffMoonrageHidden`, false);
      target.removeBuff(`BuffSomethingHappening1`, false);
      curedBuff.applyBuff(target);
      physician.logging(
        `As you splash ${targetName} with the substance ${targetAdj} release a high-pitched shriek and shake uncontrollably for a moment.`
      );
      if (target !== physician) {
        target.logging(
          `${physician.getName()} splashed you with some substance causing you to release a high-pitched shriek and shake uncontrollably for a moment.`
        );
      }
    } else {
      // backfire
      const bruise = utils.random(15, 30);
      const cut = utils.random(20, 40);
      const internal = utils.random(10, 15);
      const injuries = [
        `bruise ${bruise}`,
        `cut ${cut}`,
        `internal damage ${internal}`
      ].join(", ");
      physician.logging(
        `As you splash ${targetName} with the substance ${targetAdj} seem to be filled with uncontrollable rage ${
          target === physician
            ? "and thrash around violently"
            : "and assault you"
        }. You suffered injuries: ${injuries}.`
      );
      if (target !== physician) {
        target.logging(
          `${physician.getName()} splashed you with some substance which filled with uncontrollable rage and made you to assault them.`
        );
      }
      physician.damageBruised(bruise);
      physician.damageCut(cut);
      physician.damageInternal(internal);
    }
  }
}
Item.itemFactory(MoonrageCure, {
  name: `${name} Cure`,
  icon: `/${ICONS_PATH}/items/alchemy/bottle_02_2_blue.png`,
  order: ITEMS_ORDER.MEDICINE,
  weight: 0.25,
  containerItemType: ClayFlask,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      WolfFang: 3,
      AlchemyIng3_3: 2,
      AlchemyIng3_1: 2,
      ClayFlask: 1
    },
    skill: SKILLS.ALCHEMY,
    skillLevel: 4,
    // toolUtility: TOOL_UTILS.MILLING,
    baseTime: 20 * MINUTES
  },
  maxBatch: 1,
  skillLevel: 0,
  applicationTime: 3 * SECONDS,
  skillGainMultiplier: 10
});

const curedBuff = utils.newClassExtending(`Buff${name}Cured`, Buff);
Object.assign(curedBuff.prototype, {
  name: `${name} Cured`,
  icon: `/${ICONS_PATH}/buffs/grey_wolf_02_healed.png`,
  category: Buff.CATEGORIES.WOUND,
  visible: true,
  duration: 4 * DAYS,
  effects: {
    [BUFFS.MOOD]: -8,
    [BUFFS.PAIN]: 10,
    [BUFFS.STATS.ENDURANCE]: -15,
    [BUFFS.STATS.PERCEPTION]: -10,
    [BUFFS.STATS.INTELLIGENCE]: -5
  }
});
