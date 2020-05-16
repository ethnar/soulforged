const dungeonMaker = require("./dungeon-maker");
const riddles = require("./riddles");
const { lever, after } = dungeonMaker.utils;

const south4 = col => ({
  relativeId: `room-1-${col}`,
  S: {
    relativeId: `room-2-${col}`,
    ...(col > 1 ? { pathToId: `room-2-${col - 1}` } : {}),
    S: {
      relativeId: `room-3-${col}`,
      ...(col > 1 ? { pathToId: `room-3-${col - 1}` } : {}),
      S: {
        relativeId: `room-4-${col}`,
        ...(col > 1 ? { pathToId: `room-4-${col - 1}` } : {}),
        S: {
          relativeId: `room-5-${col}`,
          ...(col > 1 ? { pathToId: `room-5-${col - 1}` } : {})
        }
      }
    }
  }
});

module.exports = self = {
  place() {
    const wisdomTestLayout = {
      relativeId: "entrance",
      type: NODE_TYPES.ROOM_GREY_STONE,
      ...after(lever("firstDoor", "E")),
      E: {
        after: (node, itemGetter) => {
          const pit = new DungeonPitfall();
          node.addStructure(pit);
          pit.open();
          pit.leaveOpened = true;
          pit.setDropNode(itemGetter("room-1-1"));
        },
        door: {
          relativeId: "firstDoor",
          type: "metal"
        },
        E: {
          door: {
            opened: true,
            type: "metal"
          }
        },
        noStairs: true,
        D: {
          ...south4(1),
          E: {
            ...south4(2),
            E: {
              ...south4(3),
              E: {
                ...south4(4),
                E: {
                  ...south4(5)
                }
              }
            }
          }
        }
      }
    };
    const { dungeon, elements } = dungeonMaker.place(
      null,
      null,
      null,
      wisdomTestLayout,
      undefined,
      false,
      { x: world.trialDungeon.entrance.x, y: world.trialDungeon.entrance.y }
    );

    for (let x = 1; x <= 5; x += 1) {
      for (let y = 1; y <= 5; y += 1) {
        const room = elements[`room-${x}-${y}`];
        room
          .getConnections()
          .filter(path => path.getOtherNode(room).zLevel === room.zLevel)
          .forEach(path => {
            if (!path.getDoors()) {
              const doorObject = path.installDoor(MetalGate);
              doorObject.open();
              doorObject.leaveOpened = true;
            }
          });
      }
    }

    return {
      dungeon,
      elements: {
        ...elements,
        "start-location": elements["room-1-1"]
      }
    };
  },

  afterPlace() {
    self.scrambleRooms();

    const finalRoom = world.trialDungeonRun.dungeonElements["room-5-5"];
    finalRoom.addStructure(
      new DungeonTrialExitRune({
        roomPlacement: "E"
      })
    );

    world.trialDungeonRun.state = 0;

    const riddlesIds = utils
      .randomizeArray(Object.keys(riddles), world.trialDungeon.seed)
      .slice(0, 4);

    const riddleSolutions = utils.randomizeArray(Object.keys(riddles));

    world.trialDungeonRun.riddleIds = riddlesIds;
    for (let x = 1; x <= 5; x += 1) {
      for (let y = 1; y <= 5; y += 1) {
        if ((x === 1 && y === 1) || (x === 5 && y === 5)) {
          continue;
        }
        const room = elements[`room-${x}-${y}`];
        room.addStructure(
          new RiddleSolution({
            riddleId: riddleSolutions.pop()
          })
        );
      }
    }

    elements["room-1-1"].addStructure(new DungeonTrialWisdomInstructions());
  },

  scrambleRooms() {
    const stage = world.trialDungeonRun.state || 0;

    self.labyrinthGeneration();

    if (stage < 4) {
      self.lockDownExit();
    }
  },

  labyrinthGeneration() {
    elements = world.trialDungeonRun.dungeonElements;
    const inverseMap = {};
    const accessible = {};
    const remaining = {};
    for (let x = 1; x <= 5; x += 1) {
      for (let y = 1; y <= 5; y += 1) {
        const roomId = `room-${x}-${y}`;
        remaining[roomId] = true;

        const room = elements[roomId];
        room.getConnections().forEach(path => {
          if (path.getDoors()) {
            path.getDoors().close();
          }
        });

        inverseMap[room.id] = roomId;
      }
    }

    const roomConnected = roomId => {
      if (roomId !== "room-5-5") {
        accessible[roomId] = true;
      }
      delete remaining[roomId];
    };

    roomConnected(`room-1-1`);

    while (Object.keys(remaining).length) {
      const possibles = utils.randomizeArray(Object.keys(accessible));
      possibles.find(possible => {
        const room = elements[possible];
        return room.getConnections(true).find(path => {
          const otherRoom = path.getOtherNode(room);
          if (remaining[inverseMap[otherRoom.id]]) {
            path.getDoors().open();
            roomConnected(inverseMap[otherRoom.id]);
            return true;
          }
          return false;
        });
      });
    }
  },

  lockDownExit() {
    world.trialDungeonRun.dungeonElements["room-5-5"]
      .getAllStructures()
      .forEach(structure => {
        if (structure instanceof MetalGate) {
          structure.close();
        }
      });
  }
};

