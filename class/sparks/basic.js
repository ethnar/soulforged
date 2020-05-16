const Spark = require("./.spark");

const MIN_ITEM_QTY = 3;
const MAX_ITEM_QTY = 15;
const ACCEPTABLE_ITEM_WEIGHT = 1.3;
const BEHAVIOURS = {
  CAREFUL: 1,
  HOARDER: 2,
  BRAVE: 3
};

const foodResourceFilter = creature => r =>
  !!r.getProduce(creature, true).prototype.nutrition;

class BasicSpark extends Spark {
  startQuest() {}
  getQuestsPayload() {
    return [];
  }
  hasAcceptedLegalTerms() {
    return true;
  }
  isQuestFinished() {
    return false;
  }
  isQuestComplete() {
    return false;
  }
  knowsIcon() {
    return true;
  }
  updateDiscordRole() {}
  gainSoulXp() {}
  logging() {}
  possessCreature() {}

  constructor(args) {
    super(args);
    this.behaviour = {
      [BEHAVIOURS.CAREFUL]: utils.chance(30),
      [BEHAVIOURS.HOARDER]: utils.chance(30),
      [BEHAVIOURS.BRAVE]: utils.chance(30)
    };
  }

  getCraftingRecipes() {
    world.sparksCraftingRecipes = world.sparksCraftingRecipes || {};
    const race = this.creature.constructor.name;
    world.sparksCraftingRecipes[race] = world.sparksCraftingRecipes[race] || [];
    return world.sparksCraftingRecipes[race];
  }

  getBuildingPlansIds() {
    world.sparksBuildingPlans = world.sparksBuildingPlans || {};
    const race = this.creature.constructor.name;
    world.sparksBuildingPlans[race] = world.sparksBuildingPlans[race] || [];
    return world.sparksBuildingPlans[race];
  }

  getBehaviour(key) {
    const behaviour = this.behaviour || {};
    return key ? behaviour[key] : behaviour;
  }

  getCreature() {
    return this.creature;
  }

  control(seconds) {
    // If hiding, fight or run away
    if (this.creature.hasEnemies()) {
      if (
        this.isAreaSafeEnough(this.creature.getNode()) ||
        this.creature instanceof Orc
      ) {
        const isFighting = this.creature.isDoingAction("Fight");

        if (this.creature.hasAttackableEnemies()) {
          if (!isFighting) {
            this.startActionSafe("Fight");
          }
        } else if (isFighting || this.creature.isDoingAction("Travel")) {
          this.creature.stopAction();
        }
      } else {
        if (
          !this.creature.isDoingAction("Travel") &&
          !this.creature.isDoingAction("Dump")
        ) {
          this.wanderRandomly();
        }
      }
      return;
    }

    // Unburden yourself when trying to travel
    if (this.creature.isDoingAction("Travel") && this.needToUnburden) {
      if (this.creature.isOverburdened()) {
        this.unburden();
      } else {
        this.needToUnburden = false;
      }
      return;
    }

    // Keep doing what you were doing
    if (!this.creature.isDoingAction("Sleep")) {
      return;
    }

    // Execute queued actions
    if (this.actionQueue && this.actionQueue.length) {
      const args = this.actionQueue.shift();
      try {
        switch (args[0]) {
          case "Craft":
            if (typeof args[1] === "string") {
              args[1] = Recipe.getRecipeById(args[1]);
            }
            break;
          case "Erect & Construct":
            if (typeof args[1] === "string") {
              args[1] = Plan.getPlanById(args[1]);
            }
            break;
          default:
        }
        this.startActionSafe(args[0], args[1], args[2] || 1, false, args[3]);
      } catch (e) {
        utils.error(e);
      }
    }

    this.atInterval(5 * MINUTES, () => this.periodic(), seconds);
  }

  periodic() {
    if (!this.creature.getNode().seenRecentlyByPlayer()) {
      if (this.creature.satiated < 55) this.creature.satiated = 55;
      if (this.creature.hypothermia > 45) this.creature.hypothermia = 45;
      if (this.creature.heatstroke > 45) this.creature.heatstroke = 45;
    }
    try {
      this.decide();
    } catch (e) {
      utils.error(e);
    }
  }

