const Dungeon = require("../../../class/dungeons/dungeon");
require("../../../class/dungeons/monster-den");
require("./notes");

const DISTANCE = {
  NS: 38,
  EW: 44
};

global.LogicalGate = class LogicalGate {
  setToggleElement(element) {
    this.togglesElement = element;
  }

  getToggleElement() {
    return this.togglesElement;
  }
};

global.LogicalGateAnd = class LogicalGateAnd extends LogicalGate {
  constructor(inputsCount) {
    super();
    this.inputsCount = inputsCount;
    this.inputElements = [];
    this.inputSignals = [];
  }

  sendSignal(isOn, sourceObject) {
    if (!this.inputElements.includes(sourceObject)) {
      this.inputElements.push(sourceObject);
    }
    const idx = this.inputElements.indexOf(sourceObject);
    this.inputSignals[idx] = isOn;

    let result = 0;
    this.inputSignals.forEach(value => {
      result += value ? 1 : 0;
    });

    this.getToggleElement().sendSignal(result >= this.inputsCount, this);
  }
};

global.LogicalGateDelay = class LogicalGateDelay extends LogicalGate {
  constructor(delayTime) {
    super();
    this.delayTime = delayTime;
    this.timer = Infinity;
    world.registerCyclable(this);
  }

  sendSignal(isOn) {
    if (isOn) {
      this.timer = this.delayTime;
    } else if (this.timer !== Infinity) {
      this.getToggleElement().sendSignal(false, true);
      this.timer = Infinity;
    }
  }

  cycle(seconds) {
    this.timer -= seconds;
    if (this.timer <= 0) {
      this.getToggleElement().sendSignal(true, this);
      this.timer = Infinity;
    }
  }
};

global.LogicalGateImpulser = class LogicalGateImpulser extends LogicalGate {
  constructor(impulseLength) {
    super();
    this.impulseLength = impulseLength;
    this.timer = 0;
    world.registerCyclable(this);
  }

  sendSignal(isOn) {
    if (isOn) {
      this.getToggleElement().sendSignal(true, this);
      this.timer = this.impulseLength;
    } else if (this.timer !== Infinity) {
      this.getToggleElement().sendSignal(false, true);
      this.timer = Infinity;
    }
  }

  cycle(seconds) {
    this.timer -= seconds;
    if (this.timer <= 0) {
      this.getToggleElement().sendSignal(false, this);
      this.timer = Infinity;
    }
  }
};

global.LogicalGateBuffer = class LogicalGateBuffer extends LogicalGate {
  constructor(delayTime) {
    super();
    this.delayTime = delayTime;
    this.timer = 0;
    world.registerCyclable(this);
  }

  sendSignal(isOn) {
    if (isOn) {
      this.getToggleElement().sendSignal(true, this);
      this.timer = Infinity;
    } else if (this.timer === Infinity) {
      this.timer = this.delayTime;
    }
  }

  cycle(seconds) {
    this.timer -= seconds;
    if (this.timer <= 0) {
      this.getToggleElement().sendSignal(false, true);
      this.timer = Infinity;
    }
  }
};

global.LogicalGateSplitter = class LogicalGateSplitter extends LogicalGate {
  constructor(targetElements) {
    super();
    this.targetElements = targetElements;
  }

  sendSignal(isOn) {
    this.targetElements.forEach(e => e.sendSignal(isOn, this));
  }
};

const isDirection = value => "NSEWUD".split("").includes(value);

