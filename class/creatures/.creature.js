const Entity = require("../.entity");
const server = require("../../singletons/server");
const fightingFeedback = require("../../singletons/fighting-feedback");
const Action = require("../action");
require("../../singletons/systems/follow-system");
require("../../singletons/systems/perk-system");
require("../../singletons/game-chat-server");
utils.recursiveRequire("class/items/edibles");
utils.recursiveRequire("class/items/materials");
require("../items/corpses/.corpse.js");
require("./.creature-buffs");

global.AUTO_SLEEP = true;
global.VIEW_TOLERANCE = 1.9;

const MAX_SCOUTER = 3;
const TRACK_BASE_TIME = 15 * MINUTES;

const getEnemyStateProperty = (onlyFighting, onlyAttackable) => {
  return onlyFighting
    ? ENEMY_STATE_TYPES.FIGHTING
    : onlyAttackable
    ? ENEMY_STATE_TYPES.ATTACKABLE
    : ENEMY_STATE_TYPES.ANY;
};

const actions = Action.groupById([
  FollowSystem.getFollowAction(),
  new Action({
    name: "Fight",
    icon: "/actions/icons8-sword-100.png",
    notification: false,
    repeatable: false,
    breaksHiding: true,
    valid(entity, creature) {
      if (entity !== creature) {
        return false;
      }
      if (!creature.hasEnemies()) {
        return false;
      }
      return true;
    },
    onStarted(entity) {
      entity.getNode().everyoneCheckForEnemies();
    },
    onFinished(entity) {
      entity.getNode().everyoneCheckForEnemies();
    },
    run(entity, creature, seconds) {
      creature.actionProgress +=
        (seconds * utils.random(50, 150)) / creature.attackDelay;

      if (creature.actionProgress >= 100) {
        creature.actionProgress -= 100;
        const randomEnemy = creature.getRandomEnemy();
        creature.exchangeBlows(randomEnemy);
      }
      return true;
    }
  }),
  new Action({
    name: "Call over",
    icon: "/actions/icons8-treasure-map-100.png",
    notification: false,
    repeatable: false,
    quickAction: true,
    valid(entity, creature) {
      if (!creature.getPlayer()) {
        return false;
      }
      if (!creature.getPlayer().npc) {
        return false;
      }
      if (entity.isPlayableCharacter()) {
        return false;
      }
      return true;
    },
    run(entity, creature, seconds) {
      const targetNode = creature.getNode();
      if (entity.getPlayer() && entity.getPlayer().queueAction) {
        entity.stopAction(false, true);
      } else {
        entity.seenByPlayer = true;
      }
      entity.startAction(targetNode, targetNode.getActionById("Travel"));
      return false;
    }
  }),
  new Action({
    name: "Attack",
    icon: "/actions/icons8-sword-100.png",
    notification: false,
    repeatable: false,
    breaksHiding: true,
    valid(entity, creature) {
      if (entity === creature) {
        return false;
      }
      if (entity.isDead()) {
        return false;
      }
      if (!creature.isHostile(entity)) {
        return false;
      }
      if (creature.isDoingAction("Fight")) {
        return false;
      }
      return true;
    },
    runCheck(target, creature) {
      if (creature.getNode() !== target.getNode()) {
        return "You must be in the same location to attack the creature";
      }
      return true;
    },
    run(entity, creature, seconds) {
      creature.startAction(creature, creature.getActionById("Fight"));
      return true;
    }
  }),
  new Action({
    name: "Track",
    icon: "/actions/icons8-search-100.png",
    repeatable: true,
    maxRepetitions: MAX_SCOUTER,
    defaultRepetitions: MAX_SCOUTER,
    hideTargetName: true,
    valid(entity, creature) {
      if (entity === creature) {
        return false;
      }
      if (entity.isDead()) {
        return false;
      }
      if (!creature.canScoutOut(entity)) {
        return false;
      }
      return true;
    },
    queueEstimate: (entity, creature) => {
      if (!creature.currentAction || creature.currentAction.repetitions <= 1) {
        return 0;
      }
      let scouter = 1 + Math.floor(entity.getScouter(creature));
      let result = 0;
      for (let i = 1; i < creature.currentAction.repetitions; i++) {
        scouter += 1;
        if (scouter > MAX_SCOUTER) {
          creature.currentAction.repetitions = i;
          break;
        }
        result +=
          (TRACK_BASE_TIME * scouter) /
          (creature.currentAction ? creature.currentAction.efficiency : 0);
      }
      return result;
    },
    runCheck(target, creature) {
      if (!target.getNode().isConnectedTo(creature.getNode())) {
        return "You need to be within immediate distance to the location";
      }
      const current = Math.floor(target.getScouter(creature));
      if (current >= MAX_SCOUTER) {
        return "You cannot get any more information with your current tracking skill level";
      }
      if (!creature.seesNode(target.getNode())) {
        return "You are unable to track creatures without seeing the location.";
      }
      return true;
    },
    run(entity, creature, seconds) {
      const scouter = 1 + Math.floor(entity.getScouter(creature));
      const time = scouter * TRACK_BASE_TIME;
      if (creature.progressingAction(seconds, time, SKILLS.TRACKING)) {
        let skillExperience = 5 * time;

        creature.triggerQuestEvent("trackedSomeone", entity, scouter);

        entity.rattledBy(creature, (scouter * TRACK_BASE_TIME) / 2);

        creature.gainSkill(
          SKILLS.TRACKING,
          skillExperience,
          creature.getSkillGainDifficultyMultiplier(SKILLS.TRACKING, -10)
        );
        creature.gainStatsFromSkill(
          SKILLS.TRACKING,
          creature.getTimeSpentOnAction()
        );

        creature.scoutOut(entity);

        return false;
      }
      return true;
    }
  }),
  new Action({
    name: "Sleep",
    icon: "/actions/icons8-sleep-100.png",
    notification: false,
    repeatable: false,
    cancellable: false,
    valid(target, creature) {
      if (target !== creature) {
        return false;
      }
      return true;
    },
    run(entity, creature, seconds) {
      creature.actionProgress +=
        (seconds * 100) / SECONDS_NEEDED_FOR_GOOD_SLEEP;

      creature.actionProgress = Math.min(creature.actionProgress, 100);

      return true;
    }
  })
]);

class Creature extends Entity {
  static actions() {
    return actions;
  }

  constructor(args) {
    super(args);
    this.painThreshold = 100;
    this.node = null;
    this.items = [];
    this.skills = {};
    this.buffs = [];
    this.blood = 100;
  }

  rattledBy() {}

  getItems() {
    return this.items;
  }

  getItemsByType(itemClass) {
    return this.items.filter(i => i instanceof itemClass);
  }

  getPainThreshold() {
    return this.painThreshold;
  }

  isNodeMapped(node) {
    return true;
  }

  seesNode(node) {
    return true;
  }

  isSleeping() {
    return this.currentAction && this.currentAction.actionName === "Sleep";
  }

  startAction(
    entity,
    action,
    repetitions,
    notification = true,
    extra,
    context
  ) {
    if (this.dead || !action) {
      return;
    }
    if (action.quickAction) {
      this.postponeAction();
    } else {
      this.stopAction(notification, true);
    }
    if (action.onStart) {
      action.onStart(entity, this);
    }
    this.actionProgress = 0;
    this.currentAction = {
      entityId: entity.getEntityId(),
      actionId: action.getId(),
      actionName: action.getName(entity, this),
      context: action.context || context,
      repetitions,
      extra
    };
    if (action.onStarted) {
      action.onStarted(entity, this);
    }
  }

  queueAction(
    entity,
    action,
    repetitions,
    notification = true,
    extra,
    context
  ) {
    this.postponedActions.unshift({
      currentAction: {
        entityId: entity.getEntityId(),
        actionId: action.getId(),
        actionName: action.getName(entity, this),
        context: action.context || context,
        repetitions,
        extra
      },
      actionProgress: 0
    });
  }

  updateAction(
    entity,
    action,
    repetitions,
    notification = true,
    extra,
    context
  ) {
    this.currentAction.actionName = action.getName(entity, this);

    if (!action || !action.update) {
      return;
    }

    action.update(entity, this, context);
  }

  progressingAction(seconds, baseTime, skill, toolUtility, toolUse) {
    const efficiency = this.getEfficiency(skill, toolUtility);

    this.actionProgress += (seconds * efficiency * 100) / baseTime;

    const tool = this.getTool();
    if (this.isUsingTool(toolUtility)) {
      tool.reduceIntegrity(toolUse);
    }
    if (this.actionProgress >= 100) {
      this.actionProgress -= 100;
      return true;
    }
    return false;
  }

  getPlayer() {
    return null;
  }

  isPlayableCharacter() {
    if (this.getPlayer() && this.getPlayer().npc) {
      return false;
    }
    return (
      this.getPlayer() &&
      this.getPlayer() instanceof Player &&
      !(this instanceof Admin)
    );
  }

  actionOnSimilarItem(item, specifiedContainer) {
    const container = specifiedContainer || this;
    const similarItem = container.items
      .filter(i => i.constructor.name === item.constructor.name)
      .filter(i => i.matchesTradeId(item))
      .sort((a, b) => b.integrity - a.integrity)
      .pop();
    if (similarItem) {
      this.currentAction.entityId = similarItem.getEntityId();
    } else {
      if (!specifiedContainer && this.getHome()) {
        return this.actionOnSimilarItem(item, this.getHome());
      }
    }
    return similarItem;
  }

  setNode(node) {
    this.node = node;
  }

  getRegion() {
    return this.getNode().getRegion();
  }

  getNode() {
    return this.node;
  }

  isInDungeon() {
    return this.getNode() instanceof Room;
  }

