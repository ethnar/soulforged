const Creature = require("../.creature");
const server = require("../../../singletons/server");
const InformationProvider = require("../../../singletons/information-provider");
const jd = require("../../../client/libs/json-delta");

let statusBuffs;
(() => {
  const buffs = utils.getClasses(Buff);
  statusBuffs = [
    "Minor pain",
    "Pain",
    "Major pain",
    "Extreme pain",
    "Slightly Sad",
    "Sad",
    "Very Sad",
    "Gloomy",
    "Very Tired",
    "Exhausted",
    "Cheerful",
    "Overjoyed",
    "Ecstatic"
  ].map(
    displayName => buffs.find(b => b.name === displayName).constructor.name
  );
})();

const MAX_SKILL_LEVEL = 10;
const BASE_SKILL = 3 * DAYS;
const MAX_SKILL = BASE_SKILL * (Math.pow(2, MAX_SKILL_LEVEL) - 1);

const DIFFICULTY_LABELS = {
  1: "Trivial",
  2: "Fairly simple",
  3: "Difficult",
  4: "Extremely Difficult",
  5: "Insurmountable"
};
const REST_MARGIN = 3;

const dataStreams = {
  ticker: () => global.timing.nextCycleSeconds,
  currentTimeInMinutes: () => Math.ceil(world.getCurrentTime() / (60 * 1000)),
  currentAction: creature => creature.getCurrentActionPayload(),
  isTutorialArea: creature => !creature.isOnMainland,
  acceptedLegalTerms: creature =>
    creature.getPlayer() ? creature.getPlayer().hasAcceptedLegalTerms() : true,
  ambientAudio: creature => creature.ambientAudio,
  myCreature: (creature, connection) =>
    creature.getPayload(creature, connection),
  myEquipment: creature => creature.getEquipmentPayload(creature),
  myFurniture: creature =>
    creature.getHome() && creature.getHome().getFurnishingPayload(creature),
  researchMaterials: creature =>
    Item.getMaterialsPayload(creature.researchMaterials, creature),
  recentResearches: creature => creature.getRecentResearchesPayload(creature),
  myQuests: creature =>
    creature.getPlayer() ? creature.getPlayer().getQuestsPayload(creature) : [],
  effectsSummary: creature => creature.getEffectsSummaryPayload(),
  tradeListings: creature => creature.getAllTradeListingsPayload(creature),
  knownItems: creature => creature.getKnownItemsPayload(creature),
  nodeItems: creature =>
    creature.getNode().items.map(item => {
      creature.learnAboutItem(item.constructor.name);
      return item.getPayload(creature);
    }),
  relationships: creature => creature.getRelationshipsPayload(),
  listingIds: (creature, connection) => creature.getListingIds(connection),
  events: creature => [
    ...world.getEventsPayload(creature),
    ...creature.getNode().getNodeEventsPayload(creature)
  ],
  playerInfo: creature => ({
    age: creature.age,
    stats: creature.getStatsPayload(creature),
    skills: creature.getSkillsPayload(),
    location: creature.getNode().getEntityId(),
    travelQueue: (creature.travelQueue || []).map(i => i.getEntityId()),
    knowsCrafting: creature.getCraftingRecipes().length,
    knowsBuildingPlan: creature.getBuildingPlansIds().length,
    unacceptedTradesCount: Trade.getCreatureTrades(creature).filter(
      trade => !trade.hasAccepted(creature)
    ).length,
    climate: creature.getNode().getClimate(),
    hasFurnishing:
      creature.getHome() && creature.getHome().getDecorations().length
  }),
  myTrades: creature =>
    Trade.getCreatureTrades(creature).map(trade => trade.getPayload(creature)),
  myBuildingPlans: creature =>
    creature
      .getBuildingPlansIds()
      .map(planId => Plan.getPlanById(planId))
      .map(plan => plan.getPayload(creature))
      .reverse(),
  myRecipes: creature =>
    creature
      .getCraftingRecipes()
      .map(recipeId => Recipe.getRecipeById(recipeId))
      .map(recipe => recipe.getPayload(creature))
      .reverse(),
  myInventory: creature => ({
    items: creature.items.map(item => ({
      deadEnd:
        creature.knowsItem(item.constructor.name) === ITEM_KNOWLEDGE.DEAD_END,
      ...item.getPayload(creature)
    })),
    weights: creature.getBurdenLevels()
    // weight: creature.getItemsWeight(),
    // weightLimit: creature.getCarryCapacity(),
  }),
  myHomeInventory: creature =>
    creature.getHome() && creature.getHome().getInventoryPayload(creature)
};

const actions = Action.groupById([
  new Action({
    name: "Research",
    icon: "/actions/icons8-test-tube-100.png",
    repeatable: false,
    quickAction: true,
    notification: false,
    cannotBePostponed: true,
    valid(target, creature) {
      if (target !== creature) {
        return false;
      }
      return true;
    },
    runCheck(entity, creature) {
      const researchMaterials = utils.cleanup(creature.researchMaterials);
      if (!Object.keys(researchMaterials).length) {
        return "You did not select any materials to use for research";
      }

      if (!creature.hasMaterials(researchMaterials)) {
        return "You do not have enough resources";
      }
      const tool = creature.getTool();
      if (
        tool &&
        creature.researchMaterials[tool.constructor.name] &&
        !creature.hasMaterials({ [tool.constructor.name]: 1 })
      ) {
        return `You need to have more than one ${tool.name} to do this.`;
      }

      const deadEnds = Object.keys(creature.researchMaterials).filter(
        className =>
          creature.getKnownItems()[className] === ITEM_KNOWLEDGE.DEAD_END
      );
      if (deadEnds.length) {
        const itemList = deadEnds
          .map(itemClass => global[itemClass].getName())
          .sort()
          .join(", ");
        return `The following items are already known dead ends: ${itemList}.`;
      }

      return true;
    },
    run(entity, creature, seconds) {
      // const efficiency = creature.getEfficiency(SKILLS.RESEARCH, null);

      // creature.actionProgress += seconds * efficiency * 100 / RESEARCH_TIME;
      creature.actionProgress += (seconds * 100) / 3;

      const researchMaterials = Object.keys(
        utils.cleanup(creature.researchMaterials)
      ).toObject(
        key => key,
        () => 1
      );
      const tool = creature.getTool();

      // const lastResearch = creature.recentResearches[0];
      // if (
      //     lastResearch &&
      //     lastResearch.toolUsed === (tool ? tool.constructor.name : null) &&
      //     lastResearch.insights &&
      //     !lastResearch.recipeId &&
      //     !lastResearch.insights.theresMore &&
      //     !lastResearch.insights.requiredSkillNotMet &&
      //     !lastResearch.insights.missingBuilding &&
      //     JSON.stringify(lastResearch.materialsUsed) === JSON.stringify(researchMaterials)
      // ) {
      //     creature.logging(`Research interrupted: Identical to the previous research, results would be the same.`, LOGGING.IMMEDIATE_ERROR);
      //     return false;
      // }

      if (creature.actionProgress >= 100) {
        const availableCrafting = [
          ...Recipe.getRecipes()
            .filter(recipe => !!recipe.research)
            .filter(recipe => !creature.knowsCraftingRecipe(recipe)),
          ...Plan.getPlans()
            .filter(plan => !!plan.research)
            .filter(plan => !creature.knowsBuilding(plan))
        ];

        if (creature.hasBuff(BuffPerk_OriginalThinker)) {
          const saved = [];
          const newMaterials = Object.keys(researchMaterials)
            .filter(material => {
              if (utils.chance(5)) {
                saved.push(global[material].prototype.name);
                return false;
              } else {
                return true;
              }
            })
            .toObject(
              v => v,
              () => 1
            );
          if (saved.length) {
            creature.logging(
              `Your original thinking saved you some materials: ${saved.join(
                ", "
              )}.`,
              LOGGING.GOOD
            );
          }
          creature.spendMaterials(newMaterials);
        } else {
          creature.spendMaterials(researchMaterials);
        }

        let somethingIsMissing = false;
        let somethingIsNotAvailable = false;
        let allNeededItemsWereThere = false;
        let atLeastOneItemMatches = false;
        let requiredSkillNotMet = Infinity;
        let requiredSkillNotMetSkillId;
        let wrongTool = false;
        let missingBuilding = false;
        let theresMore = false;
        const ingredientsMatch = availableCrafting.filter(recipe => {
          const research = utils.cleanup(recipe.research);

          const usedMaterials = Object.keys(researchMaterials);
          const neededMaterials = Object.keys(
            utils.cleanup(research.materials)
          );

          const allMaterialsMatched =
            neededMaterials.every(material =>
              usedMaterials.includes(material)
            ) &&
            usedMaterials.length === Object.keys(research.materials).length;

          if (allMaterialsMatched) {
            if (
              recipe.getToolUtility() &&
              !creature.getToolLevel(recipe.getToolUtility())
            ) {
              wrongTool = true;
              return false;
            }

            return true;
          }

          if (
            neededMaterials.every(material => usedMaterials.includes(material))
          ) {
            allNeededItemsWereThere = true;
            return false;
          }

          if (
            usedMaterials.every(material =>
              neededMaterials.includes(material)
            ) &&
            neededMaterials.every(material => creature.knowsItem(material))
          ) {
            somethingIsMissing = true;
            return false;
          }

          if (
            usedMaterials.every(material =>
              neededMaterials.includes(material)
            ) &&
            neededMaterials
              .filter(material => !usedMaterials.includes(material))
              .some(material => !creature.knowsItem(material))
          ) {
            somethingIsNotAvailable = true;
            return false;
          }

          if (
            usedMaterials.some(material => neededMaterials.includes(material))
          ) {
            atLeastOneItemMatches = true;
            return false;
          }

          return false;
        });

        let learnedRecipe;
        if (ingredientsMatch.length > 0) {
          learnedRecipe = ingredientsMatch.find(recipe => {
            const baseSkillPassChance =
              (recipe.skillLevel === undefined && 100) ||
              creature.getSkillSuccessChance(recipe.skill, recipe.skillLevel);
            const skillPassChance = 100 - (100 - baseSkillPassChance) / 4;
            const passedSkillCheck = baseSkillPassChance
              ? utils.random(1, 100) <= skillPassChance
              : 0;

            if (recipe.getMissingBuilding(creature.getNode())) {
              missingBuilding = true;
              return false;
            }

            if (!passedSkillCheck) {
              let targetSkillNotMet;
              switch (true) {
                case baseSkillPassChance >= SKILL_CHANCE.GUARANTEED:
                  targetSkillNotMet = 0;
                  break;
                case baseSkillPassChance >= SKILL_CHANCE.HIGH:
                  targetSkillNotMet = 1;
                  break;
                case baseSkillPassChance >= SKILL_CHANCE.LOW:
                  targetSkillNotMet = 2;
                  break;
                case baseSkillPassChance >= SKILL_CHANCE.TINY:
                  targetSkillNotMet = 3;
                  break;
                default:
                  targetSkillNotMet = 4;
                  break;
                // case baseSkillPassChance >= SKILL_CHANCE.GUARANTEED: requiredSkillNotMet = `It should not be possible to get this message`; break;
                // case baseSkillPassChance >= SKILL_CHANCE.HIGH: requiredSkillNotMet = `<span class="${DIFFICULTY_LABELS[2]}">Almost</span> had it...`; break;
                // case baseSkillPassChance >= SKILL_CHANCE.LOW: requiredSkillNotMet = `This is <span class="${DIFFICULTY_LABELS[3]}">difficult</span>`; break;
                // case baseSkillPassChance >= SKILL_CHANCE.TINY: requiredSkillNotMet = `This is <span class="${DIFFICULTY_LABELS[4]}">extremely difficult</span>`; break;
                // default: requiredSkillNotMet = `This seems <span class="${DIFFICULTY_LABELS[5]}">beyond your skills</span>`; break;
              }
              // requiredSkillNotMet = `${requiredSkillNotMet} (${SKILL_NAMES[recipe.skill]})`;
              // console.log(targetSkillNotMet, recipe.id);
              if (targetSkillNotMet < requiredSkillNotMet) {
                requiredSkillNotMet = targetSkillNotMet;
                requiredSkillNotMetSkillId = recipe.skill;
              }
              return false;
            }

            return true;
          });

          if (learnedRecipe && ingredientsMatch.length >= 2) {
            theresMore = true;
          }
        }

        const researchResult = {
          result: null,
          materialsUsed: researchMaterials,
          toolUsed: tool ? tool.constructor.name : null
        };

        if (tool) {
          tool.reduceIntegrity(0.5);
        }

        if (learnedRecipe) {
          const research = utils.cleanup(learnedRecipe.research);

          const player = creature.getPlayer();
          if (player) {
            player.gainSoulXp(10);
          }
          if (learnedRecipe instanceof Recipe) {
            creature.learnCrafting(learnedRecipe);
            researchResult.recipeId = learnedRecipe.getRecipeId();
          } else {
            creature.learnBuilding(learnedRecipe);
            researchResult.result = learnedRecipe.getPlanId();
          }

          researchResult.insights = {
            theresMore
          };
        } else {
          switch (requiredSkillNotMet) {
            case Infinity:
              requiredSkillNotMet = null;
              break;
            case 0:
              requiredSkillNotMet = `It should not be possible to get this message`;
              break;
            case 1:
              requiredSkillNotMet = `<span class="${DIFFICULTY_LABELS[2]}">Almost</span> had it...`;
              break;
            case 2:
              requiredSkillNotMet = `This is <span class="${DIFFICULTY_LABELS[3]}">difficult</span>`;
              break;
            case 3:
              requiredSkillNotMet = `This is <span class="${DIFFICULTY_LABELS[4]}">extremely difficult</span>`;
              break;
            default:
              requiredSkillNotMet = `This seems <span class="${DIFFICULTY_LABELS[5]}">beyond your skills</span>`;
              break;
          }
          if (requiredSkillNotMet) {
            requiredSkillNotMet = `${requiredSkillNotMet} (${SKILL_NAMES[requiredSkillNotMetSkillId]})`;
          }

          researchResult.insights = {
            somethingIsMissing,
            requiredSkillNotMet,
            wrongTool,
            missingBuilding,
            allNeededItemsWereThere,
            atLeastOneItemMatches,
            somethingIsNotAvailable
          };

          if (
            Object.values(researchResult.insights).every(v => !v) &&
            creature.isPlayableCharacter()
          ) {
            // DEAD END
            const knownItems = creature.getKnownItems();
            Object.keys(researchMaterials).forEach(
              itemClass => (knownItems[itemClass] = ITEM_KNOWLEDGE.DEAD_END)
            );
          }
        }
        utils.log(
          creature.getName(),
          "researching",
          JSON.stringify(researchMaterials),
          "Tool:",
          tool && tool.name,
          "Insights:",
          researchResult.insights && JSON.stringify(researchResult.insights),
          "Match:",
          learnedRecipe && learnedRecipe.name
        );

        creature.recentResearches.unshift(researchResult);
        creature.recentResearches.splice(10);

        return false;
      }

      return true;
    }
  }),
  Duel.issueDuelAction,
  Trade.startTradeAction,
  new Action({
    name: "Interact",
    icon: "/actions/icons8-so-so-100.png",
    notification: false,
    quickAction: true,
    repeatable: false,
    valid(target, creature) {
      if (target === creature) {
        return false;
      }
      if (creature.isHostile(target)) {
        return false;
      }
      if (!target.getPlayer()) {
        return false;
      }
      if (target.isDead()) {
        return false;
      }
      return true;
    },
    runCheck(target, creature) {
      const interactionType = creature.currentAction.extra;
      if (creature.getNode() !== target.getNode()) {
        return "You must be in the same location to do this";
      }
      return true;
    },
    run(target, creature) {
      const interactionType = creature.currentAction.extra;
      const interactions = target.getInteractions();

      const interaction = interactions[interactionType];
      if (interaction) {
        if (typeof interaction === "function") {
          interaction();
          return;
        }
        target.addOrUpdateBuff(
          {
            source: creature,
            category: Buff.CATEGORIES.INTERACTION
          },
          {
            visible: true,
            ...interaction.buff
          }
        );

        target.logging(
          interaction.message(creature.getName()),
          LOGGING.NORMAL,
          `interaction-${interactionType}`
        );

        target.recalculateInteractions();
      }
    },
    ...utils.jsAction("/js/actions/friendly-interact")
  }),
  MonsterDen.scanForDensAction
]);

