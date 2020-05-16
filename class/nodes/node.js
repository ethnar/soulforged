const Entity = require("../.entity");
const Action = require("../action");
const Resource = require("../resources/.resource");
const server = require("../../singletons/server");
const Jimp = require("jimp");
const fs = require("fs");
const path = require("path");

const travelTimeCache = {};
const MAP_CACHE = "/.map";
if (!program.test) {
  fs.mkdir(`resources${MAP_CACHE}`, () => {});
}

const extraPerishTimesADay = 4;
const fastPerishDays = 14;
const fastPerish = fastPerishDays * DAYS;
const extraNeededPerish = PERISHING - fastPerish;
const fastPerishSeconds =
  extraNeededPerish / (fastPerishDays * extraPerishTimesADay);

const mapImagePromises = {};

function terraformAction(label, nodeType, underground) {
  return new Action({
    name: "Change: " + label,
    icon: "/actions/icons8-treasure-map-100.png",
    repeatable: false,
    valid(node, creature) {
      if (creature.adminMode !== "terraform") {
        return false;
      }
      if (underground && node.zLevel !== -1) {
        return false;
      }
      if (!underground && node.zLevel === -1) {
        return false;
      }
      return creature instanceof Admin;
    },
    run(node, creature) {
      [...node.getResources()].forEach(r => r.destroy());
      node.setType(nodeType);
      node.setType(node.getTerraformResult());
    }
  });
}
function addRoomAction(direction, x, y) {
  return new Action({
    name: `Make room: ${direction}`,
    icon: "/actions/icons8-treasure-map-100.png",
    quickAction: true,
    repeatable: false,
    notification: false,
    valid(entity, creature) {
      if (creature.adminMode !== "dungeon") {
        return false;
      }
      if (!(creature instanceof Admin)) {
        return false;
      }
      if (!(entity instanceof Room)) {
        return false;
      }
      return true;
    },
    run(entity, creature) {
      const room = new Room({
        type: NODE_TYPES.ROOM_CLAY,
        x: entity.x + x,
        y: entity.y + y,
        zLevel: entity.zLevel
      });

      new RoomPath({}, entity, room);

      return false;
    }
  });
}
function addDoorAction(doorClassName) {
  return new Action({
    name: `Place doors: ${doorClassName}`,
    icon: "/actions/icons8-treasure-map-100.png",
    quickAction: true,
    repeatable: false,
    notification: false,
    valid(entity, creature) {
      if (creature.adminMode !== "dungeon room") {
        return false;
      }
      if (!(creature instanceof Admin)) {
        return false;
      }
      if (!(entity instanceof Room)) {
        return false;
      }
      if (creature.getNode() === entity) {
        return false;
      }
      const path = entity.getPath(creature.getNode());
      if (!path) {
        return false;
      }
      if (path.getDoors && path.getDoors()) {
        return false;
      }
      return true;
    },
    run(entity, creature) {
      const path = entity.getPath(creature.getNode());

      path.installDoor(global[doorClassName]);

      return false;
    }
  });
}

const regionAdminActions = [
  new Action({
    name: "New region",
    icon: "/actions/icons8-sleep-100.png",
    notification: false,
    repeatable: false,
    quickAction: true,
    valid(node, creature) {
      if (creature.adminMode !== "region") {
        return false;
      }
      if (!(creature instanceof Admin)) {
        return false;
      }
      if (node.getRegion()) {
        return false;
      }
      return true;
    },
    run(node, creature) {
      creature.postponedActions = [];
      new Region([node]);
    }
  }),
  new Action({
    name: "Remove from region",
    icon: "/actions/icons8-sleep-100.png",
    notification: false,
    repeatable: false,
    valid(node, creature) {
      if (creature.adminMode !== "region") {
        return false;
      }
      if (!(creature instanceof Admin)) {
        return false;
      }
      if (!node.getRegion()) {
        return false;
      }
      return true;
    },
    run(node, creature) {
      creature.postponedActions = [];
      node.getRegion().removeNode(node);
    }
  }),
  new Action({
    name: "Attach to region",
    icon: "/actions/icons8-sleep-100.png",
    notification: false,
    repeatable: false,
    quickAction: true,
    valid(node, creature) {
      if (creature.adminMode !== "region") {
        return false;
      }
      if (!(creature instanceof Admin)) {
        return false;
      }
      if (node.getRegion()) {
        return false;
      }
      if (!creature.getRegion()) {
        return false;
      }
      return true;
    },
    run(node, creature) {
      creature.postponedActions = [];
      const region = creature.getRegion();
      region.addNode(node);
    }
  })
];
const dungeonAdminActions = [
  new Action({
    name: "Make dungeon entrance",
    icon: "/actions/icons8-treasure-map-100.png",
    quickAction: true,
    repeatable: false,
    notification: false,
    valid(entity, creature) {
      if (creature.adminMode !== "dungeon") {
        return false;
      }
      if (!(creature instanceof Admin)) {
        return false;
      }
      return true;
    },
    run(entity, creature) {
      const dungeonEntranceStructure = new DungeonEntrance();
      const dungeonExitStructure = new DungeonExit();
      const room = new Room({
        type: NODE_TYPES.ROOM_CLAY,
        x: entity.x,
        y: entity.y,
        zLevel: world.getNextDungeonLevel()
      });

      entity.addStructure(dungeonEntranceStructure);
      dungeonEntranceStructure.setDungeonEntranceNode(room);

      room.addStructure(dungeonExitStructure);
      dungeonExitStructure.setExitNode(entity);

      new RoomPath({}, entity, room);

      return false;
    }
  }),
  addRoomAction("East", 44, 0),
  addRoomAction("South", 0, 38),
  addRoomAction("West", -44, 0),
  addRoomAction("North", 0, -38),

  addDoorAction("WoodenDoors"),
  addDoorAction("MetalGate")
];
const terraformAdminActions = [
  terraformAction("Water", NODE_TYPES.COAST),
  terraformAction("Plains", NODE_TYPES.PLAINS),
  terraformAction("Forest", NODE_TYPES.BROADLEAF_FOREST),
  terraformAction("Hills", NODE_TYPES.HILLS_GRASS),
  terraformAction("Mountains", NODE_TYPES.MOUNTAINS_COLD),
  terraformAction("Open cave", NODE_TYPES.UNDERGROUND_FLOOR, true),
  terraformAction("Rocky Cave", NODE_TYPES.UNDERGROUND_CAVE, true),
  terraformAction("Wall", NODE_TYPES.UNDERGROUND_WALL, true),
  terraformAction("Bedrock", NODE_TYPES.UNDERGROUND_BEDROCK, true)
];

