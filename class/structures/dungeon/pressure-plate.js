const Structure = require("../.structure");

class DungeonPressurePlate extends Structure {
  constructor(args) {
    super(args);
    this.isOn = false;
  }

  toggleOn() {
    if (this.togglesElement && !this.isOn) {
      this.isOn = true;
      this.togglesElement.sendSignal(this.isOn, this);
    }
  }

  toggleOff() {
    if (this.togglesElement && this.isOn) {
      this.isOn = false;
      this.togglesElement.sendSignal(this.isOn, this);
    }
  }

  dungeonReset() {
    this.isOn = false;
    if (this.togglesElement) {
      this.togglesElement.sendSignal(false, this);
    }
  }

  cycle(seconds) {
    if (this.getNode().getCreatures().length) {
      this.toggleOn();
    } else {
      this.toggleOff();
    }
  }
}
Object.assign(DungeonPressurePlate.prototype, {
  name: "Pressure plate",
  unlisted: true,
  icon: `/${ICONS_PATH}/structures/dungeon/sgi_86_button.png`,
  mapGraphic: (node, structure, tilesBase) => {
    return {
      5: `tiles/dungeon/rooms/${tilesBase}-pressure-plate.png`
    };
  }
});

module.exports = global.DungeonPressurePlate = DungeonPressurePlate;
