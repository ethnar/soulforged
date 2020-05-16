require("./$monster-den-types");

class MonsterDen extends Dungeon {
  resetDungeon() {}
  checkReset() {}

  constructor(args) {
    super(args);
    this.atLocation = args.atLocation;
    this.denType = args.denType;
    this.denSeen = {};
    if (!this.atLocation) {
      throw new Error("No den location");
    }
    if (!this.denType) {
      throw new Error("No den type");
    }
    if (!MONSTER_DEN_TYPES[this.denType]) {
      throw new Error("Invalid den type " + this.denType);
    }
    this.buildDungeon();
    this.spawnGuardians();

    this.daysSinceSpawned = 0;
  }

  cycle(seconds) {
    const denDefinition = this.getDenDefinition();

    if (TimeCheck.atHour(12, seconds)) {
      this.daysSinceSpawned += 1;

      if (
        !this.cleared &&
        this.daysSinceSpawned * DAYS >= denDefinition.spawnDelay
      ) {
        this.spawnRoamingMonsters();
      }
      if (
        this.cleared ||
        this.daysSinceSpawned * DAYS >= denDefinition.denDuration
      ) {
        this.tryDespawning();
      }
    }
    super.cycle(seconds);
  }

  characterDied() {
    if (this.guardians.length && this.guardians.every(g => g.isDead())) {
      this.dungeonCleared();
    }
  }

  dungeonCleared() {
    if (this.cleared) {
      return;
    }
    this.cleared = true;
    const region = this.entrance.getNode().getRegion();
    if (region) {
      region.modifyThreatLevel(-5);
    }
    this.getPlayersInVicinity().forEach(creature => {
      creature.logging("The den has been cleared!", LOGGING.GOOD);
    });
  }

  getPlayersInVicinity() {
    return [...this.roomNodes, ...this.entryNodes].reduce((acc, room) => {
      return [
        ...acc,
        ...room
          .getCreatures()
          .filter(
            creature =>
              creature instanceof Humanoid && this.creatureCanSeeDen(creature)
          )
      ];
    }, []);
  }

  destroy() {
    const entrance = this.entryNodes[0];
    this.roomNodes.forEach(room => {
      [...room.getItems()].forEach(item => {
        room.removeItem(item);
        entrance.addItem(item);
      });
      [...room.getCreatures()].forEach(creature => {
        creature.move(entrance);
      });
    });
    entrance.reStackItems();
    this.entrance.destroy();
    super.destroy();
  }

  annihilate() {
    this.roomNodes.forEach(room => {
      [...room.getCreatures()]
        .filter(creature => !(creature instanceof Humanoid))
        .forEach(creature => {
          if (!creature.isDead()) {
            creature.die();
          }
          creature.destroy();
        });
      let idx = 0;
      let lastItem = null;
      while (room.getItems().length) {
        if (lastItem === room.getItems()[idx]) {
          idx += 1;
        }
        lastItem = room.getItems()[idx];
        lastItem.destroy(false);
      }
    });

    this.destroy();
  }

  getDenDefinition() {
    return MONSTER_DEN_TYPES[this.denType];
  }

  buildDungeon() {
    this.entrance = dungeonMaker.place(
      this.atLocation,
      null,
      null,
      this.getDenDefinition().getLayout(),
      this,
      true
    ).entrance;
  }

  spawnGuardians() {
    const rooms = this.getDeadEnds();
    const denDefinition = this.getDenDefinition();
    const guardians = denDefinition.guardians;
    this.guardians = this.guardians || [];
    Object.keys(guardians).forEach(monsterClassName => {
      const count = utils.random(...guardians[monsterClassName]);
      for (let i = 0; i < count; i += 1) {
        const room = utils.randomItem(rooms);
        const spawns = room.spawnCreature(global[monsterClassName]);
        spawns.dungeonChaser = true;
        spawns.aggressiveness = 0;
        spawns.movementDelay = Infinity;
        this.guardians.push(spawns);
      }
    });
  }

  getDeadEnds() {
    return this.roomNodes.filter(node => node.getConnections().length <= 1);
  }

  tryDespawning() {
    if (this.getPlayersInVicinity().length) {
      return;
    }
    if (this.cleared) {
      this.destroy();
    } else {
      this.annihilate();
    }
  }

  static spawnNewDenInRegion(region) {
    const validNodes = utils.randomizeArray(
      region
        .getNodes()
        .filter(node => !node.seenRecentlyByPlayer())
        .filter(
          node =>
            !node.getAllStructures().some(s => s instanceof DungeonEntrance)
        )
    );
    const denTypes = utils.randomizeArray(Object.keys(MONSTER_DEN_TYPES));
    while (validNodes.length) {
      const node = validNodes.pop();
      const denType = denTypes.find(monsterDenType => {
        const definition = MONSTER_DEN_TYPES[monsterDenType];
        const placement = definition.placement()[node.getType()];
        return placement && utils.chance(2 * placement);
      });
      if (denType) {
        new MonsterDen({
          atLocation: node,
          denType
        });
        return;
      }
    }
  }

