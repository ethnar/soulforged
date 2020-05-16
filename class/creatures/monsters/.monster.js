const Creature = require("../.creature");

const monsterNames = require("./monster-names.js");

const actions = Action.groupById([
  new Action({
    name: "Demolish",
    breaksHiding: true,
    icon: "/actions/icons8-home-sword.png",
    repeatable: false,
    valid(entity, creature) {
      if (entity !== creature) {
        return false;
      }

      if (!creature.getDemolishableBuildings().length) {
        return false;
      }

      return true;
    },
    run(entity, creature, seconds) {
      creature.actionProgress +=
        (seconds * utils.random(50, 150)) / creature.attackDelay;

      if (creature.actionProgress >= 100) {
        creature.actionProgress -= 100;
        const randomBuilding = utils.randomItem(
          creature.getDemolishableBuildings()
        );
        utils.log(
          "Demolisher!",
          creature.getName(),
          randomBuilding.getName(),
          `(${randomBuilding.integrity}%)`
        );
        // 30 day building goes down in 2 hour
        randomBuilding.deteriorate(creature.demolisher * 2 * HOURS);
      }
      return true;
    }
  })
]);

class Monster extends Creature {
  static actions() {
    return { ...actions, ...Creature.actions() };
  }

  static actionPriority() {
    return [
      Monster.prototype.actionPriorities.fight,
      Monster.prototype.actionPriorities.chaser,
      Monster.prototype.actionPriorities.dungeonChaser,
      Monster.prototype.actionPriorities.demolish,
      Monster.prototype.actionPriorities.wander
    ];
  }

  actionPriority() {
    return this.constructor.actionPriority();
  }

