require("./action");
const server = require("../singletons/server");
const Entity = require("./.entity");

class Duel extends Entity {
  constructor(args) {
    super(args);
    this.parties = [args.challenged, args.startedBy];
    this.accepted = {};
    this.markAccepted(args.startedBy);
    const id = Duel.getDuelId(...this.parties);
    world.duels[id] = this;
    args.challenged.logging(
      `${args.startedBy.name} has challenged you to a duel.`
    );
  }

  involves(creature) {
    return this.parties.includes(creature);
  }

  messageParties(messageCallback, level) {
    this.parties.forEach(party => {
      const other = this.getOtherParty(party);
      party.logging(messageCallback(party, other), level);
    });
  }

  destroy(args) {
    this.duelIsOn = false;
    const id = Duel.getDuelId(...this.parties);
    delete world.duels[id];
    this.parties.forEach(c => c.getNode().everyoneCheckForEnemies());
    super.destroy(args);
  }

  hasAccepted(creature) {
    return this.accepted[creature.getEntityId()];
  }

  markAccepted(creature) {
    this.accepted[creature.getEntityId()] = true;

    const other = this.getOtherParty(creature);
    if (this.accepted[other.getEntityId()]) {
      other.logging(`${creature.name} has accepted duel request.`);
      this.startDuel();
    }
  }

  markUnaccepted(creature) {
    this.accepted[creature.getEntityId()] = false;

    const other = this.getOtherParty(creature);
    if (!this.accepted[other.getEntityId()]) {
      if (this.isOn()) {
        this.messageParties(
          (creature, other) => `Duel with ${other.name} has ended.`,
          LOGGING.GOOD
        );
      } else {
        other.logging(`Duel request from ${creature.name} was withdrawn.`);
      }
      this.destroy();
    } else {
      other.logging(`${creature.name} has requested to end the duel.`);
    }
  }

  isOn() {
    return this.duelIsOn;
  }

  startDuel() {
    this.duelIsOn = true;
    this.parties.forEach(c => c.getNode().everyoneCheckForEnemies());
    this.parties.forEach(c => {
      const other = this.parties.find(p => p !== c);
      const buff = c.buffs.find(
        b => b.category === Buff.CATEGORIES.INTERACTION && b.source === other
      );
      if (buff) {
        c.removeBuff(buff);
        c.recalculateInteractions();
      }
    });
  }

  getOtherParty(creature) {
    return this.parties.find(c => c !== creature);
  }

  checkForDeaths() {
    if (this.parties.find(c => c.isDead())) {
      this.destroy();
    }
  }

  static getDuelId(c1, c2) {
    let small, big;
    const c1Id = c1.getEntityId();
    const c2Id = c2.getEntityId();
    if (c1Id < c2Id) {
      small = c1Id;
      big = c2Id;
    } else {
      big = c1Id;
      small = c2Id;
    }
    const result = `[${small},${big}]`;
    return result;
  }

  static getDuelObject(c1, c2) {
    const id = Duel.getDuelId(c1, c2);
    return world.duels[id];
  }

  static areDueling(c1, c2) {
    const duel = Duel.getDuelObject(c1, c2);
    if (duel) {
      duel.checkForDeaths();
      return duel.duelIsOn;
    }
    return false;
  }
}
module.exports = global.Duel = Duel;

Duel.issueDuelAction = new Action({
  name: "Duel",
  icon: "/actions/icons8-sword-100.png",
  notification: false,
  repeatable: false,
  secondaryAction: true,
  quickAction: true,
  dynamicLabel: (target, creature) => {
    const duel = Duel.getDuelObject(target, creature);
    if (!duel) {
      return "Challenge to a Duel";
    }
    if (duel.isOn()) {
      if (duel.hasAccepted(creature)) {
        return "Request Duel End";
      } else {
        return "Cancel Request to End Duel";
      }
    }
    if (duel.hasAccepted(creature)) {
      return "Cancel Challenge";
    } else {
      return "Accept Duel Challenge";
    }
  },
  valid(target, creature) {
    if (target === creature) {
      return false;
    }
    if (creature.isHostile(target) && !Duel.areDueling(target, creature)) {
      return false;
    }
    if (!target.isPlayableCharacter() && !(target instanceof Admin)) {
      return false;
    }
    if (target.isDead()) {
      return false;
    }
    return true;
  },
  run(target, creature) {
    const duel = Duel.getDuelObject(target, creature);
    if (!duel) {
      new Duel({
        startedBy: creature,
        challenged: target
      });
      return false;
    }
    if (duel.hasAccepted(creature)) {
      duel.markUnaccepted(creature);
    } else {
      duel.markAccepted(creature);
    }
    return false;
  }
});