class Humanoid extends Creature {
  static actions() {
    return { ...actions, ...Creature.actions() };
  }

  constructor(args = {}) {
    super(args);

    this.painThreshold = 100;
    this.energy = 100;
    this.satiated = 100;
    this.mood = 100;

    this.painThresholdTiered = 100;
    this.energyTiered = 100;
    this.satiatedTiered = 100;
    this.moodTiered = 100;

    this.equipment = {};
    this.researchMaterials = {};
    this.recentResearches = [];

    this.stats = {
      ...this.agingTiers[0]
    };

    this.age = 0;
    BuffAge1.applyBuff(this);

    this.looks = args.looks || {
      hairStyle: 1,
      hairColor: 1,
      skinColor: 1
    };
  }

  connected() {}

  getPlayer() {
    return this.player || this.spark;
  }

  setPlayer(player) {
    this.player = player;
  }

  getInteractions() {
    const value = this.hasBuff(BuffPerk_Hermit) ? 2 : 8;
    return {
      cheerup: {
        // TODO: define buff class
        message: name => `${name} is cheering you up!`,
        buff: {
          name: "Cheered up",
          icon: `/${ICONS_PATH}/creatures/humanoids/sgi_61_green.png`,
          duration: 4 * HOURS,
          effects: {
            [BUFFS.MOOD]: value
          }
        }
      },
      insult: {
        message: name =>
          `${name} makes rude gestures in your general direction.`,
        buff: {
          name: "Slighted",
          icon: `/${ICONS_PATH}/creatures/humanoids/sgi_61_red.png`,
          duration: 2 * HOURS,
          effects: {
            [BUFFS.MOOD]: -10
          }
        }
      }
    };
  }

  recalculateInteractions() {
    const interactions = this.getInteractions();
    Object.keys(interactions)
      .map(it => interactions[it])
      .forEach(interaction => {
        let level = 1;
        const name = interaction.buff.name;
        const effectValue = Object.values(interaction.buff.effects).pop();
        const effectKey = Object.keys(interaction.buff.effects).pop();
        this.getBuffs()
          .filter(
            b => b.category === Buff.CATEGORIES.INTERACTION && b.name === name
          )
          .sort((a, b) => b.duration - a.duration)
          .forEach(b => {
            let nextValue;
            if (MULTIPLIER_BUFFS[effectKey]) {
              nextValue = (effectValue - 100) / level + 100;
            } else {
              nextValue = +(effectValue / level).toFixed(2);
            }
            b.effects = {
              [effectKey]: nextValue
            };
            if (name === "Slighted") {
              level = level * 1.5;
            } else {
              level = level * 2;
            }
          });
      });
  }

  getAge() {
    return this.age;
  }

  getSkillGainDifficultyMultiplier(skill, skillLevel) {
    if (!skill) {
      return 1;
    }
    const creatureSkill = this.getSkillLevel(skill);
    const levelDistance = Math.abs(creatureSkill - (skillLevel || 0) + 1);
    return Math.pow(2, Math.max(0, 2 - levelDistance));
  }

  getSkillSuccessChance(skill, skillLevel, withLinearProgress = true) {
    skillLevel = +skillLevel || 0;
    if (skill) {
      const creatureSkill = this.getSkillLevel(skill, false);
      const levelDifference = creatureSkill - skillLevel;
      let baseChance;
      let extraChance;
      switch (true) {
        case levelDifference >= 1:
          baseChance = SKILL_CHANCE.GUARANTEED;
          extraChance = 0;
          break;
        case levelDifference >= 0:
          baseChance = SKILL_CHANCE.HIGH;
          extraChance = SKILL_CHANCE.GUARANTEED;
          break;
        case levelDifference >= -1:
          baseChance = SKILL_CHANCE.LOW;
          extraChance = SKILL_CHANCE.HIGH;
          break;
        case levelDifference >= -2:
          baseChance = SKILL_CHANCE.TINY;
          extraChance = SKILL_CHANCE.LOW;
          break;
        case levelDifference >= -3:
          baseChance = SKILL_CHANCE.NONE;
          extraChance = SKILL_CHANCE.TINY;
          break;
        default:
          baseChance = SKILL_CHANCE.NONE;
          extraChance = SKILL_CHANCE.NONE;
          break;
      }
      if (withLinearProgress && extraChance) {
        return (
          baseChance +
          ((100 + creatureSkill - skillLevel) % 1) * (extraChance - baseChance)
        );
      }
      return baseChance;
    }
    return SKILL_CHANCE.GUARANTEED;
  }