const actions = Action.groupById([
  new Action({
    name: "TouchRiddleSolution",
    dynamicLabel: () => "Touch",
    icon: "/actions/icons8-so-so-100.png",
    notification: false,
    repeatable: false,
    notAllowedInCombat: true,
    valid(entity, creature) {
      const player = creature.getPlayer();
      if (!player) {
        return false;
      }
      return true;
    },
    runCheck(entity, creature) {
      if (entity.getNode() !== creature.getNode()) {
        return "You must be in the same location to do that";
      }
      return true;
    },
    run(entity, creature) {
      const currentState = world.trialDungeonRun.state;
      if (
        currentState < 4 &&
        world.trialDungeonRun.riddleIds[currentState] === entity.riddleId
      ) {
        world.trialDungeonRun.state += 1;
      } else {
        world.trialDungeonRun.state = 0;
      }
      console.log(world.trialDungeonRun.state);
      DungeonTrials.wisdom.scrambleRooms();
      creature.logging(
        "As you touch the image, you hear a sound of rattling mechanisms."
      );
      utils.log(
        "Dungeon Trial - answer provided",
        entity.riddleId,
        `[${world.trialDungeonRun.riddleIds.join(", ")}]`,
        world.trialDungeonRun.state,
        creature.getName(),
        creature.getPlayer().email
      );
      return ACTION.FINISHED;
    }
  })
]);

class RiddleSolution extends Structure {
  static actions() {
    return actions;
  }

  getIcon(creature) {
    const icon = riddles[this.riddleId][1];
    return server.getImage(
      creature,
      `/${ICONS_PATH}/riddle-answers/${icon}.png`
    );
  }
}
Entity.factory(RiddleSolution, {
  name: "Image"
});

class DungeonTrialWisdomInstructions extends DungeonNoteStructure {
  getName() {
    return "Plaque";
  }

  getPlotLanguage() {
    return LANGUAGES.AERIAN;
  }

  getIcon(creature) {
    return server.getImage(
      creature,
      `/${ICONS_PATH}/notes/sgi_86_text_plaque.png`
    );
  }

  getPlotText() {
    this.noteId = `wisdom_riddle_text_${world.trialDungeonRun.riddleIds.join(
      "_"
    )}`;
    DUNGEON_NOTES[this.noteId] = {
      language: LANGUAGES.AERIAN
    };
    return `There is a plaque with some text written on it:<br/>
§Trial of Wisdom<br/>
<br/>
Follow the clues and the path will be opened.
<br/><br/>
${world.trialDungeonRun.riddleIds
  .map(riddleId => riddles[riddleId][0])
  .join("<br/><br/>")}§`;
  }
}

Entity.factory(DungeonTrialWisdomInstructions, {
  name: "?DungeonTrialWisdomInstructions?",
  cannotBeOccupied: true
});