  getFriendlies(node, includeSelf = false) {
    node = node || this.getNode();
    return node
      .getVisibleAliveCreatures()
      .filter(creature => includeSelf || creature !== this)
      .filter(creature => !creature.isHostile(this));
  }

  hasUnknowns(node) {
    node = node || this.getNode();
    return !!node
      .getVisibleAliveCreatures()
      .find(creature => this.canSeeCreatureDetails(creature) <= 1);
  }

  hasAttackableEnemies(node) {
    return this.hasEnemies(node, false, true);
  }

  hasEnemies(node, onlyFighting = false, onlyAttackable = false) {
    node = node || this.getNode();
    if (node === this.getNode()) {
      if (!this.hasEnemiesState) {
        this.checkForEnemies(node, onlyFighting, onlyAttackable);
      }
      return this.hasEnemiesState[
        getEnemyStateProperty(onlyFighting, onlyAttackable)
      ];
    }
    return this.checkForEnemies(node, onlyFighting, onlyAttackable);
  }

  checkForEnemies(node, onlyFighting = false, onlyAttackable = false) {
    const checkForHostility = creature =>
      creature.isHostile(this) &&
      (node === this.getNode() || this.canSeeCreatureDetails(creature) >= 2) &&
      creature.canBeAttacked();
    const checkIsFighting = creature => creature.isDoingAction("Fight");
    const checkIsAttackable = creature => !creature.isProtected();

    node = node || this.getNode();
    if (node === this.getNode()) {
      this.hasEnemiesState = {
        [ENEMY_STATE_TYPES.FIGHTING]: false,
        [ENEMY_STATE_TYPES.ATTACKABLE]: false,
        [ENEMY_STATE_TYPES.ANY]: false
      };
      node.getVisibleAliveCreatures().find(creature => {
        const isEnemy = checkForHostility(creature);

        this.hasEnemiesState[ENEMY_STATE_TYPES.ANY] =
          this.hasEnemiesState[ENEMY_STATE_TYPES.ANY] || isEnemy;
        this.hasEnemiesState[ENEMY_STATE_TYPES.ATTACKABLE] =
          this.hasEnemiesState[ENEMY_STATE_TYPES.ATTACKABLE] ||
          (isEnemy && checkIsAttackable(creature));
        this.hasEnemiesState[ENEMY_STATE_TYPES.FIGHTING] =
          this.hasEnemiesState[ENEMY_STATE_TYPES.FIGHTING] ||
          (isEnemy && checkIsFighting(creature));

        return (
          this.hasEnemiesState[ENEMY_STATE_TYPES.FIGHTING] &&
          this.hasEnemiesState[ENEMY_STATE_TYPES.ATTACKABLE]
        );
      });
      return this.hasEnemiesState[
        getEnemyStateProperty(onlyFighting, onlyAttackable)
      ];
    }
    return !!node
      .getVisibleAliveCreatures()
      .find(
        creature =>
          checkForHostility(creature) &&
          (!onlyAttackable || checkIsAttackable(creature)) &&
          (!onlyFighting || checkIsFighting(creature))
      );
  }

  hasFightingEnemies(node) {
    node = node || this.getNode();
    return this.hasEnemies(node, true);
  }

  isInDanger() {
    return this.hasFightingEnemies() && this.isVisible();
  }

  getValidEnemies() {
    return this.getAllEnemies().filter(
      creature => creature.canBeAttacked() && !creature.hasBuff(BuffHiding)
    );
  }

  getAllEnemies() {
    return this.getNode()
      .getVisibleAliveCreatures()
      .filter(creature => creature.isHostile(this));
  }

  getRandomEnemy() {
    return utils.randomItem(this.getValidEnemies());
  }

  getTravelSpeed() {
    return this.travelSpeed || 1;
  }

  getTool() {
    return null;
  }

  isEquipped(item, slotId = null) {
    if (slotId) {
      return this.equipment[slotId] === item;
    }
    return Object.values(this.equipment).some(e => e === item);
  }

  equip(item, slotId) {
    this.equipment[slotId] = item;
  }

  getMaterials(materials, includeHouse = true, includeDamaged = true) {
    const items = this.getAllAvailableItems(includeHouse);
    return Object.keys(materials)
      .map(materialClassName => {
        return [
          materialClassName,
          items
            .filter(item => {
              return item.constructor.name === materialClassName;
            })
            .filter(item => {
              return includeDamaged || item.integrity === 100;
            })
        ];
      })
      .reduce(
        (acc, [cName, items]) => ({
          ...acc,
          [cName]: items
        }),
        {}
      );
  }

  itemsInUseCount(keyFn = item => item.constructor.name) {
    const reduceCounts = {};
    Object.values(this.equipment).forEach(item => {
      if (item) {
        reduceCounts[keyFn(item)] = +1;
      }
    });

    const home = this.getHome();
    if (home) {
      home.getDecorations().forEach(slot => {
        if (slot.item) {
          reduceCounts[keyFn(slot.item)] = +1;
        }
      });
    }

    return reduceCounts;
  }

  hasMaterials(materials, missing = {}) {
    const reduceCounts = this.itemsInUseCount();

    const availableMaterials = this.getMaterials(materials);
    return !Object.keys(materials).find(material => {
      if (
        !availableMaterials[material] ||
        !availableMaterials[material].length ||
        availableMaterials[material].reduce(utils.stackQty, 0) -
          (reduceCounts[material] || 0) <
          materials[material]
      ) {
        missing[material] = true;
        return true;
      }
      return false;
    });
  }

  spendMaterials(materials, chanceToUse = 100) {
    const availableMaterials = this.getMaterials(materials);
    Object.keys(materials).forEach(material => {
      let qty = materials[material];
      while (qty > 0) {
        qty -= 1;
        if (utils.random(1, 100) <= chanceToUse) {
          const item = availableMaterials[material]
            .filter(item => item.qty > 0)
            .reduce((acc, item) =>
              item.integrity < acc.integrity ? item : acc
            );
          item.useUpItem();
        }
      }
    });
  }

  getAllAvailableItems(includeHome = true, includeNode = true) {
    const homeItems =
      includeHome && this.getHome() ? this.getHome().getItems() : [];
    // const nodeItems = (includeHome && includeNode) ? this.getNode().getItems() : [];
    return [
      ...this.items,
      ...homeItems
      // ...nodeItems,
    ];
  }

  getAllAvailableItemsQuantities(includeHome = true, includeNode = true) {
    const reduceCounts = this.itemsInUseCount(item =>
      JSON.stringify(item.getTradeId())
    );
    const availableQty = {};
    this.getAllAvailableItems(includeHome, includeNode).forEach(item => {
      const tId = JSON.stringify(item.getTradeId());
      availableQty[tId] = availableQty[tId] || 0;
      availableQty[tId] += item.qty;
      availableQty[tId] -= reduceCounts[tId] || 0;
      reduceCounts[tId] = 0;
    });
    return availableQty;
  }

  wasteMaterials(
    message,
    materials,
    failureLevel,
    notification = false,
    onlyIfFailed = false
  ) {
    let wastedSome = false;
    let wastedAll = true;
    const wastedMaterials = Object.keys(materials)
      .map(material => {
        const originalQty = materials[material];
        const wasted = Math.round((originalQty * failureLevel) / 100);
        if (wasted > 0) {
          wastedSome = true;
        }
        if (wasted !== originalQty) {
          wastedAll = false;
        }
        return {
          material,
          wasted
        };
      })
      .toObject(
        i => i.material,
        i => i.wasted
      );

    if (wastedSome) {
      this.spendMaterials(wastedMaterials);

      if (wastedAll) {
        message += " All materials were wasted.";
      } else {
        message += ` Some materials were wasted: ${utils.humanizeItemList(
          wastedMaterials
        )}.`;
      }
    }

    if (!onlyIfFailed || wastedSome) {
      this.logging(message, LOGGING.WARN, notification || wastedSome);
    }
  }

  isDead() {
    // Changes will require refactoring number of uses of this.dead
    return this.dead;
  }

  getDemolishableBuildings() {
    return this.getNode()
      .getBuildings()
      .filter(building => !building.noDemolish);
  }

  hasPostponedAction(actionId) {
    return this.postponedActions.some(
      a => a.currentAction.actionId === actionId
    );
  }

  isDoingAction(queryActionId) {
    if (!this.currentAction) {
      return false;
    }
    return queryActionId === this.currentAction.actionId;
  }

  postponeAction() {
    this.postponedActions = this.postponedActions || [];
    const action = this.getCurrentAction();
    if (action && !action.cannotBePostponed) {
      this.postponedActions.push({
        currentAction: this.currentAction,
        actionProgress: this.actionProgress
      });
    }
    this.currentAction = null;
    this.actionProgress = 0;
  }

  resumeAction() {
    this.postponedActions = this.postponedActions || [];
    if (this.postponedActions.length) {
      const postponedAction = this.postponedActions.pop();
      this.currentAction = postponedAction.currentAction;
      this.actionProgress = postponedAction.actionProgress;
    }
  }

  stopAction(notify = true, clearQueue = false, actualFinish = false) {
    if (clearQueue) {
      this.travelQueue = [];
      this.postponedActions = [];
    }

    let action;
    let entity;

    if (this.currentAction) {
      const { entityId, actionId, context, actionName } = this.currentAction;
      entity = Action.getTarget(entityId, context, this);
      let sendNotification = false;
      if (entity) {
        action = entity.getActionById(actionId);
        if (action && action.onFinish) {
          action.onFinish(entity, this);
        }
        if (
          notify &&
          !this.postponedActions.length &&
          (!action || action.notificationEnabled(entity, this))
        ) {
          sendNotification = true;
        }
      } else {
        sendNotification = true;
      }

      if (sendNotification) {
        const finish = actualFinish ? "finished" : "interrupted";
        this.logging(
          `${actionName || action.getName(entity, this)}: ${finish}!`,
          LOGGING.NORMAL,
          true,
          EMOJIS.OK
        );
      }
    }

    this.currentAction = null;
    this.actionProgress = 0;
    this.resumeAction();

    if (action && action.onFinished) {
      action.onFinished(entity, this);
    }
  }