  getDifficultyLabel(skill, skillLevel) {
    const chance = this.getSkillSuccessChance(skill, skillLevel);
    let label;
    switch (true) {
      case chance >= SKILL_CHANCE.GUARANTEED:
        label = DIFFICULTY_LABELS[1];
        break;
      case chance >= SKILL_CHANCE.HIGH:
        label = DIFFICULTY_LABELS[2];
        break;
      case chance >= SKILL_CHANCE.LOW:
        label = DIFFICULTY_LABELS[3];
        break;
      case chance >= SKILL_CHANCE.TINY:
        label = DIFFICULTY_LABELS[4];
        break;
      case chance >= SKILL_CHANCE.NONE:
        label = DIFFICULTY_LABELS[5];
        break;
      default:
        return `Unknown ${chance}%`;
    }
    return `${label} (${Math.round(chance)}%)`;
  }

  knowsBuilding(plan) {
    return this.getBuildingPlansIds().find(
      planId => planId === plan.getPlanId()
    );
  }

  getCraftingRecipes() {
    const player = this.getPlayer();
    return player ? player.getCraftingRecipes() : [];
  }

  getBuildingPlansIds() {
    const player = this.getPlayer();
    return player ? player.getBuildingPlansIds() : [];
  }

  knowsCraftingRecipe(recipe) {
    return this.getCraftingRecipes().some(
      recipeId => Recipe.getRecipeById(recipeId) === recipe
    );
  }

  addCraftingRecipe(recipe) {
    this.getCraftingRecipes().push(recipe.getRecipeId());
  }

  learnCrafting(recipe) {
    this.addCraftingRecipe(recipe);
    this.logging(`You learned new recipe: ${recipe.getName()}`, LOGGING.NORMAL);
    if (recipe.research && recipe.research.onLearn) {
      recipe.research.onLearn(this);
    }
    Object.keys(recipe.result).forEach(itemClass =>
      this.learnAboutItem(itemClass)
    );
    ResearchConcept.checkForInspiration(this.getPlayer());
  }

  learnBuilding(plan) {
    this.getBuildingPlansIds().push(plan.getPlanId());
    this.logging(
      `You learned to place new structure: ${plan.getName()}`,
      LOGGING.NORMAL
    );
    ResearchConcept.checkForInspiration(this.getPlayer());
  }

  getStartingNode() {
    if (!this.startingNode) {
      this.startingNode = this.getNode();
    }
    return this.startingNode;
  }

  seesNode(node) {
    if (!this.isPlayableCharacter()) {
      return true;
    }
    return this.getNodeSeenAgo(node) < 3 * IN_MILISECONDS;
  }

  getMapData(nodeId) {
    const mapData = (this.getPlayer() && this.getPlayer().getMapData()) || {};
    return nodeId ? mapData[nodeId] || {} : mapData;
  }

  setMapData(nodeId, data) {
    const mapData = this.getPlayer().getMapData();
    mapData[nodeId] = mapData[nodeId] || {};
    mapData[nodeId].cache = data;
  }

  deleteMapData(nodeId) {
    const mapData = this.getPlayer().getMapData();
    delete mapData[nodeId];
  }

  getNodeSeenAgo(node) {
    const data = this.getMapData(node.getEntityId());
    if (!data || !data.cache || !data.cache.lastUpdate) {
      return Infinity;
    }
    return world.getCurrentTime() - data.cache.lastUpdate;
  }

  isNodeMapped(node) {
    if (!this.isPlayableCharacter()) {
      return true;
    }
    return !!this.getMapData(node.getEntityId()).cache;
  }

  isNodeKnown(node) {
    return this.isNodeMapped(node);
  }

  storeNodeInfo(node, data) {
    if (!this.isPlayableCharacter()) {
      return false;
    }
    const knownNodeTypes = this.getPlayer().getKnownNodeTypes();
    knownNodeTypes[node.getType()] = true;
    this.setMapData(node.getEntityId(), data);
  }

  getNodeInfo(node) {
    return this.getMapData(node.getEntityId()).cache || { type: node.type };
  }

  deleteNodeInfo(node) {
    const nodeId = node.getEntityId();
    this.deleteMapData(nodeId);
    server.getConnections(this.getPlayer()).forEach(connection => {
      if (nodeId === connection.liveUpdateNode) {
        connection.liveUpdateNode = null;
      }
    });
    server.sendToPlayer(this.getPlayer(), "remove-node-id", nodeId);
  }

  getKnownNodes() {
    return Object.keys(this.getMapData())
      .map(id => Entity.getById(id))
      .filter(node => this.isNodeKnown(node));
  }

  isNodeTypeKnown(nodeType) {
    if (!this.isPlayableCharacter()) {
      return true;
    }
    const knownNodeTypes = this.getPlayer().getKnownNodeTypes();
    return knownNodeTypes[nodeType];
  }

  getKnownNodeTypes() {
    if (!this.isPlayableCharacter()) {
      return {};
    }
    return this.getPlayer().getKnownNodeTypes();
  }

  getCreaturesMapPayload(onlyVisible = false, connection = {}) {
    const extraNodeId = connection.liveUpdateNode;
    const nodesInVisionRange = this.getNodesInVisionRange();

    let nodes = Object.keys(nodesInVisionRange)
      .map(nodeId => Entity.getById(nodeId))
      .concat(
        this.getKnownNodes().filter(node => {
          const nodeId = node.getEntityId();
          if (nodesInVisionRange[nodeId]) {
            return false;
          }
          const mapData = this.getMapData(nodeId);
          const time =
            mapData &&
            mapData.cache &&
            world.getCurrentTime().getTime() -
              mapData.cache.lastUpdate.getTime();
          return time && time < 10000;
        })
      );
    if (!onlyVisible) {
      nodes = nodes.concat(this.getKnownNodes());
    }
    if (extraNodeId) {
      nodes.push(Entity.getById(extraNodeId));
    }

    return nodes
      .filter(node => !!node)
      .filter(node => node.x !== undefined)
      .map(node =>
        node.getMapPayload(
          this,
          nodesInVisionRange,
          extraNodeId === node.getEntityId(),
          connection
        )
      )
      .filter(data => !!data);
  }

  setNode(node) {
    super.setNode(node);
  }

  updateEnergy(seconds) {
    const buffMultiplier = seconds / (7 * DAYS);
    [...this.buffs]
      .filter(b => b.isCategory(Buff.CATEGORIES.TRINKET))
      .forEach(b => {
        b.setLevel(b.getLevel() - buffMultiplier);
        if (b.getLevel() < 0) {
          this.removeBuff(b);
        }
      });

    if (this.isSleeping()) {
      const sleepNeeded = 6 * HOURS;
      const previousEnergy = this.energy;
      this.energy += (seconds * this.actionProgress) / sleepNeeded;

      const sleepQuality = this.actionProgress;
      const timeLeftTillFullQuality =
        (SECONDS_NEEDED_FOR_GOOD_SLEEP * (100 - sleepQuality)) / 100;

      const energyNeededLeft = 100 - this.energy;

      const maxEnergyGainedTillFullQuality =
        (timeLeftTillFullQuality / sleepNeeded) *
        (sleepQuality + (100 - sleepQuality) / 2);

      if (energyNeededLeft <= 0) {
        this.currentAction.ETA = null;
      } else if (energyNeededLeft > maxEnergyGainedTillFullQuality) {
        const extraTimeNeeded =
          (sleepNeeded * (energyNeededLeft - maxEnergyGainedTillFullQuality)) /
          100;
        this.currentAction.ETA = timeLeftTillFullQuality + extraTimeNeeded;
      } else {
        const ratio = 100 / SECONDS_NEEDED_FOR_GOOD_SLEEP;
        const a = ratio / (2 * sleepNeeded);
        const b = sleepQuality / sleepNeeded;
        const c = -energyNeededLeft;
        const needed = (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);
        this.currentAction.ETA = needed;
      }

      const buffMultiplier = seconds / (7 * 5 * HOURS);

      const home = this.getHome();
      if (home) {
        home.getDecorations().forEach(slot => {
          if (slot.item && slot.item.buffs) {
            this.updateBuffLevel(
              {
                decorationId: slot.item.constructor.name
              },
              {
                source: slot.item,
                level: buffMultiplier,
                category: Buff.CATEGORIES.TRINKET
              },
              {
                name: `Well rested (${slot.item.getName()})`,
                effects: slot.item.buffs
              }
            );
          }
        });
      }
    } else {
      const workHours = 18 * HOURS;
      this.energy -= (seconds * 100) / workHours;
    }

    this.energy = utils.limit(this.energy, 0, 100);
    this.energyTiered =
      Math.ceil((this.energy + this.getBuff(BUFFS.ENERGY)) / 25) * 25;
    if (this.energy === 0) {
      this.startAction(this, this.getActionById("Sleep"));
    }
  }

  updateMood() {
    this.mood = 100 + this.getBuff(BUFFS.MOOD);

    this.mood = utils.limit(this.mood, 0, 200);
    this.moodTiered = Math.ceil(this.mood / 25) * 25;
  }

  getStatsAtAge(age) {
    if (this.agingTiers[age]) {
      return this.agingTiers[age];
    }

    const ageTiers = Object.keys(this.agingTiers).reduce(
      (acc, tier) => {
        if (+tier < this.age && +tier > acc.from) acc.from = +tier;
        if (+tier >= this.age && +tier < acc.to) acc.to = +tier;
        return acc;
      },
      {
        from: 0,
        to: Infinity
      }
    );

    if (ageTiers.to === Infinity) {
      return this.agingTiers[ageTiers.from];
    }

    const delta = ageTiers.to - ageTiers.from;
    const ratios = {
      from: (ageTiers.to - age) / delta,
      to: (age - ageTiers.from) / delta
    };

    return Object.values(STATS).reduce((acc, s) => {
      acc[s] = Math.round(
        this.agingTiers[ageTiers.from][s] * ratios.from +
          this.agingTiers[ageTiers.to][s] * ratios.to
      );
      return acc;
    }, {});
  }

  debugMakeAdult() {
    const adulthoodAge = +Object.keys(this.agingTiers)[1] + 1;
    for (let i = 0; i < adulthoodAge; i += 1) {
      this.progressAging();
    }
  }

