const Monster = require("../.monster");
require("../../../../singletons/systems/pet-training-system");

const actions = Action.groupById(PetTrainingSystem.actions);

class Predator extends Monster {
  static actions() {
    return { ...actions, ...Monster.actions() };
  }

  getTamingSkillLevel() {
    return this.taming.skillLevel + (this.tamingSkillLevelMod || 0);
  }

  static actionPriority() {
    return [
      Monster.prototype.actionPriorities.fight,
      Monster.prototype.actionPriorities.chaser,
      Monster.prototype.actionPriorities.dungeonChaser,
      Monster.prototype.actionPriorities.wander
    ];
  }

  actionPriority() {
    if (this.tamed) {
      return [
        Predator.prototype.actionPriorities.stayHidden,
        Predator.prototype.actionPriorities.stopHiding,
        Monster.prototype.actionPriorities.petFight
      ];
    }
    return super.actionPriority();
  }

  cycle(seconds) {
    if (!this.isDead() && this.tamed) {
      this.gettingHungry(seconds);
    }

    super.cycle(seconds); // updates pains and wounds

    if (!this.isDead() && this.tamed) {
      this.updateStatusBuffs();
      if (!this.currentAction) {
        this.startAction(this, this.getActionById("Sleep"));
      }

      if (this.malnourished > 50) {
        this.turnWild();
        return;
      }

      if (this.taming.tamedCycle) {
        this.taming.tamedCycle(this, seconds);
      }

      if (this.satiated < 65 && TimeCheck.timesADay(6, seconds)) {
        this.feedOffTheGround();
      }
    }
  }

  getPayload(creature, connection) {
    const result = super.getPayload(creature, connection);
    if (this.tamed && result && this.tamed.owner === creature) {
      if (connection.creatureDetailsId === this.id) {
        result.trainings = PetTrainingSystem.getTrainingsPayload(this);
        result.bondLevel = PetTrainingSystem.getBondLevelName(
          PetTrainingSystem.getCurrentOwnerBondLevel(this)
        );
      }
    }
    return result;
  }

  feedOffTheGround() {
    const foodName = global[this.taming.food].name;
    const nutrition = global[foodName].prototype.nutrition;

    while (this.satiated + nutrition <= 100) {
      let toDestroy = this.getNode().items.find(
        item => item.constructor.name === foodName
      );
      if (!toDestroy) {
        break;
      }
      if (toDestroy.qty > 1) {
        toDestroy = toDestroy.split(1);
      }
      toDestroy.destroy();

      this.satiated += nutrition;
    }
  }

  getOwner() {
    return this.tamed && this.tamed.owner;
  }

  turnTamed(newOwner) {
    this.faction = newOwner.getFaction().getName();
    this.satiated = 75;
    this.tamed = {
      owner: newOwner,
      following: true,
      aggressive: false,
      nextInteraction: world.getCurrentTime().getTime()
    };

    if (this.nickname) {
      this.name = this.nickname;
      delete this.nickname;
    }

    this.getBuffs()
      .filter(b => b instanceof BuffTaming)
      .forEach(b => this.removeBuff(b));
  }

  turnWild() {
    if (this.getNode() === this.tamed.owner.getNode()) {
      this.tamed.owner.logging(
        `${this.getName()} has turned wild due to hunger!`,
        LOGGING.FAIL
      );
    }
    this.tamed = null;
    delete this.faction;
    this.removeBuffsByCategory(Buff.CATEGORIES.STATUS);
    const runAwayTo = this.getNode().findNearest(
      node => !this.hasEnemies(node),
      () => true,
      3
    );
    if (runAwayTo) {
      this.move(runAwayTo);
    }
  }

  tryNuzzle(chance, buff, message, seconds) {
    chance =
      chance *
      (1 + PetTrainingSystem.getTrainingLevel(this, "nuzzleOften") * 0.3);
    const owner = this.getOwner();
    if (
      owner &&
      TimeCheck.onTheHour(seconds) &&
      utils.chance(chance) &&
      owner.getNode() === this.getNode() &&
      !owner.isDoingAction("Sleep") &&
      !owner.isDoingAction("Fight")
    ) {
      owner.logging(message, LOGGING.GOOD);
      buff.applyBuff(this.getOwner());
    }
  }

  leaveDroppings(chance, seconds) {
    const owner = this.getOwner();
    const home = owner.getHome(this.getNode());
    if (owner && home) {
      chance =
        (chance *
          (3 - PetTrainingSystem.getTrainingLevel(this, "stopPooping"))) /
        3;
      if (chance && TimeCheck.onTheHour(seconds) && utils.chance(chance)) {
        if (owner.getNode() === this.getNode()) {
          owner.logging(
            `${this.getName()} has left some droppings in your house.`,
            LOGGING.WARN
          );
        }
        home.addItemByType(AnimalDroppings);
      }
    }
  }

