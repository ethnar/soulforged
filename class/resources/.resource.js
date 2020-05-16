const Entity = require("../.entity");
const Action = require("../action");
const assaultAction = require("../actions/assault");
const occupyAction = require("../actions/occupy");

const actions = Action.groupById([
  assaultAction,
  occupyAction,
  new Action({
    name: "Gather",
    dynamicLabel(entity, creature) {
      return entity.gatherActionLabel ? entity.gatherActionLabel : "Gather";
    },
    icon: "/actions/icons8-receive-cash-100.png",
    difficulty: (resource, creature) => resource.getDifficultyLabel(creature),
    available(entity, creature) {
      const blocked = creature.accessErrorMessage(entity);
      if (blocked) return blocked;
      if (!creature.getToolLevel(entity.toolUtility)) {
        return "You need a " + entity.toolUtility + " tool";
      }
      return true;
    },
    runCheck(entity, creature) {
      if (entity.getSize() <= 0) {
        return "There is not enough quality resource";
      }
      if (
        entity.getNode() !== creature.getNode() &&
        !entity.getNode().isConnectedTo(creature.getNode())
      ) {
        return "You need to be within immediate distance to the location to gather this resource";
      }
      return true;
    },
    run(entity, creature, seconds) {
      const efficiency = creature.getEfficiency(
        entity.skill,
        entity.toolUtility
      );

      creature.actionProgress += (seconds * efficiency * 100) / entity.baseTime;

      const tool = creature.getTool();
      if (creature.isUsingTool(entity.toolUtility)) {
        tool.reduceIntegrity(0.0002);
      }
      if (creature.actionProgress >= 100) {
        creature.actionProgress -= 100;

        let skillExperience = entity.baseTime;

        const successChance = entity.getGatherChance(creature);
        const succeeded = utils.random(1, 100) <= successChance;
        utils.log(
          creature.name,
          "skill",
          creature.getSkillLevel(entity.skill, false).toFixed(2),
          "gather",
          entity.name,
          `${successChance.toFixed(2)}%`,
          "success",
          succeeded
        );

        creature.triggerQuestEvent("gatherFinished", entity);

        if (succeeded) {
          creature.addItemByType(entity.getProduce(creature));
          entity.useUpResource(1);

          creature.gainSkill(
            entity.skill,
            skillExperience,
            entity.getSkillGainDifficultyMultiplier(creature)
          );
          creature.gainStatsFromSkill(
            entity.skill,
            creature.getTimeSpentOnAction()
          );

          creature.triggerQuestEvent("gatherSuccess", entity);
        } else {
          const injuryChance = 100 - successChance;
          const accidentMessage = creature.accidentChance(
            injuryChance / 2,
            entity.skill,
            entity.toolUtility,
            entity.baseTime
          );

          if (entity.failMessageGenerator) {
            creature.logging(
              entity.failMessageGenerator(entity, creature) +
                " " +
                accidentMessage,
              LOGGING.WARN,
              !!accidentMessage
            );
          } else {
            creature.logging(
              "Resource gathering was unsuccessful. " + accidentMessage,
              LOGGING.WARN,
              !!accidentMessage
            );
          }
          creature.gainSkill(
            entity.skill,
            skillExperience / 2,
            entity.getSkillGainDifficultyMultiplier(creature)
          );
          creature.gainStatsFromSkill(
            entity.skill,
            creature.getTimeSpentOnAction()
          );

          creature.triggerQuestEvent("gatherFailure", entity);
        }

        entity.getNode().rattleTheMonsters(creature, entity.baseTime);

        return false;
      }
      return true;
    }
  })
]);

class Resource extends Entity {
  static actions() {
    return actions;
  }

  constructor(args) {
    super(args);
    if (this.sizeRange) {
      const [from, to] = this.sizeRange;
      const size = utils.random(+from, +to);
      this.setSize(size);
    }
  }

  isType(resourceName) {
    return this instanceof global[resourceName];
  }

  setNode(node) {
    this.node = node;
  }

  getNode() {
    return this.node;
  }

  getSize() {
    return this.size;
  }

  setSize(size) {
    this.size = size;
  }

  isVisible() {
    return true;
  }

  static getSimplePayload(creature) {
    return {
      name: this.getName(),
      icon: this.getIcon(creature),
      toolNeeded: this.getToolUtility(),
      skillUsed: this.prototype.skill ? SKILL_NAMES[this.prototype.skill] : null
    };
  }

  static getPayload(creature) {
    return this.getSimplePayload(creature);
  }

  getSimplePayload(creature) {
    return {
      id: this.getEntityId(),
      sizeLevel: this.getSizeLevel(),
      occupyLevel: creature.getOccupyLevel(this),
      ...this.constructor.getSimplePayload(creature)
    };
  }

  static isKnownBy(creature) {
    const accessResQ = creature.getPlayer() && creature.getPlayer().accessResQ;
    return accessResQ && accessResQ[server.filePathToKey(this.getIconPath())];
  }

  getPayload(creature) {
    return {
      ...this.getSimplePayload(creature),
      nameable: Nameable.getPublicKey(this.constructor.name),
      blockedBy: creature.getBlockingCreatures(this).map(c => c.getEntityId()),
      actions: this.getActionsPayloads(creature)
    };
  }

  cycle(seconds) {}

  getProduce(creature, core = false) {
    if (this.produces.prototype instanceof Entity) {
      return this.produces;
    } else {
      return this.produces(creature, core, this);
    }
  }

  destroy() {
    this.getNode().removeResource(this);
    super.destroy();
  }

  static getIconPath() {
    if (this.prototype.icon) {
      return this.prototype.icon;
    }
    return this.prototype.getProduce(null, true).prototype.icon;
  }

  static getIcon(creature) {
    if (this.prototype.icon) {
      return server.getImage(creature, this.prototype.icon);
    }
    return this.prototype.getProduce(creature, true).getIcon(creature);
  }

  getIcon(creature) {
    return this.constructor.getIcon(creature);
  }

  getMaxSize() {
    return this.sizeRange[1];
  }

  getSizeLevel() {
    if (!this.sizeRange) {
      return 4;
    }
    const size = Math.max(this.getSize(), 0);
    return Math.min(Math.ceil((3 * size) / this.getMaxSize()), 3);
  }

  static getToolUtility() {
    return this.prototype.toolUtility;
  }

  getToolUtility() {
    return this.constructor.getToolUtility();
  }

  getGatherChance(creature) {
    return creature.getSkillSuccessChance(this.skill, this.skillLevel);
  }

  getSkillGainDifficultyMultiplier(creature) {
    return creature.getSkillGainDifficultyMultiplier(
      this.skill,
      this.skillLevel
    );
  }

  getDifficultyLabel(creature, modifier = 0) {
    return creature.getDifficultyLabel(this.skill, this.skillLevel + modifier);
  }

  useUpResource(reduction = 1) {
    this.size -= reduction;
    if (this.size <= 0) {
      this.destroy();
    }
  }

  static getAllResourcesTypes() {
    return utils
      .getClasses(Resource)
      .filter(proto => proto.name)
      .map(proto => proto.constructor);
  }

  static placementChancePerNodeType(nodeType) {
    return (
      (this.prototype.placement && this.prototype.placement[nodeType]) || 0
    );
  }
}
Object.assign(Resource.prototype, {
  icon: null
});

module.exports = global.Resource = Resource;