  progressAging() {
    const previousAgeStats = this.getStatsAtAge(this.age);
    this.age += 1;
    const newAgeStats = this.getStatsAtAge(this.age);

    const ageLevels = Object.keys(this.agingTiers);
    const adolescenceMaxAge = +ageLevels[1];
    const elderlyMinAge = this.getElderlyMinAge();

    this.removeBuffsByCategory(Buff.CATEGORIES.AGE_INDICATOR);

    switch (true) {
      case this.age >= this.maxAge:
        BuffAge4.applyBuff(this);
        if (
          Math.random() <
          -2 / ((100 * (this.age - this.maxAge)) / this.maxAge + 2) + 1
        ) {
          this.dieOfOldAge();
        }
        break;
      case this.age <= adolescenceMaxAge:
        BuffAge1.applyBuff(this);
        break;
      case this.age >= elderlyMinAge:
        BuffAge3.applyBuff(this);
        this.looks.hairColorGrayness = this.getEldernessStage();
        break;
      default:
        BuffAge2.applyBuff(this);
    }

    Object.values(STATS).forEach(stat => {
      this.setStatValue(
        stat,
        this.stats[stat] + newAgeStats[stat] - previousAgeStats[stat]
      );
    });

    const player = this.getPlayer();
    if (player && this.age % 10 === 0) {
      this.logging(`You are now ${this.age} days old!`, LOGGING.NORMAL);

      const totalSkillEarned = this.getTotalSkillExpEarned();
      const soulXp = Math.round(totalSkillEarned / (80 * HOURS));

      if (soulXp) {
        player.gainSoulXp(soulXp);
      }
    }
  }

  getTotalSkillExpEarned() {
    return Object.values(this.skills).reduce((a, v) => a + v, 0);
  }

  dieOfOldAge() {
    this.die("You died of old age");
  }

  die(reason) {
    [
      EQUIPMENT_SLOTS.HEAD,
      EQUIPMENT_SLOTS.CHEST,
      EQUIPMENT_SLOTS.HANDS,
      EQUIPMENT_SLOTS.TROUSERS,
      EQUIPMENT_SLOTS.FEET
    ].forEach(slot => {
      if (this.equipment[slot]) {
        this.equipment[slot].reduceIntegrity(utils.random(15, 25) / 100);
      }
    });
    if (this.getPlayer()) {
      this.lastPlayer = this.getPlayer();
      this.getPlayer().recordEpitaph(reason);
    }
    this.getNode().addItem(new global[`${this.constructor.name}Corpse`]());
    this.grantMonsterVeterancy();
    super.die(reason);

    Trade.getCreatureTrades(this).forEach(t => t.destroy());

    if (this.getPlayer()) {
      this.getPlayer().updateDiscordRole();
    }
  }

  grantMonsterVeterancy() {
    const validMonsters = this.getNode()
      .getCreatures()
      .filter(c => !c.isDead())
      .filter(c => c.isHostile(this))
      .filter(c => c instanceof Monster);

    const monsterExperience =
      (20 * Math.floor(this.getTotalSkillExpEarned() / (800 * HOURS))) /
      validMonsters.length;

    validMonsters.forEach(m => {
      m.gainVeterancyExperience(monsterExperience);
    });
  }

  applyDrinkBuff(item) {
    if (item.buffs) {
      if (item.buffs[BUFFS.VENOM]) {
        BuffVenom.applyBuff(this, item.buffs[BUFFS.VENOM]);
      }
      if (item.buffs[BUFFS.ENERGY]) {
        this.energy = utils.limit(
          this.energy + item.buffs[BUFFS.ENERGY],
          0,
          100
        );
      }
      if (item.buffs[BUFFS.BLOOD]) {
        this.blood = utils.limit(this.blood + item.buffs[BUFFS.BLOOD], 0, 100);
      }
      if (item.buffs.satiation) {
        this.satiated = utils.limit(
          this.satiated + item.buffs.satiation,
          0,
          100
        );
      }
    }
    if (item.timedBuff) {
      const existing = this.buffs.filter(
        b => b.source && b.source.constructor.name === item.constructor.name
      );

      const getEffectsKey = buff => JSON.stringify(Object.keys(buff.effects));

      item.timedBuff.forEach(timed => {
        const diminishingReturns = timed.diminishingReturn;
        const effectsKey = getEffectsKey(timed);
        existing
          .filter(b => getEffectsKey(b) === effectsKey)
          .forEach(b => {
            b.setLevel(b.getLevel() * diminishingReturns);
          });
        this.addBuff(Buff, {
          source: item,
          category: Buff.CATEGORIES.OTHER,
          duration: timed.duration,
          effects: timed.effects
        });
      });
    }
  }

  applyFoodBuff(item) {
    const previous = this.satiated - item.nutrition;
    const foodBuffs = [...this.buffs].filter(b =>
      b.isCategory(Buff.CATEGORIES.FOOD)
    );

    // diminish previous results
    foodBuffs.forEach(b => {
      const newLevel =
        Math.floor((1000 * b.getLevel() * previous) / this.satiated) / 1000;
      if (!newLevel) {
        this.removeBuff(b);
      } else {
        b.setLevel(newLevel);
      }
    });

    // Add the new buffs
    if (item.buffs) {
      const level =
        Math.floor(
          1000 *
            ((((100 + this.getBuff(BUFFS.FOOD_BONUS)) / 100) * item.nutrition) /
              this.satiated)
        ) / 1000;

      this.updateBuffLevel(
        {
          category: Buff.CATEGORIES.FOOD,
          foodId: item.constructor.name
        },
        {
          source: item,
          level,
          effects: {
            ...item.buffs
          }
        },
        {
          name: `Food: ${item.getName()}`
        },
        5
      );
    }
  }

  updateAuraBuffs() {
    this.removeBuffsByCategory(Buff.CATEGORIES.BUILDING_AURA);
    this.removeBuffsByCategory(Buff.CATEGORIES.EQUIPMENT_AURA);

    const locationAuras = [
      ...this.getNode().getCompleteStructures(),
      this.getNode()
    ];

    locationAuras.forEach(structure => {
      const buffs = structure.getBuffs && structure.getBuffs(this);
      if (buffs && Object.keys(buffs).length > 0) {
        this.addBuff(Buff, {
          source: structure,
          category: Buff.CATEGORIES.BUILDING_AURA,
          effects: buffs
          // visible: true,
        });
      }
    });

    Object.keys(this.equipment).forEach(slotId => {
      const equipment = this.equipment[slotId];
      if (!equipment || equipment.isUnusable()) {
        return;
      }
      if (+slotId === +EQUIPMENT_SLOTS.TOOL && equipment.damage) {
        return;
      }
      const buffs = equipment.getBuffs(this);
      if (buffs) {
        this.addBuff(Buff, {
          source: equipment,
          category: Buff.CATEGORIES.EQUIPMENT_AURA,
          effects: buffs
          // visible: true,
        });
      }
    });
  }

  isQuestComplete(questId) {
    return this.getPlayer().isQuestComplete(questId);
  }

  markQuestReviewed(questId, setTo = true) {
    if (this.getPlayer().currentQuests[questId]) {
      this.getPlayer().currentQuests[questId].reviewed = setTo;
    }
  }

  updateBuffs(seconds) {
    this.buffs = this.buffs || [];

    this.updateAuraBuffs(); // does not rely on seconds

    this.removeBuffsByCategory(Buff.CATEGORIES.THERMAL);
  }

  updateStatusBuffs() {
    super.updateStatusBuffs();

    if (this.energyTiered < 100) {
      const severity = 4 - this.energyTiered / 25;
      this.addBuff(global[`BuffTired${severity}`]);
    }
    if (this.energy === 100) {
      this.addBuff(BuffFullyRested);
    }

    if (this.moodTiered < 100) {
      const severity = 4 - this.moodTiered / 25;
      this.addBuff(global[`BuffMoodBad${severity}`]);
    }
    if (this.moodTiered === 100) {
      this.addBuff(BuffMoodContent);
    }
    if (this.moodTiered > 100) {
      const goodMoodTier = Math.min(Math.floor((this.mood - 100) / 20) + 1, 5);
      this.addBuff(global[`BuffMoodGood${goodMoodTier}`]);
    }
    const burdens = this.getBurdenLevels();
    if (burdens.currentLevel) {
      this.addBuff(global[`BuffBurdened${burdens.currentLevel}`]);
    }
  }

  getChallengeLevel() {
    return 60 * this.getEfficiency();
  }

  getThermalRange() {
    return {
      min: this.thermalRange.min - this.getBuff(BUFFS.TEMPERATURE_MIN),
      max: this.thermalRange.max + this.getBuff(BUFFS.TEMPERATURE_MAX)
    };
  }

  checkInspire() {
    ResearchConcept.checkForInspiration(this.getPlayer());
  }

  cycle(seconds) {
    if (!this.isDead()) {
      if (this.isPlayableCharacter()) {
        Object.keys(this.getNodesInVisionRange()).forEach(nodeId => {
          const data = this.getMapData(nodeId);
          if (data && data.cache) {
            data.cache.lastUpdate = world.getCurrentTime();
          }
        });

        this.atInterval(6 * HOURS, () => this.checkInspire(), seconds);
      }

      if (
        this.protectionStatus === PROTECTION_STATUS.IDLE &&
        this.hasEnemies()
      ) {
        this.enableProtectionStatus();
      }

      this.updateBuffs(seconds);

      this.updateEnergy(seconds);
      this.gettingHungry(seconds);
      this.updateStats(seconds);
    }

    super.cycle(seconds); // updates pains and wounds

    if (!this.isDead()) {
      this.updateMood();

      this.updateStatusBuffs();

      this.notifications();

      this.atInterval(24 * HOURS, () => this.progressAging(), seconds);

      if (!this.currentAction && AUTO_SLEEP) {
        this.startAction(this, this.getActionById("Sleep"));
      }

      if (
        (!this.isCurrentActionAllowedDuringCombat() ||
          this.isDoingAction("Sleep")) &&
        this.energy > 5 &&
        this.isInDanger() &&
        this.protectionStatus === PROTECTION_STATUS.UNPROTECTED
      ) {
        this.startAction(this, this.getActionById("Fight"));
      }

      if (
        this.protectionStatus !== PROTECTION_STATUS.IDLE &&
        !this.hasEnemies()
      ) {
        this.removeBuff(`BuffHiding`);
        this.protectionStatus = PROTECTION_STATUS.IDLE;
      }

      if (
        this.protectionStatus === PROTECTION_STATUS.PROTECTED &&
        this.getCurrentAction() &&
        this.getCurrentAction().breaksHiding
      ) {
        this.removeBuff(`BuffHiding`);
        this.protectionStatus = PROTECTION_STATUS.UNPROTECTED;
        this.getNode().everyoneCheckForEnemies();
      }

      if (this.player) {
        this.player.cycle(seconds);
      } else if (this.spark) {
        this.spark.control(seconds);
      }

      this.updateAudio();
    }
  }

  updateStats(seconds) {
    Object.values(STATS).forEach(stat => {
      const statGain = this.getBuff(getStatGainId(stat));
      const change = (statGain || 0) - this.stats[stat] / 60;
      this.setStatValue(stat, this.stats[stat] + seconds * change * 0.000003);
    });
  }

  putInSpark(spark) {
    this.spark = spark;
    spark.setCreature(this);
  }

