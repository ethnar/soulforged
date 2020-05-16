const Structure = require("../../.structure");

const actions = Action.groupById([
  new Action({
    name: "Open",
    icon: "/actions/icons8-open-door-filled-100.png",
    quickAction: true,
    notification: false,
    repeatable: false,
    notAllowedInCombat: true,
    valid(entity, creature) {
      if (!entity.getPath()) {
        return false;
      }
      if (!entity.getPath().hasNode(creature.getNode())) {
        return false;
      }
      if (!entity.isClosed()) {
        return false;
      }
      return true;
    },
    runCheck(entity, creature) {
      if (entity.locked) {
        return `It's locked shut.`;
      }
      return true;
    },
    run(entity, creature, seconds) {
      entity.open();
      return false;
    }
  }),
  new Action({
    name: "Close",
    icon: "/actions/icons8-door-closed-filled-100.png",
    quickAction: true,
    notification: false,
    repeatable: false,
    valid(entity, creature) {
      if (!entity.getPath()) {
        return false;
      }
      if (!entity.getPath().hasNode(creature.getNode())) {
        return false;
      }
      if (entity.isClosed()) {
        return false;
      }
      return true;
    },
    runCheck(entity, creature) {
      if (entity.locked) {
        return `It's stuck open`;
      }
      return true;
    },
    run(entity, creature, seconds) {
      entity.close();
      return false;
    }
  })
]);

class Doors extends Structure {
  static actions() {
    return actions;
  }

  constructor(args) {
    super(args);
    this.doorsClosed = true;
  }

  getPath() {
    return this.path;
  }

  getName(creature, node) {
    const base = super.getName(creature);
    if (!node) {
      return base;
    }
    let direction;
    switch (true) {
      case this.nodeNorth === node:
        direction = "South";
        break;
      case this.nodeSouth === node:
        direction = "North";
        break;
      case this.nodeWest === node:
        direction = "East";
        break;
      case this.nodeEast === node:
        direction = "West";
        break;
    }
    return `${base} - ${direction}`;
  }

  sendSignal(signal) {
    if (signal) {
      this.open();
    } else {
      this.close();
    }
  }

  open() {
    this.doorsClosed = false;
  }

  close() {
    if (!this.isClosed()) {
      this.doorsClosed = world.getCurrentTime().toString();
    }
  }

  dungeonReset() {
    if (this.leaveOpened) {
      this.open();
    } else {
      this.close();
    }
  }

  isClosed() {
    return !!this.doorsClosed;
  }

  isBlockingPath() {
    return !!this.doorsClosed;
  }

  isBlockingVision() {
    if (this.doorsClosed.toString() === world.getCurrentTime().toString()) {
      return false;
    }
    return !!this.doorsClosed;
  }

  getPayload(creature, node) {
    const result = super.getPayload(creature, node);
    if (result) {
      result.roomPlacement = Doors.getDirection(this, node);
    }
    return result;
  }

  static getDirection(structure, node) {
    switch (true) {
      case structure.nodeNorth === node:
        return "S";
      case structure.nodeSouth === node:
        return "N";
      case structure.nodeWest === node:
        return "E";
      case structure.nodeEast === node:
        return "W";
    }
  }
}

module.exports = global.Doors = Doors;
