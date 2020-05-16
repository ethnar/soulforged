const dungeonMaker = require("./dungeon-maker");
const { lever, after } = dungeonMaker.utils;

const entranceNodeId = 1081;

module.exports = {
  place() {
    const node = Entity.getById(entranceNodeId);
    const icon = `/tiles/decor/pyramid00_full_icon.png`;
    const mapGraphic = {
      1: `tiles/decor/pyramid00_full.png`
    };

    const level3b = {
      S: {
        roomClass: "Tier4_Hallway",
        S: {
          roomClass: "Tier4_Storage",
          W: {
            roomClass: "Tier4_Storage"
          }
        },
        E: {
          S: {
            roomClass: "Tier4_Storage",
            S: {
              roomClass: "Tier4_Hallway",
              W: {
                roomClass: "Tier4_Hallway",
                W: {
                  roomClass: "Tier4_Hallway",
                  W: {
                    roomClass: "Tier4_Storage",
                    S: {
                      roomClass: "Tier4_Hallway",
                      E: {
                        roomClass: "Tier4_Hallway",
                        E: {
                          roomClass: "Tier4_Hallway",
                          E: {
                            roomClass: "Tier4_Hallway",
                            E: {
                              roomClass: "Tier4_Hallway",
                              N: {
                                roomClass: "Tier4_Storage",
                                relativeId: 3
                              },
                              S: {
                                roomClass: "Tier4_Storage",
                                W: {
                                  roomClass: "Tier4_Hallway",
                                  W: {
                                    roomClass: "Tier4_Hallway",
                                    W: {
                                      roomClass: "Tier4_Hallway",
                                      W: {
                                        roomClass: "Tier4_Hallway",
                                        W: {
                                          roomClass: "Tier4_Storage",
                                          N: {
                                            N: {
                                              roomClass: "Tier4_Storage"
                                            },
                                            W: {
                                              S: {
                                                roomClass: "Tier4_Storage",
                                                W: {
                                                  W: {
                                                    roomClass: "Tier4_Treasury"
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
                        }
                      }
                    },
                    N: {
                      roomClass: "Tier4_Storage",
                      W: {
                        relativeId: 2,
                        W: {
                          S: {
                            roomClass: "Tier4_Storage",
                            W: {
                              W: {
                                roomClass: "Tier4_Treasury"
                              },
                              N: {
                                W: {
                                  roomClass: "Tier4_Treasury"
                                }
                              },
                              S: {
                                W: {
                                  roomClass: "Tier4_Treasury"
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
      }
    };

    const level3 = {
      S: {
        roomClass: "Tier4_Storage",
        S: {
          E: {
            roomClass: "Tier4_Storage",
            N: {
              N: {
                N: {
                  roomClass: "Tier4_Storage",
                  W: {
                    roomClass: "Tier4_Storage"
                  }
                }
              }
            },
            S: {
              S: {
                roomClass: "Tier4_Storage"
              }
            }
          }
        },
        W: {
          roomClass: "Tier4_Storage",
          N: {
            roomClass: "Tier4_Storage",
            W: {
              roomClass: "Tier4_Hallway",
              W: {
                roomClass: "Tier4_Hallway",
                W: {
                  roomClass: "Tier4_Hallway",
                  W: {
                    roomClass: "Tier4_Hallway",
                    S: {
                      roomClass: "Tier4_Storage",
                      E: {
                        E: {
                          roomClass: "Tier4_GuardRoom"
                        }
                      }
                    }
                  },
                  N: {
                    roomClass: "Tier4_Storage",
                    E: {
                      roomClass: "Tier4_Hallway",
                      E: {
                        roomClass: "Tier4_Hallway",
                        E: {
                          roomClass: "Tier4_Storage"
                        }
                      }
                    },
                    W: {
                      roomClass: "Tier4_Hallway",
                      W: {
                        roomClass: "Tier4_Hallway",
                        W: {
                          roomClass: "Tier4_Hallway",
                          S: {
                            roomClass: "Tier4_Storage"
                          }
                        },
                        S: {
                          S: {
                            roomClass: "Tier4_Storage",
                            W: {
                              roomClass: "Tier4_Storage",
                              S: {
                                roomClass: "Tier4_Hallway",
                                E: {
                                  roomClass: "Tier4_Hallway",
                                  E: {
                                    roomClass: "Tier4_Hallway",
                                    E: {
                                      roomClass: "Tier4_Hallway",
                                      E: {
                                        roomClass: "Tier4_Hallway",
                                        E: {
                                          roomClass: "Tier4_Hallway",
                                          N: {
                                            roomClass: "Tier4_GuardRoom"
                                          },
                                          E: level3b
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
              }
            }
          }
        }
      }
    };

    const level2 = {
      N: {
        roomClass: "Tier3_Storage",
        W: {
          N: {
            N: {
              N: {
                roomClass: "Tier3_Storage",
                N: {
                  roomClass: "Tier3_Storage"
                },
                E: {
                  relativeId: 81,
                  roomClass: "Tier3_Hallway",
                  S: {
                    relativeId: 82,
                    roomClass: "Tier3_Hallway",
                    S: {
                      relativeId: 83,
                      roomClass: "Tier3_Hallway"
                    }
                  },
                  N: {
                    roomClass: "Tier3_Hallway",
                    E: {
                      roomClass: "Tier3_Hallway",
                      E: {
                        roomClass: "Tier3_Hallway",
                        E: {
                          roomClass: "Tier3_Hallway",
                          E: {
                            roomClass: "Tier3_Storage",
                            relativeId: 6
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
      },
      W: {
        roomClass: "Tier3_Storage",
        S: {
          roomClass: "Tier3_Storage",
          E: {
            roomClass: "Tier3_Hallway",
            E: {
              roomClass: "Tier3_Hallway",
              E: {
                roomClass: "Tier3_Hallway",
                E: {
                  roomClass: "Tier3_Hallway",
                  E: {
                    roomClass: "Tier3_Storage"
                  },
                  N: {
                    W: {
                      W: {
                        roomClass: "Tier3_Storage"
                      },
                      N: {
                        roomClass: "Tier3_Storage",
                        W: {
                          roomClass: "Tier3_Hallway",
                          N: {
                            roomClass: "Tier3_Hallway",
                            N: {
                              roomClass: "Tier3_Hallway",
                              N: {
                                roomClass: "Tier3_Storage",
                                E: {
                                  roomClass: "Tier3_Hallway",
                                  E: {
                                    roomClass: "Tier3_Hallway",
                                    E: {
                                      roomClass: "Tier3_Hallway",
                                      S: {
                                        roomClass: "Tier3_Hallway",
                                        W: {
                                          roomClass: "Tier3_GuardRoom",
                                          W: {
                                            roomClass: "Tier3_Treasury"
                                          }
                                        },
                                        S: {
                                          roomClass: "Tier3_Hallway",
                                          S: {
                                            roomClass: "Tier3_Storage",
                                            W: {
                                              roomClass: "Tier3_Storage"
                                            }
                                          },
                                          E: {
                                            roomClass: "Tier3_Hallway",
                                            S: {
                                              roomClass: "Tier3_Hallway",
                                              S: {
                                                roomClass: "Tier3_Hallway",
                                                W: {
                                                  roomClass: "Tier3_Storage",
                                                  relativeId: 4
                                                },
                                                S: {
                                                  roomClass: "Tier3_Storage"
                                                }
                                              }
                                            },
                                            N: {
                                              roomClass: "Tier3_GuardRoom",
                                              N: {
                                                roomClass: "Tier3_GuardRoom",
                                                N: {
                                                  relativeId: 5,
                                                  roomClass: "Tier3_Hallway",
                                                  D: level3
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

    // 4 - add a button to door

    const level1 = {
      E: {
        roomClass: "Tier2_Storage",
        S: {
          E: {
            roomClass: "Tier2_Storage",
            S: {
              roomClass: "Tier2_Storage"
            }
          }
        },
        N: {
          roomClass: "Tier2_Storage",
          E: {
            N: {
              roomClass: "Tier2_Storage",
              W: {
                roomClass: "Tier2_Storage"
              }
            },
            S: {
              roomClass: "Tier2_Storage"
            }
          },
          W: {
            roomClass: "Tier2_Storage",
            W: {
              roomClass: "Tier2_GuardRoom"
            },
            N: {
              W: {
                relativeId: 7,
                W: {
                  relativeId: 71,
                  S: {
                    relativeId: 72,
                    S: {
                      relativeId: 73,
                      E: {
                        roomClass: "Tier2_Storage",
                        S: {
                          E: {
                            roomClass: "Tier2_Storage"
                          },
                          W: {
                            roomClass: "Tier2_Storage"
                          },
                          S: {
                            roomClass: "Tier2_Storage",
                            E: {
                              roomClass: "Tier2_GuardRoom",
                              E: {
                                roomClass: "Tier2_Treasury"
                              }
                            },
                            W: {
                              D: level2
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

    const layout = {
      type: NODE_TYPES.ROOM_LIGHT_STONE,
      E: {
        roomClass: "Tier2_Hallway",
        E: {
          roomClass: "Tier2_Hallway",
          E: {
            relativeId: 1,
            roomClass: "Tier2_Hallway",
            E: {
              roomClass: "Tier2_Hallway",
              E: {
                U: {
                  W: {
                    U: level1
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

    // TODO: enable
    // const exitPath = new RoomPath({}, elements[1], elements[2]);
    // const exitDoors = exitPath.installDoor(WallDoors);
    //
    // elements[3].addStructure(new DungeonButton({
    //     roomPlacement: 'N',
    //     togglesElement: exitDoors,
    //     hiddenStructure: 55,
    // }));

    const shortCut = new RoomPath({}, elements[5], elements[6]);
    const shortCutDoors = shortCut.installDoor(MetalGate);

    elements[4].addStructure(
      new DungeonButton({
        roomPlacement: "W",
        togglesElement: shortCutDoors,
        hiddenStructure: 62
      })
    );

    const pits = [71, 72, 73].map(id => {
      const pit = new DungeonPitfall();
      elements[id].addStructure(pit);
      pit.setDropNode(elements[id + 10]);
      return pit;
    });

    const buffer = new LogicalGateBuffer(15 * SECONDS);
    const delay = new LogicalGateDelay(6 * SECONDS);
    const impulser = new LogicalGateImpulser(5 * SECONDS);
    const splitter = new LogicalGateSplitter(pits);

    buffer.setToggleElement(delay);
    delay.setToggleElement(impulser);
    impulser.setToggleElement(splitter);

    elements[7].addStructure(
      new DungeonPressurePlate({
        roomPlacement: "W",
        togglesElement: buffer,
        hiddenStructure: 62
      })
    );

    entrance.description = `A massive structure with triangular sides converging to a single point at the top.`;
  }
};
