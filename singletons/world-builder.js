const World = require("../class/world");
const Path = require("../class/connections/path");
const LevelPath = require("../class/connections/level-path");
const RoomPath = require("../class/connections/room-path");
const Region = require("../class/region");

const Player = require("../class/player");
const Admin = require("../class/creatures/humanoids/admin");
const expansion1 = require("./expansions/expansion-1");

utils.recursiveRequire("class/nodes");

const mapGenerator = require("./world-builder/map-generator");

let world;
const tileSize = 50;

require("../class/creatures/monsters/dragons/fire-dragon");
require("../class/creatures/monsters/dragons/frost-dragon");
require("../class/creatures/monsters/dragons/earth-dragon");
require("../class/creatures/monsters/dragons/water-dragon");

const GAMEMASTERING = {
  id: 9001,
  fn: world => {}
};

let startNode;

const makeNode = (x, y) => {
  const node = new Node({
    x,
    y,
    zLevel: 1
  });
  return node;
};

const WorldBuilder = {
  buildNewWorld() {
    world = new World();
    global.world = world;

    const mapWidth = 300;
    const mapHeight = 300;

    const promise = mapGenerator.generateMap().then(map => {
      const tileHeightOffset = Math.floor(tileSize * TILE_HEIGHT_RATIO);
      const nodeMap = {};

      while (map.nodes.length) {
        const idx = utils.random(0, map.nodes.length - 1);
        const node = map.nodes.splice(idx, 1).pop();

        let x = node.x;
        let y = node.y;
        if (y % 2 === 0) {
          x += 0.5;
        }
        x *= tileSize;
        y *= tileHeightOffset;
        nodeMap[node.id] = makeNode(x, y, node.type);
        node.creator(nodeMap[node.id]);
      }

      Object.keys(map.connections).forEach(fromId => {
        const from = nodeMap[fromId];
        Object.keys(map.connections[fromId]).forEach(toId => {
          const to = nodeMap[toId];
          if (!from.hasPath(to)) {
            new Path({}, from, to);
          }
        });
      });
      // const node = n(x, y, terrainType(color), color);
      // new Path({}, node, otherNode);

      // Find a nice starting point
      startNode = world.getNodes().find(node => {
        return (
          node.isType(NODE_TYPES.PLAINS) &&
          node
            .getConnectedNodes()
            .some(c => c.isType(NODE_TYPES.BROADLEAF_FOREST))
        );
      });

      if (!startNode) {
        throw new Error("Failed to create world - no suitable starting nodes");
      }

      this.placeResources(world);

      this.divideIntoRegions(world);

      utils.log("World done");

      return world;
    });

    if (program.dev) {
      promise.then(() => {
        const startingNode = world.getStartingNode();

        const urist = new Admin({
          name: "Urist",
          looks: {
            hairStyle: 1,
            hairColor: 1,
            skinColor: 1
          }
        });

        startingNode.addCreature(urist);

        Object.keys(global)
          .filter(name => global[name].prototype instanceof Item)
          .filter(name => global[name].prototype.name[0] !== "?")
          .forEach(i =>
            urist.addItem(new global[i]({ qty: debugOption.itemSpawnedQty }))
          );

        urist.satiated = 50;
        urist.energy = 50;
        urist.painThreshold = 50;

        const player = new Player({
          name: "Urist"
        });
        player.profileId = "117544948973463425985";
        player.possessCreature(urist);
        player.email = ADMIN_EMAIL;
      });
    }

    return promise;
  },

  placeResources(world) {
    utils.getClasses(Resource).forEach(resourceCtr => {
      const resourceName = resourceCtr.constructor.name;
      world.positionResource(resourceName);
    });
  },

  checkPlayers() {
    const time = new Date().getTime();
    Player.list
      .map(player => player.getCreature())
      .filter(creature => !!creature)
      .filter(creature => !creature.isDead())
      .forEach(creature => {
        creature.getPayload(creature, true);
        creature.getNode().getPayload(creature);
        creature.getCreaturesMapPayload();
        Inspiration.checkForInspiration(creature.getPlayer());
      });

    global.timing.fullUpdate = new Date().getTime() - time;
    utils.log("All player updates:", global.timing.fullUpdate);
  },

  checkItems() {
    Object.keys(global)
      .filter(name => global[name].prototype instanceof Item)
      .forEach(name => {
        if (global[name].prototype.crafting) {
          const invalidItem = Object.keys(
            utils.cleanup(global[name].prototype.crafting.materials)
          ).find(material => !global[material]);
          if (invalidItem) {
            utils.error(
              "Crafting",
              name,
              "requires non-existent item",
              invalidItem
            );
            process.exit(1);
          }

          if (global[name].prototype.crafting.building) {
            const invalidItem = global[name].prototype.crafting.building.find(
              material => !global[material.replace(/ /g, "")]
            );
            if (invalidItem) {
              utils.error(
                "Crafting",
                name,
                "requires non-existent building",
                invalidItem
              );
              process.exit(1);
            }
          }
        }
        if (global[name].prototype.research) {
          const materials = Object.keys(
            global[name].prototype.research.materials
          );

          if (materials.length > MAX_RESEARCH_MATERIALS) {
            utils.error(
              "Researching",
              name,
              `requires more than ${MAX_RESEARCH_MATERIALS} items`
            );
            process.exit(1);
          }

          const invalidItem = materials.find(material => !global[material]);
          if (invalidItem) {
            utils.error(
              "Researching",
              name,
              "requires non-existent item",
              invalidItem
            );
            process.exit(1);
          }
        }
      });
    Object.keys(global)
      .filter(name => global[name].prototype instanceof Building)
      .forEach(name => {
        if (global[name].prototype.materials) {
          const invalidItem = Object.keys(
            global[name].prototype.materials
          ).find(material => !global[material]);
          if (invalidItem) {
            utils.error(
              "Building",
              name,
              "requires non-existent item",
              invalidItem
            );
            process.exit(1);
          }
        }
        if (global[name].prototype.research) {
          const materials = Object.keys(
            global[name].prototype.research.materials || {}
          );

          if (materials.length > MAX_RESEARCH_MATERIALS) {
            utils.error(
              "Researching",
              name,
              `requires more than ${MAX_RESEARCH_MATERIALS} items`
            );
            process.exit(1);
          }

          const invalidItem = materials.find(material => !global[material]);
          if (invalidItem) {
            utils.error(
              "Building research for",
              name,
              "requires non-existent item",
              invalidItem
            );
            process.exit(1);
          }
        }
      });
  },

  checkNameables() {
    const invalid = utils
      .getClasses(Entity)
      .filter(p => p.nameable)
      .filter(
        p =>
          !Nameable.getPublicKey(
            p.nameable !== true ? p.nameable : p.constructor.name
          )
      )
      .filter(p => p.name !== "?Entity?")
      .map(p => p.constructor.name);

    if (invalid.length) {
      throw new Error(
        "Some objects are marked as nameable, but are not nameable."
      );
    }
  },

  checkRecipes() {
    Recipe.getRecipes().forEach(recipe => {
      const materials = recipe.materials;
      const result = recipe.result;
      const round = x => Math.round(x * 100) / 100;

      const materialsWeight = round(
        Object.keys(materials).reduce(
          (acc, key) => acc + global[key].prototype.weight * materials[key],
          0
        )
      );
      const resultWeight = round(
        Object.keys(result).reduce(
          (acc, key) => acc + global[key].prototype.weight * result[key],
          0
        )
      );
      if (materialsWeight < resultWeight) {
        utils.error(
          `Recipe generates weight: ${recipe.id} result: ${materialsWeight} is turned into ${resultWeight}`
        );
      }

      const excludeAuto = [/Butcher_/, /Salvage/, /^[A-Za-z]+Saw$/];
      if (
        !excludeAuto.some(r => recipe.id.match(r)) &&
        recipe.autoLearn &&
        materialsWeight > resultWeight
      ) {
        utils.error(
          `Auto-learn recipe reduces weight: ${recipe.id} result: ${materialsWeight} is turned into ${resultWeight}`
        );
      }
    });
  },

  checkLootTables() {
    utils
      .getClasses(Entity)
      .filter(e => !!e.lootTable)
      .forEach(classPrototype => {
        Object.values(classPrototype.lootTable).forEach(dropTable => {
          Object.keys(dropTable).forEach(itemClassName => {
            if (!global[itemClassName]) {
              throw new Error(
                `No such item to be dropped as ${itemClassName} from ${classPrototype.constructor.name}`
              );
            }
          });
        });
      });
  },

  gameMastering(world) {
    expansion1.apply(world);
    if (world.GAMEMASTERING !== GAMEMASTERING.id) {
      utils.log("Applying GM update");
      GAMEMASTERING.fn(world);
      world.GAMEMASTERING = GAMEMASTERING.id;
    }
  },

  divideIntoRegions(world) {
    return; // TODO implement for hex-based map
    const MIN_REGION_SIZE = 6;
    const MAX_REGION_SIZE = 40;

    const regionMapping = {};

    const grow = (fromNode, filter) => {
      let check = [fromNode];
      let result = [];

      while (check.length) {
        result = [...result, ...check];

        check = check.reduce(
          (acc, node) => [
            ...acc,
            ...node
              .getConnectedNodes()
              .filter(filter)
              .filter(node => !result.includes(node))
              .filter(node => !acc.includes(node))
              .filter(node => regionMapping[node.id] === undefined)
          ],
          []
        );
      }
      return result;
    };

    const growerMarker = (filter, regionBuilder, min, max) =>
      world
        .getNodes()
        .filter(filter)
        .filter(node => regionMapping[node.id] === undefined)
        .forEach(seed => {
          const area = grow(seed, node => node instanceof seed.constructor);
          if (area.length >= min && area.length <= max) {
            const region = regionBuilder(area);
            area.forEach(node => (regionMapping[node.id] = region));
          }
        });

    growerMarker(
      node => node.isType("Hills"),
      nodes => new Region(nodes),
      MIN_REGION_SIZE,
      MAX_REGION_SIZE
    );

    growerMarker(
      node => node.isType("Mountains"),
      nodes => new Region(nodes),
      MIN_REGION_SIZE,
      MAX_REGION_SIZE
    );

    world
      .getNodes()
      .filter(node => node.isType(NODE_TYPES.MOUNTAINS_COLD))
      .filter(node => regionMapping[node.id] === undefined)
      .forEach(node => {
        regionMapping[node.id] = null;
      });

    /** PLAINS **/
    const growPlains = (fromNode, filter) => {
      let check = [fromNode];
      let result = [];

      while (check.length) {
        result = [...result, ...check];

        check = check.reduce(
          (acc, node) => [
            ...acc,
            ...node
              .getConnectedNodes()
              .filter(filter)
              .filter(node => !result.includes(node))
              .filter(node => !acc.includes(node))
              .filter(node => regionMapping[node.id] === undefined)
          ],
          []
        );

        if (result.length >= MIN_REGION_SIZE && check.length === 1) {
          break;
        }
      }
      return result;
    };
    const growerMarkerPlains = (filter, regionBuilder, min, max, extraFilter) =>
      world
        .getNodes()
        .filter(filter)
        .filter(node => regionMapping[node.id] === undefined)
        .filter(extraFilter)
        .forEach(seed => {
          const area = growPlains(seed, node => true);
          if (area.length >= min && area.length <= max) {
            const region = regionBuilder(area);
            area.forEach(node => (regionMapping[node.id] = region));
          }
        });

    growerMarkerPlains(
      node => node.isType(NODE_TYPES.PLAINS),
      nodes => new Region(nodes),
      MIN_REGION_SIZE,
      MAX_REGION_SIZE,
      node =>
        node
          .getConnectedNodes()
          .filter(node => regionMapping[node.id] === undefined).length === 1
    );

    growerMarkerPlains(
      node => node.isType(NODE_TYPES.PLAINS),
      nodes => new Region(nodes),
      MIN_REGION_SIZE,
      MAX_REGION_SIZE,
      node => true
    );

    growerMarkerPlains(
      node => node.isType(NODE_TYPES.PLAINS),
      nodes => new Region(nodes),
      4,
      MAX_REGION_SIZE,
      node => true
    );

    Object.keys(regionMapping).forEach(key => {
      if (regionMapping[key]) {
        Entity.getById(+key).debug = regionMapping[key].id;
      }
    });
  },

  cleanup() {
    Object.values(Entity.getEntityMap()).forEach(entity => {
      if (entity instanceof Item && !entity.getContainer() && !entity.qty) {
        console.log("Found orphaned item!", entity.name, entity.qty);
        setTimeout(() => {
          entity.destroy();
        }, 5000);
      }
    });
  },

  switchIcons(world) {
    if (world.iconSize !== ICONS_PATH) {
      Player.list.forEach(p => {
        Object.keys(p.accessResQ).forEach(icon => {
          if (icon.match(/^\/iconpack/)) {
            delete p.accessResQ[icon];
          }
          if (icon.match(/^\/icons/)) {
            const updated = icon.replace(
              /^\/?icons[0-9]*\//,
              `/${ICONS_PATH}/`
            );
            delete p.accessResQ[icon];
            p.accessResQ[updated] = true;
          }
        });
        if (p.mapData) {
          Object.values(p.mapData).forEach(mapData => {
            utils.recursiveReplace(
              mapData.cache,
              value => value && value.match && value.match(/\/icons/),
              value => value.replace(/\/icons[0-9]*\//, `/${ICONS_PATH}/`)
            );
          });
        }
      });
    }
    world.iconSize = ICONS_PATH;
  },

  upgrade(world) {
    world.trades = world.trades || [];

    utils.log("*** Upgrading world ***");
    startNode = world.getStartingNode();

    this.gameMastering(world);
    this.switchIcons(world);
    this.cleanup();

    // check consistency
    if (program.dev) {
      console.time("Running tests");
      // this.checkNameables();
      // this.checkPlayers();
      // this.checkItems();
      // this.checkRecipes();
      // this.checkLootTables();
      console.timeEnd("Running tests");
    }

    utils.log("*** Upgrade done ***");

    return Promise.resolve(world);
  }
};
module.exports = WorldBuilder;