  canSeeCreatureDetails() {
    return 6;
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

  baseEfficiency() {
    if (this.painThresholdTiered === undefined) {
      this.painThresholdTiered = 100;
    }
    return (this.painThresholdTiered * 0.95 + 5) / 100;
  }

  getCombatStrength() {
    return (this.baseEfficiency() * this.getBuff(BUFFS.COMBAT_STRENGTH)) / 100;
  }

  getEfficiency() {
    return (this.baseEfficiency() * this.getBuff(BUFFS.ACTION_SPEED)) / 100;
  }

  receiveDamage(damage) {
    this.seenByPlayer = true;
    return super.receiveDamage(damage);
  }

  getPayload(creature, connection) {
    const result = super.getPayload(creature, connection);
    if (result && creature.canSeeCreatureDetails(this) >= 6 && !this.noMood) {
      const moodTiered = this.painThresholdTiered;
      let buff = BuffMoodContent;
      if (moodTiered < 100) {
        const severity = 4 - moodTiered / 25;
        buff = global[`BuffMoodBad${severity}`];
      }
      buff = new buff({}, this).getPayload(creature);
      result.buffs.push(buff);
    }
    return result;
  }

  rattledBy(who, baseTime = 30 * MINUTES) {
    if (this.tamed) {
      return;
    }
    const travelTo = who.getNode();
    const multiplier = baseTime / (30 * MINUTES);
    const attackChance = this.aggressiveness * multiplier;
    const moveChance =
      (10 + this.getPlacementChance(travelTo) * 3) * multiplier;
    let isChasing = false;

    if (
      !this.isDoingAction("Travel") &&
      !this.hasEnemies() &&
      utils.chance(attackChance) &&
      utils.chance(moveChance)
    ) {
      if (!this.chasingFrom) {
        this.chasingFrom = this.getNode();
      }
      this.enraged = this.enraged || 1;
      this.enraged += 0.5;
      this.startAction(travelTo, travelTo.getActionById("Travel"));
      isChasing = true;
    }

    utils.log(
      `Rattling ${this.constructor.name} at ${this.getNode().getEntityId()}, ` +
        `enraged: ${this.enraged}, ` +
        `chasing: ${isChasing}, ` +
        `by ${who.getName()} from ${who.getNode().getEntityId()} ` +
        `with base time ${Math.round(baseTime / MINUTES)}min. ` +
        `Chance to rattle: ${Math.round(attackChance)}. ` +
        `Chance to move: ${Math.round(moveChance)}`
    );
  }

  chaseHostilesInDungeon() {
    let travelTo = this.getNode()
      .getConnectedNodes()
      .filter(n => n instanceof Room)
      .find(node => this.hasEnemies(node));
    if (travelTo) {
      this.chasingEnemy = travelTo
        .getVisibleAliveCreatures()
        .find(c => c.isHostile(this));
    } else if (this.chasingEnemy) {
      if (
        this.chasingEnemy.getNode() instanceof Room &&
        !this.chasingEnemy.isDead() &&
        this.chasingEnemy.isVisible()
      ) {
        travelTo = this.chasingEnemy.getNode();
      } else {
        this.chasingEnemy = null;
      }
    }

    if (travelTo) {
      this.startAction(travelTo, travelTo.getActionById("Travel"));
    }
  }

  gainVeterancyExperience(exp) {
    this.veteranExp = this.veteranExp || 0;
    this.veteranExp += exp;
    this.veteranLevel = this.veteranLevel || 0;

    let needed =
      Math.pow(2, this.veteranLevel) * Math.sqrt(this.getThreatLevel()) * 10;
    if (this.veteranExp > needed) {
      this.veteranLevel += 1;
      utils.log(
        `Monster ${
          this.constructor.name
        } (${this.getEntityId()}) gained veterancy`
      );
      // level up
      this.maxAge = this.maxAge + 30 * this.veteranLevel;
      this.aggressiveness = this.aggressiveness * 1.1;
      if (this.taming) {
        this.tamingSkillLevelMod = (this.tamingSkillLevelMod || 0) + 0.5;
      }
      this.defaultArmor = Object.keys(this.defaultArmor).reduce((acc, type) => {
        acc[type] =
          this.defaultArmor[type] +
          Math.max(this.defaultArmor[type], 0) * 0.02 +
          0.5;
        return acc;
      }, {});

      BuffMonsterVeteran.applyBuff(this);
      if (!this.nickname) {
        world.veteranMonsterNickname = world.veteranMonsterNickname || 0;
        this.nickname =
          monsterNames[world.veteranMonsterNickname % monsterNames.length];
        world.veteranMonsterNickname += 1;
      }

      this.gainVeterancyExperience(0); // To check again
    }
  }

  getName(...args) {
    const base = super.getName(...args);
    if (this.nickname) {
      return `${this.nickname} (${base})`;
    }
    return base;
  }

  getPlacementChance(node) {
    return (
      this.placement &&
      ((this.placement[node.getType()] || 0) +
        (this.placement[this.getNode().getType()] || 0)) /
        2
    );
  }

  static getPlacementChance(node) {
    return this.prototype.placement && this.prototype.placement[node.getType()];
  }

  getTravelSpeed() {
    if (program.dev && debugOption.veryFastEnemies) {
      return debugOption.veryFastEnemies;
    }
    return (
      (super.getTravelSpeed() * (this.enraged || 1) * utils.random(98, 102)) /
      100
    );
  }

  grantSoulXP() {
    const veterancyBuffs = this.getBuffs().filter(
      b => b instanceof BuffMonsterVeteran
    );
    const soulXpValue = this.getThreatLevel() * veterancyBuffs.length;
    if (soulXpValue) {
      const humanoids = this.getValidEnemies().filter(
        c => c instanceof Humanoid
      );
      humanoids.forEach(creature => {
        if (creature.getPlayer() && creature.getPlayer().gainSoulXp) {
          creature
            .getPlayer()
            .gainSoulXp(Math.ceil(soulXpValue / humanoids.length));
        }
      });
    }
  }

  die(reason) {
    if (!this.isDead()) {
      this.grantSoulXP();
      super.die(reason);
      utils.applyLootDrop(this.lootTable, this.getNode());
    }
  }

  move(toNode) {
    if (!this.dead) {
      super.move(toNode);

      this.getNode()
        .getConnectedNodes()
        .forEach(node =>
          node
            .getCreatures()
            .filter(c => !c.isDead())
            .filter(c => c.tamed && c.tamed.owner && !c.tamed.owner.isDead())
            .filter(c => c.tamed.owner.getNode() !== c.getNode())
            .filter(c => c.isHostile(this))
            .filter(c =>
              PetTrainingSystem.getTrainingLevel(c, "warnOfHostiles")
            )
            .forEach(petToWarn => {
              const owner = petToWarn.tamed.owner;
              if (
                petToWarn.getNode().findNearest(
                  node => node === owner.getNode(),
                  () => true,
                  4
                )
              ) {
                owner.logging(
                  `You hear ${utils.thirdPerson(petToWarn.getName())} ${
                    TRAINABLES.warnOfHostiles.soundName[
                      petToWarn.constructor.name
                    ]
                  } in the distance.`
                );
              }
            })
        );
    }
  }

  isDungeonChaser() {
    return this.dungeonChaser;
  }
}

Object.assign(Monster.prototype, {
  nameable: true,
  faction: Faction.getByName("Monster"),
  power: 0,
  maxAge: 8,
  bloodPool: 50,
  aggressiveness: 50,
  actionPriorities: {
    chaser: {
      condition: self => !self.noChase,
      trigger: self => !self.isDoingAction("Travel") && !self.hasEnemies(),
      action: self => {
        global.chasersRegister = global.chasersRegister || {};
        if (global.chasersRegister.time !== world.getCurrentTime()) {
          utils.log("Still waiting to chase:", global.chasersRegister.waiting);
          global.chasersRegister.time = world.getCurrentTime();
          global.chasersRegister.counts = 0;
          global.chasersRegister.waiting = 0;
        }

        if (global.chasersRegister.counts > 4) {
          global.chasersRegister.waiting++;
          return;
        }
        global.chasersRegister.counts++;

        const travelTo = self
          .getNode()
          .findNearest(node => self.hasEnemies(node) || self.hasUnknowns(node));

        if (!travelTo) {
          self.noChase = true;
          return;
        }

        self.startAction(travelTo, travelTo.getActionById("Travel"));
        self.continueAction(1);
        if (!self.isDoingAction("Travel")) {
          self.noChase = true;
        }
      }
    },
    petFight: {
      condition: self =>
        !self.isDoingAction("Travel") &&
        (self.isDoingAction("Fight") || self.hasEnemies()),
      trigger: self => !self.isDoingAction("Fight"),
      action: self => {
        self.removeBuff(`BuffHiding`);
        self.startAction(self, self.getActionById("Fight"));
      }
    },
    fight: {
      condition: self => self.isDoingAction("Fight") || self.hasEnemies(),
      trigger: self => !self.isDoingAction("Fight"),
      action: self => {
        self.removeBuff(`BuffHiding`);
        self.startAction(self, self.getActionById("Fight"));
      }
    },
    demolish: {
      condition: self =>
        self.isDoingAction("Demolish") ||
        (self.demolisher && self.getDemolishableBuildings().length),
      trigger: self => !self.isDoingAction("Demolish"),
      action: self => self.startAction(self, self.getActionById("Demolish"))
    },
    wander: {
      condition: self =>
        !self.hasEnemies() &&
        (self.isDoingAction("Travel") || self.movementDelay),
      trigger: self => !self.isDoingAction("Travel"),
      action: (self, seconds) => self.wanderRandomly(seconds)
    },
    dungeonChaser: {
      condition: self =>
        (self.isDungeonChaser() && !self.hasEnemies()) ||
        self.isDoingAction("Travel"),
      trigger: self => !self.isDoingAction("Travel"),
      action: self => self.chaseHostilesInDungeon()
    },
    coward: {
      condition: self =>
        self.isDoingAction("Travel") ||
        (self.painThreshold <= 40 && self.hasEnemies()),
      trigger: self => !self.isDoingAction("Travel"),
      action: self => self.moveRandomly()
    }
  }
});
module.exports = global.Monster = Monster;