module.exports = global.dungeonMaker = {
  place(node, icon, mapGraphic, layout, dungeon, isDen = false, other = {}) {
    dungeon = dungeon || new Dungeon();

    const idCache = {};
    const postRuns = [];

    let dungeonEntranceStructure, dungeonExitStructure;
    const entranceDefinition = { dungeon };
    if (isDen) {
      dungeonEntranceStructure = new MonsterDenEntrance(entranceDefinition);
      dungeonExitStructure = new MonsterDenExit();
    } else if (node) {
      if (icon) {
        entranceDefinition.icon = icon;
      }
      if (mapGraphic) {
        entranceDefinition.mapGraphic = mapGraphic;
      }
      dungeonEntranceStructure = new DungeonEntrance(entranceDefinition);
      dungeonExitStructure = new DungeonExit({
        icon: `/${ICONS_PATH}/structures/dungeon/sgi_23_stairs-${Room.getTimeBase(
          layout.type
        )}.png`
      });
    }
    const room = new Room({
      type: layout.type,
      x: (node || {}).x || other.x || 0,
      y: (node || {}).y || other.y || 0,
      zLevel: world.getNextDungeonLevel()
    });

    dungeon.addNode(room);
    if (layout.relativeId) {
      idCache[layout.relativeId] = room;
    }
    if (layout.after) {
      postRuns.push({
        callback: layout.after,
        room
      });
    }

    if (node) {
      node.addStructure(dungeonEntranceStructure);
      dungeonEntranceStructure.setDungeonEntranceNode(room);

      room.addStructure(dungeonExitStructure);
      dungeonExitStructure.setExitNode(node);

      dungeon.addNode(node);
      new RoomPath({}, node, room);
    }

    dungeonMaker.makeRooms(dungeon, room, layout, idCache, postRuns);
    postRuns.forEach(({ callback, room }) => {
      callback(room, id => idCache[id]);
    });

    return {
      elements: idCache,
      entrance: dungeonEntranceStructure,
      dungeon: dungeon
    };
  },

  destroyDungeon(structure) {
    structure.destroy();
    // TODO
  },

  makeRooms(dungeon, fromNode, layout, idCache = {}, postRuns = []) {
    Object.keys(layout)
      .filter(isDirection)
      .forEach(direction => {
        let x, y;
        let zLevel = fromNode.zLevel;
        switch (direction) {
          case "N":
            x = 0;
            y = -DISTANCE.NS;
            break;
          case "S":
            x = 0;
            y = DISTANCE.NS;
            break;
          case "E":
            x = DISTANCE.EW;
            y = 0;
            break;
          case "W":
            x = -DISTANCE.EW;
            y = 0;
            break;
          case "U":
            x = 0;
            y = 0;
            zLevel += 2;
            break;
          case "D":
            x = 0;
            y = 0;
            zLevel -= 2;
            break;
        }

        const furtherDef = {
          type: layout.type,
          ...layout[direction]
        };

        const roomClass = global[furtherDef.roomClass || "Room"];
        const nextRoom = new roomClass({
          type: layout.type,
          x: fromNode.x + x,
          y: fromNode.y + y,
          zLevel
        });
        dungeon.addNode(nextRoom);

        let path;
        if ((direction === "U" || direction === "D") && !layout.noStairs) {
          const dungeonEntranceStructure = new DungeonEntrance({ dungeon });
          const dungeonExitStructure = new DungeonExit({ dungeon });
          let down, up;
          switch (direction) {
            case "U":
              up = fromNode;
              down = nextRoom;
              break;
            case "D":
              down = fromNode;
              up = nextRoom;
              break;
          }
          down.addStructure(dungeonEntranceStructure);
          dungeonEntranceStructure.setDungeonEntranceNode(up);

          up.addStructure(dungeonExitStructure);
          dungeonExitStructure.setExitNode(down);

          dungeonExitStructure.icon = `/${ICONS_PATH}/structures/dungeon/sgi_23_stairs-${Room.getTimeBase(
            up.type
          )}.png`;
          dungeonEntranceStructure.icon = `/${ICONS_PATH}/structures/dungeon/sgi_23_stairs-${Room.getTimeBase(
            down.type
          )}.png`;
          new RoomPath({}, fromNode, nextRoom);
        } else {
          path = new RoomPath({}, fromNode, nextRoom);
        }

        const doors = furtherDef.door;
        if (doors) {
          let doorClass;
          switch (doors.type) {
            case "metal":
              doorClass = MetalGate;
              break;
            case "wall":
              doorClass = WallDoors;
              break;
            default:
              doorClass = WoodenDoors;
          }
          const doorObject = path.installDoor(doorClass);
          if (doors.opened) {
            doorObject.open();
            doorObject.leaveOpened = true;
          }
          if (doors.locked) {
            doorObject.setLocked(true, doors.keyId, doors.lockLevel);
          }
          if (doors.relativeId) {
            idCache[doors.relativeId] = doorObject;
          }
        }

        if (furtherDef.relativeId) {
          idCache[furtherDef.relativeId] = nextRoom;
        }

        if (furtherDef.pathToId) {
          if (!idCache[furtherDef.pathToId]) {
            console.error(`No such relativeId: ${furtherDef.pathToId}`);
          } else {
            new RoomPath({}, idCache[furtherDef.pathToId], nextRoom);
          }
        }

        if (furtherDef.after) {
          postRuns.push({
            callback: furtherDef.after,
            room: nextRoom
          });
        }

        dungeonMaker.makeRooms(
          dungeon,
          nextRoom,
          furtherDef,
          idCache,
          postRuns
        );
      });
  },

  utils: {
    prisonCell: id => ({
      roomClass: "Tier1_PrisonCell",
      door: {
        relativeId: id,
        type: "metal"
      }
    }),

    prisonCell2: id => ({
      roomClass: "Tier2_PrisonCell",
      door: {
        relativeId: id,
        type: "metal"
      }
    }),

    prisonCell3: id => ({
      roomClass: "Tier3_PrisonCell",
      door: {
        relativeId: id,
        type: "metal"
      }
    }),

    prisonCellSpecialMonster: id => ({
      roomClass: "TierSpecial_PrisonCell_Monster",
      door: {
        relativeId: id,
        type: "metal"
      }
    }),

    lever: (id, dir, resetsIn) => (node, itemGetter) => {
      node.addStructure(
        new Lever({
          roomPlacement: dir,
          togglesElement: itemGetter(id),
          resetsIn
        })
      );
    },

    button: (id, dir, hiddenStructure) => (node, itemGetter) => {
      node.addStructure(
        new DungeonButton({
          roomPlacement: dir,
          togglesElement: itemGetter(id),
          hiddenStructure
        })
      );
    },

    after: (...args) => ({
      after: (node, itemGetter) => {
        args.forEach(a => a(node, itemGetter));
      }
    })
  }
};