  decide() {
    // Accept all incoming trades
    const trades = Trade.getCreatureTrades(this.creature);
    trades.forEach(trade => {
      trade.markAccepted(this.creature);
    });

    // Drop items that are unusable
    this.dumpBrokenItems();

    // If you can patch some of your wounds - do that
    if (this.patchedSomeWounds()) {
      return;
    }

    this.checkForHouse();

    // Equip new gear
    this.checkForEquipment();

    // Mark node as home if not yet set
    if (
      !this.homeNode &&
      this.creature.knowsBuilding(Plan.getPlanById("LeanTo")) &&
      this.creature.getNode().getRegion() &&
      this.creature
        .getNode()
        .getRegion()
        .getNPCTownNode()
    ) {
      this.homeNode = this.creature
        .getNode()
        .getRegion()
        .getNPCTownNode();
    }

    if (this.creature.satiated <= 90) {
      if (this.hasFood()) {
        this.eat();
        return;
      }
    }

    // Ensure the character gets sleep
    if (this.needsRest) {
      if (this.creature.energyTiered < 100) {
        return;
      } else {
        this.needsRest = false;
      }
    }

    // When very tired get sleep
    if (this.creature.energy <= 50) {
      this.needsRest = true;
      this.startActionSafe("Sleep");
      return;
    }

    if (this.canReclaimHouses()) {
      return;
    }

    // Ensure the character is fed
    if (this.creature.satiated <= 90) {
      if (this.hasFood()) {
        this.eat();
        return;
      } else {
        this.searchForNewResources(true, foodResourceFilter(this));
        return;
      }
    }

    // When tired go home
    let allowedToExplore = this.creature.mood > 30 || !this.homeNode;
    if (!allowedToExplore && this.creature.getNode() !== this.homeNode) {
      this.queueAction("Travel", this.homeNode);
      return;
    }

    // Repair or build
    if (this.repairingSomething()) {
      return;
    }

    // Erect building
    if (this.creature.getNode() === this.homeNode && this.erectingSomething()) {
      return;
    }

    // Crafting and researching
    if (!this.researchSomething()) {
      if (this.canCraftSomething()) {
        this.craftSomething();
        return;
      } else {
        this.searchForNewResources(allowedToExplore);
        return;
      }
    }

    // console.log(`${this.creature.name} - spark has nothing to do`);
  }

  canReclaimHouses() {
    const node = this.creature.getNode();
    let potential = null;
    node.getAllStructures().forEach(structure => {
      const reclaim = structure.getActionById("Reclaim");
      if (reclaim && reclaim.canDo(structure, this.creature)) {
        potential = structure;
      }
    });
    if (potential) {
      this.queueAction("Reclaim", potential);
      return true;
    }
    return false;
  }

  dumpBrokenItems() {
    this.creature.getItems().forEach(i => {
      if (i.getIntegrity() <= 0) {
        this.queueAction("Dump", i);
      }
    });
  }

  unburden() {
    let dumped = false;
    this.creature.getItems().forEach(i => {
      const value = this.getItemValueNormalised(i.constructor.name);
      if (
        !this.creature.isEquipped(i) &&
        value < 0.3 &&
        utils.chance(80 - value * 100)
      ) {
        this.startActionSafe("Dump", i);
        dumped = true;
      }
    });
    if (!dumped) {
      this.creature.getItems().forEach(i => {
        const value = this.getItemValueNormalised(i.constructor.name);
        if (!this.creature.isEquipped(i) && utils.chance(100 - value * 50)) {
          this.startActionSafe("Dump", i);
        }
      });
    }
  }

  checkForHouse() {
    const node = this.creature.getNode();
    if (node !== this.homeNode) {
      return;
    }
    let current = null;
    let potential = null;
    node.getAllStructures().forEach(structure => {
      if (!structure.isHome()) {
        return;
      }
      if (structure.getOwner() === this) {
        current = structure;
      }
      if (!structure.getOwner()) {
        potential = structure;
      }
    });
    if (!current && potential) {
      this.queueAction("Claim", potential);
    }
  }

  repairingSomething() {
    return this.creature
      .getNode()
      .getAllStructures()
      .filter(s => s instanceof Building)
      .some(s => {
        const repairMaterials = utils.cleanup(s.remainingMaterialsNeeded);
        if (!repairMaterials) {
          return false;
        }
        const utility = s.getConstructionUtility();

        const hasMaterial = Object.keys(repairMaterials).filter(itemClass => {
          this.increaseItemValue(itemClass, 1);
          return this.creature.hasItemType(itemClass);
        }).length;
        const hasTool = !utility || this.getBestTool(utility);

        if (hasMaterial && hasTool) {
          if (utility) {
            this.queueAction("Equip: Tool", this.getBestTool(utility));
          }
          const action = s.isComplete() ? "Repair" : "Build";
          this.queueAction(action, s, 100);
          return true;
        }
        return false;
      });
  }

