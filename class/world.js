require("../singletons/utils");
require("../singletons/static");
require("../singletons/time-check");
require("./trade");
require("./dueling");

const resurrect = require("resurrect-js");
const fs = require("fs");
const ExpirableItem = require("./items/.expirable-item");

require("./faction");

require("../singletons/scenario");

utils.recursiveRequire("class/items");
utils.recursiveRequire("class/resources");
utils.recursiveRequire("class/structures");
utils.recursiveRequire("class/quests");
utils.recursiveRequire("class/creatures");
utils.recursiveRequire("class/buffs");

const EVENTS = utils.recursiveRequire("class/events");

const necro = new resurrect({
  cleanup: true
});
global.necro = necro;

const oldHandleAtom = resurrect.prototype.handleAtom;

// Enhance error reporting for failed serialization
resurrect.prototype.handleAtom = function(atom) {
  if (resurrect.isFunction(atom)) {
    utils.error("Invalid atom", atom);
    throw new this.Error(`Can't serialize functions.`);
  }
  return oldHandleAtom.call(this, atom);
};

class World {
  constructor(args) {
    this.nodes = [];
    this.events = [];
    this.currentTime = new Date();
    this.trades = [];
    this.cyclables = [];
    this.duels = {};
  }

  addNode(node) {
    this.nodes.push(node);
    node.setWorld(this);
  }

  removeNode(node) {
    this.nodes = this.nodes.filter(n => n !== node);
  }

  getStartingNode(player) {
    if (player && player.getStartingNode()) {
      return player.getStartingNode();
    }
    return this.getNodes().filter(node =>
      node.getAllStructures().some(structure => structure.newPlayerSpawn)
    );
  }

  getNodes() {
    return this.nodes;
  }

  getCurrentTime() {
    return this.currentTime;
  }

  hasEvent(eventClass) {
    return this.events.some(event => event instanceof eventClass);
  }

  getEvents() {
    this.events = this.events || [];
    return this.events;
  }

  getEventsPayload(creature) {
    return this.getEvents()
      .filter(
        event =>
          !event.visibilityCondition || event.visibilityCondition(creature)
      )
      .map(event => event.getPayload(creature));
  }

  positionResource(resourceName) {
    this.getNodes().forEach(node => {
      node.placeResource(resourceName);
    });
  }

  resourceRePoppingCycle(seconds) {
    utils.atInterval(
      RESOURCE_REROLL_FREQUENCY,
      () => this.resourceRePopping(),
      seconds
    );
  }

  resourceRePopping() {
    utils.getClasses(PoppingResource).forEach(resourceCtr => {
      const resourceName = resourceCtr.constructor.name;
      this.positionResource(resourceName);
    });
  }

  resourceReQuaking() {
    Entity.getEntities(QuakingResources).forEach(resource => {
      resource.reQuake();
    });

    Resource.getAllResourcesTypes().forEach(resourceCtr => {
      const resourceName = resourceCtr.name;
      if (global[resourceName].prototype instanceof QuakingResources) {
        utils.log("ReQuaking resources", resourceName);
        this.positionResource(resourceName);
      }
    });
  }

  startNewEvent(eventClass) {
    utils.log("Starting event", eventClass.prototype.name);
    this.events = this.events || [];
    const event = new eventClass();
    this.events.push(event);
    return event;
  }

  finishEvent(event) {
    utils.log("Finishing event", event.name);
    let idx = this.events.indexOf(event);
    if (idx === -1) {
      idx = this.events.findIndex(e => e instanceof event);
      event = this.events[idx];
    }
    if (idx !== -1) {
      this.events.splice(idx, 1);
      event.destroy();
    }
  }

  triggeringEvents(seconds) {
    EVENTS.forEach(eventClass => {
      if (!eventClass.prototype) {
        return;
      }
      if (this.isEventInProgress(eventClass.prototype.name)) {
        return;
      }
      if (
        eventClass.isTheTimeRight(seconds) &&
        utils.chance(eventClass.getEventChance()) &&
        eventClass.triggerCondition()
      ) {
        this.startNewEvent(eventClass);
      }
    });
  }

  isEventInProgress(eventName) {
    return this.events.some(event => event.constructor.name === eventName);
  }

  getSleepBuffMultiplier() {
    return this.sleepBuffMultiplier || 1;
  }

  getBuff(stat) {
    return (this.buffs || {})[stat] || 0;
  }

