const Unliving = require("../.unliving");

const actions = Action.groupById([
  new Action({
    name: "Start training",
    icon: "/actions/icons8-sword-100.png",
    notification: false,
    repeatable: false,
    valid(target, creature) {
      if (!creature.isPlayableCharacter()) {
        return false;
      }
      if (creature.isDoingAction("Fight")) {
        return false;
      }
      if (target.isDead()) {
        return false;
      }
      return true;
    },
    run(target, creature) {
      if (!Duel.areDueling(creature, target)) {
        const duel = new Duel({
          startedBy: creature,
          challenged: target
        });
        duel.startDuel();
      }
      const interval = setInterval(() => {
        if (!creature.isDoingAction("Sleep")) {
          clearInterval(interval);
          utils.log("Cleared interval", interval);
        }
        creature.startAction(creature, creature.getActionById("Fight"));
      }, 1000);
      utils.log("Started interval", interval);
      return false;
    }
  }),
  new Action({
    name: "Stop training",
    icon: "/actions/icons8-so-so-100.png",
    notification: false,
    repeatable: false,
    quickAction: true,
    valid(target, creature) {
      if (!creature.isPlayableCharacter()) {
        return false;
      }
      if (!creature.isHostile(target)) {
        return false;
      }
      if (target.isDead()) {
        return false;
      }
      return true;
    },
    run(target, creature) {
      const duel = Duel.getDuelObject(target, creature);
      duel.destroy();
      return false;
    }
  })
]);
const itemActions = Action.groupById([
  new Action({
    name: "Deploy",
    icon: "/actions/icons8-so-so-100.png",
    notification: false,
    valid(item, creature) {
      if (!creature.hasItem(item)) {
        return false;
      }
      return true;
    },
    run(item, creature) {
      creature.getNode().addCreature(new item.trainingDummyCreature());
      item.useUpItem();
      return false;
    }
  })
]);

class TrainingDummy extends Unliving {
  static actions() {
    return actions;
  }

  getChallengeLevel() {
    return this.trainingLevel;
  }

  exchangeBlows() {}

  attack() {
    return null;
  }

  cycle(seconds) {
    if (this.isDead()) {
      return;
    }
    this.recalculateBuffs();
    this.checkInternalDamage(seconds);
  }

  getScouter() {
    return 6;
  }
}

Object.assign(TrainingDummy.prototype, {
  nameable: false,
  name: "?TrainingDummy?",
  faction: Faction.getByName("TrainingDummies"),
  threatLevel: 0,
  trainingLevel: 1,
  butcherable: false,
  noMood: true,
  damageTime: {
    [DAMAGE_TYPES.INTERNAL_DAMAGE]: Infinity
  },
  thermalRange: {
    min: -50,
    max: 8
  },
  scouterMessages: [SCOUTER_MESSAGES.NONE]
});

class TrainingDummyItem extends Item {
  static actions() {
    return { ...itemActions, ...Item.actions() };
  }
}
Item.itemFactory(TrainingDummyItem, {
  name: "?TrainingDummy?",
  order: ITEMS_ORDER.OTHER,
  weight: 10
});

module.exports = global.TrainingDummy = TrainingDummy;