  erectingSomething() {
    this.creature.getBuildingPlansIds().some(planId => {
      const plan = Plan.getPlanById(planId);
      const utility = plan.getToolUtility();
      if (utility) {
        const bestTool = this.getBestTool(utility);
        if (!bestTool) {
          return false;
        }
        this.creature.equip(bestTool, EQUIPMENT_SLOTS.TOOL);
      }
      if (
        plan.getActionById("Erect & Construct").canRun(plan, this.creature) ===
          true &&
        (!plan.getConstructor().prototype.isHome() ||
          !this.getCreature().ownsAnyHomeHere())
      ) {
        this.queueAction("Erect & Construct", plan.getPlanId());
        return true;
      }
      return false;
    });
  }

  static getBuffValue() {
    return 1;
  }

  getEquipmentValue(item, slot) {
    return this.constructor.getEquipmentValue(item, slot);
  }

  static getEquipmentValue(item, slot) {
    if (+slot === +EQUIPMENT_SLOTS.WEAPON) {
      const values = Object.values(item.damage).sort((a, b) => b - a);
      return values.reduce((acc, v, idx) => acc + v / (1 + idx), 0);
    } else {
      return Object.keys(item.buffs || {}).reduce(
        (acc, k) => acc + item.buffs[k] * this.getBuffValue(k),
        0
      );
    }
  }

  checkForEquipment() {
    const itemsBySlot = {};
    this.creature.getItems().forEach(i => {
      Object.keys(i.slots || {}).forEach(slot => {
        itemsBySlot[slot] = itemsBySlot[slot] || [];
        itemsBySlot[slot].push({
          item: i,
          equipmentValue: BasicSpark.getEquipmentValue(i, slot)
        });
      });
    });
    Object.values(EQUIPMENT_SLOTS)
      .filter(slot => slot !== EQUIPMENT_SLOTS.TOOL)
      .forEach(slot => {
        if (itemsBySlot[slot]) {
          const element = itemsBySlot[slot].reduce(
            (acc, element) => {
              return element.equipmentValue > acc.equipmentValue
                ? element
                : acc;
            },
            {
              equipmentValue: -1
            }
          );
          if (element.item && !this.creature.isEquipped(element.item, slot)) {
            this.creature.equip(element.item, slot);
          }
        }
      });
  }

  isActionSafe(actionId, target) {
    const action = target.getActionById(actionId);

    const difficultyText = action.difficulty
      ? action.difficulty(target, this.creature)
      : "100";
    const successChance = +(difficultyText
      ? difficultyText.match(/[0-9]+/)
      : [100])[0];

    if (this.getBehaviour(BEHAVIOURS.CAREFUL)) {
      return successChance >= 85;
    }
    return successChance >= 65;
  }

  isAreaSafeEnough(node) {
    return (
      node
        .getCreatures()
        .filter(c => c.isHostile(this.creature))
        .reduce((acc, c) => acc + c.getThreatLevel(), 0) <=
      this.getConsideredSafeThreatLevel()
    );
  }

  getConsideredSafeThreatLevel() {
    let multiplier = 1;
    if (this.getBehaviour(BEHAVIOURS.BRAVE)) {
      multiplier *= 5;
    }
    return (
      (multiplier * this.consideredSafeThreatLevel * this.creature.moodTiered) /
      100
    );
  }

  startActionSafe(
    actionId,
    target,
    repetitions = 1,
    notifications = false,
    extra
  ) {
    if (target instanceof Item) {
      this.increaseItemValue(target.constructor.name, 50);
    }

    target = target || this.creature;

    if (!this.isActionSafe(actionId, target)) {
      return;
    }
    this.creature.startAction(
      target,
      target.getActionById(actionId),
      Math.round(repetitions),
      notifications,
      extra
    );
  }

  hasFood() {
    return this.creature
      .getAllAvailableItems(false)
      .some(item => !!item.nutrition);
  }

  eat() {
    const allFood = this.creature
      .getAllAvailableItems(false)
      .filter(item => !!item.nutrition)
      .map(item => ({
        item,
        equipmentValue: BasicSpark.getEquipmentValue(item)
      }));

    const food = allFood.reduce(
      (acc, element) => {
        return element.equipmentValue > acc.equipmentValue ? element : acc;
      },
      {
        equipmentValue: -Infinity
      }
    );

    this.increaseItemValue(
      food.item.constructor.name,
      4 + food.equipmentValue * 5
    );

    this.queueAction("Eat", food.item, 50);
  }

