const Entity = require("../.entity");
const server = require("../../singletons/server");
const InformationProvider = require("../../singletons/information-provider");
const assaultAction = require("../actions/assault");
const occupyAction = require("../actions/occupy");

global.inscriptionActions = Action.groupById([
  new Action({
    name: "Read inscription",
    icon: "/actions/icons8-parchment-100.png",
    notification: false,
    repeatable: false,
    quickAction: true,
    notAllowedInCombat: true,
    valid(entity, creature) {
      if (!entity.getPlotText()) {
        return false;
      }
      return true;
    },
    runCheck(entity, creature) {
      const blocked = creature.accessErrorMessage(entity);
      if (blocked) return blocked;
      if (
        entity instanceof Structure &&
        entity.getNode() !== creature.getNode()
      ) {
        return "You must be in the same location to read the inscription";
      }
      if (
        entity instanceof Item &&
        entity.getContainer() !== creature &&
        entity.getContainer() !== creature.getNode() &&
        entity.getContainer() !== creature.getHome()
      ) {
        return "You are clearly doing something dodgy";
      }
      if (entity.onRead) {
        entity.onRead(creature);
      }
      // order matters, so player first acquires the quest
      creature.triggerQuestEvent("readInscription", entity);
      return true;
    },
    ...utils.jsAction("/js/actions/read")
  }),
  new Action({
    name: "Copy inscription",
    icon: "/actions/icons8-parchment-100-copy.png",
    repeatable: true,
    valid(entity, creature) {
      if (!entity.getPlotText()) {
        return false;
      }
      if (!creature.knowsItem("ClayTablet")) {
        return false;
      }
      if (
        !TabletWriting.getInscriptionCopyClass(entity.sourceId || entity.id)
      ) {
        return false;
      }
      return true;
    },
    available(entity, creature) {
      const blocked = creature.accessErrorMessage(entity);
      if (blocked) return blocked;
      if (!creature.getToolLevel(TOOL_UTILS.ETCHING)) {
        return "You need a " + TOOL_UTILS.ETCHING + " tool.";
      }
      return true;
    },
    runCheck(entity, creature) {
      if (
        entity instanceof Structure &&
        entity.getNode() !== creature.getNode()
      ) {
        return "You must be in the same location to copy the inscription";
      }
      if (entity instanceof Item && entity.getContainer() !== creature) {
        return "You must hold the item to copy the inscription";
      }
      if (!creature.hasItemType("ClayTablet")) {
        return "You need a clay tablet to do this.";
      }
      return true;
    },
    run(entity, creature, seconds) {
      if (
        creature.progressingAction(
          seconds,
          4 * MINUTES,
          SKILLS.CRAFTING,
          TOOL_UTILS.ETCHING,
          0.0002
        )
      ) {
        let skillExperience = 4 * MINUTES;

        creature.gainSkill(
          SKILLS.CRAFTING,
          skillExperience,
          creature.getSkillGainDifficultyMultiplier(SKILLS.CRAFTING, -1)
        );
        creature.gainStatsFromSkill(
          SKILLS.CRAFTING,
          creature.getTimeSpentOnAction()
        );
        const tabletClass = TabletWriting.getInscriptionCopyClass(
          entity.sourceId || entity.id
        );
        creature.addItem(new tabletClass());
        creature.reStackItems();

        creature.spendMaterials({
          ClayTablet: 1
        });

        if (entity instanceof Item) {
          creature.actionOnSimilarItem(entity);
        }

        return false;
      }

      return true;
    }
  })
]);

const actions = Action.groupById([assaultAction, occupyAction]);

class Structure extends Entity {
  getPlotText() {
    return this.plotText;
  }
  getPlotLanguage() {
    return this.plotLanguage;
  }

  static actions() {
    return { ...inscriptionActions, ...actions };
  }

  static getHomeLevel() {
    return this.prototype.homeLevel;
  }

  getHomeLevel() {
    return this.homeLevel;
  }

  constructor(args) {
    super(args);
    this.integrity = 100;
  }

  isHome() {
    return !!this.getHomeLevel();
  }

  isComplete() {
    return true;
  }

  setNode(node) {
    this.node = node;
  }

  getNode() {
    return this.node;
  }

  getNeededMaterials() {
    return utils.cleanup(this.remainingMaterialsNeeded);
  }

  setOwner(creature) {
    if (!creature) {
      this.playerOwner = null;
      this.owner = null;
      return;
    }
    if (creature.isPlayableCharacter()) {
      this.playerOwner = creature.getPlayer();
    } else {
      this.owner = creature;
    }
  }

  getOwner() {
    if (this.playerOwner) {
      return this.playerOwner.getCreature();
    }
    if (this.owner && this.owner.isDead()) {
      this.setOwner(null);
    }
    return this.owner;
  }

  getName(creature) {
    let postfix = "";
    if (this.getOwner() && (this.getHomeLevel() || this.uniquePerPlayer)) {
      if (creature === this.getOwner()) postfix = " (Yours)";
      else postfix = ` (${this.getOwner().getName()})`;
    }
    // if (creature &&
    //     creature === this.getOwner() && (
    //         this.getHomeLevel() ||
    //         this.uniquePerPlayer
    //     )
    // ) {
    //     postfix = ' (Yours)';
    // }
    return super.getName() + postfix;
  }

  getBuffs() {
    return this.buffs || {};
  }