const actions = Action.groupById([
  new Action({
    name: "Travel",
    breaksHiding: true,
    notification: (node, creature) => !(node instanceof Room),
    difficulty: (node, creature) => node.getDifficultyLabel(creature),
    dynamicLabel: (entity, creature, current) => {
      const directionName = utils.getDirectionName(
        utils.getDirection(creature.getNode(), entity)
      );
      const directionLabel = directionName ? ` (${directionName})` : "";
      switch (true) {
        // case (creature.hasEnemies(entity) || creature.hasUnknowns(entity)) &&
        //   creature.seesNode(entity):
        //   return ASSAULT_ACTION_NAME + ` (${directionName})`;
        case creature.hasEnemies():
          return "Flee" + directionLabel;
        default:
          return "Travel" + directionLabel;
      }
    },
    queueEstimate: (entity, creature) => {
      if (!creature.travelQueue || creature.travelQueue.length <= 1) {
        return 0;
      }
      return (
        creature.travelQueue
          .map((node, idx) => {
            const next = creature.travelQueue[idx + 1];
            if (!next) {
              return 0;
            }
            return (
              node.getPath(next) && node.getPath(next).getDistance(creature)
            );
          })
          .reduce((acc, v) => acc + v, 0) /
        (creature.currentAction ? creature.currentAction.efficiency : 0)
      );
    },
    icon: "/actions/icons8-treasure-map-100.png",
    repeatable: false,
    onStart(entity, creature) {
      if (
        creature.lastTravel &&
        creature.lastTravel.time.getTime() + 10 * SECONDS * IN_MILISECONDS >
          world.getCurrentTime().getTime()
      ) {
        return;
      }
      creature
        .getNode()
        .getConnectedNodes()
        .forEach(node => {
          node
            .getCreatures()
            .filter(c => !c.isDead())
            .filter(c => c.isPlayableCharacter())
            .forEach(toNotify => {
              const unknown = toNotify.canSeeCreatureDetails(creature) < 2;
              if (
                (unknown || (!unknown && toNotify.isHostile(creature))) &&
                toNotify.seesNode(creature.getNode())
              ) {
                const direction = utils.getDirection(
                  toNotify.getNode(),
                  creature.getNode()
                );
                const directionPositionDescriptor = utils.getDirectionPositionDescriptor(
                  direction
                );
                const directionName = utils.getDirectionName(direction);
                const label = unknown
                  ? `An unknown nearby creature`
                  : `A hostile nearby ${toNotify.getCreatureName(creature)}`;
                const notify = unknown ? `unknown-movement` : true;
                toNotify.logging(
                  `${label} ${directionPositionDescriptor} ${directionName} is on the move.`,
                  LOGGING.WARN,
                  notify,
                  EMOJIS.EYES
                );
                try {
                  utils.log(
                    `Movement notification: ${
                      toNotify.name
                    } notified about ${creature.getName()} (${creature.getEntityId()})`
                  );
                } catch (e) {}
              }
            });
        });
    },
    valid(entity, creature) {
      if (entity === creature.getNode()) {
        return false;
      }
      return true;
    },
    available(entity, creature, context) {
      if (creature.isOverburdened()) {
        return "You are overburdened!";
      }
      // const path = entity.getPath(creature.getNode());
      // if (path && path.isInaccessible()) {
      //     return 'The path is blocked';
      // }
      if (
        entity instanceof Node &&
        creature.currentAction &&
        creature.isPlayableCharacter() &&
        !FollowSystem.followingWho(creature)
      ) {
        const targetNode = entity;
        const enemyPresence = creature.hasEnemies(targetNode);
        const unknownsPresence = creature.hasUnknowns(targetNode);
        const seesNode = creature.seesNode(targetNode);

        if (
          seesNode &&
          enemyPresence &&
          !creature.isAssaulting(context) &&
          !creature.disregardHostiles(context)
        ) {
          creature.lastTravel.time = world.getCurrentTime();
          return "Enemies ahead!";
        }
        if (
          seesNode &&
          unknownsPresence &&
          !creature.ignoresUnknowns(context) &&
          !creature.isAssaulting(context) &&
          !creature.disregardHostiles(context)
        ) {
          creature.lastTravel.time = world.getCurrentTime();
          return "Unknown creatures ahead!";
        }
      }
      return true;
    },
    unblockOption(node, creature) {
      creature.currentAction.context = {
        skipUnknowns: true,
        assault: true,
        disregard: false
      };
      return true;
    },
    unblockOptionLabel(node, creature) {
      if (
        creature.currentAction.blocked === "Unknown creatures ahead!" ||
        creature.currentAction.blocked === "Enemies ahead!"
      ) {
        return "Ambush";
      }
      return false;
    },
    run(node, creature, seconds) {
      if (!node.hasPath(creature.getNode())) {
        node = creature.pathfinding(node);
        if (!node) {
          return false;
        }
      }

      const path = creature.getNode().getPath(node);

      if (!creature.travelQueue || !creature.travelQueue.length) {
        creature.travelQueue = [node];
      }

      const targetNode = creature.travelQueue[0];

      const efficiency = creature.getEfficiency(
        node.travelSkill,
        null,
        true,
        creature.getTravelSpeed()
      );

      if (path.getDistance(creature) === Infinity) {
        creature.logging("Area is not accessible!", LOGGING.WARN);
        creature.stopAction(false);
        return false;
      }
      let travelTime = path.getDistance(creature);
      if (creature.hasEnemies()) {
        travelTime += creature.getBuff(BUFFS.FLEE_TIME);
      }

      const currentTravelSpeed = 100 + creature.getBuff(BUFFS.TRAVEL_SPEED);
      const lastSpeed =
        (creature.lastTravel && creature.lastTravel.travelSpeed) ||
        currentTravelSpeed;

      creature.actionProgress = Math.min(
        100,
        (creature.actionProgress * currentTravelSpeed) / lastSpeed
      );

      creature.actionProgress += (seconds * efficiency * 100) / travelTime;

      if (
        currentTravelSpeed / lastSpeed === 1 &&
        creature.lastTravel &&
        creature.lastTravel.node === targetNode.id &&
        creature.lastTravel.progress > creature.actionProgress &&
        creature.lastTravel.time.getTime() + 10 * SECONDS * IN_MILISECONDS >
          world.getCurrentTime().getTime()
      ) {
        creature.actionProgress = creature.lastTravel.progress;
      } else {
        creature.lastTravel = {
          node: targetNode.id,
          progress: creature.actionProgress,
          time: world.getCurrentTime(),
          travelSpeed: currentTravelSpeed
        };
      }

      if (FollowSystem.shouldBlockTravelAction(creature)) {
        return true;
      }

      if (creature.actionProgress >= 100) {
        creature.actionProgress -= 100;

        creature.move(node);

        if (creature instanceof Humanoid) {
          creature
            .getNode()
            .getConnectedNodes()
            .forEach(connected =>
              connected.rattleTheMonsters(creature, 10 * MINUTES)
            );
        }

        const pathDifficulty = node.getTravelDifficulty(creature);

        const injuryChance =
          100 -
          creature.getSkillSuccessChance(node.travelSkill, pathDifficulty);
        if (injuryChance > 0) {
          const message = creature.accidentChance(
            injuryChance,
            node.travelSkill,
            null,
            path.getDistance()
          );
          if (message) {
            creature.logging(message, LOGGING.FAIL);
          }
        }

        const experience = path.getDistance();
        if (experience) {
          creature.gainSkill(
            node.travelSkill,
            experience,
            creature.getSkillGainDifficultyMultiplier(
              node.travelSkill,
              pathDifficulty
            )
          );
          creature.gainStatsFromSkill(
            node.travelSkill,
            creature.getTimeSpentOnAction()
          );
        }

        if (creature.travelQueue && creature.travelQueue.length > 1) {
          if (
            creature.currentAction.context &&
            creature.currentAction.context.disregard &&
            creature.hasEnemies()
          ) {
            creature.protectionStatus = PROTECTION_STATUS.UNPROTECTED;
          }

          creature.travelQueue.shift();
          const targetNode = creature.travelQueue[0];
          creature.currentAction.entityId = targetNode.getEntityId();

          this.onStart(targetNode, creature);

          return true;
        } else {
          if (
            creature.protectionStatus === PROTECTION_STATUS.IDLE &&
            creature.hasEnemies()
          ) {
            creature.stopAction(true, false, true);
            creature.enableProtectionStatus();
          }
        }

        return false;
      }
      return true;
    },
    update(entity, creature) {
      creature.travelQueue = [];
    },
    onFinish(entity, creature) {
      creature.travelQueue = [];
    },
    ...utils.jsAction("/js/actions/travel")
  }),
  new Action({
    name: "Name town",
    icon: "/actions/icons8-parchment-100.png",
    notification: false,
    repeatable: false,
    quickAction: true,
    valid(entity, creature) {
      if (entity !== creature.getNode()) {
        return false;
      }
      const home = creature.getHome(entity);
      if (!home) {
        return false;
      }
      if (!home.isComplete()) {
        return false;
      }
      if (home.getOwner() !== creature) {
        return false;
      }
      if (!Nameable.canVote(creature, entity)) {
        return false;
      }
      return true;
    },
    ...utils.jsAction("/js/actions/name-town")
  }),
  new Action({
    name: "Name region",
    icon: "/actions/icons8-parchment-100.png",
    ...utils.jsAction("/js/actions/name-region"),
    notification: false,
    repeatable: false,
    quickAction: true,
    valid(node, creature) {
      if (!Nameable.canVote(creature, node.getRegion())) {
        return false;
      }
      return true;
    }
  }),

  new Action({
    name: "Teleport",
    icon: "/actions/icons8-treasure-map-100.png",
    quickAction: true,
    repeatable: false,
    notification: false,
    valid(entity, creature) {
      if (!(creature instanceof Admin)) {
        return false;
      }
      return true;
    },
    run(entity, creature) {
      creature.travelQueue = [];
      creature.postponedActions = [];
      creature.move(entity);
      return false;
    }
  }),

  ...regionAdminActions,
  ...terraformAdminActions
  // ...dungeonAdminActions,
]);