  wanderOff(chance, seconds) {
    chance =
      (chance *
        (3 - PetTrainingSystem.getTrainingLevel(this, "stopWandering"))) /
      3;
    if (chance && TimeCheck.onTheHour(seconds) && utils.chance(chance)) {
      FollowSystem.stopFollowing(this);
      this.moveRandomly(true);
      this.getOwner().logging(
        `It seems ${this.getName()} decided to wander about.`
      );
    }
  }

  doHunting(seconds) {
    if (TimeCheck.onTheHour(seconds) && utils.chance(8)) {
      let resourceToHunt;
      utils
        .randomizeArray(Object.keys(PET_HUNTS))
        .filter(trainableId =>
          PetTrainingSystem.getTrainingLevel(this, trainableId)
        )
        .find(trainableId =>
          this.getNode().findNearest(
            node => {
              return (
                (resourceToHunt = node.hasResource(
                  PET_HUNTS[trainableId].animals
                )) &&
                resourceToHunt.getSize() &&
                resourceToHunt.isVisible()
              );
            },
            () => true,
            2
          )
        );

      if (resourceToHunt) {
        const produce = new (resourceToHunt.getProduce(this))();
        resourceToHunt.useUpResource(1);
        const owner = this.getOwner();
        let message = `${this.getName()} went out to hunt down a ${produce
          .getName()
          .replace(" (corpse)", "")} `;
        if (
          owner &&
          !owner.isDead() &&
          owner.getNode() === this.getNode() &&
          produce.weight < owner.getCarryCapacity() / 2 - owner.getItemsWeight()
        ) {
          owner.addItem(produce);
          message += ` and they brought it to you.`;
        } else {
          this.getNode().addItem(produce);
          message += ` and they left it on the ground for you.`;
        }
        if (owner.getNode() === this.getNode()) {
          owner.logging(message, LOGGING.GOOD);
        }
      }
    }
  }
}

Object.assign(Predator.prototype, {
  // faction: Faction.getByName("Predator"),
  actionPriorities: {
    stopHiding: {
      condition: self => self.isProtected() && !self.tamed.owner.isProtected(),
      trigger: self => true,
      action: self => {
        self.removeBuff(`BuffHiding`);
      }
    },
    stayHidden: {
      condition: self =>
        self.tamed.owner.getNode() === self.getNode() &&
        self.tamed.owner.isProtected(),
      trigger: self => {
        if (self.isDoingAction("Fight")) {
          self.stopAction();
        }
        return !self.isProtected();
      },
      action: self => {
        self.addBuff(BuffHiding);
      }
    },
    stay: {
      condition: self =>
        self.isDoingAction("Travel") &&
        self.tamed.owner.getNode() === self.getNode() &&
        !self.tamed.owner.isDoingAction("Travel"),
      trigger: self => true,
      action: self => {
        self.stopAction();
      }
    },
    simpleFollow: {
      condition: self => self.tamed.owner.getNode() !== self.getNode(),
      trigger: self =>
        !self.isDoingAction("Travel") ||
        self.travelQueue[self.travelQueue.length - 1] !==
          self.tamed.owner.getNode(),
      action: self => {
        const owner = self.tamed.owner;
        const travelTo = owner.getNode();
        self.startAction(travelTo, travelTo.getActionById("Travel"));
      }
    },
    follow: {
      condition: self =>
        (!self.tamed.owner.isDoingAction("Travel") &&
          self.tamed.owner.getNode() !== self.getNode()) ||
        (self.tamed.owner.isDoingAction("Travel") &&
          self.tamed.owner.getActionTarget() !== self.getNode()),
      trigger: self => !self.isDoingAction("Travel"),
      action: self => {
        const owner = self.tamed.owner;
        const travelTo = owner.isDoingAction("Travel")
          ? owner.getActionTarget()
          : owner.getNode();
        self.startAction(travelTo, travelTo.getActionById("Travel"));
      }
    }
  }
});
module.exports = global.Predator = Predator;

const poopActions = Action.groupById([
  new Action({
    name: "Clean up",
    icon: "/actions/icons8-broom-100.png",
    valid(item, creature) {
      if (!creature.hasItem(item)) {
        return false;
      }
      return true;
    },
    run(item, creature, seconds) {
      if (creature.progressingAction(seconds, 30 * MINUTES)) {
        if (item.qty > 1) {
          item = item.split(1);
        }
        item.destroy();
        return ACTION.FINISHED;
      }
      return ACTION.CONTINUE;
    }
  })
]);
class AnimalDroppings extends ExpirableItem {
  static actions() {
    return poopActions;
  }

  static getTradeId() {
    return null;
  }

  getTradeId() {
    return null;
  }
}
Entity.factory(AnimalDroppings, {
  name: "Animal droppings",
  expiresIn: 8 * DAYS,
  expiresInto: {},
  order: ITEMS_ORDER.CRITICAL,
  nonResearchable: true,
  icon: SCOUTER_MESSAGES.ANIMAL_POO.icon
});
