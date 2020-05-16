const Structure = require("../.structure");

const actions = Action.groupById([
  new Action({
    name: "Pull",
    icon: "/actions/icons8-so-so-100.png",
    quickAction: true,
    notification: false,
    repeatable: false,
    notAllowedInCombat: true,
    valid(entity, creature) {
      if (entity.getNode() !== creature.getNode()) {
        return false;
      }
      return true;
    },
    run(entity, creature, seconds) {
      entity.toggle();
      return false;
    }
  })
]);

class Lever extends Structure {
  static actions() {
    return actions;
  }

  constructor(args) {
    super(args);
    this.isOn = false;
    if (this.resetsIn) {
      this.timer = Infinity;
      world.registerCyclable(this);
    }
  }

  toggle() {
    this.isOn = !this.isOn;
    if (this.togglesElement) {
      this.togglesElement.sendSignal(this.isOn, this);
    }
    if (this.isOn && this.resetsIn) {
      this.timer = this.resetsIn;
    } else {
      this.timer = Infinity;
    }
  }

  dungeonReset() {
    if (this.isOn) {
      this.toggle();
    }
  }

  cycle(seconds) {
    this.timer -= seconds;
    if (this.timer <= 0) {
      this.isOn = false;
      this.timer = Infinity;
      this.togglesElement.sendSignal(false, this);
    }
  }

  getName(creature, node) {
    const base = super.getName(creature);
    if (!node) {
      return base;
    }
    let direction;
    switch (true) {
      case this.roomPlacement === "S":
        direction = "South";
        break;
      case this.roomPlacement === "N":
        direction = "North";
        break;
      case this.roomPlacement === "E":
        direction = "East";
        break;
      case this.roomPlacement === "W":
        direction = "West";
        break;
    }
    return `${base} - ${direction}`;
  }
}
Object.assign(Lever.prototype, {
  name: "Lever",
  icon: `/${ICONS_PATH}/structures/dungeon/en_craft_32.png`,
  mapGraphic: (node, structure, tilesBase) => {
    const dir = structure.roomPlacement;
    return {
      1: `tiles/dungeon/lever_${structure.isOn ? "on" : "off"}_${dir}.png`
    };
  }
});

module.exports = global.Lever = Lever;