class Node extends Entity {
  static actions() {
    return actions;
  }

  constructor(args) {
    super(args);

    this.type = args.type;
    this.resources = [];
    this.structures = [];
    this.creatures = [];
    this.items = [];
    this.paths = [];
    this.events = [];
    this.temperature = 0;

    world.addNode(this);
  }

  getType() {
    return this.type;
  }

  setType(type) {
    const oldType = this.type;
    this.type = type;
    if (type !== oldType) {
      this.placeRegrowingResource();
    }
    this.manageResources();
  }

  manageResources() {
    // SAND
    if (
      [
        NODE_TYPES.DESERT_SAND,
        NODE_TYPES.DESERT_PALMS,
        NODE_TYPES.CACTI
      ].includes(this.getType())
    ) {
      if (!this.hasResource("SandPile")) {
        this.addResource(new SandPile());
      }
    } else if (!this.isCoast()) {
      this.removeResourceType("SandPile");
    }
  }

  recalculateType() {}

  placeRegrowingResource() {
    Resource.getAllResourcesTypes().forEach(resource => {
      if (resource.prototype instanceof RegrowingResource) {
        this.removeResourceType(resource.name);
        this.placeResource(resource.name);
      }
    });
  }

  everyoneCheckForEnemies() {
    this.getCreatures().forEach(creature => creature.checkForEnemies());
  }

  isType(type) {
    return this.type === type;
  }

  isWater() {
    return (
      this.isType(NODE_TYPES.LAKE) ||
      this.isType(NODE_TYPES.OCEAN) ||
      this.isType(NODE_TYPES.COAST) ||
      this.isType(NODE_TYPES.UNDERGROUND_LAKE)
    );
  }

  isWall() {
    return false;
  }

  isForest() {
    return (
      this.isType(NODE_TYPES.BROADLEAF_FOREST) ||
      this.isType(NODE_TYPES.CONIFEROUS_FOREST) ||
      this.isType(NODE_TYPES.CONIFEROUS_FOREST_COLD) ||
      this.isType(NODE_TYPES.CONIFEROUS_FOREST_SNOWED)
    );
  }

  setWorld(world) {
    this.world = world;
  }

  getWorld() {
    return this.world;
  }

  setRegion(region) {
    this.region = region;
  }

  getRegion() {
    return this.region;
  }

  getCompleteStructures() {
    return this.getAllStructures().filter(structure => structure.isComplete());
  }

  placeResource(resourceName) {
    const resource = global[resourceName];
    let chance = resource.placementChancePerNodeType(this.getType());
    if (resource.prototype.activeFor) {
      chance =
        (chance * RESOURCE_REROLL_FREQUENCY) /
        global[resourceName].prototype.activeFor;
    }

    if (!chance) {
      return;
    }

    if (utils.chance(chance, 1, 5)) {
      this.addResource(new global[resourceName]({}));
    }
  }

  hasResource(resourceName) {
    return this.resources.find(r => r.isType(resourceName));
  }

  getResources() {
    return this.resources;
  }

  getAllStructures() {
    return this.structures;
  }

  addStructure(structure) {
    structure.setNode(this);
    this.structures.push(structure);
  }

  addResourceByType(type, qty) {
    const existing = this.resources.find(r => r instanceof type);

    if (existing) {
      existing.setSize(existing.getSize() + qty);
    } else {
      this.addResource(
        new type({
          size: qty
        })
      );
    }
  }

  addResource(resource) {
    const exists = this.resources.find(
      res => res instanceof resource.constructor
    );

    this.resources.push(resource);
    resource.setNode(this);

    const region = this.getRegion();
    if (
      region &&
      region.getAllowedResources() &&
      !region.getAllowedResources().includes(resource.constructor.name)
    ) {
      utils.log(
        "Forbidden resource",
        resource.constructor.name,
        "on node",
        this.getEntityId()
      );
      resource.destroy();
      return;
    }

    if (resource.placementCondition && !resource.placementCondition(this)) {
      resource.destroy();
      return;
    }

    if (exists) {
      const newSize = exists.getSize() + resource.getSize();
      exists.setSize(newSize);
      resource.destroy();
    }
  }