  searchForNewResources(allowedToExplore = true, resourceFilter = () => true) {
    const validItems = this.getCreature()
      .getNode()
      .getItems()
      .filter(i => this.getItemDesiredExtraNeeded(i.constructor.name) > 0)
      .filter(i =>
        resourceFilter({
          getProduce: () => i.constructor
        })
      );

    if (validItems.length) {
      const target = utils.randomItem(validItems);

      this.queueAction(
        "Pick up",
        target,
        this.getItemDesiredExtraNeeded(target.constructor.name)
      );
      return;
    }

    const validResources = this.getCreature()
      .getNode()
      .getResources()
      .filter(r => r.size)
      .filter(r => r.isVisible())
      .filter(r => !this.hasResourceItem(r))
      .filter(r => this.isActionSafe("Gather", r))
      .filter(resourceFilter)
      .map(r => ({
        resource: r,
        tool: this.getToolToGather(r)
      }))
      .filter(e => e.tool);

    if (validResources.length) {
      const target = utils.randomItem(validResources);

      if (target.tool !== true) {
        this.queueAction("Equip: Tool", target.tool);
      }
      const itemType = target.resource.getProduce(this.creature, true);
      this.queueAction(
        "Gather",
        target.resource,
        this.getItemDesiredExtraNeeded(itemType.name)
      );
    } else if (allowedToExplore) {
      this.wanderRandomly();
    }
  }

  queueAction(...args) {
    if (args[0] === "Craft" && typeof args[1] !== "string") {
      if (program.dev) {
        throw new Error("Wrong action");
      } else {
        utils.error("Wrong action");
        return;
      }
    }

    if (
      ["Travel", "Gather", "Pick up"].includes(args[0]) &&
      this.creature.isOverburdened()
    ) {
      this.needToUnburden = true;
      this.unburden();
    }

    if (args[0] === "") {
      throw new Error("Invalid action queued");
    }
    this.actionQueue = this.actionQueue || [];
    this.actionQueue.push(args);

    this.actionQueue.splice(10);
  }

  getToolToGather(resource) {
    return resource.getToolUtility()
      ? this.getBestTool(resource.getToolUtility())
      : true;
  }

  getBestTool(toolUtility) {
    return this.creature.items.reduce((acc, i) => {
      const level = i.getUtilityLevel && !!i.getUtilityLevel(toolUtility);
      if (level && (!acc || level > acc.getUtilityLevel(toolUtility))) {
        return i;
      }
      return acc;
    }, null);
  }

  hasResourceItem(resource) {
    return this.creature.items.some(
      i => !!(i instanceof resource.getProduce(this.creature, true))
    );
  }

  wanderRandomly() {
    const travelTo = utils.randomItem(
      this.creature
        .getNode()
        .getConnectedLocations()
        .filter(node => this.isActionSafe("Travel", node))
        .filter(node => this.isAreaSafeEnough(node))
    );
    if (travelTo) {
      this.startActionSafe("Travel", travelTo);
    }
  }

  canCraftSomething() {
    return !!this.getRandomCraftableRecipe();
  }

  craftSomething() {
    const recipe = this.getRandomCraftableRecipe();
    if (!recipe) {
      return; // TODO: this shouldn't be needed
    }
    if (recipe.getToolUtility()) {
      this.queueAction(
        "Equip: Tool",
        this.getBestTool(recipe.getToolUtility())
      );
    }
    const repetitions = recipe.getProduces().reduce((acc, itemClass) => {
      this.increaseItemValue(itemClass, 4);
      return Math.max(acc, this.getItemDesiredExtraNeeded(itemClass));
    }, 0);
    Object.keys(recipe.getMaterials()).forEach(itemClass =>
      this.increaseItemValue(itemClass, 2)
    );

    this.queueAction("Craft", recipe.getEntityId(), repetitions);
  }

  getItemDesiredExtraNeeded(itemClass) {
    return (
      this.getItemDesiredQuantity(itemClass) -
      this.creature.getItemQty(itemClass)
    );
  }

  getItemDesiredQuantity(itemClass) {
    if (global[itemClass].prototype.slots && itemClass !== "Stone") {
      return 1;
    }
    let multiplier = this.getItemValueNormalised(itemClass) + 1;
    if (this.getBehaviour(BEHAVIOURS.HOARDER)) {
      multiplier *= 3;
    }
    if (global[itemClass].prototype.nutrition) {
      multiplier *= 4;
    }
    return (
      multiplier *
      Math.min(
        MAX_ITEM_QTY,
        Math.max(
          MIN_ITEM_QTY,
          Math.floor(ACCEPTABLE_ITEM_WEIGHT / global[itemClass].getWeight())
        )
      )
    );
  }

