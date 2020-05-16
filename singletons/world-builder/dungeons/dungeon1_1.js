const dungeonMaker = require("./dungeon-maker");
const { prisonCell2, lever, after } = dungeonMaker.utils;

const startNodeId = 14894;

module.exports = {
  place() {
    const node = Entity.getById(startNodeId);

    const dungeon1 = Dungeon.getFromNode(node);

    const entranceLayout = {
      type: NODE_TYPES.ROOM_CLAY,
      E: {
        relativeId: 1,
        door: {
          locked: true,
          keyId: 59485,
          lockLevel: 2
        }
      }
    };

    const firstCache = {};
    dungeonMaker.makeRooms(dungeon1, node, entranceLayout, firstCache);

    const entranceNode = firstCache[1];

    const icon = `/${ICONS_PATH}/structures/dungeon/sgi_23_stairs.png`;
    const layout = {
      type: NODE_TYPES.ROOM_CLAY,
      N: {
        roomClass: "Tier2_GuardRoom",
        door: {},
        N: {
          roomClass: "Tier2_Hallway",
          door: {},
          N: {
            roomClass: "Tier2_Hallway",
            ...after(lever(155, "W")),
            W: {
              roomClass: "Tier2_Hallway",
              door: {
                type: "metal",
                relativeId: 155,
                resetsIn: 20 * SECONDS
              },
              relativeId: 154
            },
            N: {
              roomClass: "Tier2_Hallway",
              door: {},
              W: {
                roomClass: "Tier2_GuardRoom",
                door: {
                  type: "metal",
                  relativeId: 65,
                  resetsIn: 20 * SECONDS
                },
                ...after(lever(65, "E")),
                W: {
                  roomClass: "Tier2_Hallway",
                  door: {},
                  N: {
                    roomClass: "Tier2_Hallway",
                    ...after(lever(151, "W"), lever(152, "E")),
                    W: prisonCell2(151),
                    E: prisonCell2(152),
                    N: {
                      roomClass: "Tier2_Hallway",
                      ...after(lever(153, "W"), lever(154, "E")),
                      W: prisonCell2(153),
                      E: prisonCell2(154),
                      N: {
                        roomClass: "Tier2_Hallway",
                        ...after(lever(155, "W"), lever(156, "E")),
                        W: prisonCell2(155),
                        E: prisonCell2(156)
                      }
                    }
                  },
                  S: {
                    pathToId: 154,
                    W: {
                      roomClass: "Tier2_Hallway",
                      N: {
                        door: {},
                        roomClass: "Tier2_MessHall"
                      },
                      W: {
                        door: {},
                        roomClass: "Tier2_Storage",
                        S: {
                          door: {},
                          roomClass: "Tier2_Hallway",
                          S: {
                            door: {
                              locked: true,
                              lockLevel: 2
                            },
                            roomClass: "Tier2_Treasury",
                            after: (node, itemGetter) => {
                              node.addStructure(
                                new DungeonButton({
                                  roomPlacement: "E",
                                  togglesElement: itemGetter(2000),
                                  hiddenStructure: 60
                                })
                              );
                            }
                          }
                        }
                      }
                    },
                    S: {
                      roomClass: "Tier2_Hallway",
                      ...after(lever(51, "W"), lever(52, "E")),
                      W: prisonCell2(51),
                      E: prisonCell2(52),
                      S: {
                        roomClass: "Tier2_Hallway",
                        ...after(lever(53, "W"), lever(54, "E")),
                        W: prisonCell2(53),
                        E: prisonCell2(54),
                        S: {
                          roomClass: "Tier2_Hallway",
                          ...after(lever(55, "W"), lever(56, "E")),
                          W: prisonCell2(55),
                          E: prisonCell2(56),
                          S: {
                            roomClass: "Tier2_Storage",
                            door: {
                              type: "wall",
                              relativeId: 2000
                            },
                            E: {
                              door: {},
                              roomClass: "Tier2_Treasury"
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    };
    const { elements, entrance } = dungeonMaker.place(
      entranceNode,
      icon,
      null,
      layout,
      dungeon1
    );
  }
};
