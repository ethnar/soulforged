const Structure = require("../.structure");
const Action = require("../../action");
const server = require("../../../singletons/server");

class DungeonPitfall extends Structure {
  static actions() {
    return {};
  }

  getDropNode() {
    return this.dropNode;
  }

  setDropNode(node) {
    this.dropNode = node;
  }

  dungeonReset() {
    if (this.leaveOpened) {
      this.open();
    } else {
      this.close();
    }
  }

  cycle(seconds) {
    if (this.dropNode && this.isOpened()) {
      [...this.getNode().getCreatures()].forEach(c => {
        c.move(this.dropNode);
        const bruise = utils.random(1, 17);
        c.damageBruised(bruise);
        c.logging(
          `You fell down the pit! You suffered an injury (bruise ${bruise})`,
          LOGGING.FAIL
        );
      });
    }
  }

  sendSignal(signal) {
    if (signal) {
      this.open();
    } else {
      this.close();
    }
  }

  open() {
    this.opened = true;
  }

  close() {
    this.opened = false;
  }

  isOpened() {
    return this.opened;
  }
}
Object.assign(DungeonPitfall.prototype, {
  name: "Pitfall",
  unlisted: true,
  mapGraphic: (node, structure, tilesBase) => {
    if (!(node instanceof Room)) {
      return {};
    }
    if (!structure.isOpened()) {
      return {};
    }
    return {
      2: `tiles/dungeon/rooms/pitfall-${tilesBase}.png`
    };
  }
});

module.exports = global.DungeonPitfall = DungeonPitfall;