  hasEnoughOfItem(itemClass) {
    return (
      this.creature.getItemQty(itemClass) >=
      this.getItemDesiredQuantity(itemClass)
    );
  }

  getRandomCraftableRecipe() {
    return utils
      .randomizeArray(this.creature.getCraftingRecipes())
      .map(rId => Recipe.getRecipeById(rId))
      .filter(r => !this.hasEnoughOfItem(Object.keys(r.result).shift()))
      .filter(r => this.isActionSafe("Craft", r))
      .find(recipe => {
        const utility = recipe.getToolUtility();
        if (utility) {
          const bestTool = this.getBestTool(utility);
          if (!bestTool) {
            return false;
          }
          this.creature.equip(bestTool, EQUIPMENT_SLOTS.TOOL);
        }
        if (recipe.getActionById("Craft").canRun(recipe, this.creature)) {
          this.queueAction("Craft", recipe.getEntityId());
          return true;
        }
      });
  }

  researchSomething() {
    const availableResearches = [
      ...Recipe.getRecipes()
        .filter(recipe => !!recipe.research)
        .filter(recipe => !this.creature.knowsCraftingRecipe(recipe)),
      ...Plan.getPlans()
        .filter(plan => !!plan.research)
        .filter(plan => !this.creature.knowsBuilding(plan))
    ];

    const nextRecipe = availableResearches.find(learnable => {
      const research = utils.cleanup(learnable.research);
      return (
        research.materials &&
        this.creature.hasMaterials(research.materials) &&
        !learnable.getMissingBuilding(this.creature.getNode()) &&
        (!learnable.getToolUtility() ||
          this.getBestTool(learnable.getToolUtility()))
      );
    });

    if (nextRecipe) {
      const toolUtility = nextRecipe.getToolUtility();
      if (toolUtility) {
        const tool = this.getBestTool(toolUtility);
        this.creature.startAction(tool, tool.getActionById("Equip: Tool"));
      } else {
        if (this.creature.getTool()) {
          this.creature.unequip(this.creature.getTool(), EQUIPMENT_SLOTS.TOOL);
        }
      }

      this.creature.researchMaterials = utils.cleanup(
        nextRecipe.research.materials
      );

      this.queueAction("Research", this.creature);

      return true;
    }
    return false;
  }

  patchedSomeWounds() {
    this.creature.items.some(i => {
      if (i.sourceBuff && this.creature.hasBuff(i.sourceBuff)) {
        this.queueAction("Tend wounds", i, 100, {
          creatureId: this.creature.getEntityId()
        });
        return true;
      }
      return false;
    });
  }

  increaseItemValue(itemClass, value = 1) {
    this.itemValues = this.itemValues || {};
    this.itemValues[itemClass] = (this.itemValues[itemClass] || 0) + value;
  }

  getItemValue(itemClass) {
    this.itemValues = this.itemValues || {};
    return this.itemValues[itemClass] || 0;
  }

  getItemValueNormalised(itemClass) {
    this.itemValues = this.itemValues || {};
    const min = Object.values(this.itemValues).reduce(
      (acc, v) => Math.min(acc, v),
      Infinity
    );
    const max = Object.values(this.itemValues).reduce(
      (acc, v) => Math.max(acc, v),
      -Infinity
    );
    return (this.getItemValue(itemClass) - min) / (max - min) || 1;
  }

  recordEpitaph(reason) {
    const epitaph = [
      `**** Epitaph: ${this.creature.getName()} ****`,
      `Race: ${this.creature.constructor.name}`,
      `Age: ${this.creature.age}`,
      `Death cause: ${reason}`,
      `Location: ${this.creature.node.getName()} (${this.creature.node.getTemperature(
        true
      )})`,
      `Traits: ${Object.keys(BEHAVIOURS)
        .filter(k => this.behaviour[BEHAVIOURS[k]])
        .join(", ")}`,
      `**** Epitaph End: ${this.creature.getName()} ****`
    ];
    utils.log(epitaph.join("    "));
  }
}
Object.assign(BasicSpark.prototype, {
  consideredSafeThreatLevel: 3
});

module.exports = global.BasicSpark = BasicSpark;