  isVisible() {
    return !this.getBuff(BUFFS.INVISIBILITY);
  }

  isStarving() {
    return this.satiated === 0;
  }

  isExhausted() {
    return this.energyTiered === 0;
  }

  isTiredAround(lastState, value) {
    return (
      (lastState &&
        this.energy > value - REST_MARGIN &&
        this.energy < value + REST_MARGIN) ||
      this.energy <= value
    );
  }
  isFullyRested(lastState) {
    return (
      (lastState && this.energy > 100 - REST_MARGIN && this.energy < 100) ||
      this.energy >= 100
    );
  }
  isTired1(lastState) {
    return this.isTiredAround(lastState, 75);
  }
  isTired2(lastState) {
    return this.isTiredAround(lastState, 50);
  }
  isTired3(lastState) {
    return this.isTiredAround(lastState, 25);
  }

  isActionBlocked() {
    return this.currentAction && this.currentAction.blocked;
  }

  isInDanger() {
    return this.hasEnemies();
  }

  notifications() {
    this.lastChecks = this.lastChecks || {};
    const checks = {
      isInDanger: {
        on: {
          message: () =>
            `Enemies are about! ${utils.humanizeList(
              this.getAllEnemies().map(enemy => this.getCreatureName(enemy))
            )}.`,
          level: LOGGING.FAIL,
          emoji: EMOJIS.SWORDS
        },
        off: {
          message: "The area is clear.",
          level: LOGGING.GOOD,
          emoji: EMOJIS.SHIELD
        }
      },
      isStarving: {
        on: {
          message: "You are starving!",
          level: LOGGING.FAIL,
          emoji: EMOJIS.FOOD
        }
      },
      isExhausted: {
        on: {
          message: "You are exhausted!",
          level: LOGGING.FAIL,
          emoji: EMOJIS.ENERGY
        }
      },
      isFullyRested: {
        on: {
          message: "You are now fully rested!",
          level: LOGGING.GOOD,
          emoji: EMOJIS.ENERGY,
          notifyGroup: "energyLevel"
        }
      },
      // isTired1: {
      //     on: {
      //         message: 'You are slightly tired.',
      //         level: LOGGING.NORMAL,
      //         emoji: EMOJIS.ENERGY,
      //         notifyGroup: 'energyLevel',
      //     },
      // },
      isTired2: {
        on: {
          message: "You are tired.",
          level: LOGGING.NORMAL,
          emoji: EMOJIS.ENERGY,
          notifyGroup: "energyLevel"
        }
      },
      isTired3: {
        on: {
          message: "You are very tired!",
          level: LOGGING.WARN,
          emoji: EMOJIS.ENERGY,
          notifyGroup: "energyLevel"
        }
      },
      isActionBlocked: {
        on: {
          message: `Action blocked: ${this.currentAction &&
            this.currentAction.blocked}`,
          level: LOGGING.FAIL,
          emoji: EMOJIS.BLOCKED
        }
      }
    };
    Object.keys(checks).forEach(fn => {
      const isTrue = this[fn](this.lastChecks[fn]);
      // const isTrue = this[fn]();
      if (isTrue && !this.lastChecks[fn] && checks[fn].on) {
        const on = checks[fn].on;
        const message =
          typeof on.message === "function" ? on.message() : on.message;
        this.logging(message, on.level, on.notifyGroup || true, on.emoji);
      }
      if (!isTrue && this.lastChecks[fn] && checks[fn].off) {
        const off = checks[fn].off;
        const message =
          typeof off.message === "function" ? off.message() : off.message;
        this.logging(message, off.level, off.notifyGroup || true, off.emoji);
      }
      this.lastChecks[fn] = isTrue;
    });
  }

  getArmorValue() {
    const result = {};
    const parent = super.getArmorValue();
    Object.values(DAMAGE_TYPES).forEach(
      type =>
        (result[type] = (parent[type] || 0) + this.getBuff(BUFFS.ARMOR[type]))
    );
    return result;
  }

  reduceWeaponDurability() {
    if (this.equipment[EQUIPMENT_SLOTS.WEAPON]) {
      this.equipment[EQUIPMENT_SLOTS.WEAPON].reduceIntegrity(0.0075);
    }
  }

  reduceArmorDurability() {
    [
      EQUIPMENT_SLOTS.HEAD,
      EQUIPMENT_SLOTS.CHEST,
      EQUIPMENT_SLOTS.HANDS,
      EQUIPMENT_SLOTS.TROUSERS,
      EQUIPMENT_SLOTS.FEET
    ].forEach(slot => {
      if (this.equipment[slot]) {
        this.equipment[slot].reduceIntegrity(utils.random(5, 10) / 1000);
      }
    });
  }

  ownsAnyHomeHere(node) {
    if (!node) {
      node = this.getNode();
    }
    return node
      .getAllStructures()
      .find(structure => structure.getOwner() === this && structure.isHome());
  }

  getHome(node) {
    node = node || this.getNode();
    return utils.cachableFunction(`getHome:${this.id}-${node.id}`, () =>
      this.getHomeLive(node)
    );
  }

  getHomeLive(node) {
    return node
      .getCompleteStructures()
      .find(structure => structure.isHome() && structure.getOwner() === this);
    // TODO: performance opportunity
  }

  setStatValue(stat, value) {
    this.stats[stat] = Math.max(0, value);
  }

  getAllEquipment() {
    return this.equipment;
  }

  getEquipment(slotId) {
    return this.equipment[slotId];
  }

  hasAnythingEquipped() {
    return Object.values(this.equipment).some(slot => !!slot);
  }

  getTool() {
    const tool = this.equipment[EQUIPMENT_SLOTS.TOOL];
    if (!tool || tool.isUnusable()) {
      return super.getTool();
    }
    return tool;
  }

  getDodgeRating() {
    return (
      (10 + 30 * this.getSkillLevel(SKILLS.FIGHTING_DODGE, 1)) *
      this.getSkillEfficiencyMultiplier(SKILLS.FIGHTING_DODGE) *
      (this.getBuff(BUFFS.DODGE_MULTIPLIER) / 100)
    );
  }

  getWeapon() {
    const weapon = this.equipment[EQUIPMENT_SLOTS.WEAPON];
    if (!weapon || weapon.isUnusable()) {
      return super.getWeapon();
    }
    return weapon;
  }

  getWeaponSkill() {
    return this.getWeapon().weaponSkill || super.getWeaponSkill();
  }

  getSkillEfficiencyMultiplier(skill) {
    const skillsAffectingCount = SKILL_STATS[skill].length;
    return +SKILL_STATS[skill]
      .map(stat => this.getStatValue(stat))
      .reduce(
        (acc, val) => acc + (0.1 + (9 * val) / 500 - 1) / skillsAffectingCount,
        1
        // .reduce((acc, val) => acc + (val - 50) / (50 * skillsAffectingCount), 1)
      )
      .toFixed(2);
  }

  getEfficiency(
    skill,
    toolUtility,
    isCurrentAction = true,
    mod = 1,
    includeActionSpeed = true
  ) {
    let multiplier = mod;

    if (toolUtility) {
      multiplier *= this.getToolLevel(toolUtility);
    }

    multiplier *= (100 + this.getBuff(BUFFS.SKILL_SPEED[skill])) / 100;

    if (skill && SKILL_STATS[skill]) {
      multiplier *= this.getSkillEfficiencyMultiplier(skill);
    }

    if (program.dev && debugOption.superpower) {
      multiplier *= debugOption.superpower;
    }

    if (includeActionSpeed) {
      multiplier *= this.getBuff(BUFFS.ACTION_SPEED) / 100;
    }

    if (isCurrentAction && this.currentAction) {
      this.currentAction.efficiency = +multiplier.toFixed(2);
    }

    return multiplier;
  }

  getSkillsPayload() {
    return Object.values(SKILLS)
      .map(skill => {
        const skillValue =
          Math.floor(this.getSkillLevel(skill, false) * 1000) / 1000;
        return {
          id: skill,
          name: SKILL_NAMES[skill],
          level: skillValue,
          maxLevel: skillValue >= MAX_SKILL_LEVEL,
          buffed: this.getBuff(SKILL_NAMES[skill])
        };
      })
      .filter(skill => !!skill.level)
      .sort((a, b) => b.level - a.level);
    // return Object
    //     .keys(this.skills)
    //     .map(skill => {
    //         const skillValue = Math.round(this.getSkillLevel(skill, false) * 1000) / 1000;
    //         return {
    //             id: skill,
    //             name: SKILL_NAMES[skill],
    //             level: skillValue,
    //             maxLevel: skillValue >= MAX_SKILL_LEVEL,
    //         };
    //     })
    //     .sort((a, b) => b.level - a.level);
  }

  getIcon(creature) {
    if (this.avatarIcon) {
      return server.getImage(creature, this.avatarIcon);
    }
    return super.getIcon(creature);
  }

  setSkillLevel(skill, level) {
    this.skills[skill] =
      Math.sign(level) * (Math.pow(2, Math.abs(level)) - 1) * BASE_SKILL;
  }

  /**
   * Returns a value between 0 and 10.
   */
  getSkillLevel(skill, round = true, includeBuff = true) {
    const skillValue = this.skills[skill] || 0;

    // const base = skillValue / BASE_SKILL + this.getBuff(SKILL_NAMES[skill]);
    // const value = Math.sign(base) * Math.log2(Math.abs(base) + 1);

    const base = skillValue / BASE_SKILL;
    let value = Math.sign(base) * Math.log2(Math.abs(base) + 1);
    if (includeBuff) {
      value += this.getBuff(SKILL_NAMES[skill]);
    }
    if (round === 1) {
      return Math.floor(value * 10) / 10;
    }

    return round ? Math.floor(value) : value;
  }

  gainSkill(skill, points = 1, difficultyMultiplier = 1) {
    if (!skill || !points) {
      try {
        utils.log(
          `${this.getName()} Invalid skill gain ${skill} for ${points} ${JSON.stringify(
            this.currentAction
          )}`
        );
      } catch (e) {
        utils.error(e);
      }
      return;
    }
    if (program.dev && debugOption.skillGainSpeed) {
      points = points * debugOption.skillGainSpeed;
    }

    this.skills[skill] = this.skills[skill] || 0;

    const gain =
      (2 *
        points *
        difficultyMultiplier *
        this.getStatPercentageEfficiency(STATS.INTELLIGENCE)) /
      100;
    this.skills[skill] = Math.min(this.skills[skill] + gain, MAX_SKILL);
  }

