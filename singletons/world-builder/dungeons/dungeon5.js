const dungeonMaker = require("./dungeon-maker");
const { prisonCellSpecialMonster, lever, after } = dungeonMaker.utils;
const entranceNodeId = 612;

const placeRuin = (nodeId, no) => {
  const node = Entity.getById(nodeId);
  while (node.structures.length) {
    node.structures[0].destroy();
  }
  node.addStructure(
    new Ruins({
      blocking: true,
      persistentRuin: true,
      baseTime: 10 * DAYS,
      buffs: {
        [BUFFS.MOOD]: -25
      },
      mapGraphic: {
        1: `tiles/decor/ruins0${no}.png`
      }
    })
  );
};

module.exports = {
  place() {
    const dormitory = {
      roomClass: "Tier3_Dormitory",
      door: { opened: true }
    };

    Entity.getById(2704).setType(NODE_TYPES.DESERT_GRASS);
    Entity.getById(2399).setType(NODE_TYPES.DESERT_GRASS);
    Entity.getById(523).setType(NODE_TYPES.DESERT_GRASS);
    Entity.getById(750).setType(NODE_TYPES.DESERT_GRASS);
    Entity.getById(612).setType(NODE_TYPES.DESERT_GRASS);

    placeRuin(2704, "4");
    placeRuin(2150, "3");
    placeRuin(2399, "2");
    placeRuin(523, "1");
    placeRuin(750, "3");

    const node = Entity.getById(entranceNodeId);
    const icon = `${ICONS_PATH}/structures/dungeon/temple_ruins_icon.png`;
    const mapGraphic = {
      1: `tiles/decor/templeRuins.png`
    };

    if (node.structures[0]) {
      if (node.structures[0].dungeon) {
        node.structures[0].dungeon.destroy(true);
      }
      node.structures[0].destroy(true);
    }

    const secondFloor = {
      W: {
        door: {},
        roomClass: "Tier4_GuardRoom",
        N: {
          door: {},
          ...after(lever(51, "N")),
          N: prisonCellSpecialMonster(51),
          E: {
            ...after(lever(52, "N")),
            N: prisonCellSpecialMonster(52)
          }
        }
      },
      S: {
        E: {
          door: {},
          roomClass: "Tier4_GuardRoom",
          N: {
            door: {},
            roomClass: "Tier4_GuardRoom",
            N: {
              relativeId: "trial-entrance",
              after(node) {
                node.addStructure(
                  new DungeonTrialEntryRune({
                    roomPlacement: "N"
                  })
                );
              },
              E: {
                ...after(lever("treasury_exit", "W")),
                door: { type: "wall", relativeId: "treasury_exit" },
                roomClass: "TierSpecial_Treasury_Trial",
                relativeId: "trial_treasury"
              }
            }
          },
          E: {
            door: {},
            after: (node, itemGetter) => {
              new RoomPath({}, node, itemGetter("2nd-level-entrance-mid"));
            },
            S: {
              roomClass: "Tier3_MessHall"
            },
            E: {
              N: dormitory,
              S: dormitory,
              E: {
                N: dormitory,
                S: dormitory,
                E: {
                  N: dormitory,
                  S: dormitory,
                  E: {
                    N: dormitory,
                    S: dormitory,
                    E: {
                      after: (node, itemGetter) => {
                        new RoomPath(
                          {},
                          node,
                          itemGetter("2nd-level-entrance-east")
                        );
                      },
                      S: dormitory
                    }
                  }
                }
              }
            }
          }
        }
      }
    };

    const firstFloor = {
      N: {
        E: {
          N: {
            D: {
              relativeId: "2nd-level-entrance-mid"
            }
          },
          S: {
            roomClass: "Tier3_MessHall"
          },
          E: {
            N: dormitory,
            S: dormitory,
            E: {
              N: dormitory,
              S: dormitory,
              E: {
                N: dormitory,
                S: dormitory,
                E: {
                  N: dormitory,
                  S: dormitory,
                  E: {
                    N: {
                      D: {
                        relativeId: "2nd-level-entrance-east"
                      }
                    },
                    S: dormitory
                  }
                }
              }
            }
          }
        },
        W: {
          N: {
            D: secondFloor
          }
        },
        N: {
          N: {
            W: {
              roomClass: "Tier3_GuardRoom"
            },
            E: {
              roomClass: "Tier3_MessHall"
            },
            N: {
              roomClass: "Tier3_Garden",
              W: {
                roomClass: "Tier3_Garden",
                N: {
                  roomClass: "Tier3_Garden",
                  relativeId: "garden-north-west",
                  after: (node, itemGetter) => {
                    new RoomPath({}, node, itemGetter("garden-north-middle"));
                  },
                  W: {
                    door: {},
                    roomClass: "Tier3_Classroom"
                  },
                  N: {
                    door: {},
                    roomClass: "Tier3_Classroom"
                  }
                },
                W: {
                  door: { opened: true },
                  roomClass: "Tier3_Classroom"
                }
              },
              E: {
                roomClass: "Tier3_Garden",
                N: {
                  roomClass: "Tier3_Garden",
                  relativeId: "garden-north-east",
                  after: (node, itemGetter) => {
                    new RoomPath({}, node, itemGetter("garden-north-middle"));
                  },
                  E: {
                    door: {},
                    roomClass: "Tier3_Classroom"
                  },
                  N: {
                    door: {},
                    roomClass: "Tier3_Classroom"
                  }
                },
                E: {
                  door: { opened: true },
                  roomClass: "Tier3_Classroom"
                }
              },
              N: {
                roomClass: "Tier3_Garden",
                relativeId: "garden-north-middle",
                N: {
                  door: {
                    opened: true
                  },
                  roomClass: "Tier3_Classroom"
                }
              }
            }
          }
        }
      }
    };

    const layout = {
      type: NODE_TYPES.ROOM_GREY_STONE,
      ...firstFloor
    };
    const { elements, entrance, dungeon } = dungeonMaker.place(
      node,
      icon,
      mapGraphic,
      layout
    );

    entrance.description = `A massive structure lies in ruins.`;

    world.trialDungeon = {
      entrance: elements["trial-entrance"],
      treasury: elements["trial_treasury"]
    };

    return dungeon;
  }
};

const actions = Action.groupById([
  new Action({
    name: "TouchRune1",
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
      if (!DungeonTrials.isTrialInProgress()) {
        creature.logging(
          `The rune is warm to the touch. It causes you to briefly black out and you find yourself in a different room.`
        );
        DungeonTrials.startTrial(entity.getNode().trialType, creature);
      } else {
        creature.logging(`The rune is cold to the touch.`);
      }
      return ACTION.FINISHED;
    }
  })
]);

class DungeonTrialEntryRune extends Structure {
  static actions() {
    return actions;
  }

  getIcon(creature) {
    return this.constructor.getIcon(creature);
  }

  static getIcon(creature) {
    const icon = DungeonTrials.isTrialInProgress()
      ? "violet_21_red_off.png"
      : "violet_21_red.png";
    return server.getImage(creature, `/${ICONS_PATH}/structures/${icon}`);
  }
}
Entity.factory(DungeonTrialEntryRune, {
  name: "Rune"
});