  tryUnblockAction() {
    const action = this.getCurrentAction();

    return (
      action &&
      action.unblockOptionLabel &&
      action.unblockOptionLabel(this.getActionTarget(), this) &&
      action.unblockOption(this.getActionTarget(), this)
    );
  }

  accessErrorMessage(entity) {
    const blockingCreatures = this.getBlockingCreatures(entity);
    if (blockingCreatures.length) {
      const names = blockingCreatures.map(c => c.getName());
      const lastName = names.pop();
      const namesString = [names.join(", "), lastName]
        .filter(s => !!s)
        .join(" & ");
      return `The ${entity.getName()} is blocked by ${namesString}`;
    }
    return false;
  }

  getOccupyLevel(entity) {
    const occupying = this.occupying || {};
    return occupying[entity.getEntityId()];
  }

  occupyEntity(entity, level) {
    this.occupying = this.occupying || {};
    this.occupying[entity.getEntityId()] = level;
  }

  isCreatureBlocking(entity, c) {
    if (c === this) {
      return false;
    }
    const level = c.getOccupyLevel(entity);
    const blocking =
      level &&
      (level === OCCUPY_LEVELS.ONLY_ME ||
        (level === OCCUPY_LEVELS.MY_FRIENDS && !this.considersFriend(c)) ||
        (level === OCCUPY_LEVELS.NO_RIVALS && this.considersRival(c)));
    return blocking;
  }

  isBlockedByAnyone(entity) {
    return this.getNode()
      .getVisibleAliveCreatures()
      .some(c => this.isCreatureBlocking(entity, c));
  }

  getBlockingCreatures(entity) {
    return entity
      .getNode()
      .getVisibleAliveCreatures()
      .filter(c => this.isCreatureBlocking(entity, c));
  }

  isActionRunable() {
    if (this.currentAction) {
      const { entityId, actionId, context, repetitions } = this.currentAction;
      const entity = Action.getTarget(entityId, context, this);
      const action = entity.getActionById(actionId);
      if (!action) {
        return false;
      }
      return action.canRun(entity, this, context, repetitions);
    }
    return true;
  }

  getActionTarget() {
    return (
      this.currentAction &&
      this.currentAction.entityId &&
      Action.getTarget(
        this.currentAction.entityId,
        this.currentAction.context,
        this
      )
    );
  }

  continueAction(seconds) {
    if (this.currentAction) {
      const { entityId, actionId, context } = this.currentAction;
      const entity = Action.getTarget(entityId, context, this);
      if (!entity) {
        this.stopAction();
        return;
      }
      const action = entity.getActionById(actionId);

      if (!action || !action.run) {
        this.stopAction();
        return;
      }

      if (!action.isValid(entity, this, context)) {
        this.stopAction();
        return;
      }

      this.currentAction.actionName = action.getName(entity, this);

      const available = action.getAvailabilityMessage(entity, this, context);
      if (available !== true) {
        if (!this.currentAction.blocked) {
          this.currentAction.blockedTimeout = 0;
        } else {
          this.currentAction.blockedTimeout += seconds;
          if (this.currentAction.blockedTimeout > 30 * MINUTES) {
            this.stopAction(true, true);
            this.logging(
              "Action was blocked for too long, it was cancelled",
              LOGGING.WARN
            );
            return;
          }
        }
        this.currentAction.blocked = available;
      } else {
        this.currentAction.blocked = false;
        const previousProgress = this.actionProgress;

        this.currentAction.timeSpent =
          (this.currentAction.timeSpent || 0) + seconds;

        const runCheck = action.runCheck
          ? action.runCheck(
              entity,
              this,
              this.currentAction.context,
              this.currentAction.repetitions,
              this.currentAction.extra
            )
          : true;
        if (runCheck !== true) {
          this.logging(runCheck, LOGGING.IMMEDIATE_ERROR);
          this.stopAction(false);
          return false;
        }

        const result = action.run(entity, this, seconds, context);
        const updatedProgress = this.actionProgress;

        if (this.currentAction && !this.isDoingAction("Sleep")) {
          if (
            updatedProgress > previousProgress &&
            this.isPlayableCharacter()
          ) {
            const delta = (updatedProgress - previousProgress) / seconds;
            let queueTime;
            if (action.queueEstimate) {
              // utils.performanceMeasure("travelQueue");
              queueTime = action.queueEstimate(entity, this);
              // utils.performanceMeasureEnd("travelQueue", {
              //   name: this.name,
              //   travel: this.travelQueue && this.travelQueue.length
              // });
            } else {
              queueTime =
                (((this.currentAction.repetitions || 1) - 1) * 100) / delta;
            }
            this.currentAction.ETA = (100 - updatedProgress) / delta;
            this.currentAction.allETA =
              (100 - updatedProgress) / delta + queueTime;
          } else {
            this.currentAction.ETA = null;
            this.currentAction.allETA = null;
          }
        }

        if (!result && this.currentAction) {
          this.currentAction.repetitions -= 1;
          if (
            !this.currentAction.repetitions ||
            this.currentAction.repetitions <= 0
          ) {
            this.stopAction(true, false, true);
          }
        }
      }
    }
  }

  isUsingTool(toolUtility) {
    if (!toolUtility) {
      return false;
    }
    const ref = {};
    this.getToolLevel(toolUtility, ref);
    return ref.usingTool;
  }

  getToolLevel(toolUtility, ref = {}) {
    const tool = this.getTool();
    let toolLevel = 1;
    if (toolUtility) {
      const fromBuff =
        this.getBuff(toolUtility) !== 100 ? this.getBuff(toolUtility) / 100 : 0;
      const fromTool = tool && tool.getUtilityLevel(toolUtility);
      if (!fromTool && !fromBuff) {
        return null;
      }
      const usingTool = fromTool > fromBuff;
      toolLevel = usingTool ? fromTool : fromBuff;
      ref.usingTool = usingTool;
    }
    return toolLevel;
  }

  hasItem(item) {
    return (
      item.getContainer() === this || item.getContainer() === this.getHome()
    );
  }

  getHome() {
    return null;
  }

  hasItemType(itemClassName) {
    return (
      this.items.some(item => item.constructor.name === itemClassName) ||
      (this.getHome() &&
        this.getHome()
          .getItems()
          .some(item => item.constructor.name === itemClassName))
    );
  }

  getItemQty(itemClassName, includeHome = true) {
    const items = this.getAllAvailableItems(includeHome);
    return items.reduce(
      (acc, item) =>
        item.constructor.name === itemClassName ? acc + item.qty : acc,
      0
    );
  }

  pickUp(item, qty = 1) {
    const node = item.getContainer();
    let toPick = item;
    if (item.qty > qty) {
      toPick = item.split(qty);
    }
    node.removeItem(toPick);
    this.addItem(toPick);
    return toPick;
  }

  drop(item, qty = 1) {
    let toDrop = item;
    if (item.qty > qty) {
      toDrop = item.split(qty);
    }
    this.removeItem(toDrop);
    this.getNode().addItem(toDrop);
    return toDrop;
  }

  give(item, qty, to, restack = true) {
    let toGive = item;
    if (toGive.qty > qty) {
      toGive = item.split(qty);
    }
    const givingFrom = toGive.getContainer();
    givingFrom.removeItem(toGive);
    to.receiveItem(toGive, restack);
    if (restack) {
      givingFrom.reStackItems();
    }
  }

  receiveItem(received, restack = true) {
    // const home = this.getHome();
    // if (home && home.hasStorageSpace()) {
    //     home.addItem(received);
    //     home.reStackItems();
    // } else {
    this.addItem(received);
    if (restack) {
      this.reStackItems();
    }
    // }
  }

  putToStorage(item, qty = 1) {
    let toDrop = item;
    if (item.qty > qty) {
      toDrop = item.split(qty);
    }
    this.removeItem(toDrop);
    this.getHome().addItem(toDrop);
    return toDrop;
  }

  takeFromStorage(item, qty = 1) {
    let toPick = item;
    if (item.qty > qty) {
      toPick = item.split(qty);
    }
    this.getHome().removeItem(toPick);
    this.addItem(toPick);
    return toPick;
  }

  addItem(item) {
    this.items.push(item);
    item.setContainer(this);
  }

  addItemByType(itemType, qty = 1) {
    for (let i = 0; i < qty; i += 1) {
      const existing =
        itemType.prototype.stackable &&
        this.items.find(i => i.constructor === itemType && i.integrity === 100);
      if (existing) {
        existing.qty += 1;
      } else {
        const item = new itemType();
        this.addItem(item);
      }
    }
  }

  isOverburdened() {
    return false;
  }

  removeItem(item) {
    const idx = this.items.indexOf(item);
    if (idx !== -1) {
      this.items.splice(idx, 1);
      item.setContainer(null);
    }
    this.replaceEquipment(item);
    this.replaceActionedItem(item);
    item.setContainer(null);
  }

  replaceActionedItem(item) {
    if (this.currentAction && this.currentAction.entityId === item.id) {
      this.actionOnSimilarItem(item);
    }
  }

  replaceEquipment(item) {
    if (!item) {
      return;
    }
    let similarItem = false;
    Object.keys(this.equipment).forEach(slotId => {
      if (this.equipment[slotId] === item) {
        if (similarItem === false) {
          similarItem = this.items
            .filter(i => i.constructor.name === item.constructor.name)
            .filter(i => !i.isUnusable())
            .sort((a, b) => b.integrity - a.integrity)
            .pop();
        }
        if (similarItem) {
          this.equipment[slotId] = similarItem;
        } else {
          this.equipment[slotId] = null;
        }
      }
    });
  }