  registerCyclable(instance) {
    this.cyclables.push(instance);
  }

  deregisterCyclable(instance) {
    utils.removeFromArray(this.cyclables, instance);
  }

  cycle(seconds) {
    this.currentTime = new Date(
      this.currentTime.getTime() + CYCLE_RATE * seconds
    );
    this.nodes.forEach(node => node.cycle(seconds));
    [...this.events].forEach(event => event.cycle(seconds));
    this.resourceRePoppingCycle(seconds);
    this.triggeringEvents(seconds);
    this.updateTemperature(seconds);
    this.terraforming(seconds);

    this.cyclables.forEach(instance => instance.cycle(seconds));

    ExpirableItem.cycle(seconds);

    utils.atInterval(1 * DAYS, () => this.reduceTravFreq(), seconds);
    utils.atInterval(
      1 * DAYS + 1 * HOURS + 1 * MINUTES + 5 * SECONDS,
      () => utils.checkForInvalidTrackers(),
      seconds
    );
  }

  reduceTravFreq() {
    Entity.getEntities(Node).forEach(n => n.reduceTravFreq());
  }

  updateTemperature(seconds) {
    // Stabilise temperatures
    utils.atInterval(
      TEMPERATURE_INTERVAL,
      () => this.stabiliseTemperature(),
      seconds
    );
  }

  stabiliseTemperature() {
    this.nodes.forEach(node => {
      node.tempDelta = [];
    });

    this.nodes.forEach(node => {
      node.getConnectedNodes().forEach(connected => {
        const insulation = NODE_TEMPERATURE_INSULATION[node.getType()];
        if (!insulation) {
          utils.error(`No insulation defined for node type ${node.getType()}`);
        }

        const maxChange = (node.temperature - connected.temperature) / 2;
        const change = (maxChange * (10 - insulation)) / 10;
        node.tempDelta.push(-change);
      });

      const currentDrain = node.getDrainage();
      const modifyDrain =
        -Math.sign(currentDrain) *
        Math.min(1 + Math.abs(currentDrain) * 0.05, Math.abs(currentDrain));
      node.modifyDrainage(modifyDrain * TEMPERATURE_VOLATILITY);
    });

    this.nodes
      .filter(node => node.tempDelta.length)
      .forEach(node => {
        const finalChange =
          (Math.max(...node.tempDelta) + Math.min(...node.tempDelta)) / 2;

        let temperature = node.temperature;
        temperature += finalChange;
        temperature -= temperature * TEMPERATURE_STABILITY;
        node.setTemperature(temperature);
      });
  }

  terraforming(seconds) {
    utils.atInterval(TERRAFORM_INTERVAL, () => this.terraform(), seconds);
  }

  terraform() {
    const newTypes = {};
    this.nodes.forEach(node => {
      const nodeId = node.getEntityId();
      newTypes[nodeId] = node.getTerraformResult();
    });
    this.nodes.forEach(node => {
      const nodeId = node.getEntityId();
      node.setType(newTypes[nodeId]);
    });
  }

  isNight() {
    return world.hasEvent(Night);
  }

  getTrades() {
    return this.trades;
  }

  initTrade(first, second) {
    this.trades.push(
      new Trade({
        parties: [first, second]
      })
    );
  }

  rollingSave(seconds) {
    utils.atInterval(5 * MINUTES, () => this.save5Min(), seconds);
    utils.atInterval(1 * HOURS, () => this.save1Hour(), seconds);
  }

  save5Min() {
    this.save("rolling_save.json");
  }

  save1Hour() {
    if (!program.dev) {
      this.save(
        this.currentTime.toISOString().replace(/[^0-9A-Za-z]/g, "_") +
          "_save.json"
      );
    }
  }

  save(filename) {
    if (program.dev && debugOption.disableSave) {
      return;
    }
    const startTime = new Date().getTime();

    this.entityMap = utils.cleanup(Entity.getEntityMap());

    let serialized;
    try {
      serialized = necro.stringify(this);
    } catch (e) {
      utils.error(e);
      process.exit(1);
    }

    const timeSerialized = new Date().getTime();

    fs.writeFileSync(".saves/" + filename, serialized);

    const current = new Date().getTime();
    global.timing.save = {
      total: current - startTime,
      serialize: timeSerialized - startTime,
      writeFile: current - timeSerialized
    };
  }

