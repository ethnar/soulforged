const Entity = require("../.entity");

class Event extends Entity {
  constructor(args) {
    super(args);
    this.expiresIn = this.eventDuration;
  }

  getPayload(creature) {
    const result = {
      name: this.name,
      icon: this.getIcon(creature),
      plotText: this.plotText
    };
    if (this.includeMinutesLeft) {
      result.minutesLeft = Math.floor(this.expiresIn / MINUTES);
    }
    return result;
  }

  cycle(seconds) {
    this.expiresIn -= seconds;
    if (this.expiresIn <= 0) {
      world.finishEvent(this);
    }
  }

  static isTheTimeRight(seconds) {
    if (!this.prototype.checkEventTiming) {
      return false;
    }
    return this.prototype.checkEventTiming(seconds);
  }

  static triggerCondition() {
    return (
      !this.prototype.triggerCondition || this.prototype.triggerCondition()
    );
  }

  static getEventChance() {
    return this.prototype.eventChance || 0;
  }
}

class WorldEvent extends Event {
  visibilityCondition(creature) {
    return creature.isOnMainland;
  }
}

global.WorldEvent = WorldEvent;
module.exports = global.Event = Event;