  unequip(item, slotId = null) {
    if (slotId) {
      this.equipment[slotId] = null;
    } else {
      Object.keys(this.equipment).forEach(sId => {
        if (this.equipment[sId] === item) {
          this.equipment[sId] = null;
        }
      });
    }
  }

  reStackItems() {
    this.items = utils.reStackItems(this.items);
  }

  exchangeBlows(enemy) {
    if (!enemy) {
      return;
    }
    if (enemy.isDoingAction("Travel")) {
      if (utils.chance(4 - enemy.getBuff(BUFFS.FLEE_AVOIDANCE))) {
        this.attack(enemy);
      } else {
        fightingFeedback.reportFleeMiss(this, enemy);
      }
    } else {
      this.attack(enemy);
      enemy.attack(this);
    }
  }

  attack(enemy) {
    if (this.isProtected()) {
      return;
    }
    const minChance = 3;
    const maxChance = 97;

    if (enemy.isProtected()) {
      fightingFeedback.reportHidden(this, enemy);
    } else {
      const dodgeRating = enemy.getEffectiveDodgeRating();

      const hitChance = this.getChanceToHit() || 50;
      const dodgeChance = Math.max(100 - hitChance, 2) * dodgeRating;

      const missThreshold = utils.limit(hitChance, minChance, maxChance);

      const grazeThreshold = utils.limit(
        hitChance - dodgeChance,
        minChance,
        maxChance
      );
      const dodgeThreshold = utils.limit(
        (missThreshold - grazeThreshold) / 2 + grazeThreshold,
        minChance,
        maxChance
      );

      const hitRoll = utils.random(1, 100);

      const efficiencyExpMultiplier =
        this.getCombatStrength() * enemy.getCombatStrength();

      switch (true) {
        case hitRoll > missThreshold:
          fightingFeedback.reportMiss(this, enemy);
          return;
        case hitRoll > dodgeThreshold:
          fightingFeedback.reportDodge(this, enemy);
          enemy.gainSkill(
            SKILLS.FIGHTING_DODGE,
            5 * this.getChallengeLevel() * efficiencyExpMultiplier
          );
          enemy.gainStatsFromSkill(
            SKILLS.FIGHTING_DODGE,
            this.attackDelay * 15
          );
          return;
        default:
          const isGraze = hitRoll > grazeThreshold;
          const damage = this.dealDamage(enemy, isGraze ? 0.5 : 1);
          if (isGraze) {
            fightingFeedback.reportGraze(this, enemy, damage);
          } else {
            fightingFeedback.reportHit(this, enemy, damage);
          }
          this.reduceWeaponDurability();
          enemy.reduceArmorDurability();
          this.gainSkill(
            this.getWeaponSkill(),
            5 * enemy.getChallengeLevel() * efficiencyExpMultiplier
          );
          this.gainStatsFromSkill(this.getWeaponSkill(), this.attackDelay * 15);
          enemy.gainSkill(
            SKILLS.FIGHTING_DODGE,
            0.8 *
              this.getChallengeLevel() *
              efficiencyExpMultiplier *
              (isGraze ? 2 : 1)
          );
          enemy.gainStatsFromSkill(
            SKILLS.FIGHTING_DODGE,
            this.attackDelay * 15
          );
      }
    }
  }

  reduceWeaponDurability() {}
  reduceArmorDurability() {}

  getThreatLevel() {
    return this.threatLevel;
  }

  getChallengeLevel() {
    return (Math.sqrt(this.getThreatLevel()) || 0) * 30;
  }

  getEfficiency() {
    return 1;
  }

  getCombatStrength() {
    return this.getBuff(BUFFS.COMBAT_STRENGTH) / 100;
  }

  getStatValue(stat) {
    return this.stats[stat] + this.getBuff(STAT_NAMES[stat]);
  }

  getStatPercentageEfficiency(stat) {
    return Math.floor((Math.pow(this.getStatValue(stat) / 2, 1.5) + 75) / 2);
  }

  getWeapon() {
    if (Array.isArray(this.defaultWeapon)) {
      return utils.randomItem(this.defaultWeapon);
    }
    return this.defaultWeapon;
  }

  getWeaponDamage(weapon) {
    weapon = weapon || this.getWeapon();
    return WeaponSystem.calculateDamageWithCoefficients(weapon, this);
  }

  getArmorValue() {
    const armor = this.defaultArmor || {};
    if (typeof armor === "number") {
      console.warn("Old armor style", this.name);
      return {
        [DAMAGE_TYPES.BLUNT]: armor,
        [DAMAGE_TYPES.PIERCE]: armor,
        [DAMAGE_TYPES.SLICE]: armor
      };
    }
    return armor;
  }

  getEffectiveDodgeRating() {
    // return -(60 / (this.getDodgeRating() + 60)) + 1;
    return Math.pow(this.getDodgeRating() / 100, 0.75);
  }

  getDodgeRating() {
    return (
      (this.dodgeRating || 0) * (this.getBuff(BUFFS.DODGE_MULTIPLIER) / 100)
    );
  }

  getChanceToHit(weapon) {
    weapon = weapon || this.getWeapon();
    return (
      weapon.hitChance + WeaponSystem.getHitChanceCoefficient(weapon, this)
    );
  }

  getDamageDealt(multiplier = 1) {
    const damages = {
      ...this.getWeaponDamage()
    };
    Object.keys(damages).forEach(type => {
      damages[type] =
        multiplier *
        this.getCombatStrength() *
        this.getSkillEfficiencyMultiplier(this.getWeaponSkill()) *
        (this.getBuff(BUFFS.COMBAT_STRENGTH) / 100) *
        (utils.random(30, 100) / 100) *
        damages[type];
    });
    return damages;
  }

  getWeaponSkill() {
    return SKILLS.FIGHTING_UNARMED;
  }

  getSkillLevel() {
    return 0;
  }

  getDifficultyLabel() {
    return "";
  }

  accidentChance(injuryChance, skill, toolUtility, baseTime = 1 * HOURS) {
    injuryChance =
      injuryChance *
      Math.pow(100 / this.getStatPercentageEfficiency(STATS.DEXTERITY), 1 / 3);

    if (!utils.chance(injuryChance)) {
      return "";
    }

    const luck = this.getBuff(BUFFS.LUCK);
    if (luck && utils.chance(Math.min(20, luck))) {
      return "";
    }

    const L = 186;
    const k = 0.05;
    const x0 = 110;
    const c = 4;
    const injuryBase = L / (1 + Math.pow(Math.E, -k * (injuryChance - x0))) + c;

    const timeMultiplier = (baseTime / (1 * HOURS)) * (2 / 3) + 1 / 3;

    let injuryLevel = (injuryBase * utils.random(60, 100)) / 100;
    injuryLevel = Math.round(injuryLevel * timeMultiplier);
    if (injuryLevel <= 0) {
      return "";
    }

    let damage = "";
    switch (true) {
      case skill === SKILLS.PATHFINDING:
      case skill === SKILLS.SPELUNKING:
        if (utils.random(1, 100) >= 80) {
          if (injuryLevel > 20) {
            damage = this.damageBrokenBone(injuryLevel);
          } else {
            damage = this.damageBruised(injuryLevel);
          }
        } else {
          damage = this.damageCut(injuryLevel);
        }
        break;

      case skill === SKILLS.FISHING:
        return "";

      case toolUtility === TOOL_UTILS.CUTTING ||
        skill === SKILLS.LOCKPICKING ||
        skill === SKILLS.WOODCUTTING ||
        skill === SKILLS.SAWING:
        damage = this.damageCut(injuryLevel);
        break;

      case toolUtility === TOOL_UTILS.FIRESTARTER ||
        skill === SKILLS.SMELTING ||
        skill === SKILLS.COOKING:
        damage = this.damageBurn(injuryLevel);
        break;

      case skill === SKILLS.SEWING:
        damage = this.damageInternal(injuryLevel);
        break;
      case skill === SKILLS.FARMING && !toolUtility:
      case skill === SKILLS.FORAGING:
      /* fall-through */
      default:
        if (utils.chance(40)) {
          damage = this.damageBruised(injuryLevel);
        } else {
          damage = this.damageCut(injuryLevel);
        }
        break;
    }
    if (this.isPlayableCharacter()) {
      this.sufferedAccident = true;
    }
    if (!damage) {
      return "";
    }
    return `You hurt yourself in an accident (${damage.name}${
      damage.stacks > 1 ? " " + damage.stacks : ""
    }).`;
  }

  isProtected() {
    return this.hasBuff(BuffHiding);
  }

  dealDamage(enemy, multiplier = 1) {
    return enemy.receiveDamage(this.getDamageDealt(multiplier));
  }

