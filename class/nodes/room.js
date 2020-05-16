const Node = require("./node");

const actions = {};

class Room extends Node {
  static actions() {
    return { ...actions, ...Node.actions() };
  }

  constructor(args) {
    super(args);

    this.openings = {};
    this.spawn();
  }

  getBuffs() {
    return {
      [BUFFS.HIDING_TIME]: -100,
      [BUFFS.FLEE_AVOIDANCE]: -100,
      [BUFFS.FLEE_TIME]: 20
    };
  }

  addConnection(path) {
    super.addConnection(path);

    const theOther = path.getOtherNode(this);

    if (theOther instanceof Room && this.zLevel === theOther.zLevel) {
      if (theOther.x === this.x) {
        this.openings[theOther.y < this.y ? "N" : "S"] = true;
      } else {
        this.openings[theOther.x < this.x ? "W" : "E"] = true;
      }
    }
  }

  getTravelDifficulty() {
    return -1;
  }

  getImageFilesStack(creature) {
    const tileInfo = creature.getNodeInfo(this);
    const imageFiles = [];
    const imagesFromBuildings = {};

    const tilesBase = Room.getTimeBase(tileInfo.type);

    [...this.getCompleteStructures(), this].forEach(s => {
      if (s.mapGraphic) {
        const graphics =
          typeof s.mapGraphic === "function"
            ? s.mapGraphic(this, s, tilesBase)
            : s.mapGraphic;
        Object.keys(graphics).forEach(prio => {
          imagesFromBuildings[prio] = imagesFromBuildings[prio] || [];
          imagesFromBuildings[prio].push(graphics[prio]);
        });
      }
    });

    imageFiles.push(
      this.oneOfImage(
        `tiles/dungeon/${tilesBase}/base_floor01.png`,
        `tiles/dungeon/${tilesBase}/base_floor02.png`,
        `tiles/dungeon/${tilesBase}/base_floor03.png`
      )
    );
    imageFiles.push(`tiles/dungeon/${tilesBase}/base_walls.png`);
    ["N", "S", "W", "E"].forEach(dir => {
      if (this.openings[dir]) {
        imageFiles.push(`tiles/dungeon/${tilesBase}/${dir}.png`);
      }
    });

    for (let i = 1; i <= 10; i += 1) {
      if (imagesFromBuildings[i]) {
        imagesFromBuildings[i].forEach(img => imageFiles.push(img));
      }
    }

    if (this.items.length) {
      imageFiles.push(`tiles/dungeon/inventory.png`);
    }

    return imageFiles;
  }

  static getTimeBase(type) {
    switch (type) {
      case NODE_TYPES.ROOM_CAVE:
        return "clay";
      case NODE_TYPES.ROOM_CLAY:
        return "clay";
      case NODE_TYPES.ROOM_DARK_STONE:
        return "dark";
      case NODE_TYPES.ROOM_GREY_STONE:
        return "grey";
      case NODE_TYPES.ROOM_LIGHT_STONE:
        return "light";
      case NODE_TYPES.ROOM_DEN:
        return "den";
      default:
        console.warn("Tile type not identified:", type);
        break;
    }
  }

  cleanup() {
    [...this.getCreatures()].forEach(c => {
      if (c.dungeonCreep) {
        c.annihilate();
      }
    });
    [...this.getItems()].forEach(i => i.destroy());
  }

  everyoneCheckForEnemies() {
    super.everyoneCheckForEnemies();
    if (this.dungeon) {
      this.dungeon.characterDied();
    }
  }

  spawn() {
    utils.applyLootDrop(this.lootTable, this);
    if (this.monstersTable) {
      utils.applySpawnTable(this.monstersTable, this, [
        c => (c.dungeonCreep = true),
        c => {
          c.dungeonCreep = true;
          c.dungeonChaser = true;
        }
      ]);
    }
  }

  reset() {
    this.cleanup();
    this.resetStructures();
    this.spawn();
  }

  resetStructures() {
    this.getAllStructures().forEach(s => {
      if (s.dungeonReset) {
        s.dungeonReset();
      }
    });
  }

  blocksVision() {
    return true;
  }

  getViewRangeModifier(range) {
    return 0;
  }
  increaseTraverseFrequency() {}
  reduceTravFreq() {}
}
Object.assign(Room.prototype, {
  travelSkill: null,
  icon: `/${ICONS_PATH}/sgi_86.png`,
  threatLevel: [0, 0],
  monsters: [],
  lootTable: {}
});

module.exports = global.Room = Room;
