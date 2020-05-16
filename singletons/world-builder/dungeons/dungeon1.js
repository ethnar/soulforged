const dungeonMaker = require("./dungeon-maker");
const { prisonCell, lever, after } = dungeonMaker.utils;

const entranceNodeId = 585;

module.exports = {
  place() {
    const finalLogicGate = new LogicalGateAnd(2);
    const finalLogicBuffer = new LogicalGateBuffer(3 * MINUTES);

    const node = Entity.getById(entranceNodeId);
    const icon = `/tiles/structures/hexmarshcastleruins00_icon_new.png`;
    const mapGraphic = {
      1: `tiles/structures/hexmarshcastleruinsdark00_new.png`
    };
    const layout = {
      type: NODE_TYPES.ROOM_CLAY,
      roomClass: "Tier1_Hallway",
      E: {
        roomClass: "Tier1_GuardRoom",
        door: {
          locked: true,
          lockLevel: 0
        }
      },
      W: {
        roomClass: "Tier1_Hallway",
        relativeId: 1,
        N: {
          roomClass: "Tier1_MessHall",
          door: {
            locked: true,
            keyId: 59485,
            lockLevel: 0.8
          }
        }
      },
      N: {
        roomClass: "Tier1_Hallway",
        relativeId: 32,
        N: {
          roomClass: "Tier1_GuardRoom",
          door: {
            type: "metal",
            relativeId: 44,
            resetsIn: 20 * SECONDS
          },
          ...after(lever(44, "S")),
          E: {
            roomClass: "Tier1_Hallway",
            door: {},
            N: {
              roomClass: "Tier1_Hallway",
              ...after(lever(51, "W"), lever(52, "E")),
              W: prisonCell(51),
              E: prisonCell(52),
              N: {
                roomClass: "Tier1_Hallway",
                ...after(lever(53, "W"), lever(54, "E")),
                W: prisonCell(53),
                E: prisonCell(54),
                N: {
                  roomClass: "Tier1_Hallway",
                  ...after(lever(55, "W"), lever(56, "E")),
                  W: prisonCell(55),
                  E: prisonCell(56)
                }
              }
            },
            S: {
              roomClass: "Tier1_Hallway",
              door: {
                type: "metal",
                relativeId: 30
              },
              after: (node, itemGetter) => {
                node.addStructure(
                  new Lever({
                    roomPlacement: "N",
                    resetsIn: 20 * SECONDS,
                    togglesElement: itemGetter(30)
                  })
                );
              },
              pathToId: 32,
              E: {
                roomClass: "Tier1_Hallway",
                door: {
                  locked: true,
                  keyId: 59485,
                  lockLevel: 0.1
                },
                N: {
                  roomClass: "Tier1_Hallway",
                  E: {
                    roomClass: "Tier1_GuardRoom",
                    door: {},
                    after: (node, itemGetter) => {
                      node.addStructure(
                        new Lever({
                          roomPlacement: "E",
                          resetsIn: 30 * MINUTES,
                          togglesElement: itemGetter(2)
                        })
                      );
                    }
                  }
                },
                E: {
                  roomClass: "Tier1_Hallway",
                  S: {
                    roomClass: "Tier1_Hallway",
                    after: (node, itemGetter) => {
                      node.addStructure(
                        new DungeonButton({
                          roomPlacement: "E",
                          togglesElement: itemGetter(20),
                          hiddenStructure: 60
                        })
                      );
                    },
                    W: {
                      roomClass: "Tier1_Treasury",
                      door: {
                        type: "wall",
                        relativeId: 20
                      }
                    },
                    S: {
                      roomClass: "Tier1_Hallway",
                      door: {
                        type: "metal",
                        relativeId: 2
                      },
                      after: (node, itemGetter) => {
                        node.addStructure(
                          new Lever({
                            roomPlacement: "N",
                            resetsIn: 30 * MINUTES,
                            togglesElement: itemGetter(2)
                          })
                        );
                      },
                      W: {
                        roomClass: "Tier1_Hallway",
                        W: {
                          roomClass: "Tier1_GuardRoom",
                          door: {},
                          after: (node, itemGetter) => {
                            node.addStructure(
                              new Lever({
                                roomPlacement: "W",
                                resetsIn: 5 * SECONDS, // TODO
                                togglesElement: finalLogicGate
                              })
                            );
                          }
                        },
                        S: {
                          roomClass: "Tier1_Hallway",
                          W: {
                            roomClass: "Tier1_Hallway",
                            W: {
                              roomClass: "Tier1_Treasury",
                              door: {
                                type: "metal",
                                relativeId: 3
                              },
                              after: (node, itemGetter) => {
                                node.addStructure(
                                  new DungeonButton({
                                    roomPlacement: "W",
                                    togglesElement: itemGetter(21),
                                    hiddenStructure: 40
                                  })
                                );
                              },
                              N: {
                                roomClass: "Tier1_GuardRoom",
                                door: {
                                  type: "wall",
                                  relativeId: 21
                                },
                                W: {
                                  door: {},
                                  pathToId: 1
                                },
                                after: (node, itemGetter) => {
                                  node.addItem(
                                    new Key({
                                      name: `Rusty Key`,
                                      keyId: 59485,
                                      icon: `/${ICONS_PATH}/items/keys/key_b_01_rusty.png`
                                    })
                                  );
                                }
                              }
                            }
                          },
                          S: {
                            roomClass: "Tier1_Hallway",
                            W: {
                              roomClass: "Tier1_GuardRoom",
                              door: {},
                              after: (node, itemGetter) => {
                                node.addStructure(
                                  new Lever({
                                    roomPlacement: "W",
                                    resetsIn: 5 * SECONDS,
                                    togglesElement: finalLogicGate
                                  })
                                );
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
      }
    };
    const { elements, entrance } = dungeonMaker.place(
      node,
      icon,
      mapGraphic,
      layout
    );

    entrance.description = `An ancient, gloomy fortress.`;

    finalLogicGate.setToggleElement(finalLogicBuffer);
    finalLogicBuffer.setToggleElement(elements[3]);
  }
};