  static load(filename) {
    utils.log("Loading the world...");
    const serialised = fs.readFileSync(".saves/" + filename);
    let world;

    utils.log("Restoring the world...");
    try {
      world = necro.resurrect(serialised);
    } catch (e) {
      utils.error(e.message);
      utils.error(e.stack);
      process.exit(1);
    }
    Entity.setEntityMap(world.entityMap);

    Player.list = Object.values(world.entityMap).filter(
      e => e.constructor.name === "Player"
    );

    utils.log("World is ready.");

    utils.triggerGameLoaded(world);

    return world;
  }

  recipeBugChecker() {
    const knowsCraftingRecipe = (player, recipe) =>
      player
        .getCraftingRecipes()
        .some(recipeId => Recipe.getRecipeById(recipeId) === recipe);
    const knowsBuilding = (player, plan) =>
      player.getBuildingPlansIds().find(planId => planId === plan.getPlanId());

    Player.list.forEach(player => {
      const creature = player.getCreature();
      if (!creature) {
        return;
      }
      const playerKnownItems = player.knownItemsList || {};

      const researchables = [
        ...Recipe.getRecipes().filter(r => !knowsCraftingRecipe(player, r)),
        ...Plan.getPlans().filter(p => !knowsBuilding(player, p))
      ].filter(recipe => !!recipe.research);

      const itemsRequiredForNewResearches = {};
      researchables.forEach(e =>
        Object.keys(e.research.materials).forEach(
          i => (itemsRequiredForNewResearches[i] = true)
        )
      );

      const playersMissingRecipes = {};
      Object.keys(itemsRequiredForNewResearches).forEach(itemClass => {
        if (playerKnownItems[itemClass] === ITEM_KNOWLEDGE.DEAD_END) {
          playerKnownItems[itemClass] = ITEM_KNOWLEDGE.KNOWN;
          playersMissingRecipes[itemClass] = true;
        }
      });

      const items = Object.keys(playersMissingRecipes);
      if (items.length) {
        const itemList = items
          .map(itemClass => global[itemClass].getName())
          .sort()
          .join(", ");
        player.logging(
          `The following items were incorrectly marked as dead end for you: ${itemList}`,
          LOGGING.GOOD
        );
      }
    });
  }

  recipeChecker() {
    const init = !world.researchRegister;
    world.researchRegister = world.researchRegister || {};
    const researchables = [...Recipe.getRecipes(), ...Plan.getPlans()].filter(
      recipe => !!recipe.research
    );

    const affectedPlayers = Player.list;

    const getKey = recipe => `${recipe.constructor.name}_${recipe.id}`;

    const newResearches = researchables.filter(
      recipe => !init && !world.researchRegister[getKey(recipe)]
    );

    researchables.forEach(
      recipe => (world.researchRegister[getKey(recipe)] = true)
    );

    const itemsRequiredForNewResearches = {};
    newResearches.forEach(e =>
      Object.keys(e.research.materials).forEach(
        i => (itemsRequiredForNewResearches[i] = true)
      )
    );

    const playersMissingRecipes = {};

    Object.keys(itemsRequiredForNewResearches).forEach(itemClass => {
      affectedPlayers.forEach(player => {
        if (!player.getCreature()) {
          return;
        }
        const playerKnownItems = player.getCreature().getKnownItems();

        if (playerKnownItems[itemClass] === ITEM_KNOWLEDGE.DEAD_END) {
          playerKnownItems[itemClass] = ITEM_KNOWLEDGE.KNOWN;
          const key = player.getEntityId();
          playersMissingRecipes[key] = playersMissingRecipes[key] || {};
          playersMissingRecipes[key][itemClass] = true;
        }
      });
    });

    Player.list.forEach(player => {
      const key = player.getEntityId();
      const items = Object.keys(playersMissingRecipes[key] || {});
      if (items.length) {
        const itemList = items
          .map(itemClass => global[itemClass].getName())
          .sort()
          .join(", ");
        player.logging(
          `The following items that you previously exhausted research option with now can be used in newly added researches: ${itemList}`,
          LOGGING.GOOD
        );
      }
    });
  }

  getNextDungeonLevel() {
    this.nextDungeonLevel = this.nextDungeonLevel || -9000;
    this.nextDungeonLevel -= 3;
    return this.nextDungeonLevel;
  }
}
module.exports = global.World = World;