  gainStatsFromSkill(skill, timeSpent) {
    if (!timeSpent || !skill) {
      utils.error(
        `Invalid timeSpent: ${timeSpent}, action: ${this.currentAction.actionId}`
      );
      return;
    }
    const actionStatGain = this.getBuff(BUFFS.ACTION_STAT_GAINS) / 100;
    SKILL_STATS[skill].forEach(stat => {
      const current = this.stats[stat];
      this.setStatValue(
        stat,
        current +
          (5 * actionStatGain * timeSpent * (20 / (current + 20))) /
            (450 * 100 * SKILL_STATS[skill].length)
      );
    });
    if (this.currentAction) {
      this.currentAction.timeSpent = 0;
    }
  }

  reStackItems() {
    super.reStackItems();
  }

  getItemsWeight() {
    return this.items.reduce((acc, i) => acc + i.getWeight(), 0);
  }

  getCarryCapacity() {
    const bonus =
      program.dev && debugOption.superCapacity ? debugOption.superCapacity : 0;

    const multiplier = this.getBuff(BUFFS.CARRY_CAPACITY) / 100;

    return (
      (80 * this.getStatPercentageEfficiency(STATS.STRENGTH) * multiplier) /
        100 +
      bonus
    );
  }

  getBurdenLevels() {
    return utils.cachableFunction(`getBurdenLevels:${this.id}`, () =>
      this.getBurdenLevelsLive()
    );
  }
  getBurdenLevelsLive() {
    const maxCapacity = this.getCarryCapacity();
    const currentWeight = this.getItemsWeight();
    const thresholds = {
      0: maxCapacity * 0.5,
      1: maxCapacity * 0.8,
      2: maxCapacity,
      3: 999999999
    };
    const currentLevel = +Object.keys(thresholds).find(level => {
      return currentWeight <= thresholds[level];
    });
    return {
      currentWeight,
      currentLevel,
      thresholds
    };
  }

  isOverburdened() {
    return this.getBurdenLevels().currentLevel >= 3;
  }

  enableProtectionStatus() {
    const context = (this.currentAction && this.currentAction.context) || {};

    if (
      this.getCurrentAction() &&
      this.getCurrentAction().breaksHiding &&
      (!this.isDoingAction("Travel") ||
        context.assault !== true ||
        context.skipUnknowns !== false ||
        context.disregard !== false)
    ) {
      this.protectionStatus = PROTECTION_STATUS.UNPROTECTED;
      return;
    }

    if (this.getCurrentAction() && this.getCurrentAction().breaksHiding) {
      this.stopAction();
    }

    this.protectionStatus = PROTECTION_STATUS.PROTECTED;
    this.addBuff(BuffHiding, {
      duration:
        (this.baseHidingTime * (100 + this.getBuff(BUFFS.HIDING_TIME))) / 100
    });
    this.getNode().everyoneCheckForEnemies();
  }

  move(toNode) {
    super.move(toNode);

    Trade.getCreatureTrades(this).forEach(trade => trade.tryCommence());

    if (this.isPlayableCharacter()) {
      this.getCreaturesMapPayload(true); // To update the map when player is not looking
      toNode.increaseTraverseFrequency();
      Inspiration.checkForInspiration(this.getPlayer());
    }
  }

  isProtected() {
    return this.protectionStatus === PROTECTION_STATUS.PROTECTED;
  }

  addItem(item) {
    this.learnAboutItem(item.constructor.name);
    super.addItem(item);
  }

  receiveItem(received, restack = true) {
    this.learnAboutItem(received.constructor.name);
    super.receiveItem(received, restack);
  }

  knowsItem(itemClassName) {
    return this.getKnownItems()[itemClassName];
  }

  learnAboutItem(itemClassName) {
    const knownItems = this.getKnownItems();
    if (!knownItems[itemClassName]) {
      knownItems[itemClassName] = ITEM_KNOWLEDGE.KNOWN;
      if (global[itemClassName] && global[itemClassName].prototype.slots) {
        const knownSlotsList = this.getKnownSlotsList();
        Object.keys(global[itemClassName].prototype.slots).forEach(slotId => {
          knownSlotsList[slotId] = true;
        });
      }
      ResearchConcept.checkForInspiration(this.getPlayer());
    }
  }

  getKnownSlotsList() {
    let player = this.getPlayer();
    if (!player) {
      return Object.values(EQUIPMENT_SLOTS).toObject(id => id);
    }
    player.knownSlotsList = player.knownSlotsList || {};
    return player.knownSlotsList;
  }

  getKnownItems() {
    let context = this.getPlayer();
    if (!context) {
      context = this;
    }
    context.knownItemsList = context.knownItemsList || {};
    return context.knownItemsList;
  }

  getTravelSpeed() {
    let multiplier = 1;
    if (program.dev && debugOption.superFastTravel) {
      multiplier = debugOption.superFastTravel;
    }

    return (
      multiplier *
      super.getTravelSpeed() *
      (1 + this.getBuff(BUFFS.TRAVEL_SPEED) / 100)
    );
  }

  updateCanNameRegion(region) {
    if (!region) {
      return false;
    } else {
      return region.getNodes().every(node => this.isNodeMapped(node));
    }
  }

  getViewRange() {
    let range =
      Math.floor((30 + this.getStatValue(STATS.PERCEPTION)) / 35) +
      this.getBuff(BUFFS.VIEW_RANGE);
    if (program.dev && debugOption.bonusVisionRange) {
      range += debugOption.bonusVisionRange;
    }
    range += this.getNode().getViewRangeModifier(range);
    return range >= 0 ? range : 0;
  }

  getStatsPayload(creature) {
    return Object.keys(STAT_NAMES).reduce((acc, s) => {
      acc[STAT_NAMES[s]] = Math.floor(this.getStatValue(s) * 100) / 100;
      return acc;
    }, {});
  }

  sendError(errorMessage) {
    this.logging(errorMessage, LOGGING.IMMEDIATE_ERROR);
  }

  logging(message, level, notify = true, emoji) {
    const player = this.getPlayer();
    if (player) {
      player.logging(message, level, notify, emoji);
    } else {
      utils.log(`${this.getName()}: ${message}`);
    }
  }

  updateAudio() {
    const files = {};

    const isStorm = world.isEventInProgress("Storm");
    const isNight = world.isNight();

    if (isStorm) {
      files.main = "storm.mp3";
    }
    switch (this.getNode().getType()) {
      // case WATER:
      case NODE_TYPES.BOG:
      case NODE_TYPES.SWAMP:
        if (!isStorm) files.main = "swamp.mp3";
        break;
      case NODE_TYPES.UNDERGROUND_BEDROCK:
      case NODE_TYPES.UNDERGROUND_FLOOR:
      case NODE_TYPES.UNDERGROUND_CAVE:
      case NODE_TYPES.UNDERGROUND_WALL:
        files.main = "cave.mp3";
        break;
      case NODE_TYPES.TROPICAL_PLAINS:
      case NODE_TYPES.JUNGLE:
        if (!isStorm) files.main = "jungle.mp3";
        break;
      case NODE_TYPES.BROADLEAF_FOREST:
        if (!isStorm) files.main = "forest-owls2.mp3";
        break;
      case NODE_TYPES.PLAINS:
      case NODE_TYPES.HILLS_GRASS:
        if (!isStorm) {
          files.main = isNight ? "night-bugs.mp3" : "plains.mp3";
        }
        break;
      case NODE_TYPES.CONIFEROUS_FOREST_SNOWED:
      case NODE_TYPES.CONIFEROUS_FOREST_COLD:
      case NODE_TYPES.CONIFEROUS_FOREST:
        if (!isStorm) {
          files.main = "forest-owls2.mp3";
          break;
        }
      /* fall-through */
      case NODE_TYPES.SNOW_FIELDS:
      case NODE_TYPES.PLAINS_SNOW:
      case NODE_TYPES.COLD_DIRT: // weak
      case NODE_TYPES.HILLS_SNOW: // weak
      case NODE_TYPES.HILLS_COLD: // weak
      case NODE_TYPES.MOUNTAINS_SNOW:
      case NODE_TYPES.MOUNTAINS_COLD:
      case NODE_TYPES.MOUNTAINS_DIRT:
        files.main = "mountain-glacier.mp3";
        break;
      case NODE_TYPES.DESERT_GRASS:
      case NODE_TYPES.DESERT_SAND:
      case NODE_TYPES.SCRUB_LAND:
      case NODE_TYPES.SAVANNAH:
      case NODE_TYPES.CACTI:
      case NODE_TYPES.DESERT_PALMS:
      case NODE_TYPES.HILLS_REDGRASS: // weak
      case NODE_TYPES.HILLS_DIRT: // weak
        files.main = "desert.mp3";
        break;
    }

    if (this.getNode().isCoast()) {
      files.extra = "ocean-waves.mp3";
    }

    this.ambientAudio = Object.values(files).map(file =>
      server.getHttpResourceForPlayer(this.getPlayer(), `/audio/${file}`)
    );
  }

  destroy() {
    const player = this.getPlayer();

    if (player && player.getCreature() === this) {
      player.possessCreature(null);
    }

    if (this.spark) {
      this.spark.destroy();
    }

    Trade.getCreatureTrades(this).forEach(trade => trade.destroy());
    super.destroy();
  }

  getTradeListingsPayload(creature, onlyCheckIds) {
    if (this.isDead()) {
      return [];
    }
    const own = creature === this;

    if (onlyCheckIds) {
      onlyCheckIds = onlyCheckIds.toObject(
        id => id,
        () => true
      );
    }

    const availableQty = this.getAllAvailableItemsQuantities(true, false);
    return (this.tradeListings || [])
      .filter(listing => !onlyCheckIds || onlyCheckIds[listing.tradeListingId])
      .filter(listing => {
        return own || Trade.canAccessListing(listing, this, creature);
      })
      .map(listing => {
        const getElements = elements =>
          elements.map(element => ({
            item: Item.inferPayloadFromTradeId(
              creature,
              JSON.parse(element.tradeId)
            ),
            qty: element.qty
          }));

        const maxQty = listing.offering
          .map(element => {
            return (
              (availableQty[element.tradeId] &&
                availableQty[element.tradeId] / element.qty) ||
              0
            );
          })
          .reduce((acc, qty) => Math.min(acc, qty), 9999);

        const maxRepetitions = Math.floor(maxQty);

        return {
          offering: getElements(listing.offering),
          asking: getElements(listing.asking),
          repetitions: listing.repetitions,
          maxRepetitions: maxRepetitions,
          tradeListingId: listing.tradeListingId,
          listingTarget: own ? listing.listingTarget : undefined
        };
      })
      .filter(listing => own || (listing.maxRepetitions && listing.repetitions))
      .map(listing => {
        [...listing.offering, ...listing.asking].forEach(({ item }) => {
          creature.learnAboutItem(utils.fromKey(item.itemCode));
        });
        return listing;
      });
  }

