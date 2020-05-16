const dungeonMaker = require("./dungeon-maker");
const { lever, after, button } = dungeonMaker.utils;

const entranceNodeIds = {
  2500: {
    // Human
    rewardClassName: "AStatue14200",
    key: {
      keyId: 29568,
      icon: `blue`
    }
  },
  1929: {
    // Orc
    rewardClassName: "AStatue14327",
    key: {
      keyId: 38568,
      icon: `red`
    }
  },
  3047: {
    // Dwarf
    rewardClassName: "AStatue14338",
    key: {
      keyId: 48568,
      icon: `white`
    }
  },
  898: {
    // Elf
    rewardClassName: "AStatue14332",
    key: {
      keyId: 58568,
      icon: `green`
    }
  }
};

const dungeonBuilder = (module.exports = {
  placeAll() {
    Object.keys(entranceNodeIds).forEach(entranceNodeId => {
      dungeonBuilder.place(entranceNodeId, entranceNodeIds[entranceNodeId]);
    });
  },

  place(entranceNodeId, { rewardClassName, key }) {
    const reward = global[rewardClassName];
    if (!entranceNodeId) {
      throw new Error("entranceNodeId must be specified");
    }
    const node = Entity.getById(entranceNodeId);
    const icon = `/tiles/decor/necroCastle_icon.png`;
    const mapGraphic = {
      1: `tiles/decor/necroCastle.png`
    };

    const level4 = {
      W: {
        roomClass: "Tier4_Hallway",
        N: {
          door: {},
          roomClass: "Tier4_GuardRoom",
          ...after(lever(411, "W")),
          E: {
            door: {},
            roomClass: "Tier4_Treasury"
          },
          W: {
            door: {
              type: "metal",
              relativeId: 411
            },
            relativeId: 421
          }
        },
        S: {
          door: {},
          roomClass: "Tier4_GuardRoom",
          ...after(lever(412, "W")),
          E: {
            door: {},
            roomClass: "Tier4_Treasury"
          },
          W: {
            door: {
              type: "metal",
              relativeId: 412
            },
            N: {
              door: {},
              roomClass: "Tier4_Treasury",
              relativeId: 422,
              after: (node, itemGetter) => {
                node.addItem(new reward());
              }
            }
          }
        }
      }
    };

    const level3 = {
      E: {
        roomClass: "Tier3_Hallway",
        S: {
          roomClass: "Tier3_Hallway",
          E: {
            door: {
              type: "wall",
              relativeId: 301
            },
            ...after(lever(312, "E", 10 * SECONDS)),
            N: {
              door: {
                type: "wall",
                relativeId: 302
              },
              roomClass: "Tier3_Treasury"
            },
            E: {
              door: {
                type: "metal",
                relativeId: 312
              },
              roomClass: "Tier3_GuardRoom",
              S: {
                door: {},
                roomClass: "Tier3_GuardRoom",
                ...after(lever(303, "E")),
                S: {
                  door: {},
                  roomClass: "Tier3_GuardRoom",
                  W: {
                    door: {},
                    roomClass: "Tier3_GuardRoom",
                    ...after(lever(313, "S")),
                    S: {
                      door: {
                        type: "metal",
                        relativeId: 313
                      },
                      roomClass: "Tier3_GuardRoom",
                      ...after(lever(314, "W")),
                      W: {
                        door: {
                          type: "metal",
                          relativeId: 314
                        },
                        roomClass: "Tier3_GuardRoom",
                        relativeId: 321
                      }
                    }
                  }
                }
              }
            }
          },
          S: {
            door: {},
            E: {
              door: {
                type: "metal",
                relativeId: 303
              },
              U: level4
            },
            S: {
              door: {},
              pathToId: 321
            },
            W: {
              door: {},
              roomClass: "Tier3_Hallway",
              N: {
                roomClass: "Tier3_Hallway",
                W: {
                  door: {},
                  roomClass: "Tier3_Storage",
                  ...after(button(301, "W", 65))
                }
              },
              W: {
                door: {},
                roomClass: "Tier3_Storage",
                ...after(button(302, "W", 70))
              },
              S: {
                door: {},
                roomClass: "Tier3_GuardRoom",
                W: {
                  door: {},
                  roomClass: "Tier3_Storage"
                },
                S: {
                  door: {},
                  roomClass: "Tier3_Treasury"
                }
              }
            }
          }
        }
      }
    };

    const level2 = {
      E: {
        roomClass: "Tier2_Hallway",
        E: {
          roomClass: "Tier2_Hallway",
          S: {
            door: {},
            W: {
              door: {},
              roomClass: "Tier2_Hallway",
              W: {
                door: {},
                roomClass: "Tier2_Storage",
                ...after(button(201, "N", 55))
              },
              S: {
                W: {
                  door: {},
                  roomClass: "Tier2_Storage"
                }
              }
            },
            S: {
              door: {},
              S: {
                roomClass: "Tier2_GuardRoom",
                W: {
                  door: {
                    type: "wall",
                    relativeId: 201
                  },
                  roomClass: "Tier2_Treasury",
                  after: (node, itemGetter) => {
                    node.addItem(
                      new Key({
                        ...key,
                        keyId: key.keyId + 10,
                        name: "Glinting Key",
                        icon: `/${ICONS_PATH}/items/keys/ni_b_10_${key.icon}.png`
                      })
                    );
                  }
                },
                E: {
                  door: {},
                  roomClass: "Tier2_Storage"
                }
              }
            },
            E: {
              door: {},
              roomClass: "Tier2_Hallway",
              ...after(button(202, "S", 63)),
              S: {
                door: {
                  type: "wall",
                  relativeId: 202
                },
                roomClass: "Tier2_Treasury"
              },
              E: {
                door: {},
                roomClass: "Tier2_MessHall",
                N: {
                  door: {},
                  roomClass: "Tier2_Storage"
                },
                S: {
                  door: {},
                  roomClass: "Tier2_Storage"
                }
              },
              N: {
                roomClass: "Tier2_Hallway",
                N: {
                  door: {
                    locked: true,
                    lockLevel: 4,
                    keyId: key.keyId + 10
                  },
                  roomClass: "Tier2_GuardRoom",
                  W: {
                    door: {},
                    roomClass: "Tier2_Hallway",
                    W: {
                      U: level3
                    }
                  }
                }
              }
            }
          }
        }
      }
    };

    const level1 = {
      type: NODE_TYPES.ROOM_DARK_STONE,
      E: {
        E: {
          door: {},
          N: {
            door: {},
            roomClass: "Tier1_Hallway",
            E: {
              roomClass: "Tier1_Storage",
              door: {}
            },
            N: {
              roomClass: "Tier1_Hallway",
              E: {
                roomClass: "Tier1_GuardRoom",
                door: {},
                after: (node, itemGetter) => {
                  node.addItem(
                    new Key({
                      ...key,
                      name: "Crooked Key",
                      icon: `/${ICONS_PATH}/items/keys/key_b_02_${key.icon}.png`
                    })
                  );
                }
              },
              W: {
                roomClass: "Tier1_Storage",
                door: {}
              }
            },
            W: {
              door: {
                type: "metal",
                relativeId: 101
              },
              W: {
                door: {
                  type: "metal",
                  relativeId: 102
                },
                U: level2
              }
            }
          },
          E: {
            door: {},
            E: {
              door: {},
              roomClass: "Tier1_MessHall",
              N: {
                door: {},
                roomClass: "Tier1_Storage",
                ...after(lever(102, "W"))
              },
              S: {
                door: {},
                roomClass: "Tier1_Storage"
              }
            }
          },
          S: {
            E: {
              roomClass: "Tier1_Hallway",
              door: {
                locked: true,
                keyId: key.keyId,
                lockLevel: 3
              },
              S: {
                roomClass: "Tier1_Hallway",
                W: {
                  roomClass: "Tier1_GuardRoom",
                  ...after(lever(101, "W"))
                }
              }
            },
            W: {
              roomClass: "Tier1_GuardRoom",
              door: {},
              S: {
                door: {},
                roomClass: "Tier1_Storage"
              },
              W: {
                door: {
                  locked: true,
                  keyId: key.keyId,
                  lockLevel: 3
                },
                roomClass: "Tier1_Treasury"
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
      level1
    );

    const secondPath = new RoomPath({}, elements[421], elements[422]);
    secondPath.installDoor(WoodenDoors);

    entrance.description = `A gloomy castle with a central tower climbing high into the clouds.`;
  }
});