  removeResource(resource) {
    this.resources = this.resources.filter(r => r !== resource);
  }

  removeResourceType(resourceName) {
    this.resources = this.resources.filter(r => {
      if (r instanceof global[resourceName]) {
        r.destroy();
        return false;
      }
      return true;
    });
  }

  getResourceOfType(resourceName) {
    return this.resources.find(r => r instanceof global[resourceName]);
  }

  getVisibleResources(creature) {
    return Object.values(
      this.resources
        .filter(resource => resource.isVisible())
        .reduce((acc, resource) => {
          const name = resource.constructor.name;
          if (!acc[name] || acc[name].size < resource.size) {
            return {
              ...acc,
              [name]: resource
            };
          }
          return acc;
        }, {})
    );
  }

  isTown() {
    const homeLevels = this.getCompleteStructures()
      .filter(structure => structure instanceof Home)
      .reduce((acc, home) => acc + home.getHomeLevel(), 0);

    return homeLevels >= 8;
  }

  removeStructure(structure) {
    const idx = this.structures.indexOf(structure);
    this.structures.splice(idx, 1);

    if (!this.isTown()) {
      Nameable.resetVotes(this);
    }
  }

  hasStructure(structureName) {
    return this.getCompleteStructures().some(
      structure =>
        structure.constructor.name === structureName ||
        (structure.obsoletes && structure.obsoletes.includes(structureName))
    );
  }

  hasUnblockedStructure(structureName, creature, messages = []) {
    return this.getCompleteStructures().some(structure => {
      if (
        structure.constructor.name === structureName ||
        (structure.obsoletes && structure.obsoletes.includes(structureName))
      ) {
        if (creature.isBlockedByAnyone(structure)) {
          messages.push(creature.accessErrorMessage(structure));
          return false;
        }
        return true;
      }
      return false;
    });
  }

  hasBuildings() {
    return this.getBuildings().length;
  }

  getBuildings() {
    return this.getCompleteStructures().filter(
      structure => structure instanceof Building
    );
  }

  addItem(item) {
    this.items.push(item);
    item.perishing = PERISHING;
    item.setContainer(this);
  }

  addItemByType(itemType, qty = 1) {
    const existing =
      itemType.prototype.stackable &&
      this.items.find(i => i.constructor === itemType && i.integrity === 100);
    if (existing) {
      existing.qty += qty;
      return existing;
    } else {
      const item = new itemType({ qty });
      this.addItem(item);
      return item;
    }
  }

  removeItem(item) {
    const idx = this.items.indexOf(item);
    if (idx !== -1) {
      this.items.splice(idx, 1);
    }
    item.setContainer(null);
  }

  getItems() {
    return this.items;
  }

  reStackItems() {
    this.items = utils.reStackItems(this.items);
  }

  rattleTheMonsters(creature, baseTime) {
    this.getCreatures()
      .filter(c => c instanceof Monster)
      .forEach(c => c.rattledBy(creature, baseTime));
  }

  getCreatures() {
    return this.creatures;
  }

  getVisibleAliveCreatures() {
    return this.getVisibleCreatures().filter(c => !c.isDead());
  }

  getVisibleCreatures() {
    return this.getCreatures().filter(creature => creature.isVisible());
  }

  addCreature(creature) {
    this.creatures.push(creature);
    creature.setNode(this);
    this.everyoneCheckForEnemies();
  }

  spawnCreature(classCtr) {
    const c = new classCtr();
    this.addCreature(c);
    c.move(this);
    return c;
  }

  static getSeenRecentlyByPlayerMap() {
    if (!Node.seenRecentlyMap) {
      Node.calculateSeenRecentlyByPlayerMap();
    }
    return Node.seenRecentlyMap;
  }

  static updateSeenRecentlyByPlayerMap(nodeId) {
    const map = Node.getSeenRecentlyByPlayerMap();
    map[nodeId] = true;
  }

  static calculateSeenRecentlyByPlayerMap() {
    const time = 20 * HOURS;
    const results = {};
    Entity.getEntities(Humanoid)
      .filter(humanoid => humanoid.isPlayableCharacter())
      .filter(humanoid => !(humanoid instanceof Admin))
      .forEach(h => {
        Object.keys(h.getMapData()).forEach(nodeId => {
          const data = h.getMapData(nodeId);
          if (!data || !data.cache || !data.cache.lastUpdate) {
            return;
          }
          if (
            world.getCurrentTime() - data.cache.lastUpdate <=
            time * IN_MILISECONDS
          ) {
            results[nodeId] = true;
          }
        });
      });
    Node.seenRecentlyMap = results;
  }

  seenRecentlyByPlayer() {
    const map = Node.getSeenRecentlyByPlayerMap();
    return map[this.getEntityId()];
  }

  removeCreature(creature) {
    const idx = this.creatures.indexOf(creature);
    if (idx === -1) {
      utils.error("Attempting to remove creature not found in the node");
    } else {
      this.creatures.splice(idx, 1);
      this.everyoneCheckForEnemies();
    }
  }

  findNearest(condition, pathCondition = () => true, max = Infinity) {
    const nodes = {
      [this.getEntityId()]: 1
    };

    let check = [this];

    while (check.length) {
      const next = utils.randomizeArray(check);
      check = [];

      const match = next.find(node => {
        if (condition(node)) {
          return true;
        }
        const distance = nodes[node.getEntityId()];
        node.getConnectedNodes().forEach(connected => {
          if (nodes[connected.getEntityId()] === undefined) {
            nodes[connected.getEntityId()] = distance + 1;
            if (distance + 1 <= max && pathCondition(connected)) {
              check.push(connected);
            }
          }
        });
      });

      if (match) {
        return match;
      }
    }

    return null;
  }

  addConnection(path) {
    this.paths.push(path);
  }

  removeConnection(path) {
    const idx = this.paths.indexOf(path);
    if (idx !== -1) {
      this.paths.splice(idx, 1);
    }
  }

  isCoast() {
    // TODO: performance opportunity
    return !this.isWater() && this.getConnectedNodes().some(n => n.isWater());
  }

  isConnectedTo(node) {
    return !!this.getConnections().some(path => path.hasNode(node));
  }

  getConnections(includeSeeThrough = false) {
    return this.paths.filter(path =>
      includeSeeThrough ? !path.blocksVision() : !path.isInaccessible()
    );
  }

  getConnectedNodes() {
    return this.getConnections().map(path => path.getOtherNode(this));
  }

  getConnectedLocations() {
    return this.getConnectedNodes().filter(node => !(node instanceof Room));
  }

  hasPath(toNode) {
    const path = this.getPath(toNode);
    return !!path && !path.isInaccessible();
  }

  getPath(toNode) {
    return this.paths.find(path => path.hasNode(toNode));
  }

  isConnectedDown() {
    return this.hasPath(this.getLevelDown());
  }

  isConnectedUp() {
    return this.hasPath(this.getLevelUp());
  }

  getLevelDown() {
    return Entity.getById(this.levelDownId);
  }

