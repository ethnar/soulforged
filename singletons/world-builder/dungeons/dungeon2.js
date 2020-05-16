const dungeonMaker = require("./dungeon-maker");
const { prisonCell2, prisonCell3, lever, after } = dungeonMaker.utils;

const entranceNodeId = 2889;

module.exports = {
  place() {
    const dungeon2 = new Dungeon();

    const finalLogicGate = new LogicalGateAnd(2);
    const finalLogicBuffer = new LogicalGateBuffer(3 * MINUTES);

    const node = Entity.getById(entranceNodeId);
    const icon = `/tiles/decor/castleRuinDirt_icon.png`;
    const mapGraphic = {
      1: `tiles/decor/castleRuinDirt.png`
    };
    const layout = {
      type: NODE_TYPES.ROOM_CLAY,
      roomClass: "Tier2_Hallway",
      E: {
        roomClass: "Tier2_Storage",
        door: {
          locked: true,
          lockLevel: 0
        }
      },
      W: {
        roomClass: "Tier2_Hallway",
        relativeId: 1,
        N: {
          roomClass: "Tier2_MessHall",
          door: {
            locked: true,
            keyId: 334457,
            lockLevel: 0.8
          }
        }
      },
      N: {
        roomClass: "Tier2_Hallway",
        relativeId: 32,
        N: {
          roomClass: "Tier2_GuardRoom",
          door: {
            type: "metal",
            relativeId: 44,
            resetsIn: 20 * SECONDS
          },
          ...after(lever(44, "S")),
          E: {
            roomClass: "Tier2_Hallway",
            door: {},
            N: {
              roomClass: "Tier2_Hallway",
              ...after(lever(51, "W"), lever(52, "E")),
              W: prisonCell2(51),
              E: prisonCell2(52),
              N: {
                roomClass: "Tier2_Hallway",
                ...after(lever(53, "W"), lever(54, "E")),
                W: prisonCell2(53),
                E: prisonCell2(54),
                N: {
                  roomClass: "Tier2_Hallway",
                  ...after(lever(55, "W"), lever(56, "E")),
                  W: prisonCell2(55),
                  E: prisonCell2(56)
                }
              }
            },
            S: {
              roomClass: "Tier2_Hallway",
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
                roomClass: "Tier2_Hallway",
                door: {
                  locked: true,
                  keyId: 334457,
                  lockLevel: 0.1
                },
                N: {
                  roomClass: "Tier2_Hallway",
                  E: {
                    roomClass: "Tier2_Storage",
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
                  roomClass: "Tier2_Hallway",
                  S: {
                    roomClass: "Tier2_Hallway",
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
                      roomClass: "Tier2_Treasury",
                      door: {
                        type: "wall",
                        relativeId: 20
                      }
                    },
                    S: {
                      roomClass: "Tier2_Hallway",
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
                        roomClass: "Tier2_Hallway",
                        W: {
                          roomClass: "Tier2_GuardRoom",
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
                          roomClass: "Tier2_Hallway",
                          E: {
                            relativeId: 10001,
                            roomClass: "Tier2_GuardRoom",
                            door: {
                              locked: true,
                              keyId: 334457,
                              lockLevel: 2
                            }
                          },
                          W: {
                            roomClass: "Tier2_Hallway",
                            W: {
                              roomClass: "Tier2_Treasury",
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
                                roomClass: "Tier2_GuardRoom",
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
                                      name: "Burnished Key",
                                      keyId: 334457,
                                      icon: `/${ICONS_PATH}/items/keys/key_b_01.png`
                                    })
                                  );
                                }
                              }
                            }
                          },
                          S: {
                            roomClass: "Tier2_Hallway",
                            W: {
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
      layout,
      dungeon2
    );

    entrance.description = `An ancient, gloomy fortress.`;

    finalLogicGate.setToggleElement(finalLogicBuffer);
    finalLogicBuffer.setToggleElement(elements[3]);

    const entranceNode = elements[10001];

    const icon2 = `/${ICONS_PATH}/structures/dungeon/sgi_23_stairs.png`;
    const layout2 = {
      type: NODE_TYPES.ROOM_CLAY,
      N: {
        roomClass: "Tier3_GuardRoom",
        door: {},
        N: {
          roomClass: "Tier3_Hallway",
          door: {},
          N: {
            roomClass: "Tier3_Hallway",
            ...after(lever(155, "W")),
            W: {
              roomClass: "Tier3_Hallway",
              door: {
                type: "metal",
                relativeId: 155,
                resetsIn: 20 * SECONDS
              },
              relativeId: 154
            },
            N: {
              roomClass: "Tier3_Hallway",
              door: {},
              W: {
                roomClass: "Tier3_GuardRoom",
                door: {
                  type: "metal",
                  relativeId: 65,
                  resetsIn: 20 * SECONDS
                },
                ...after(lever(65, "E")),
                W: {
                  roomClass: "Tier3_Hallway",
                  door: {},
                  N: {
                    roomClass: "Tier3_Hallway",
                    ...after(lever(151, "W"), lever(152, "E")),
                    W: prisonCell3(151),
                    E: prisonCell3(152),
                    N: {
                      roomClass: "Tier3_Hallway",
                      ...after(lever(153, "W"), lever(154, "E")),
                      W: prisonCell3(153),
                      E: prisonCell3(154),
                      N: {
                        roomClass: "Tier3_Hallway",
                        ...after(lever(155, "W"), lever(156, "E")),
                        W: prisonCell3(155),
                        E: prisonCell3(156)
                      }
                    }
                  },
                  S: {
                    pathToId: 154,
                    W: {
                      roomClass: "Tier3_Hallway",
                      N: {
                        door: {},
                        roomClass: "Tier3_MessHall"
                      },
                      W: {
                        door: {},
                        roomClass: "Tier3_GuardRoom",
                        S: {
                          door: {},
                          roomClass: "Tier3_Hallway",
                          S: {
                            door: {
                              locked: true,
                              lockLevel: 2
                            },
                            roomClass: "Tier3_Treasury",
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
                      roomClass: "Tier3_Hallway",
                      ...after(lever(51, "W"), lever(52, "E")),
                      W: prisonCell3(51),
                      E: prisonCell3(52),
                      S: {
                        roomClass: "Tier3_Hallway",
                        ...after(lever(53, "W"), lever(54, "E")),
                        W: prisonCell3(53),
                        E: prisonCell3(54),
                        S: {
                          roomClass: "Tier3_Hallway",
                          ...after(lever(55, "W"), lever(56, "E")),
                          W: prisonCell3(55),
                          E: prisonCell3(56),
                          S: {
                            roomClass: "Tier3_Hallway",
                            door: {
                              type: "wall",
                              relativeId: 2000
                            },
                            E: {
                              door: {},
                              roomClass: "Tier3_Treasury"
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
    dungeonMaker.place(entranceNode, icon2, null, layout2, dungeon2);
  }
};