  receiveDamage(damage) {
    if (this.isProtected()) {
      return;
    }
    const armor = this.getArmorValue();
    return Object.values(DAMAGE_TYPES)
      .map(type => {
        if (!damage[type]) {
          return null;
        }
        let armorValue = armor[type] || 0;

        if (type === DAMAGE_TYPES.VENOM) {
          armorValue +=
            ((armor[DAMAGE_TYPES.PIERCE] || 0) * 2) / 4 +
            ((armor[DAMAGE_TYPES.SLICE] || 0) * 1) / 4;
        }

        if (type === DAMAGE_TYPES.BURN) {
          armorValue +=
            ((armor[DAMAGE_TYPES.BLUNT] || 0) * 1) / 4 +
            ((armor[DAMAGE_TYPES.PIERCE] || 0) * 1) / 4 +
            ((armor[DAMAGE_TYPES.SLICE] || 0) * 1) / 4;
        }

        // const armorDivider = armorValue >= 1 ? Math.sqrt(armorValue) : Math.pow(0.9, 1 - armorValue);
        // const damageMultiplier = Math.sqrt(damage[type]);

        const armorDivider =
          armorValue >= 1 ? armorValue : Math.pow(0.9, 1 - armorValue);
        const damageMultiplier = damage[type];

        let value = (5 * damageMultiplier) / armorDivider;
        if (value < 1) {
          // console.warn(this.name, 100 * value, damage[type], armorValue);
          if (utils.chance(100 * value, 1, 3)) {
            value = 1;
          } else {
            return null;
          }
        }

        value = Math.round(value);

        switch (type) {
          case DAMAGE_TYPES.BLUNT:
            if (utils.random(1, 1000) < value) {
              return this.damageBrokenBone(value);
            } else {
              return this.damageBruised(value);
            }
          case DAMAGE_TYPES.PIERCE:
            value = Math.round(value / 2);
            if (value > 0) {
              return this.damageInternal(value);
            }
            break;
          case DAMAGE_TYPES.SLICE:
            return this.damageCut(value);
          case DAMAGE_TYPES.BURN:
            return this.damageBurn(value);
          case DAMAGE_TYPES.VENOM:
            return this.damageVenom(value);
        }
        return null;
      })
      .filter(buff => !!buff);
  }

  damageBrokenBone(value, time) {
    time = time || 28 * DAYS;
    return this.addBuff(BuffBrokenBone, {
      duration: time,
      effects: {
        [BUFFS.PAIN]: value * 1.5,
        [BUFFS.STATS.DEXTERITY]: -Math.round((value * 10) / 5) / 10,
        [BUFFS.STATS.STRENGTH]: -Math.round((value * 10) / 5) / 10
      }
    });
  }

  damageBruised(value, time) {
    time = time || this.damageTime[DAMAGE_TYPES.BLUNT];
    return this.addBuff(BuffBruise, {
      duration: time,
      stacks: value,
      effects: {
        [BUFFS.PAIN]: value,
        [BUFFS.INTERNAL_DAMAGE]: value / 10
      }
    });
  }

  damageInternal(value, time) {
    time = time || this.damageTime[DAMAGE_TYPES.INTERNAL_DAMAGE];
    return this.addBuff(BuffInternalDamage, {
      duration: time,
      stacks: value,
      effects: {
        [BUFFS.PAIN]: value / 3,
        [BUFFS.BLEEDING]: value / 20,
        [BUFFS.INTERNAL_DAMAGE]: value,
        [BUFFS.NAUSEOUS]: value / 2
      }
    });
  }

  damageCut(value, time, canGushing = true) {
    const gushingChance = this instanceof Humanoid ? 500 : 100;
    if (canGushing && utils.random(1, gushingChance) < value) {
      time =
        time || ((this.damageTime[DAMAGE_TYPES.SLICE] / HOURS) * MINUTES) / 3;
      return this.addBuff(BuffGushingCut, {
        duration: time,
        stacks: value,
        effects: {
          [BUFFS.PAIN]: value / 2,
          [BUFFS.BLEEDING]: value * 12
        }
      });
    } else {
      time = time || this.damageTime[DAMAGE_TYPES.SLICE];
      return this.addBuff(BuffCut, {
        duration: time,
        stacks: value,
        effects: {
          [BUFFS.PAIN]: value / 2,
          [BUFFS.BLEEDING]: value
        }
      });
    }
  }

  damageBurn(value, time) {
    time = time || this.damageTime[DAMAGE_TYPES.BURN];
    this.heatstroke += value / 2;
    return this.addBuff(BuffBurn, {
      duration: time,
      stacks: value,
      effects: {
        [BUFFS.STATS.ENDURANCE]: -(value / 6),
        [BUFFS.STATS.STRENGTH]: -(value / 6),
        [BUFFS.PAIN]: value / 2
      }
    });
  }

  damageVenom(value) {
    return BuffVenom.applyBuff(this, value);
  }

  possibleInjury(type, stacks) {
    let ageMultiplier = 1;
    let enduranceMultiplier =
      100 / this.getStatPercentageEfficiency(STATS.ENDURANCE);
    let grace = 0;
    if (this.hasBuff(BuffAge1)) {
      ageMultiplier = 0.2;
      grace = -5;
    }
    if (this.hasBuff(BuffAge3)) {
      ageMultiplier = 2;
      grace = +5;
    }
    if (this.hasBuff(BuffAge4)) {
      ageMultiplier = 6;
      grace = +15;
    }
    if (utils.chance((stacks * ageMultiplier + grace) * enduranceMultiplier)) {
      this.logging(
        `You have a new injury: ${type.prototype.name}`,
        LOGGING.WARN,
        false
      );
      type.applyBuff(this);
    }
  }

  getSkillSuccessChance() {
    return 100;
  }

  getSkillGainDifficultyMultiplier() {
    return 1;
  }

  getSkillEfficiencyMultiplier() {
    return 1;
  }

  gainSkill() {}
  gainStatsFromSkill() {}
  getTimeSpentOnAction() {
    return this.currentAction ? this.currentAction.timeSpent || 0 : 0;
  }

  hasBuff(query) {
    this.buffNames = this.buffNames || {};
    if (typeof query === "string") {
      return this.buffNames[query];
    }
    return this.buffNames[query.name];
  }

  getBuffs() {
    return this.buffs;
  }

  addBuff(buffType, config = {}) {
    const buff = new buffType(config, this);
    this.buffs.push(buff);
    return buff;
  }

  updateBuffLevel(key, config, override = {}, maxLevel = 1) {
    const existing = this.buffs.find(b =>
      Object.keys(key).every(prop => b[prop] === key[prop])
    );
    if (existing) {
      const newLevel = Math.min(existing.getLevel() + config.level, maxLevel);
      if (newLevel > 0) {
        existing.setLevel(newLevel);
        Object.keys(override).forEach(key => (existing[key] = override[key]));
      } else {
        this.removeBuff(existing);
      }
    } else {
      this.addBuff(Buff, {
        ...key,
        ...config,
        ...override
      });
    }
  }

  addOrUpdateBuff(key, config) {
    const existing = this.buffs.find(b =>
      Object.keys(key).every(prop => b[prop] === key[prop])
    );
    if (existing) {
      Object.keys(config).forEach(prop => (existing[prop] = config[prop]));
    } else {
      this.addBuff(Buff, {
        ...key,
        ...config
      });
    }
  }

  removeBuff(buff) {
    if (typeof buff === "string") {
      this.buffs = this.buffs.filter(b => b.constructor.name !== buff);
    } else {
      this.buffs = this.buffs.filter(b => b !== buff);
    }
  }

  removeBuffsByCategory(buffCategory) {
    [...this.buffs].forEach(buff => {
      if (buff.isCategory(buffCategory)) {
        this.removeBuff(buff, false);
      }
    });
  }

  hasAffliction(afflictionName) {
    return (
      this.hasBuff(`${afflictionName}Incubation`) ||
      this.hasBuff(`${afflictionName}Symptomatic`)
    );
  }

  isOverground() {
    return this.getNode().constructor === Node;
  }

  getTravelTime(node, current = false) {
    let mod = 1;
    if (
      current &&
      this.lastTravel &&
      this.lastTravel.node === node.id &&
      this.lastTravel.time.getTime() + 10 * SECONDS * IN_MILISECONDS >
        world.getCurrentTime().getTime()
    ) {
      mod = Math.max((100 - this.lastTravel.progress) / 100, 0);
    }
    return node.getBaseTravelTime(this) * mod;
  }

  disregardHostiles(context) {
    context = context || (this.currentAction && this.currentAction.context);
    return context && context.disregard;
  }

  ignoresUnknowns(context) {
    context = context || (this.currentAction && this.currentAction.context);
    return context && context.skipUnknowns;
  }

  isAssaulting(context) {
    context = context || (this.currentAction && this.currentAction.context);
    return context && context.assault;
  }

  isAmbushing(context) {
    context = context || (this.currentAction && this.currentAction.context);
    return this.isAssaulting(context) && !this.disregardHostiles(context);
  }

  move(toNode) {
    const fromNode = this.getNode();

    fromNode.removeCreature(this);
    toNode.addCreature(this);

    fromNode
      .getVisibleAliveCreatures()
      .forEach(c => c.triggerQuestEvent("someoneDeparted", this));
    toNode
      .getVisibleAliveCreatures()
      .forEach(c => c.triggerQuestEvent("someoneArrived", this));
    this.triggerQuestEvent("moved", fromNode, toNode);

    if (!(fromNode instanceof Room) && !(toNode instanceof Room)) {
      this.scouters = this.scouters || {};
      Object.keys(this.scouters).forEach(id => {
        this.scouters[id] -= this.scouterReduction;
        if (this.scouters[id] <= 0) {
          delete this.scouters[id];
        }
      });
    }

    toNode.getVisibleAliveCreatures().forEach(c => {
      this.fullyScout(c);
      c.fullyScout(this);
    });
  }

  wanderRandomly(seconds = 1) {
    this.moveIn = this.moveIn || 0;
    this.moveIn += seconds;
    if (this.moveIn >= this.movementDelay) {
      this.moveIn -= this.movementDelay;
      this.moveRandomly();
    }
  }

  moveRandomly(force = false) {
    const travelTo = utils.randomItem(
      this.getNode()
        .getConnectedLocations()
        .filter(
          node =>
            this.getNode()
              .getPath(node)
              .getDistance(this) <
              24 * HOURS &&
            !node
              .getCompleteStructures()
              .some(s => s.scaresMonsters && this instanceof s.scaresMonsters)
        )
    );
    if (
      travelTo &&
      (force || utils.chance(this.getPlacementChance(travelTo) * 2))
    ) {
      this.startAction(travelTo, travelTo.getActionById("Travel"));
    }
  }