  getLevelUp() {
    return Entity.getById(this.levelUpId);
  }

  blocksVision() {
    return NODE_TYPE_BLOCKS_VISION[this.getType()];
  }

  connectToLevelDown() {
    const nodeLevelDown = this.getLevelDown();
    if (!this.isConnectedTo(nodeLevelDown)) {
      new LevelPath({}, this, nodeLevelDown);
      this.addStructure(new WayDown());
      nodeLevelDown.addStructure(new WayUp());
    }
  }

  disconnectFromLevelDown() {
    const nodeLevelDown = this.getLevelDown();
    if (!this.isConnectedTo(nodeLevelDown)) {
      new LevelPath({}, this, nodeLevelDown);
      this.addStructure(new WayDown());
      nodeLevelDown.addStructure(new WayUp());
    }
  }

  getTravelDifficulty(creature, withMods = true) {
    let type;
    if (creature && creature.getNodeInfo) {
      type = creature.getNodeInfo(this).type;
    } else {
      type = this.getType();
    }
    const base = NODE_TYPE_TRAVEL_DIFFICULTY[type];
    if (!withMods) {
      return base;
    }
    return (
      base +
      (creature ? creature.getBuff(BUFFS.TRAVEL_DIFFICULTY) : 0) +
      world.getBuff(BUFFS.TRAVEL_DIFFICULTY_OVERWORLD) +
      this.getCompleteStructures().reduce(
        (acc, s) =>
          acc + s.getBuff(BUFFS.TRAVEL_DIFFICULTY_OVERWORLD, creature),
        0
      )
    );
  }

  getTravelTime(creature, current = false) {
    if (!creature) {
      return this.getBaseTravelTime();
    }
    return creature.getTravelTime(this, current);
  }

  getTravelTimeModifier(creature) {
    const nodeInfo =
      creature && creature.getNodeInfo && creature.getNodeInfo(this);
    if (!nodeInfo) {
      return this.getCompleteStructures().reduce(
        (acc, s) => acc + s.getBuff(BUFFS.TRAVEL_TIME, creature),
        0
      );
    }

    return (nodeInfo.structures || [])
      .filter(s => s.complete !== false)
      .map(s =>
        global[s.buildingCode].prototype.getBuff(BUFFS.TRAVEL_TIME, creature)
      )
      .reduce((acc, value) => acc + value, 0);
  }

  getBaseTravelTime(creature) {
    const difficulty = this.getTravelDifficulty(creature, false);
    const modifier = this.getTravelTimeModifier(creature);
    const multiplier = (100 + modifier) / 100;
    const difficultyBottom = Math.floor(difficulty);
    const difficultyTop = Math.ceil(difficulty);
    if (difficultyBottom === difficultyTop) {
      return multiplier * TRAVEL_TIMES[difficultyBottom] || Infinity;
    }
    return (
      multiplier *
      ((TRAVEL_TIMES[difficultyBottom] || Infinity) *
        (difficultyTop - difficulty) +
        (TRAVEL_TIMES[difficultyTop] || Infinity) *
          (difficulty - difficultyBottom))
    );
  }

  getViewRangeModifier() {
    return world.getBuff(BUFFS.VIEW_RANGE_OVERWORLD);
  }

  getDifficultyLabel(creature) {
    return creature.getDifficultyLabel(
      this.travelSkill,
      this.getTravelDifficulty(creature)
    );
  }

  getEvents() {
    this.events = this.events || [];
    return this.events;
  }

  getNodeEventsPayload(creature) {
    return this.getEvents().map(event => event.getPayload(creature));
  }

  getDetailsPayload(creature) {
    return {
      creatures: this.getCreatures()
        .filter(c => c === creature || c.isVisible())
        .map(c => c.getPayload(creature, false))
        .filter(creaturePayload => !!creaturePayload),
      resources: this.getVisibleResources(creature)
        .map(resource => resource.getPayload(creature))
        .filter(resourcePayload => !!resourcePayload),
      structures: this.structures
        .map(structure => structure.getPayload(creature, this))
        .filter(structurePayload => !!structurePayload),
      zLevel: this.zLevel
    };
  }

  getPayload(creature) {
    let result = {
      id: this.getEntityId(),
      name: this.getName(),
      actions: this.getActionsPayloads(creature),
      region: this.getRegion() && this.getRegion().getName(),
      x: this.x - creature.getStartingNode().x,
      y: this.y - creature.getStartingNode().y
    };

    if (program.dev) {
      result.debug = this.debug;
    }

    if (creature.getNode() === this) {
      result = {
        ...result,
        ...this.getDetailsPayload(creature)
      };
    }

    return result;
  }

  static getName(type) {
    return NODE_NAMES[type];
  }

  getName() {
    let name = NODE_NAMES[this.type];
    if (program.dev) {
      name += ` (${this.id})`;
    }
    return name;
  }

  oneOfImage(...images) {
    return images[this.getEntityId() % images.length];
  }

  getClimate() {
    const hot = this.getTemperature() > 2;
    const cold = this.getTemperature() < -2;
    const temperate = !hot && !cold;
    const wet = this.getDrainage() > 2;
    const dry = this.getDrainage() < -2;
    const medium = !wet && !dry;
    return { hot, cold, temperate, wet, dry, medium };
  }

  getTerraformResult() {
    const { hot, cold, temperate, wet, dry, medium } = this.getClimate();
    const groups = [
      {
        [NODE_TYPES.TROPICAL_PLAINS]: hot && wet,
        [NODE_TYPES.DESERT_GRASS]: hot && medium,
        [NODE_TYPES.DESERT_SAND]: hot && dry,
        [NODE_TYPES.BOG]: temperate && wet,
        [NODE_TYPES.PLAINS]: temperate && medium,
        [NODE_TYPES.SCRUB_LAND]: temperate && dry,
        [NODE_TYPES.SNOW_FIELDS]: cold && wet,
        [NODE_TYPES.PLAINS_SNOW]: cold && medium,
        [NODE_TYPES.COLD_DIRT]: cold && dry
      },
      {
        [NODE_TYPES.JUNGLE]: hot && wet,
        [NODE_TYPES.SAVANNAH]: hot && medium,
        [NODE_TYPES.CACTI]: hot && dry,
        [NODE_TYPES.SWAMP]: temperate && wet,
        [NODE_TYPES.BROADLEAF_FOREST]: temperate && medium,
        [NODE_TYPES.DESERT_PALMS]: temperate && dry,
        [NODE_TYPES.CONIFEROUS_FOREST_SNOWED]: cold && wet,
        [NODE_TYPES.CONIFEROUS_FOREST_COLD]: cold && medium,
        [NODE_TYPES.CONIFEROUS_FOREST]: cold && dry
      },
      {
        [NODE_TYPES.HILLS_REDGRASS]: hot && medium,
        [NODE_TYPES.HILLS_DIRT]: dry && !cold,
        [NODE_TYPES.HILLS_GRASS]: (wet && !cold) || (temperate && !dry),
        [NODE_TYPES.HILLS_SNOW]: cold && !dry,
        [NODE_TYPES.HILLS_COLD]: cold && dry
      },
      {
        [NODE_TYPES.MOUNTAINS_DIRT]: (!cold && dry) || (hot && medium),
        [NODE_TYPES.MOUNTAINS_COLD]:
          (!cold && wet) || (temperate && !dry) || (cold && dry),
        [NODE_TYPES.MOUNTAINS_SNOW]: cold && !dry
      }
    ];

    const type = this.getType();
    const group = groups.find(g => g[type] !== undefined);

    if (!group) {
      return type;
    }

    const targetType = Object.keys(group).find(target => group[target]);

    if (!targetType) {
      throw new Error(
        "Unable to terraform correctly",
        this.getType(),
        hot,
        temperate,
        cold,
        wet,
        medium,
        dry
      );
    }

    return +targetType;
  }