  getElderlyMinAge() {
    const ageLevels = Object.keys(this.agingTiers);
    return +ageLevels[ageLevels.length - 2];
  }

  getEldernessStage() {
    const elderly = this.getElderlyMinAge();
    return Math.min(
      9,
      Math.ceil((10 * (this.age - elderly)) / (this.maxAge - elderly))
    );
  }

  noControlCheck() {
    if (this.noControl) {
      this.logging(
        "You have no control over your character right now",
        LOGGING.IMMEDIATE_ERROR
      );
      return true;
    }
    return false;
  }

  getName() {
    return this.name;
  }

  getCurrentActionPayload() {
    const { entityId, context } = this.currentAction || {};
    const currentActionTarget = Action.getTarget(entityId, context, this);
    const action = this.getCurrentAction();

    return {
      ...utils.cleanup(this.currentAction || {}),
      ...(action ? action.getPayload(this.getActionTarget(), this) : {}),
      ETA:
        this.currentAction && this.currentAction.ETA
          ? Math.ceil(this.currentAction.ETA / 60)
          : null,
      allETA:
        this.currentAction && this.currentAction.allETA
          ? Math.ceil(this.currentAction.allETA / 60)
          : null,
      context: this.currentAction && this.currentAction.context,
      progress: Math.ceil(this.actionProgress),
      timeSpent: undefined,
      efficiency: this.currentAction && this.currentAction.efficiency,
      actionTargetName:
        action && action.getActionTargetName(currentActionTarget),
      unblockOptionLabel:
        action &&
        action.unblockOptionLabel &&
        action.unblockOptionLabel(this.getActionTarget(), this)
    };
  }

  getEquipmentPayload(creature) {
    const knownSlots = this.getKnownSlotsList();
    return Object.values(EQUIPMENT_SLOTS)
      .filter(slotId => !!knownSlots[slotId])
      .map(slotId => ({
        slot: EQUIPMENT_SLOT_NAMES[slotId],
        item:
          this.equipment[slotId] && this.equipment[slotId].getPayload(creature)
      }));
  }

  getRecentResearchesPayload(creature) {
    const recentResearches = this.recentResearches;
    return Object.keys(recentResearches).map(idx => ({
      ...utils.cleanup(recentResearches[idx]),
      result:
        recentResearches[idx].recipeId &&
        Recipe.getRecipeById(recentResearches[idx].recipeId)
          ? Recipe.getRecipeById(recentResearches[idx].recipeId).getPayload(
              creature
            )
          : recentResearches[idx].result
          ? global[recentResearches[idx].result].getPayload(creature)
          : null,
      materialsUsed: Item.getMaterialsPayload(
        recentResearches[idx].materialsUsed,
        creature
      ),
      toolUsed: recentResearches[idx].toolUsed
        ? global[recentResearches[idx].toolUsed].getPayload(creature)
        : null
    }));
  }

  getEffectsSummaryPayload() {
    return Object.keys(utils.cleanup(this.buffEffects)) // TODO: nice sorting
      .filter(rawStat => BUFF_LABELS[rawStat] !== null)
      .toObject(
        rawStat => {
          const label = BUFF_LABELS[rawStat];
          return label || rawStat;
        },
        rawStat => ({
          value: +this.buffEffects[rawStat].toFixed(2),
          group: BUFF_GROUPS[rawStat] || "100:Others",
          negative: NEGATIVE_BUFFS[rawStat],
          percentage: PERCENTAGE_BUFFS[rawStat],
          multiplier: MULTIPLIER_BUFFS[rawStat]
        })
      );
  }

  considersRival(creature) {
    if (!this.getPlayer()) {
      return false;
    }
    const relationships = creature.getRelationships();
    return (
      relationships && relationships.rivals[this.getPlayer().getEntityId()]
    );
  }

  considersFriend(creature) {
    if (!this.getPlayer()) {
      return false;
    }
    const relationships = creature.getRelationships();
    return (
      relationships && relationships.friends[this.getPlayer().getEntityId()]
    );
  }

  getRelationships() {
    const player = this.getPlayer();
    return player && player.getRelationships();
  }

  getNeutralCharacters() {
    const relationships = this.getRelationships();
    return Player.list
      .filter(p => !!p.getCreature())
      .filter(p => p.getCreature() !== this)
      .filter(p => p.getCreature().isPlayableCharacter())
      .filter(p => !p.getCreature().isDead())
      .filter(p => p.onRookIsland === this.getPlayer().onRookIsland)
      .filter(p => !relationships.friends[p.getEntityId()])
      .filter(p => !relationships.rivals[p.getEntityId()])
      .toObject(
        p => p.getEntityId(),
        () => true
      );
  }

  getRelationshipsPayload() {
    const toPayload = list =>
      Object.keys(list)
        .map(id => Entity.getById(id))
        .filter(player => player.getCreature())
        .filter(player => !player.getCreature().isDead())
        .filter(
          player =>
            player
              .getCreature()
              .getFaction()
              .getName() === this.getFaction().getName() ||
            player
              .getCreature()
              .getFaction()
              .hasPeaceWith(this.getFaction())
        )
        .map(player => ({
          id: player.getEntityId(),
          creatureId:
            player.getCreature() && player.getCreature().getEntityId(),
          name: player.getCreature() && player.getCreature().getName()
        }));
    return {
      friends: toPayload(this.getRelationships().friends),
      neutrals: toPayload(this.getNeutralCharacters()),
      rivals: toPayload(this.getRelationships().rivals)
    };
  }

  getSimplePayload(creature) {
    const result = super.getSimplePayload(creature);
    if (!result || creature.canSeeCreatureDetails(this) < 5) {
      return result;
    }
    if (creature.canSeeCreatureDetails(this) >= 6) {
      result.buffs = statusBuffs
        .filter(buffName => this.hasBuff(buffName))
        .map(buffName => ({ name: global[buffName].prototype.name }));
    }
    result.race = this.constructor.name;
    result.looks = this.looks ? { ...this.looks } : null;
    const relationships = creature.getRelationships();
    if (relationships) {
      const id = this.getPlayer() && this.getPlayer().getEntityId();
      result.relationship = relationships.friends[id]
        ? "friend"
        : relationships.rivals[id]
        ? "rival"
        : null;
    }
    return result;
  }

  getPayload(creature, includeDetails = false) {
    let result = super.getPayload(creature, includeDetails);
    if (!result) {
      return result;
    }
    if (creature.canSeeCreatureDetails(this) >= 4) {
      result.equipment = Object.keys(this.equipment)
        .filter(slotId => !!this.equipment[slotId])
        .toObject(
          slotId => EQUIPMENT_SLOT_NAMES[slotId],
          slotId => this.equipment[slotId].getIcon(creature)
        );
    }
    if (creature.canSeeCreatureDetails(this) < 5) {
      return result;
    }
    return result;
  }

  sendExtraInterface(connection) {
    const payload = [];
    // payload.push(
    //     utils.getJsPayload('/js/controls/magic', this)
    // );

    if (connection) {
      server.sendToConnection(connection, "extraComponents", payload);
    } else {
      server.sendToPlayer(this.getPlayer(), "extraComponents", payload);
    }
  }

  sendData(connection) {
    connection.dataStreams = connection.dataStreams || {};
    Object.keys(connection.dataStreams).forEach(dataStream =>
      this.sendDataSingle(connection, dataStream)
    );
  }

  sendDataSingle(connection, dataStream, initial = false) {
    connection.sentData = connection.sentData || {};
    const fullData = dataStreams[dataStream](this, connection);
    if (dataStream === "ticker") {
      initial = true;
    }
    let data;
    if (!initial) {
      data = jd.diff(connection.sentData[dataStream], fullData);
    } else {
      data = fullData;
    }
    connection.sentData[dataStream] = fullData;
    if (initial || data) {
      const type = initial ? "initial" : "delta";
      server.sendUpdate(`data.payload.${dataStream}.${type}`, connection, data);
    }
  }

  getListingIds(connection) {
    connection.checkedListingIds = connection.checkedListingIds || {};

    const friendlies = this.getFriendlies();

    return friendlies.toObject(
      c => c.getEntityId(),
      creature => {
        const cId = creature.getEntityId();
        connection.checkedListingIds[cId] =
          connection.checkedListingIds[cId] || {};

        const listingIds = (creature.tradeListings || []).map(
          tradeListing => tradeListing.tradeListingId
        );

        const needToCheckIds = listingIds.filter(
          id => connection.checkedListingIds[cId][id] === undefined
        );

        if (needToCheckIds.length) {
          const payloads = creature.getTradeListingsPayload(
            this,
            needToCheckIds
          );
          const validIds = payloads.toObject(
            listing => listing.tradeListingId,
            () => true
          );

          needToCheckIds.forEach(
            id => (connection.checkedListingIds[cId][id] = !!validIds[id])
          );
        }

        return listingIds.filter(
          listingId => connection.checkedListingIds[cId][listingId]
        );
      }
    );
  }
}
Creature.factory(Humanoid, {
  stomachSeconds: 2 * DAYS,
  name: "?Humanoid?",
  icon: `/${ICONS_PATH}/creatures/humanoids/humanoid.png`,
  scouterReduction: 0.05,
  defaultArmor: {
    [DAMAGE_TYPES.BLUNT]: 5,
    [DAMAGE_TYPES.SLICE]: 5,
    [DAMAGE_TYPES.PIERCE]: 5
  },
  defaultWeapon: {
    name: "Punch",
    damage: {
      [DAMAGE_TYPES.BLUNT]: 5
    },
    hitChance: WeaponSystem.BASE_HIT.UNARMED
  },
  butcherable: {
    corpseName: () => "Humanoid",
    butcherName: () => `Butcher Humanoid`,
    icon: `/${ICONS_PATH}/creatures/humanoids/humanoid_dead.png`,
    butcherTime: 1 * HOURS,
    butcherSkillLevel: 4,
    produces: {
      MysteryMeat: 60,
      Bone: 20
    }
  },
  travelSpeed: 1,
  thermalRange: {
    min: -0.5,
    max: 0.5
  },
  scouterMessages: [
    SCOUTER_MESSAGES.FOOTPRINTS_HUMANOID,
    SCOUTER_MESSAGES.HUMANOID_FIGURE
  ],
  fixedScouterMessages: [SCOUTER_MESSAGES.EQUIPMENT]
});
module.exports = global.Humanoid = Humanoid;

const INCREASE_MESSAGE =
  "Using the skill will also very slightly increase related statistics.";