  findRoute(fromNode, toNode, context) {
    const distances = {
      [toNode.getEntityId()]: 0
    };
    let checkNodes = [toNode];

    while (checkNodes.length > 0) {
      const next = [...checkNodes];
      checkNodes = [];
      next.forEach(node => {
        const nodeDistance = distances[node.getEntityId()];
        const paths = node
          .getConnections()
          .filter(path => {
            const target = path.getOtherNode(node);
            return (
              this.isNodeMapped(target) &&
              (!this.seesNode(target) ||
                target === toNode ||
                target === this.getNode() ||
                ((!this.hasEnemies(target) ||
                  this.disregardHostiles(context)) &&
                  (!this.hasUnknowns(target) || this.ignoresUnknowns(context))))
            );
          })
          .filter(path => path.getCurrentDistance(this) < Infinity);

        paths.forEach(path => {
          const connected = path.getOtherNode(node);
          const distance = nodeDistance + path.getCurrentDistance(this);
          if (
            distances[connected.getEntityId()] === undefined ||
            distances[connected.getEntityId()] > distance
          ) {
            distances[connected.getEntityId()] = distance;
            // connected.debug = distance;
            checkNodes.push(connected);
          }
        });
      });
    }

    if (distances[fromNode.getEntityId()] === undefined) {
      return false;
    }

    const nodesToVisit = [];

    let node = fromNode;
    do {
      const paths = node.getConnections().filter(path => {
        const otherNode = path.getOtherNode(node);
        return otherNode === toNode || this.isNodeMapped(otherNode);
      });
      let path = paths.find(path => {
        const connected = path.getOtherNode(node);
        return (
          distances[connected.getEntityId()] + path.getCurrentDistance(this) ===
          distances[node.getEntityId()]
        );
      });

      if (!path) {
        return false;
      }

      node = path.getOtherNode(node);
      nodesToVisit.push(node);
    } while (node !== toNode);

    return nodesToVisit;
  }

  pathfinding(toNode) {
    const fromNode = this.getNode();
    const nodesToVisit = this.findRoute(fromNode, toNode);
    if (!nodesToVisit) {
      this.logging(
        "Unable to find an unobstructed path!",
        LOGGING.IMMEDIATE_ERROR
      );
      this.stopAction(false);
      return;
    }
    this.travelQueue = nodesToVisit;
    this.currentAction.entityId = nodesToVisit[0].getEntityId();
    return nodesToVisit[0];
  }

  triggerQuestEvent(eventType, ...args) {
    if (this.isPlayableCharacter()) {
      this.getPlayer()
        .getCurrentQuests()
        .forEach(({ questDetails, questData }) => {
          const handler =
            questDetails.questEventsHandler &&
            questDetails.questEventsHandler[eventType];
          if (handler) {
            handler(this, { questDetails, questData }, ...args);
          }
        });
    }
  }

  die(reason) {
    this.triggerQuestEvent("die");
    this.getValidEnemies().forEach(creature =>
      creature.triggerQuestEvent("kill", this)
    );

    [...this.items].forEach(item => {
      this.drop(item, item.qty);
    });
    this.getNode().reStackItems();

    this.timeOfDeath = world.currentTime;

    this.dead = true;
    this.logging(this.getName() + ": died, " + reason, LOGGING.FAIL);
    if (this.getPlayer()) {
      this.getPlayer().deadReason = reason;
      this.setPlayer(null);
    }

    this.getNode().everyoneCheckForEnemies();
  }

  canBeAttacked() {
    return !this.isDead();
  }

  annihilate() {
    this.dead = true;
    while (this.items.length) {
      this.items[0].destroy();
    }
    this.destroy();
  }

  destroy() {
    if (!this.isDead()) {
      this.die("You died being obliterated");
    }
    if (this.getNode()) {
      this.getNode().removeCreature(this);
    }
    super.destroy();
  }

  cycle(seconds) {
    if (this.isDead()) {
      this.deterioration = this.deterioration || 0;
      this.deterioration += seconds;
      if (this.deterioration >= 8 * DAYS) {
        this.destroy();
      }
      return;
    }

    FollowSystem.cycle(this, seconds);

    this.expireTimedBuffs(seconds);

    this.removeBuffsByCategory(Buff.CATEGORIES.PAIN);
    this.updatePain(seconds);
    this.checkInternalDamage(seconds);
    this.updateBleeding(seconds);
    if (this instanceof Humanoid) {
      this.updateThermalHotBuffs(seconds);
      this.updateThermalColdBuffs(seconds);
    }

    this.recalculateBuffs();

    this.continueAction(seconds);

    this.checkAccidentSafety();

    if (!this.currentAction && AUTO_SLEEP) {
      this.startAction(this, this.getActionById("Sleep"));
    }
  }

  checkAccidentSafety() {
    if (this.sufferedAccident && this.isPlayableCharacter()) {
      delete this.sufferedAccident;
      const player = this.getPlayer();
      const painSafety = player.getUserSettings("safeties.pain");
      const bloodSafety = player.getUserSettings("safeties.blood");
      const painEffect = this.getBuffs().find(b => b instanceof BuffPain);
      const bloodEffect = this.getBuffs().find(b => b instanceof BuffBloodLoss);
      const painSeverity = painEffect ? painEffect.severity : 0;
      const bloodSeverity = bloodEffect ? bloodEffect.severity : 0;
      let reason = "";
      if (5 - painSafety <= painSeverity) reason = painEffect;
      if (5 - bloodSafety <= bloodSeverity) reason = bloodEffect;
      if (reason) {
        this.stopAction(false, true);
        this.logging(
          `Due to an accident while suffering from ${reason.getName()}, your current action was interrupted based on your safety preferences.`,
          LOGGING.WARN
        );
      }
    }
  }

  updateStatusBuffs() {
    this.removeBuffsByCategory(Buff.CATEGORIES.STATUS);

    if (this.isSleeping()) {
      this.addBuff(BuffSleeping);
    }

    if (this.satiatedTiered < 100) {
      const severity = 4 - this.satiatedTiered / 25;
      this.addBuff(global[`BuffHunger${severity}`]);
    }

    if (this.malnourishedTiered) {
      const severity = this.malnourishedTiered / 25;
      this.addBuff(global[`BuffMalnourishment${severity}`]);
    }
  }

  getSleepingSlowdown() {
    return this.isSleeping() ? (0.8 * this.actionProgress) / 100 : 0;
  }

  getHungerRate() {
    return (
      (((100 + this.getBuff(BUFFS.HUNGER_RATE)) / 100) *
        (1 - this.getSleepingSlowdown()) *
        100) /
      this.stomachSeconds
    );
  }

  gettingHungry(seconds) {
    const wasNotStarving = this.satiated > 0;
    this.satiated -= seconds * this.getHungerRate();

    this.satiated = utils.limit(this.satiated, 0, 100);
    this.satiatedTiered = Math.ceil(this.satiated / 25) * 25;

    this.malnourished = this.malnourished || 0;
    if (this.satiated <= 0) {
      this.malnourished += (seconds * 100) / (3 * DAYS);
      if (wasNotStarving) {
        this.removeBuffsByCategory(Buff.CATEGORIES.FOOD);
      }
    } else {
      this.malnourished -= (seconds * 100) / DAYS;
    }
    this.malnourished = utils.limit(this.malnourished, 0, 100);
    this.malnourishedTiered = Math.ceil(this.malnourished / 25) * 25;

    if (this.malnourished >= 100) {
      this.die("You died of malnourishment");
    }

    const nauseous = this.getBuff(BUFFS.NAUSEOUS);
    if (nauseous) {
      for (let i = 0; i < seconds; i++) {
        this.nauseated(nauseous);
      }
    }
  }

  nauseated(ratio) {
    ratio = ratio - 2;
    if (ratio <= 0) {
      return;
    }
    const baseFreq = 4 * HOURS;
    const precision = 10000;

    const chance = (precision * ratio) / baseFreq;
    if (utils.random(1, 100 * precision) <= chance) {
      BuffNauseous.applyBuff(this);
      this.logging("You feel nauseous.", LOGGING.WARN);
    }
  }

  modifyMaxAge(mod) {
    this.maxAge = this.maxAge + mod;
  }

  recalculateBuffs() {
    this.buffs = this.buffs || [];
    this.buffEffects = {};
    this.buffNames = {};
    this.buffs.forEach(b => {
      this.buffNames[b.constructor.name] = true;
      const effects = b.getEffects();
      Object.keys(effects).forEach(stat => {
        this.buffEffects[stat] =
          this.buffEffects[stat] || (MULTIPLIER_BUFFS[stat] ? 100 : 0);
        if (MULTIPLIER_BUFFS[stat]) {
          this.buffEffects[stat] *= effects[stat] / 100;
        } else {
          this.buffEffects[stat] += effects[stat];
        }
      });
    }, 0);
  }

  checkInternalDamage(seconds) {
    const internalDamage = this.getBuff(BUFFS.INTERNAL_DAMAGE);

    if (internalDamage > 100) {
      this.die("You died from internal wounds");
    }
  }

  updateBleeding(seconds) {
    const bleeding = this.getBuff(BUFFS.BLEEDING);
    let bloodLoss = (seconds * bleeding * 100) / (this.bloodPool * HOURS);

    bloodLoss = (bloodLoss * this.getBuff(BUFFS.BLEEDING_MULTIPLIER)) / 100;

    this.blood -= bloodLoss;
    this.blood += (seconds * 100) / (4 * DAYS);
    this.blood = utils.limit(this.blood, 0, 100);
    this.bloodTiered = Math.floor(this.blood / 20) * 20;

    if (this.bloodTiered < 80) {
      let description;
      if (this.lastBlood <= this.blood) {
        description = "Stable";
      } else {
        const lost = this.lastBlood - this.blood;
        const zeroBloodIn = (100 / lost) * seconds;
        switch (true) {
          case zeroBloodIn <= 6 * HOURS:
            description = "Rapidly losing blood";
            break;
          case zeroBloodIn <= 12 * HOURS:
            description = "Quickly losing blood";
            break;
          case zeroBloodIn <= 2 * DAYS:
            description = "Slowly losing blood";
            break;
          default:
            description = "Very slowly losing blood";
            break;
        }
      }
      this.lastBlood = this.blood;
      const severity = 4 - this.bloodTiered / 20;
      this.addBuff(global[`BuffBloodLoss${severity}`], {
        description
      });
    }

    if (this.blood <= 0) {
      this.die("You died of blood loss");
    }
  }