  getImageFilesStack(creature) {
    const tileInfo = creature.getNodeInfo(this);
    const imageFiles = [];
    const addHexes = name => {
      imageFiles.push(
        this.oneOfImage(
          `tiles/${name}00.png`,
          `tiles/${name}01.png`,
          `tiles/${name}02.png`,
          `tiles/${name}03.png`
        )
      );
    };

    const imagesFromBuildings = {};

    this.getCompleteStructures().forEach(s => {
      if (s.mapGraphic) {
        const graphics =
          typeof s.mapGraphic === "function"
            ? s.mapGraphic(this, s)
            : s.mapGraphic;
        Object.keys(graphics).forEach(prio => {
          imagesFromBuildings[prio] = imagesFromBuildings[prio] || [];
          imagesFromBuildings[prio].push(graphics[prio]);
        });
      }
    });

    const hasWayDown = this.isConnectedDown();
    const hasWayUp = this.isConnectedUp();

    switch (tileInfo.type) {
      case NODE_TYPES.LAKE:
        addHexes("hexwater");
        break;
      case NODE_TYPES.COAST:
        addHexes("hexwater");
        break;
      case NODE_TYPES.OCEAN:
        addHexes("hexocean");
        break;
      case NODE_TYPES.UNDERGROUND_LAKE:
        addHexes("hexwaterunder");
        break;
      case NODE_TYPES.TROPICAL_PLAINS:
        addHexes("hextropicalplains");
        break;
      case NODE_TYPES.DESERT_GRASS:
        addHexes("hexdesertredgrass");
        break;
      case NODE_TYPES.DESERT_SAND:
        addHexes("hexdesertdunes");
        break;
      // case NODE_TYPES.BOG: addHexes('hexwetlandsdark'); break;
      // case NODE_TYPES.BOG: addHexes('hexmarsh'); break;
      case NODE_TYPES.BOG:
        addHexes("hexmarshdark");
        break;
      case NODE_TYPES.PLAINS:
        addHexes("hexplains");
        break;
      case NODE_TYPES.SCRUB_LAND:
        addHexes("hexscrublands");
        break;
      case NODE_TYPES.SNOW_FIELDS:
        addHexes("hexsnowfield");
        break;
      case NODE_TYPES.PLAINS_SNOW:
        addHexes("hexplainscoldsnowcovered");
        break;
      case NODE_TYPES.COLD_DIRT:
        addHexes("hexdirtcold");
        break;
      case NODE_TYPES.JUNGLE:
        addHexes("hexjunglelight");
        break;
      case NODE_TYPES.SAVANNAH:
        addHexes("hexdesertredforest");
        break;
      case NODE_TYPES.CACTI:
        addHexes("hexdesertyellowcactiforest");
        break;
      case NODE_TYPES.SWAMP:
        addHexes("hexswampdark");
        break;
      case NODE_TYPES.BROADLEAF_FOREST:
        addHexes("hexforestbroadleaf");
        break;
      case NODE_TYPES.DESERT_PALMS:
        addHexes("hexgrassysandpalms");
        break;
      case NODE_TYPES.CONIFEROUS_FOREST_SNOWED:
        addHexes("hexforestpinesnowcovered");
        break;
      case NODE_TYPES.CONIFEROUS_FOREST_COLD:
        addHexes("hexforestpinesnowtransition");
        break;
      case NODE_TYPES.CONIFEROUS_FOREST:
        addHexes("hexdirtcoldpines");
        break;
      case NODE_TYPES.HILLS_REDGRASS:
        if (hasWayDown) imageFiles.push(`tiles/hexdesertredhillscave00.png`);
        else addHexes("hexdesertredhills");
        break;
      case NODE_TYPES.HILLS_DIRT:
        if (hasWayDown)
          imageFiles.push(`tiles/hexdesertyellowhillscave030.png`);
        else addHexes("hexdesertyellowhills");
        break;
      case NODE_TYPES.HILLS_GRASS:
        if (hasWayDown) imageFiles.push(`tiles/hexhillscave00.png`);
        else addHexes("hexhills");
        break;
      case NODE_TYPES.HILLS_SNOW:
        if (hasWayDown)
          imageFiles.push(`tiles/hexhillscoldsnowcoveredcave00.png`);
        else addHexes("hexhillscoldsnowcovered");
        break;
      case NODE_TYPES.HILLS_COLD:
        if (hasWayDown) imageFiles.push(`tiles/hexhillscoldcave_gray00.png`);
        else addHexes("hexhillscold_gray");
        break;
      case NODE_TYPES.MOUNTAINS_DIRT:
        if (hasWayDown) addHexes("hexdesertyellowmesascave");
        else addHexes("hexdesertyellowmesas");
        break;
      case NODE_TYPES.MOUNTAINS_COLD:
        if (hasWayDown)
          imageFiles.push(
            this.oneOfImage(
              `tiles/hexmountaincave00.png`,
              `tiles/hexmountaincave01.png`
            )
          );
        else addHexes("hexmountain");
        break;
      case NODE_TYPES.MOUNTAINS_SNOW:
        if (hasWayDown) addHexes("hexmountainsnowcave");
        else addHexes("hexmountainsnow");
        break;
      case NODE_TYPES.UNDERGROUND_BEDROCK:
        imageFiles.push(`tiles/underground/hexwallbedrock_darker.png`);
        break;
      case NODE_TYPES.UNDERGROUND_WALL:
        imageFiles.push(`tiles/underground/hexwall_light_2.png`);
        break;
      case NODE_TYPES.UNDERGROUND_FLOOR:
        if (hasWayUp)
          imageFiles.push(`tiles/underground/hexdesertredhillscave00.png`);
        else addHexes("underground/hexdesertyellowhills");
        break;
      case NODE_TYPES.UNDERGROUND_CAVE:
        if (hasWayUp)
          imageFiles.push(`tiles/underground/hexdesertyellowmesascave02.png`);
        else addHexes("underground/hexdesertyellowmesas");
        break;
      case NODE_TYPES.UNDERGROUND_VOLCANO:
        imageFiles.push(`tiles/underground/hexvolcanoactive02.png`);
        break;
      case NODE_TYPES.UNDERGROUND_LAVA_PLAINS:
        addHexes("underground/hexlavafieldactive");
        break;
      default:
        console.warn("Tile type not identified:", tileInfo.type);
        addHexes("hexbase");
        break;
    }

    for (let i = 1; i <= 5; i += 1) {
      if (imagesFromBuildings[i]) {
        imagesFromBuildings[i].forEach(img => imageFiles.push(img));
      }
    }

    const topFiveHouses = this.getTopFiveHouses();
    [2, 0, 4, 1, 3] // order to ensure the layering correctly
      .forEach(pos => {
        if (topFiveHouses[pos]) {
          let value = topFiveHouses[pos].mapGraphicHomePath;
          if (typeof value === "function") {
            value = value(this);
          }
          if (value) {
            imageFiles.push(`${value}${pos + 1}.png`);
          }
        }
      });

    for (let i = 6; i <= 10; i += 1) {
      if (imagesFromBuildings[i]) {
        imagesFromBuildings[i].forEach(img => imageFiles.push(img));
      }
    }

    return imageFiles;
  }

