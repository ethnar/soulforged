const dungeonMaker = require("./dungeon-maker");
const { lever, after } = dungeonMaker.utils;

module.exports = {
  place() {
    const combatTestLayout = {
      relativeId: "entrance",
      type: NODE_TYPES.ROOM_GREY_STONE,
      ...after(lever("firstDoor", "E")),
      E: {
        after: (node, itemGetter) => {
          const pit = new DungeonPitfall();
          node.addStructure(pit);
          pit.open();
          pit.leaveOpened = true;
          pit.setDropNode(itemGetter("start-location"));
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
          relativeId: "start-location",
          ...after(lever("entrance-1.1", "W"), lever("entrance-1.2", "E")),
          W: {
            door: { type: "metal", relativeId: "entrance-1.1" },
            relativeId: "monster-1.1",
            ...after(lever("entrance-2.1", "N"), lever("entrance-2.2", "S")),
            N: {
              door: { type: "metal", relativeId: "entrance-2.1" },
              relativeId: "monster-2.1",
              ...after(lever("entrance-3.1", "N"), lever("entrance-3.2", "W")),
              N: {
                door: { type: "metal", relativeId: "entrance-3.1" },
                relativeId: "monster-3.1",
                ...after(
                  lever("entrance-4.1.1", "E"),
                  lever("entrance-4.1.2", "W")
                ),
                E: {
                  door: { type: "metal", relativeId: "entrance-4.1.1" },
                  relativeId: "monster-4.1.1"
                },
                W: {
                  door: { type: "metal", relativeId: "entrance-4.1.2" },
                  relativeId: "monster-4.1.2"
                }
              },
              W: {
                door: { type: "metal", relativeId: "entrance-3.2" },
                relativeId: "monster-3.2",
                ...after(
                  lever("entrance-4.2.1", "N"),
                  lever("entrance-4.2.2", "S")
                ),
                N: {
                  door: { type: "metal", relativeId: "entrance-4.2.1" },
                  relativeId: "monster-4.2.1"
                },
                S: {
                  door: { type: "metal", relativeId: "entrance-4.2.2" },
                  relativeId: "monster-4.2.2"
                }
              }
            },
            S: {
              door: { type: "metal", relativeId: "entrance-2.2" },
              relativeId: "monster-2.2",
              ...after(lever("entrance-3.3", "S"), lever("entrance-3.4", "W")),
              S: {
                door: { type: "metal", relativeId: "entrance-3.3" },
                relativeId: "monster-3.3",
                ...after(
                  lever("entrance-4.3.1", "E"),
                  lever("entrance-4.3.2", "W")
                ),
                E: {
                  door: { type: "metal", relativeId: "entrance-4.3.1" },
                  relativeId: "monster-4.3.1"
                },
                W: {
                  door: { type: "metal", relativeId: "entrance-4.3.2" },
                  relativeId: "monster-4.3.2"
                }
              },
              W: {
                door: { type: "metal", relativeId: "entrance-3.4" },
                relativeId: "monster-3.4",
                ...after(
                  lever("entrance-4.8.1", "N"),
                  lever("entrance-4.8.2", "S")
                ),
                N: {
                  door: { type: "metal", relativeId: "entrance-4.8.1" },
                  relativeId: "monster-4.8.1"
                },
                S: {
                  door: { type: "metal", relativeId: "entrance-4.8.2" },
                  relativeId: "monster-4.8.2"
                }
              }
            }
          },
          E: {
            door: { type: "metal", relativeId: "entrance-1.2" },
            relativeId: "monster-1.2",
            ...after(lever("entrance-2.3", "N"), lever("entrance-2.4", "S")),
            N: {
              door: { type: "metal", relativeId: "entrance-2.3" },
              relativeId: "monster-2.3",
              ...after(lever("entrance-3.5", "N"), lever("entrance-3.6", "E")),
              N: {
                door: { type: "metal", relativeId: "entrance-3.5" },
                relativeId: "monster-3.5",
                ...after(
                  lever("entrance-4.4.1", "E"),
                  lever("entrance-4.4.2", "W")
                ),
                E: {
                  door: { type: "metal", relativeId: "entrance-4.4.1" },
                  relativeId: "monster-4.4.1"
                },
                W: {
                  door: { type: "metal", relativeId: "entrance-4.4.2" },
                  relativeId: "monster-4.4.2"
                }
              },
              E: {
                door: { type: "metal", relativeId: "entrance-3.6" },
                relativeId: "monster-3.6",
                ...after(
                  lever("entrance-4.7.1", "N"),
                  lever("entrance-4.7.2", "S")
                ),
                N: {
                  door: { type: "metal", relativeId: "entrance-4.7.1" },
                  relativeId: "monster-4.7.1"
                },
                S: {
                  door: { type: "metal", relativeId: "entrance-4.7.2" },
                  relativeId: "monster-4.7.2"
                }
              }
            },
            S: {
              door: { type: "metal", relativeId: "entrance-2.4" },
              relativeId: "monster-2.4",
              ...after(lever("entrance-3.7", "S"), lever("entrance-3.8", "E")),
              S: {
                door: { type: "metal", relativeId: "entrance-3.7" },
                relativeId: "monster-3.7",
                ...after(
                  lever("entrance-4.5.1", "E"),
                  lever("entrance-4.5.2", "W")
                ),
                E: {
                  door: { type: "metal", relativeId: "entrance-4.5.1" },
                  relativeId: "monster-4.5.1"
                },
                W: {
                  door: { type: "metal", relativeId: "entrance-4.5.2" },
                  relativeId: "monster-4.5.2"
                }
              },
              E: {
                door: { type: "metal", relativeId: "entrance-3.8" },
                relativeId: "monster-3.8",
                ...after(
                  lever("entrance-4.6.1", "N"),
                  lever("entrance-4.6.2", "S")
                ),
                N: {
                  door: { type: "metal", relativeId: "entrance-4.6.1" },
                  relativeId: "monster-4.6.1"
                },
                S: {
                  door: { type: "metal", relativeId: "entrance-4.6.2" },
                  relativeId: "monster-4.6.2"
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
      combatTestLayout,
      undefined,
      false,
      { x: world.trialDungeon.entrance.x, y: world.trialDungeon.entrance.y }
    );
    const mergeRooms = [
      ["4.2.1", "4.1.2", "N"],
      ["4.1.1", "4.4.2", "N"],
      ["4.4.1", "4.7.1", "N"],
      ["4.7.2", "4.6.1", "E"],
      ["4.5.1", "4.6.2", "S"],
      ["4.3.1", "4.5.2", "S"],
      ["4.3.2", "4.8.2", "S"],
      ["4.2.2", "4.8.1", "W"]
    ];
    mergeRooms.forEach(([id1, id2, dir]) => {
      const room1 = elements[`monster-${id1}`];
      const room2 = elements[`monster-${id2}`];
      while (room1.structures.length) {
        const structure = room1.structures.pop();
        room2.addStructure(structure);

        ["nodeNorth", "nodeSouth", "nodeWest", "nodeEast"].forEach(dir => {
          if (structure[dir] === room1) {
            structure[dir] = room2;
          }
        });
      }
      while (room1.paths.length) {
        const path = room1.paths.pop();
        if (path.nodeAId === room1.getEntityId()) {
          path.nodeAId = room2.getEntityId();
        } else {
          path.nodeBId = room2.getEntityId();
        }
        room2.addConnection(path);
      }
      room2.addStructure(
        new DungeonTrialExitRune({
          roomPlacement: dir
        })
      );
    });
    const allSpawns = [
      {
        roomIds: ["1.1", "1.2"],
        spawns: [
          // total threat: 20 - 30
          { CaveSpider: "3-4" },
          { Wolf: "5-8" },
          { DuskCrow: "2-4" },
          { Snake: "10-15" }
        ]
      },
      {
        roomIds: ["2.1", "2.2", "2.3", "2.4"],
        spawns: [
          // total threat: 60 - 80
          { FireDrake: "2-3" },
          { Lurker: "2-3" },
          { Direwolf: "3-4" },
          { DesertSpider: "4-6" },
          { Muckworm: "4-5" },
          { MoleRat: "6-9" }
        ]
      },
      {
        roomIds: ["3.1", "3.2", "3.3", "3.4", "3.5", "3.6", "3.7", "3.8"],
        spawns: [
          // total threat: 140 - 200
          { Troll: "2" },
          { StoneGolem: "2-3" },
          { Plaguebeast: "3-5" },
          { Screech: "4-6" },
          { ElephantBull: "1-2" }
        ]
      },
      {
        roomIds: [
          "4.1.2",
          "4.4.2",
          "4.7.1",
          "4.6.1",
          "4.6.2",
          "4.5.2",
          "4.8.2",
          "4.8.1"
        ],
        spawns: [
          // total threat: 300+
          { Nightcrawler: "1" },
          { Troll: "3-4" },
          { StoneGolem: "3-5" },
          { Plaguebeast: "5-7" }
        ]
      }
    ];

    allSpawns.forEach(({ roomIds, spawns }) => {
      let randomizedSpawns = [];
      roomIds.forEach(roomId => {
        if (!randomizedSpawns.length) {
          randomizedSpawns = utils.randomizeArray(spawns);
        }
        const room = elements[`monster-${roomId}`];
        const spawnTable = randomizedSpawns.pop();
        utils.applySpawnTable({ 100: spawnTable }, room, [
          spawn => {
            spawn.dungeonChaser = false;
            spawn.aggressiveness = 0;
            spawn.movementDelay = Infinity;
          }
        ]);
      });
    });

    return { dungeon, elements };
  }
};