const LINKED_STATS_EXPLANATION =
  "Related statistics determine the speed at which you perform the tasks related to a given skill. " +
  INCREASE_MESSAGE;
const LINKED_COMBAT_STATS_EXPLANATION =
  "Related statistics determine the damage you deal when using weapons relying on certain skill. " +
  INCREASE_MESSAGE;
const CUSTOM_SKILL_STATS_EXPLANATION = {
  [SKILLS.FIGHTING_DODGE]:
    "Related statistics determine a multiplier to your dodge chance. " +
    INCREASE_MESSAGE
};
const STAT_DESCRIPTIONS = {
  [STATS.STRENGTH]: "Strength determines your carry capacity",
  [STATS.DEXTERITY]: `Dexterity determines the chance and the severity of injuries suffered due to accidents`,
  [STATS.ENDURANCE]:
    "Endurance determines your resistance to pain, illnesses and chances of sustaining a long-term injury",
  [STATS.PERCEPTION]: "Perception determines the view range of your character",
  [STATS.INTELLIGENCE]:
    "Intelligence determines the speed at which you gain skills"
};

InformationProvider({
  info: "skillDescription",
  provider: (player, skill) => {
    const creature = player.getCreature();

    const linkedStatsDescription =
      "Related statistics: " +
      SKILL_STATS[skill].map(stat => STAT_NAMES[stat]).join(", ") +
      `<br/>Current multiplier: ${Math.round(
        creature.getSkillEfficiencyMultiplier(skill) * 100
      )}%`;

    const isCombat = SKILL_NAMES[skill].indexOf("Combat: ") === 0;

    const linkedStatsExplanation = CUSTOM_SKILL_STATS_EXPLANATION[skill]
      ? CUSTOM_SKILL_STATS_EXPLANATION[skill]
      : isCombat
      ? LINKED_COMBAT_STATS_EXPLANATION
      : LINKED_STATS_EXPLANATION;

    if (creature && creature.getSkillLevel(skill, false)) {
      return {
        title: SKILL_NAMES[skill],
        text: `
    <p>${SKILL_DESCRIPTIONS[skill]}</p>
    <p>${linkedStatsDescription}</p>
    <p class="help-text">${linkedStatsExplanation}</p>
                `
      };
    }
  }
});
InformationProvider({
  info: "statDescription",
  provider: (player, statName) => {
    const stat = +Object.keys(STAT_NAMES).find(
      stat => STAT_NAMES[stat] === statName
    );

    const creature = player.getCreature();

    const skills = Object.values(SKILLS)
      .filter(skill => !!creature.getSkillLevel(skill, false))
      .filter(skill => SKILL_STATS[skill].includes(stat))
      .map(skill => SKILL_NAMES[skill]);
    const linkedSkillsDescription = skills.length
      ? "Known related skills: " + skills.join(", ")
      : "";

    if (creature) {
      return {
        title: STAT_NAMES[stat],
        text: `
    <p>${STAT_DESCRIPTIONS[stat]}</p>
    <p>${linkedSkillsDescription}</p>
    <p class="help-text">${LINKED_STATS_EXPLANATION}</p>
                `
      };
    }
  }
});

server.registerHandler("stop-action", (params, player, connection) => {
  const creature = player.getCreature();
  if (creature.noControlCheck()) {
    return;
  }

  const clearQueue = params && !!params.clearQueue;

  creature.stopAction(false, clearQueue);
  // if (AUTO_SLEEP) {
  //     creature.startAction(creature, creature.getActionById('Sleep'));
  // }

  server.updatePlayer(connection);

  return true;
});

server.registerHandler("unblock-action", (params, player, connection) => {
  const creature = player.getCreature();
  if (creature.noControlCheck()) {
    return;
  }

  return creature.tryUnblockAction();
});

server.registerHandler("pong", (params, player, connection) => {
  connection.background = !params;
  connection.pongTime = world.currentTime;
  return true;
});

server.registerHandler("action", (params, player, connection) => {
  const target = Action.getTarget(params.target, params.context, this);
  const creature = player.getCreature();

  utils.log(
    `Action triggered! ${player.creature &&
      player.creature.name} ${JSON.stringify(params)}`
  );

  if (creature.noControlCheck()) {
    return;
  }

  if (!target) {
    utils.log(`Invalid target`);
    return false;
  }
  const action = target.getActionById(params.action, false);
  if (!action) {
    utils.log(`Invalid action: ${params.action}`);
    return false;
  }

  if (
    action.repeatable === false ||
    !params.repetitions ||
    typeof params.repetitions !== "number"
  ) {
    params.repetitions =
      utils.getValue(action.defaultRepetitions, target, creature) || 1;
  }

  if (creature.currentAction.context === null) {
    creature.currentAction.context = undefined;
  }
  if (params.context === null) {
    params.context = undefined;
  }

  if (
    creature.currentAction &&
    creature.currentAction.entityId === params.target &&
    creature.currentAction.context === params.context &&
    creature.currentAction.actionId === action.getId()
  ) {
    utils.log(`Updated repetitions: ${params.repetitions}`);
    creature.currentAction.repetitions = params.repetitions;
    creature.currentAction.extra = params.extra;
    creature.currentAction.context = params.context;
    if (action.update) {
      creature.updateAction(
        target,
        action,
        params.repetitions,
        false,
        params.extra,
        params.context
      );
    }
  } else {
    utils.log(
      `INSPECT: ${!!creature.currentAction} - ${
        creature.currentAction.entityId
      } VS ${params.target} - ${creature.currentAction.context} VS ${
        params.context
      } - ${creature.currentAction.actionId} VS ${action.getId()}`
    );
    utils.log(
      `User action! ${player.creature && player.creature.name} ${
        action.name
      } -> ${target &&
        (target.getName ? target.getName() : target.name)} (${target &&
        target.id}) x${params.repetitions} ${
        params.context ? "context: " + params.context : ""
      } ${params.queue ? "{queue}" : ""}`
    );

    let msg = action.getAvailabilityMessage(target, creature, params.context);
    if (msg === true) {
      msg = action.getRunCheck(
        target,
        creature,
        params.context,
        +params.repetitions,
        params.extra
      );
    }

    if (msg !== true) {
      utils.log("Smart Action Block!");
      creature.logging(msg, LOGGING.IMMEDIATE_ERROR, true);
      return false;
    }

    if (action.getId() === "Travel") {
      FollowSystem.stopFollowing(creature);
    }

    if (params.queue && !creature.isDoingAction("Sleep")) {
      creature.queueAction(
        target,
        action,
        params.repetitions,
        false,
        params.extra,
        params.context
      );
    } else {
      creature.startAction(
        target,
        action,
        params.repetitions,
        false,
        params.extra,
        params.context
      );
    }
  }

  server.updatePlayer(connection);

  return true;
});

server.registerHandler(
  "updateResearchMaterials",
  (params, player, connection) => {
    const creature = player.getCreature();

    const materials = params.map(key => utils.fromKey(key));

    const additions = materials.filter(
      material => !creature.researchMaterials[material]
    );

    const unknownAdditions = additions.filter(
      material =>
        !global[material] ||
        !creature.hasItemType(material) ||
        global[material].prototype.nonResearchable
    );

    if (unknownAdditions.length) {
      utils.error("HACKING ATTEMPT!", player.email, materials, additions);
      return false;
    }

    if (materials.length > MAX_RESEARCH_MATERIALS) {
      return false;
    }

    if (
      materials.some(material => !(global[material].prototype instanceof Item))
    ) {
      return false;
    }

    creature.researchMaterials = materials.toObject(
      i => i,
      () => true
    );

    server.updatePlayer(connection);

    return true;
  }
);

server.registerHandler("acceptLegalTerms", (params, player) => {
  player.acceptedLegalTerms = true;
  player.updateHttpServer();
  return true;
});

server.registerHandler("get-discord-info", (params, player) => {
  player.sendDiscordData();
});

server.registerHandler("getUserSettings", (params, player) => {
  player.sendUserSettings();
});

server.registerHandler("setUserSettings", (params, player) => {
  utils.log("User settings update", player.email, params);
  player.updateUserSettings(params.key, params.value);
});

server.registerHandler("dataFetchTrigger", (params, player, connection) => {
  const creature = player.getCreature();
  if (!creature) {
    return;
  }
  switch (params) {
    case "extraComponents":
      return creature.sendExtraInterface(connection);
  }
  return false;
});

server.registerHandler("applyRelationship", (params, player, connection) => {
  let target = Entity.getById(params.creatureId);
  const self = player.getCreature();
  if (target instanceof Creature && target.getPlayer) {
    target = target.getPlayer();
  }
  if (!target) {
    return false;
  }
  const targetId = target.getEntityId();

  const relationships = self.getRelationships();
  if (
    !relationships.friends[targetId] &&
    !relationships.rivals[targetId] &&
    !self.getNeutralCharacters()[targetId] &&
    !self.seesNode(target.getCreature().getNode())
  ) {
    return false;
  }

  delete relationships.friends[targetId];
  delete relationships.rivals[targetId];
  switch (params.relationship) {
    case "friend":
      relationships.friends[targetId] = true;
      break;
    case "rival":
      relationships.rivals[targetId] = true;
      break;
    case "neutral":
      break;
  }

  return true;
});

Object.keys(dataStreams).forEach(dataStream => {
  server.registerHandler(
    `data.request.${dataStream}`,
    (params, player, connection) => {
      connection.dataStreams = connection.dataStreams || {};
      if (params.sub) {
        // utils.log(`Player ID: ${player.id} GET ${dataStream}`);
        connection.dataStreams[dataStream] = true;
        if (params.fetch) {
          const creature = player.getCreature();
          if (creature) {
            creature.sendDataSingle(connection, dataStream, true);
          }
        }
      } else {
        // utils.log(`Player ID: ${player.id} DISCARD ${dataStream}`);
        delete connection.dataStreams[dataStream];
      }
    }
  );
});

server.registerHandler("set-vote-name", (params, player) => {
  const creature = player.getCreature();
  if (creature.noControlCheck()) {
    return;
  }
  const entityClass = Entity.getKeyToClassMap()[params.key].name;
  return Nameable.castVote(creature, entityClass, params.name);
});

server.registerHandler("get-vote-name-preferences", (params, player) => {
  const creature = player.getCreature();
  const entityClass = Entity.getKeyToClassMap()[params.key].name;
  return Nameable.getVotes(creature, entityClass);
});

server.registerHandler("creature-details", (params, player, connection) => {
  const entity = Entity.getById(params);
  if (entity || !params) {
    connection.creatureDetailsId = +params;
    if (entity) {
      Player.sendMapPayload(connection);
    }
  }
  return true;
});