  isMountains() {
    return (
      this.getType() === NODE_TYPES.MOUNTAINS_SNOW ||
      this.getType() === NODE_TYPES.MOUNTAINS_DIRT ||
      this.getType() === NODE_TYPES.MOUNTAINS_COLD
    );
  }

  getTemperature(withModifiers = false) {
    let temperature = this.temperature || 0;
    if (withModifiers) {
      temperature += world.getBuff(BUFFS.TEMPERATURE_OVERWORLD);
      if (this.isMountains()) temperature *= 1.1;
    }
    return temperature;
  }

  isTemperatureRange(from, to, withModifiers = false) {
    const temp = this.getTemperature(withModifiers);
    return temp >= from && temp <= to;
  }

  setTemperature(temp) {
    if (temp !== temp) {
      console.warn("Temperature is being set to NaN!", this.id);
    }
    this.temperature = temp || 0;
  }

  modifyTemperature(mod) {
    this.setTemperature(this.temperature + mod);
  }

  temperatureSource(value) {
    const change = value - this.temperature / 2;
    this.modifyTemperature(change);
  }

  getDrainage() {
    return this.drainage || 0;
  }

  setDrainage(temp) {
    this.drainage = utils.limit(temp, -10, 10);
  }

  modifyDrainage(mod) {
    this.setDrainage(this.drainage + mod);
  }

  getTopFiveHouses() {
    return this.getCompleteStructures()
      .filter(s => s.isHome())
      .sort((a, b) => b.getHomeLevel() - a.getHomeLevel())
      .slice(0, 5);
  }

  getImageFilename(creature) {
    const filesStack = this.getImageFilesStack(creature);
    if (!filesStack.length) {
      return null;
    }
    const imageKey = utils.md5(JSON.stringify(filesStack)) + ".png";
    const filePath = path.join(MAP_CACHE, imageKey);
    // We should wait here, but instead the resources endpoint accommodates for it
    this.promiseImagePath(creature, filePath);
    return server.getImage(creature, filePath);
  }

  promiseImagePath(creature, cacheName) {
    const filesStack = this.getImageFilesStack(creature);

    if (!mapImagePromises[cacheName]) {
      if (!filesStack.length) {
        mapImagePromises[cacheName] = Promise.resolve(null);
        return;
      }
      mapImagePromises[cacheName] = Promise.all(
        filesStack
          .map(file => path.join(__dirname, "../../resources/" + file))
          .map(file => Jimp.read(file))
      )
        .then(images => {
          let result;
          images.forEach(image => {
            if (!result) {
              result = image;
            } else {
              result.composite(image, 0, 0);
            }
          });
          return new Promise((resolve, reject) =>
            result.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
              if (!err) {
                resolve(buffer);
              } else {
                reject(err);
              }
            })
          );
        })
        .then(buffer => {
          fs.writeFileSync("resources" + cacheName, buffer);
          return cacheName;
        })
        .catch(error => {
          utils.error(error, cacheName, filesStack);
        });
    }
  }

  getMapPayload(creature, visibleNodes, includeAllDetails = false, connection) {
    includeAllDetails =
      includeAllDetails ||
      (creature.getNode() === this && this instanceof Room);
    const id = this.getEntityId();
    const isInVisionRange = !!visibleNodes[id];

    const getter = includeAllDetails ? "getPayload" : "getSimplePayload";

    let result = {
      id,
      actions: this.getActionsPayloads(creature),
      x: this.x - creature.getStartingNode().x,
      y: this.y - creature.getStartingNode().y,
      region: this.getRegion() && this.getRegion().getName(creature),
      regionNameVote:
        this.getRegion() && Nameable.hasVoted(creature, this.getRegion()),
      townNameVote: Nameable.hasVoted(creature, this),
      isInVisionRange,
      currentLocation: creature.getNode() === this ? true : undefined,
      paths: this.paths
        .filter(path => !path.isInaccessible())
        .map(path => path.getOtherNode(this))
        .filter(node => creature.isNodeKnown(node))
        .map(node => node.getEntityId()),
      // debug: program.dev && Math.floor(10 * this.getTemperature(true)) / 10,
      // debug: program.dev && this.lavaAmount,
      resources: [],
      creatures: [],
      structures: []
    };

    if (program.dev) {
      result.debug = this.debug;
    }

    const oldCache = creature.getNodeInfo(this);
    if (isInVisionRange || !oldCache.image) {
      const cache = {
        name: this.getName(),
        type: this.type,
        image: this.getImageFilename(creature),
        resources: this.getVisibleResources(creature)
          .map(resource => resource.getSimplePayload(creature))
          .filter(resourcePayload => !!resourcePayload),
        structures: this.getAllStructures()
          .map(structure => structure.getSimplePayload(creature, this))
          .filter(structurePayload => !!structurePayload),
        lastUpdate: world.getCurrentTime(),
        townName: this.townName,
        zLevel: this.zLevel
      };

      const creatures = this.getCreatures()
        .filter(c => c === creature || c.isVisible())
        .map(mob => mob[getter](creature, connection))
        .filter(creaturePayload => !!creaturePayload);

      result = {
        ...result,
        ...cache,
        creatures
      };
      if (includeAllDetails) {
        result.resources = this.getVisibleResources(creature)
          .map(resource => resource.getPayload(creature))
          .filter(resourcePayload => !!resourcePayload);
        result.structures = this.getAllStructures()
          .map(structure => structure.getPayload(creature, this))
          .filter(structurePayload => !!structurePayload);
      }
      if (creature.isPlayableCharacter()) {
        Node.updateSeenRecentlyByPlayerMap(id);
      }
      creature.storeNodeInfo(this, cache);
    } else {
      if (oldCache.lastUpdate) {
        const seenAgo =
          world.getCurrentTime().getTime() - oldCache.lastUpdate.getTime();
        if (seenAgo > 30 * DAYS * IN_MILISECONDS) {
          oldCache.veryOld = true;
          oldCache.resources = [];
          oldCache.structures = [];
        }
      }
      if (this instanceof Room) {
        creature.deleteNodeInfo(this);
        return null;
      }
      result = {
        ...result,
        ...oldCache,
        // image: server.getImage(creature, oldCache.image.substr(10)),
        region: this.getRegion() && this.getRegion().getName()
      };
    }
    if (result.lastUpdate) {
      result.lastUpdate = Math.floor(
        result.lastUpdate.getTime() / (MINUTES * IN_MILISECONDS)
      );
    }
    return result;
  }

  getArea(range, wallsBlock = false) {
    const nodes = {
      [this.getEntityId()]: 0
    };

    let check = Object.keys(nodes).map(nodeId => Entity.getById(nodeId));

    while (check.length) {
      const next = [...check];
      check = [];

      next.forEach(node => {
        const distance = nodes[node.getEntityId()];
        node.getConnectedNodes().forEach(connected => {
          if (wallsBlock && (connected.isWall() || connected.isWater())) {
            return;
          }
          if (nodes[connected.getEntityId()] === undefined) {
            nodes[connected.getEntityId()] = distance + 1;
            if (distance + 1 < range) {
              check.push(connected);
            }
          }
        });
      });
    }

    return Object.keys(nodes).map(nodeId => ({
      node: Entity.getById(nodeId),
      range: nodes[nodeId]
    }));
  }

  cycle(seconds) {
    // Use copies as each cycle may end up deleting the object
    [...this.structures].forEach(structure => structure.cycle(seconds));
    [...this.creatures].forEach(creature => creature.cycle(seconds));
    [...this.resources].forEach(resource => resource.cycle(seconds));
    let itemPerish = seconds;
    if (TimeCheck.timesADay(extraPerishTimesADay, seconds)) {
      if (!this.seenRecentlyByPlayer()) {
        itemPerish = seconds + fastPerishSeconds;
      }
    }
    [...this.items].forEach(item => {
      item.perishing -= itemPerish;
      if (item.perishing <= 0) {
        item.destroy();
      }
    });
  }

  destroy() {
    [...this.paths].forEach(structure => structure.destroy());
    [...this.structures].forEach(structure => structure.destroy(true));
    [...this.creatures].forEach(creature => creature.die());
    [...this.creatures].forEach(creature => creature.destroy());
    [...this.resources].forEach(resource => resource.destroy());
    [...this.items].forEach(item => item.destroy(false));
    world.removeNode(this);
    Player.list
      .map(player => player.getCreature())
      .filter(creature => creature && creature.getPlayer())
      .forEach(creature => {
        creature.deleteMapData(this.getEntityId());
      });
    super.destroy();
  }

  increaseTraverseFrequency() {
    this.traverseFrequency = this.traverseFrequency || 0;
    this.traverseFrequency += 4;
    this.traverseFrequency = utils.limit(this.traverseFrequency, 0, 100);
    if (this.traverseFrequency >= 75 && !Road.getRoad(this)) {
      this.addStructure(new DirtRoad());
    }
  }

  reduceTravFreq() {
    this.traverseFrequency = this.traverseFrequency || 0;
    this.traverseFrequency -= 3;
    this.traverseFrequency = utils.limit(this.traverseFrequency, 0, 100);
    if (
      this.traverseFrequency <= 25 &&
      Road.getRoad(this) &&
      Road.getRoad(this) instanceof DirtRoad
    ) {
      Road.getRoad(this).destroy();
    }
  }
}
Object.assign(Node.prototype, {
  travelSkill: SKILLS.PATHFINDING
});
module.exports = global.Node = Node;