  updateThermalHotBuffs(seconds) {
    const temperature = this.getNode().getTemperature(true);
    const range = this.getThermalRange();

    const heatSeverity = Math.max(
      0,
      Math.min(Math.floor((temperature - range.max + 2) / 2), 4)
    );
    if (heatSeverity) {
      this.addBuff(global[`BuffHeat${heatSeverity}`]);
    }

    const heatstrokeChange = {
      0: -4 * DAYS,
      1: 9 * DAYS,
      2: 3 * DAYS,
      3: 1 * DAYS,
      4: 0.6 * DAYS
    };
    this.heatstroke = this.heatstroke || 0;
    this.heatstroke += (seconds * 100) / heatstrokeChange[heatSeverity];
    this.heatstroke = utils.limit(this.heatstroke, 0, 100);
    this.heatstrokeTiered = Math.max(
      0,
      Math.ceil((this.heatstroke - 20) / 20) * 20
    );

    if (this.heatstroke === 100) {
      this.die("You died from heat stroke");
      return;
    }

    if (this.heatstrokeTiered) {
      const severity = this.heatstrokeTiered / 20;
      this.addBuff(global[`BuffHeatstroke${severity}`]);
    }
  }

  updateThermalColdBuffs(seconds) {
    const temperature = this.getNode().getTemperature(true);
    const range = this.getThermalRange();

    const coldSeverity = Math.max(
      0,
      Math.min(Math.floor((-(temperature - range.min) + 2) / 2), 4)
    );
    if (coldSeverity > 0) {
      this.addBuff(global[`BuffCold${coldSeverity}`]);
    }

    const hypothermiaChange = {
      0: -3 * DAYS,
      1: 9 * DAYS,
      2: 3 * DAYS,
      3: 1 * DAYS,
      4: 0.6 * DAYS
    };
    this.hypothermia = this.hypothermia || 0;
    this.hypothermia += (seconds * 100) / hypothermiaChange[coldSeverity];
    this.hypothermia = utils.limit(this.hypothermia, 0, 100);
    this.hypothermiaTiered = Math.max(
      0,
      Math.ceil((this.hypothermia - 20) / 20) * 20
    );

    if (this.hypothermia === 100) {
      this.die("You died from frostbite");
      return;
    }

    if (this.hypothermiaTiered) {
      const severity = this.hypothermiaTiered / 20;
      this.addBuff(global[`BuffHypothermia${severity}`]);
    }
  }

  getThermalRange() {
    return this.thermalRange;
  }

  updatePain(seconds) {
    this.painThreshold = 100 - this.getBuff(BUFFS.PAIN);

    const painAccountedForEndurance =
      100 -
      (100 - this.painThreshold) /
        (this.getStatPercentageEfficiency(STATS.ENDURANCE) / 100);

    this.painThresholdTiered = utils.limit(
      Math.ceil(painAccountedForEndurance / 25) * 25,
      0,
      100
    );

    this.painThreshold = utils.limit(this.painThreshold, 0, 100);

    const severity = 4 - this.painThresholdTiered / 25;
    if (severity > 0) {
      this.addBuff(global[`BuffPain${severity}`]);
    }
  }

  isVisible() {
    return true;
  }

  getViewRange() {
    return 2;
  }

  getNodesInVisionRange() {
    const currentNode = this.getNode();
    const nodes = {
      [currentNode.getEntityId()]: {
        distance: 1,
        angle: 0,
        angles: [0, Infinity]
      }
    };
    const viewRange = this.getViewRange();

    let check = Object.keys(nodes).map(nodeId => Entity.getById(nodeId));

    const lineDistanceCache = {};
    const getLineDistance = node => {
      if (!lineDistanceCache[node.getEntityId()]) {
        lineDistanceCache[node.getEntityId()] = Math.sqrt(
          Math.pow(currentNode.x - node.x, 2) +
            Math.pow(currentNode.y - node.y, 2)
        );
      }
      return lineDistanceCache[node.getEntityId()];
    };
    const getAngle = node => {
      return (
        Math.atan2(
          (Math.sqrt(3) * ((node.y - currentNode.y) / TILE_HEIGHT_RATIO)) / 2,
          node.x - currentNode.x
        ) +
        Math.PI * 4
      );
    };

    const getAngles = (angle, rangeAngles, distance) => {
      const slices = 6 * distance;
      const sliceHalfAngle = (Math.PI * 2) / slices / global.VIEW_TOLERANCE;
      return [
        Math.max(angle - sliceHalfAngle, rangeAngles[0]),
        Math.min(angle + sliceHalfAngle, rangeAngles[1])
      ];
    };

    while (check.length) {
      const next = [...check];
      check = [];

      next.forEach(node => {
        const { distance, angle, angles } = nodes[node.getEntityId()];
        node.getConnections(true).forEach(path => {
          const connected = path.getOtherNode(node);
          if (
            (node.zLevel !== connected.zLevel ||
              (angle >= angles[0] &&
                angle <= angles[1] &&
                getLineDistance(node) < getLineDistance(connected))) &&
            distance <= viewRange
          ) {
            if (!nodes[connected.getEntityId()]) {
              const connectedAngle = getAngle(connected);
              nodes[connected.getEntityId()] = {
                distance: distance + 1,
                id: connected.getEntityId(),
                angle: connectedAngle,
                angles: getAngles(connectedAngle, angles, distance)
              };

              if (this instanceof Admin || !connected.blocksVision()) {
                check.push(connected);
              }
            } else {
              const { distance, angle, angles: oldAngles } = nodes[
                connected.getEntityId()
              ];
              const extraAngles = getAngles(angle, oldAngles, distance - 1);
              nodes[connected.getEntityId()].angles = [
                Math.min(angles[0], extraAngles[0]),
                Math.max(angles[1], extraAngles[1])
              ];
            }
          }
        });
      });
    }

    return nodes;
  }

  getCurrentAction() {
    if (this.currentAction) {
      const { entityId, actionId, context } = this.currentAction;
      const entity = Action.getTarget(entityId, context, this);
      if (entity) {
        return entity.getActionById(actionId);
      }
    }
    return null;
  }

  isCurrentActionAllowedDuringCombat() {
    const currentAction = this.getCurrentAction();
    if (!currentAction) {
      return false;
    }
    return currentAction.isAllowedDuringCombat();
  }

  isTradingWith(creature) {
    return world
      .getTrades()
      .find(trade => trade.involves(creature) && trade.involves(this));
  }

  getAllTradeListingsPayload() {
    return {
      self: this.getTradeListingsPayload(this),
      others: this.getFriendlies().map(c => ({
        name: c.getName(),
        id: c.getEntityId(),
        listings: c.getTradeListingsPayload(this)
      }))
    };
  }

  considersRival() {}
  considersFriend() {}

  getTradeListingsPayload() {
    return [];
  }

  getKnownItemsPayload(creature) {
    const knownItems = this.getKnownItems();
    return Object.keys(knownItems).map(itemClass => ({
      // deadEnd: knownItems[itemClass] === ITEM_KNOWLEDGE.DEAD_END,
      ...global[itemClass].getPayload(creature)
    }));
  }

  sendError() {}
  logging(message, level) {}

  isHostile(creature) {
    return (
      creature !== this &&
      (creature.getFaction().isHostile(this.getFaction()) ||
        Duel.areDueling(creature, this))
    );
  }

  expireTimedBuffs(seconds) {
    [...this.buffs].forEach(buff => {
      if (buff.expiring(seconds)) {
        if (buff.expired() !== false) {
          this.removeBuff(buff);
        }
      }
    });
  }

  getBuff(stat) {
    this.buffEffects = this.buffEffects || {};
    return typeof this.buffEffects[stat] === "number"
      ? this.buffEffects[stat]
      : MULTIPLIER_BUFFS[stat]
      ? 100
      : 0;
  }

  static getUnknownBuffsPayload(creature) {
    return [
      {
        name: "Unknown effects",
        icon: server.getImage(
          creature,
          `/${ICONS_PATH}/creatures/checkbox_02.png`
        ),
        public: true,
        visible: true
      }
    ];
  }

  getBuffsPayload(creature) {
    const self = creature === this;
    const stackEffects = (e1, e2) => {
      const result = {};
      [
        [e1, e2],
        [e2, e1]
      ].forEach(([from, to]) => {
        Object.keys(from || {}).forEach(statLabel => {
          if (!result[statLabel]) {
            result[statLabel] = {
              ...from[statLabel],
              value: MULTIPLIER_BUFFS_BY_LABEL[statLabel] ? 100 : 0
            };
          }
          if (MULTIPLIER_BUFFS_BY_LABEL[statLabel]) {
            const value = to[statLabel] ? to[statLabel].value : 100;
            result[statLabel].value = (result[statLabel].value * value) / 100;
          } else {
            const value = to[statLabel] ? to[statLabel].value : 0;
            result[statLabel].value = result[statLabel].value + value;
          }
        });
      });
      return result;
    };

    return Object.values(
      this.buffs
        .filter(b => self || b.isVisible())
        .filter(b => !b.isHiddenBuff())
        .map(b => b.getPayload(creature, this))
        .reduce((acc, b) => {
          const key = b.name + b.icon;
          const existing = acc[key];
          if (!existing) {
            acc[key] = {
              ...b,
              stacked: b.stacks || 1,
              duration: {
                min: b.duration,
                max: b.duration
              }
            };
          } else {
            acc[key] = {
              ...existing,
              stacked: existing.stacked + (b.stacks || 1),
              level: existing.level ? existing.level + b.level : null,
              duration: {
                min: Math.min(existing.duration.min, b.duration),
                max: Math.max(existing.duration.max, b.duration)
              },
              effects: stackEffects(existing.effects, b.effects)
            };
          }
          return acc;
        }, {})
    );
  }