  spawnRoamingMonsters() {
    const region = this.getNode().getRegion();
    if (!region || !utils.chance(region.threatLevel)) {
      return;
    }
    if (!this.getPlayersInVicinity().length) {
      const roamingSpawns = this.getDenDefinition().roamingSpawns();
      Object.keys(roamingSpawns).forEach(monsterClassName => {
        const count = utils.random(...roamingSpawns[monsterClassName]);
        for (let i = 0; i < count; i += 1) {
          const spawns = this.entrance
            .getNode()
            .spawnCreature(global[monsterClassName]);
          spawns.moveRandomly(true);
        }
      });
    }
  }

  getNode() {
    return this.entrance.getNode();
  }

  creatureCanSeeDen(creature) {
    if (creature instanceof Admin) {
      return true;
    }
    if (!creature.getPlayer()) {
      return false;
    }
    if (this.denSeen[creature.getPlayer().getEntityId()]) {
      return true;
    }
    if (this.getNode() === creature.getNode()) {
      const following = FollowSystem.followingWho(creature);
      if (
        following &&
        following.getNode() === creature.getNode() &&
        this.denSeen[following.getPlayer().getEntityId()]
      ) {
        this.denSeen[creature.getPlayer().getEntityId()] = true;
        return true;
      }
    }
    return false;
  }

  static scanForDens(creature) {
    const trackingLevel = creature.getSkillLevel(SKILLS.TRACKING, false);
    const range = 3 + trackingLevel / 2;
    const currentNode = creature.getNode();
    const nodes = currentNode
      .getArea(range, true)
      .filter(({ node }) => node.zLevel === currentNode.zLevel);
    const results = [];

    nodes
      .filter(({ node }) => !(node instanceof Room))
      .forEach(({ node, range }) => {
        const denEntrance = node
          .getAllStructures()
          .find(s => s instanceof MonsterDenEntrance);
        if (!denEntrance) {
          return;
        }
        const den = denEntrance.getDungeon();
        if (den && !den.cleared) {
          const { trackingDifficulty } = den.getDenDefinition();

          const rating = trackingDifficulty + range * 0.3 - 2 - trackingLevel;

          let info;
          switch (true) {
            case rating <= 0:
              den.denSeen[creature.getPlayer().getEntityId()] = true;
              info = 2; // shows on map
              break;
            case rating <= 2:
              if (range === 0) {
                den.denSeen[creature.getPlayer().getEntityId()] = true;
              }
              info = 2; // range and direction
              break;
            case rating <= 5:
              info = 1; // range
              break;
            default:
              info = 0; // only that it's there
              break;
          }
          results.push({ info, den, node, range });
        }
      });

    const distanceToWord = range => {
      switch (true) {
        case range <= 0:
          return "";
        case range <= 2:
          return "close by";
        case range <= 4:
          return "some distance away";
        case range <= 6:
          return "far away";
        default:
          return "very far away";
      }
    };

    const countToWord = (count, first) => {
      let extra = "";
      switch (true) {
        case count === 1:
          extra = first ? "" : "another ";
          return `${extra}one`;
        case count <= 3:
          extra = first ? "" : " more";
          return `a few${extra}`;
        case count <= 6:
          extra = first ? "" : " more";
          return `several${extra}`;
        default:
          extra = first ? "" : " others";
          return `multiple${extra}`;
      }
    };

    results.sort((a, b) => {
      if (a.info === b.info) {
        return a.range - b.range;
      }
      return a.info - b.info;
    });

    if (results.length) {
      const counted = results.reduce((acc, { info, den, node, range }) => {
        const distanceName = info >= 1 ? distanceToWord(range) : "";
        const directionName =
          range === 0 || info >= 2
            ? utils.stringifyDirection(currentNode, node)
            : "";
        let extra = "";
        if (range === 0 && info < 2) {
          extra = ", but you cannot find the entrance";
        }

        const space = distanceName && directionName ? " " : "";
        const key = `${distanceName}${space}${directionName}${extra}`;
        acc[key] = acc[key] || 0;
        acc[key] += 1;
        return acc;
      }, {});

      let first = true;
      const worded = Object.keys(counted).map(position => {
        const result = `${countToWord(counted[position], first)}${
          first ? " den" + (counted[position] > 1 ? "s" : "") : ""
        } ${position}`;
        first = false;
        return result;
      });

      let last;
      if (worded.length > 1) {
        last = worded.pop();
      }

      return (
        "You scout " + worded.join(", ") + (last ? " and " + last : "") + "."
      );
    }

    return "You find no dens in your vicinity.";
  }
}

MonsterDen.scanForDensAction = new Action({
  name: "Scout for dens",
  icon: "/actions/icons8-spyglass-100.png",
  notification: true,
  repeatable: false,
  valid(target, creature) {
    if (target !== creature) {
      return false;
    }
    if (!creature.isOnMainland) {
      return false;
    }
    return true;
  },
  run(target, creature, seconds) {
    const baseTime = 30 * MINUTES;
    if (creature.progressingAction(seconds, baseTime, SKILLS.TRACKING)) {
      let skillExperience = baseTime;

      creature.gainSkill(
        SKILLS.TRACKING,
        0.5 * skillExperience,
        creature.getSkillGainDifficultyMultiplier(SKILLS.TRACKING, -10)
      );
      creature.gainStatsFromSkill(
        SKILLS.TRACKING,
        creature.getTimeSpentOnAction()
      );

      creature.logging(MonsterDen.scanForDens(creature));

      return false;
    }

    return true;
  }
});

module.exports = global.MonsterDen = MonsterDen;