  getBuff(stat, creature) {
    return this.getBuffs(creature)[stat] || 0;
  }

  cycle(seconds) {}

  addItem(item) {
    this.items = this.items || [];
    this.items.push(item);
    item.setContainer(this);
  }

  addItemByType(itemType, qty = 1) {
    this.items = this.items || [];
    for (let i = 0; i < qty; i += 1) {
      const existing =
        itemType.prototype.stackable &&
        this.items.find(i => i.constructor === itemType && i.integrity === 100);
      if (existing) {
        existing.qty += 1;
      } else {
        this.addItem(new itemType());
      }
    }
  }

  getItems() {
    this.items = this.items || [];
    return this.items;
  }

  getItemsByType(itemClass) {
    return this.items.filter(i => i instanceof itemClass);
  }

  receiveItem(received) {
    this.addItem(received);
    this.reStackItems();
  }

  removeItem(item) {
    const idx = this.items.indexOf(item);
    this.items.splice(idx, 1);
    item.setContainer(null);
  }

  reStackItems() {
    this.items = utils.reStackItems(this.items);
  }

  destroy() {
    [...(this.items || [])].forEach(item => {
      this.removeItem(item);
      this.getNode().addItem(item);
    });
    this.getNode().removeStructure(this);
    this.getNode().reStackItems();
    super.destroy();
  }

  getSimplePayload(creature, node) {
    if (this.unlisted) {
      return null;
    }
    if (
      this.hiddenStructure &&
      this.hiddenStructure > creature.getStatValue(STATS.PERCEPTION)
    ) {
      return null;
    }
    return {
      id: this.getEntityId(),
      name: this.getName(creature, node),
      buildingCode: this.constructor.name,
      occupyLevel: creature.getOccupyLevel(this),
      complete: this.isComplete(),
      order: this.order,
      icon: this.getIcon(creature)
    };
  }

  getPayload(creature, node) {
    const base = this.getSimplePayload(creature, node);
    if (!base) {
      return null;
    }
    return {
      ...base,
      isWriteable:
        this.isWriteable && this.getOwner() === creature && this.isComplete(),
      actions: this.getActionsPayloads(creature),
      blockedBy: creature.getBlockingCreatures(this).map(c => c.getEntityId()),
      roomPlacement: this.roomPlacement,
      listedItems: {
        "Repair materials needed": Item.getMaterialsPayload(
          this.getNeededMaterials(),
          creature
        )
      }
    };
  }

  static getPayload(creature) {
    return {
      name: this.getName(),
      icon: this.getIcon(creature),
      buildingCode: this.name
    };
  }
}
Object.assign(Structure.prototype, {
  order: 50
});
module.exports = global.Structure = Structure;

InformationProvider({
  info: "structureDescription",
  provider: (player, { buildingCode, buildingId }) => {
    const creature = player.getCreature();

    if (
      buildingId &&
      Entity.getById(buildingId) &&
      creature.seesNode(Entity.getById(buildingId).getNode()) &&
      Entity.getById(buildingId).getDescription &&
      Entity.getById(buildingId).getDescription()
    ) {
      return Entity.getById(buildingId).getDescription();
    }

    const buildingClass = global[buildingCode];
    const plan = Plan.getPlanById(buildingCode);

    if (!buildingClass) {
      return null;
    }
    if (
      (!plan || !creature.knowsBuilding(plan)) &&
      !player.knowsIcon(buildingClass.prototype.icon)
    ) {
      return null;
    }
    if (buildingClass.getDescription) {
      return buildingClass.getDescription();
    }

    return null;
  }
});

server.registerHandler("writeOnStructure", (params, player, connection) => {
  const target = Entity.getById(params.structureId);
  const creature = player.getCreature();
  if (creature.noControlCheck()) {
    return;
  }

  // target must be a structure
  // player must be in the same location
  // the structure must be writeable
  // the structure must belong to player

  if (!target || !(target instanceof Structure)) {
    return false;
  }

  if (target.getNode() !== creature.getNode()) {
    return false;
  }

  if (!target.isWriteable) {
    return false;
  }

  if (!target.isComplete()) {
    return false;
  }

  if (target.getOwner() !== creature) {
    return false;
  }

  if (params.plotText > 250) {
    return false;
  }

  target.plotText = utils.htmlEncode(params.plotText);

  return true;
});

InformationProvider({
  info: "read-plot-text",
  provider: (player, entityId) => {
    const entity = Entity.getById(entityId);
    const creature = player.getCreature();

    const action = entity.getActionById("Read inscription");
    if (!action) {
      return "Inaccessible";
    }
    if (creature.hasFightingEnemies()) {
      return {
        error: "Cannot read notes while enemies are attacking you."
      };
    }
    const runCheckResult = action.getRunCheck(entity, creature);
    if (runCheckResult !== true) {
      creature.logging(runCheckResult, LOGGING.IMMEDIATE_ERROR);
      return null;
    }

    let decrypted;
    let encrypted;
    if (entity.getPlotLanguage()) {
      encrypted = player.getEncryptedText(
        entity.getPlotLanguage(),
        entity.getPlotText()
      );
      decrypted = player.getInterpretation(
        entity.getPlotLanguage(),
        entity.getPlotText()
      );
    } else {
      decrypted = entity.getPlotText();
    }

    return {
      font: LANGUAGE_FONTS[entity.getPlotLanguage()],
      decrypted,
      encrypted
    };
  }
});