  getFaction() {
    if (this.faction && !(this.faction instanceof Faction)) {
      return Faction.getByName(this.faction);
    }
    return this.faction || Faction.getDefaultFaction();
  }

  getScouter(whose) {
    if (this.isInDungeon()) {
      return 10;
    }
    this.scouters = this.scouters || {};
    return this.scouters[whose.getEntityId()] || 0;
  }

  canScoutOut(creature) {
    if (creature.isInDungeon()) {
      return false;
    }
    if (this.canSeeCreatureDetails(creature) >= 7) {
      return false;
    }
    return true;
  }

  scoutOut(creature) {
    const current = Math.floor(creature.getScouter(this));
    creature.scouters[this.getEntityId()] = Math.min(current + 1, MAX_SCOUTER);
  }

  fullyScout(creature) {
    if (this.isPlayableCharacter()) {
      const current = Math.floor(creature.getScouter(this));
      creature.scouters = creature.scouters || {};
      creature.scouters[this.getEntityId()] = Math.max(current, 6);
    }
  }

  hasFeatureBadge(badge) {
    if (!this.isPlayableCharacter()) {
      return false;
    }
    return this.getPlayer().hasFeatureBadge(badge);
  }

  canSeeCreatureDetails(creature) {
    if (creature === this) {
      return 10;
    }
    const current = Math.floor(creature.getScouter(this));
    const trackingBonus = this.getSkillLevel(SKILLS.TRACKING);

    // account for terrain type
    // bonuses from scouting by the player
    // bonus from player's tracking skill
    // bonus from range
    // bonus from being in the same location

    // 0 - knows its there
    // 1 - info piece
    // 2 - hostile/friendly
    // 3-4 - info pieces
    // 5 - visible picture/name
    // 6 - visible effects

    return current + trackingBonus;
  }

  getCreatureName(creature) {
    const level = this.canSeeCreatureDetails(creature);
    if (level >= 5) {
      return creature.getName();
    }
    return "Unknown";
  }

  getCreatureDetailsInfo(creature) {
    const level = creature.canSeeCreatureDetails(this);

    let count = utils.limit(level - 1, 0, 3);
    if (level === 1) count = 1;

    const scouters = utils
      .scrambleArray(
        this.scouterMessages,
        this.getEntityId() + (creature ? creature.getEntityId() : 0)
      )
      .concat(this.fixedScouterMessages || []);

    return scouters.slice(0, count).map(scouter => ({
      name: "Tracking results",
      icon: server.getImage(creature, scouter.icon),
      category: Buff.CATEGORY_LABELS[Buff.CATEGORIES.TRACKS],
      description: scouter.textDynamic
        ? scouter.textDynamic(this)
        : scouter.text,
      public: true,
      visible: true
    }));
  }

  getSimplePayload(creature) {
    if (this.isDead()) {
      return null;
    }

    const currentAction = {
      actionId: this.currentAction && this.currentAction.actionId
    };

    const level = creature.canSeeCreatureDetails(this);
    if (level < 5) {
      let hostileStatus = {};
      let icon = `/${ICONS_PATH}/creatures/checkbox_02.png`;
      let name = "Unknown";
      if (level >= 2) {
        const isHostile = this.isHostile(creature);
        hostileStatus = {
          hostile: isHostile,
          friendly: !isHostile
        };
        icon = isHostile
          ? `/${ICONS_PATH}/creatures/checkbox_02_red.png`
          : `/${ICONS_PATH}/creatures/checkbox_02_green.png`;
        name = isHostile ? `${name} (hostile)` : `${name} (friendly)`;
      }
      return {
        id: this.getEntityId(),
        unknown: true,
        tracks: this.getCreatureDetailsInfo(creature).map(t => t.icon),
        name,
        currentAction,
        icon: server.getImage(creature, icon),
        ...hostileStatus
      };
    } else {
      const isHostile = this.isHostile(creature);
      return {
        id: this.getEntityId(),
        self: this === creature,
        name: this.getName(),
        icon: this.getIcon(creature),
        hostile: isHostile,
        friendly: !isHostile,
        dead: this.isDead(),
        isPlayer: this.isPlayableCharacter(),
        currentAction
      };
    }
  }

  getPayload(creature, connection = {}) {
    if (this.isDead()) {
      if (!program.dev || !debugOption.showCorpses) {
        return null;
      }
    }

    let resultPayload = this.getSimplePayload(creature);

    if (!resultPayload) {
      return resultPayload;
    }

    const level = creature.canSeeCreatureDetails(this);
    const buffs =
      level >= 6
        ? this.getBuffsPayload(creature)
        : Creature.getUnknownBuffsPayload(creature);
    const scouterBuffs = this.getCreatureDetailsInfo(creature);
    const currentAction = {
      ...(resultPayload.currentAction || {}),
      icon: this.getCurrentAction()
        ? this.getCurrentAction().getIcon(creature)
        : ""
    };

    if (level < 5) {
      resultPayload = {
        ...resultPayload,
        actions: this.getActionsPayloads(creature).filter(
          a => a.name === "Track"
        ),
        buffs: scouterBuffs,
        currentAction
      };
    } else {
      resultPayload = {
        ...resultPayload,
        info: this.getCreatureDetailsInfo(creature),
        // faction: this.getFaction().getName(),
        nameable: Nameable.getPublicKey(this.constructor.name),
        // threatLevel: this.getThreatLevel(),
        actions: this.getActionsPayloads(creature),
        currentAction,
        buffs: [
          ...buffs,
          ...scouterBuffs.map(b => ({
            ...b,
            secondary: true
          }))
        ]
      };
    }
    if (connection.creatureDetailsId === this.id) {
      if (level >= 7) {
        const action = this.getCurrentAction();
        resultPayload.currentAction = {
          ...resultPayload.currentAction,
          actionTargetName:
            action && action.getActionTargetName(this.getActionTarget()),
          name: action
            ? action.getName(this.getActionTarget(), this, true)
            : "",
          progress: Math.ceil(this.actionProgress)
        };
      }
    }
    return resultPayload;
  }

  static isKnownBy(creature) {
    return (
      creature.getPlayer() &&
      creature.getPlayer().knowsIcon(this.prototype.icon)
    );
  }

  static factory(classCtr, props) {
    classCtr = super.factory(classCtr, props);

    const butcherable = props.butcherable;
    if (butcherable === undefined && (!props.name || props.name[0] !== "?")) {
      utils.error(`Non-butcherable creature: ${classCtr.name}`);
    }
    if (butcherable) {
      const corpseClass = utils.newClassExtending(
        `${classCtr.name}Corpse`,
        Corpse
      );
      const produces = butcherable.produces;
      const creatureIcon = props.icon || classCtr.prototype.icon;
      Item.itemFactory(corpseClass, {
        dynamicName:
          butcherable.corpseName || (() => Nameable.getName(classCtr.name)),
        nameable: butcherable.nameable,
        icon:
          butcherable.icon ||
          (creatureIcon && creatureIcon.replace(".png", "_dead.png")),
        weight: utils.totalWeight(produces),
        order: ITEMS_ORDER.CORPSE,
        butcherTime: butcherable.butcherTime || 30 * MINUTES,
        butcherTool: butcherable.toolUtility,
        butcherSkill: butcherable.skill,
        butcherSkillLevel: butcherable.butcherSkillLevel,
        butcherName:
          butcherable.butcherName ||
          (() => `Butcher ${Nameable.getName(classCtr.name)}`),
        produces
      });
      global[corpseClass.name] = corpseClass;
      props.lootTable = {
        100: {
          [corpseClass.name]: "1-1"
        }
      };
    }

    return super.factory(classCtr, props);
  }
}
Object.assign(Creature.prototype, {
  stomachSeconds: 3 * DAYS,
  attackDelay: 10 * SECONDS,
  defaultArmor: {},
  defaultWeapon: {
    name: "Prod",
    damage: {
      [DAMAGE_TYPES.BLUNT]: 1
    },
    hitChance: 10
  },
  scouterMessages: [
    {
      text: "Nothing! (please report a bug)"
    }
  ],
  scouterReduction: 0.5,
  baseHidingTime: 2 * HOURS,
  bloodPool: 100,
  damageTime: {
    [DAMAGE_TYPES.SLICE]: 6 * HOURS,
    [DAMAGE_TYPES.INTERNAL_DAMAGE]: 2 * DAYS - 2 * HOURS,
    [DAMAGE_TYPES.VENOM]: 10 * MINUTES,
    [DAMAGE_TYPES.BLUNT]: 3.5 * DAYS,
    [DAMAGE_TYPES.BURN]: 7 * DAYS - 2 * HOURS
  },
  travelSpeed: 0.3,
  stats: {
    [STATS.STRENGTH]: 50,
    [STATS.DEXTERITY]: 50,
    [STATS.ENDURANCE]: 50,
    [STATS.PERCEPTION]: 50,
    [STATS.INTELLIGENCE]: 5
  },
  thermalRange: {
    min: -50,
    max: 50
  }
});
module.exports = global.Creature = Creature;

Entity.onDestroy([`Structure`, `Resource`], entity => {
  Player.list.forEach(p => {
    if (p.creature && p.creature.occupying) {
      delete p.creature.occupying[entity.getEntityId()];
    }
  });
});