server.registerHandler("live-update-node", (params, player, connection) => {
  const nodeId = params.node;
  if (nodeId && connection.liveUpdateNode !== nodeId) {
    const node = Entity.getById(nodeId);
    const creature = player.getCreature();
    if (!(node instanceof Node) || !creature.isNodeMapped(node)) {
      utils.error("HACKING ATTEMPT - MAP INFO!!", player.email, params);
      return false;
    }
  }
  connection.liveUpdateNode = nodeId;
  if (nodeId) {
    Player.sendMapPayload(connection);
  }
  return true;
});

const travelContextValidation = {
  type: Object,
  format: {
    skipUnknowns: {
      type: Boolean
    },
    assault: {
      type: Boolean
    },
    disregard: {
      type: Boolean
    }
  }
};

server.registerHandler("travel-order", (params, player, connection) => {
  const nodeId = params.nodeId;
  const node = Entity.getById(nodeId);
  const creature = player.getCreature();
  const context = params.context;
  if (context) {
    const deepValidation = utils.validateDataStructure(
      context,
      travelContextValidation
    );
    if (!deepValidation.ok) {
      return deepValidation.message;
    }
  }

  if (!(node instanceof Node)) {
    return "Please report a bug";
  }
  if (!creature.isNodeKnown(node)) {
    return "Please report a bug?";
  }
  const currentTargetNode =
    (creature.travelQueue &&
      creature.travelQueue[creature.travelQueue.length - 1]) ||
    creature.getNode();
  if (creature.getNode() === node) {
    if (creature.isDoingAction("Travel")) {
      creature.stopAction(false);
      creature.sendDataSingle(connection, "playerInfo");
    }
    return true;
  }
  if (currentTargetNode === node) {
    return false;
  }
  if (creature.travelQueue.includes(node)) {
    const idx = creature.travelQueue.indexOf(node);
    creature.travelQueue.splice(idx + 1);
    creature.sendDataSingle(connection, "playerInfo");
    return true;
  }

  const oldContext = creature.currentAction
    ? { ...creature.currentAction.context }
    : {};
  const newContext = context || oldContext;
  const additions = creature.findRoute(currentTargetNode, node, newContext);
  if (additions) {
    const travelQueue = [...creature.travelQueue, ...additions];
    // utils.compressTravelQueue(travelQueue, creature.getNode());
    const lastProgress =
      creature.isDoingAction("Travel") &&
      creature.getActionTarget() === travelQueue[0]
        ? creature.actionProgress
        : 0;
    creature.stopAction(false);
    creature.startAction(
      travelQueue[0],
      travelQueue[0].getActionById("Travel")
    );
    creature.travelQueue = travelQueue;
    creature.currentAction.context = newContext;
    creature.currentAction.ETA = undefined;
    creature.currentAction.allETA = undefined;
    if (lastProgress) {
      creature.actionProgress = lastProgress;
    }
    creature.sendDataSingle(connection, "playerInfo");
  } else {
    return "Unable to find path";
  }
  return true;
});

server.registerHandler("travel-context", (params, player, connection) => {
  const creature = player.getCreature();
  if (creature.isDoingAction("Travel")) {
    const deepValidation = utils.validateDataStructure(
      params,
      travelContextValidation
    );
    if (!deepValidation.ok) {
      return deepValidation.message;
    }
    creature.currentAction.context = params;
    creature.sendDataSingle(connection, "playerInfo");
  }
  return true;
});
