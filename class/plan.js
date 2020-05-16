const Actionable = require("./.actionable");
const Action = require("./action");

const actions = Action.groupById([
  new Action({
    name: "Erect & Construct",
    icon: "/actions/icons8-home-100.png",
    context: "Plan",
    defaultRepetitions: plan => plan.defaultRepetitions || 1,
    dynamicLabel: (plan, creature) => {
      const constructionClass = plan.getConstructor();
      const { erectLabel } = constructionClass.prototype;
      return erectLabel ? erectLabel : "Build";
    },
    difficulty(plan, creature) {
      const constructionClass = plan.getConstructor();
      const { skill, skillLevel } = constructionClass.prototype;
      if (skill && typeof skillLevel === "number") {
        return creature.getDifficultyLabel(skill, skillLevel);
      }
    },
    valid(plan, creature) {
      if (!creature.knowsBuilding(plan)) {
        return false;
      }
      return true;
    },
    available(plan, creature) {
      const toolUtility = plan.getConstructor().prototype.toolUtility;

      if (toolUtility && !creature.getToolLevel(toolUtility)) {
        return "You need a " + toolUtility + " tool.";
      }

      if (plan.getAnythingPotentiallyBlocking) {
        const potentiallyBlocking = plan.getAnythingPotentiallyBlocking(
          creature.getNode()
        );
        if (potentiallyBlocking) {
          const blocked = creature.accessErrorMessage(potentiallyBlocking);
          if (blocked) return blocked;
        }
      }

      return true;
    },
    runCheck(plan, creature) {
      const node = creature.getNode();
      const construct = plan.getConstructor();

      if (construct && construct.availabilityCheck) {
        const secondaryCheck = construct.availabilityCheck(plan, creature);
        if (secondaryCheck !== true) {
          return secondaryCheck;
        }
      }

      if (
        !construct.getHomeLevel() &&
        node
          .getAllStructures()
          .some(
            structure =>
              structure.constructor === construct &&
              (!construct.prototype.uniquePerPlayer ||
                structure.getOwner() === creature)
          )
      ) {
        return "This building is already present in this location";
      }

      if (
        node
          .getCompleteStructures()
          .some(
            structure =>
              structure.obsoletes &&
              structure.obsoletes.includes(construct.name)
          )
      ) {
        return "There is a better building already present in this location";
      }

      if (
        node.buildingsDisallowed ||
        !construct.prototype.placement.includes(creature.getNode().getType())
      ) {
        return `You cannot build ${plan
          .getConstructor()
          .getName()} in this location`;
      }

      const materials = plan.getMaterials();
      const availableMaterials = creature.getMaterials(materials);
      const anyAvailable = Object.keys(availableMaterials).find(material => {
        return (
          availableMaterials[material] && availableMaterials[material].length
        );
      });
      if (!anyAvailable) {
        return "You do not have any of the required materials";
      }
      return true;
    },
    run(plan, creature, seconds) {
      const skill = plan.getConstructor().prototype.skill;
      const skillLevel = plan.getConstructor().prototype.skillLevel;
      const toolUtility = plan.getConstructor().prototype.toolUtility;

      const multiplier = skill ? 1 : creature.getBuff(BUFFS.BUILDING) / 100;
      const efficiency = creature.getEfficiency(
        skill,
        toolUtility,
        true,
        multiplier
      );

      creature.actionProgress +=
        (seconds * efficiency * 100) / plan.getBaseTime();

      const tool = creature.getTool();
      if (creature.isUsingTool(toolUtility)) {
        tool.reduceIntegrity(0.0002);
      }

      if (creature.actionProgress >= 100) {
        if (skill) {
          creature.gainSkill(
            skill,
            plan.getBaseTime() * plan.skillGainMultiplier,
            creature.getSkillGainDifficultyMultiplier(skill, skillLevel)
          );
          creature.gainStatsFromSkill(skill, creature.getTimeSpentOnAction());
        }

        creature.actionProgress -= 100;

        // add resulting items
        const construct = plan.getConstructor();
        const structure = new construct();
        if (structure.isHome()) {
          structure.setOwner(creature);
        }
        creature.getNode().addStructure(structure);

        if (construct.onErected) {
          if (construct.onErected(plan, creature, structure)) {
            return false;
          }
        }

        // remove the materials
        const materials = plan.getMaterials();
        const availableMaterials = creature.getMaterials(materials);
        const materialUsed = Object.keys(availableMaterials).find(
          material => availableMaterials[material].length
        );
        availableMaterials[materialUsed].pop().useUpItem();

        // reduce materials needed
        structure.remainingMaterialsNeeded[materialUsed] -= 1;
        if (structure.remainingMaterialsNeeded[materialUsed] === 0) {
          delete structure.remainingMaterialsNeeded[materialUsed];
        }

        if (creature.currentAction.repetitions > 1 && !construct.onErected) {
          const repetitions = creature.currentAction.repetitions;
          creature.stopAction(false);
          creature.startAction(
            structure,
            structure.getActionById("Build"),
            repetitions
          );
        }

        return false;
      }
      return true;
    }
  })
]);

const planRegister = {};

class Plan extends Actionable {
  static actions() {
    return actions;
  }

  getEntityId() {
    // TODO: Ugly
    return this.getPlanId();
  }

  constructor(args) {
    super(args);
    this.id = args.id;
    this.name = args.name;
    this.dynamicName = args.dynamicName;
    this.defaultRepetitions = args.defaultRepetitions;
    if (args.materials && args.research && args.research.sameAsCrafting) {
      args.research.materials = {
        ...(args.research.materials || {}),
        ...args.materials
      };
    }
    this.research = args.research;
    this.buildClassName = args.buildClassName;
    this.getAnythingPotentiallyBlocking = args.getAnythingPotentiallyBlocking;
    if (!this.id) {
      throw new Error("Plan requires ID");
    }
    planRegister[this.id] = this;
  }

  getPlanId() {
    return this.id;
  }

  static getPlanById(id) {
    return planRegister[id];
  }

  static getPlans() {
    return Object.values(planRegister);
  }

  getSuccessChance(creature) {
    return creature.getSkillSuccessChance(this.skill, this.skillLevel);
  }

  getDifficultyLabel(creature) {
    return creature.getDifficultyLabel(this.skill, this.skillLevel);
  }

  getConstructor() {
    return global[this.buildClassName];
  }

  getMaterials() {
    return this.getConstructor().prototype.materials;
  }

  getBaseTime() {
    return this.getConstructor().prototype.baseTime;
  }

  getIcon(creature) {
    return server.getImage(creature, this.icon);
  }

  getMissingBuilding() {
    return null;
  }

  getToolUtility() {
    return this.getConstructor().prototype.toolUtility;
  }

  getPayload(creature) {
    let researchMaterials;
    if (this.buildClassName && global[this.buildClassName].prototype.research) {
      researchMaterials = Item.getMaterialsPayload(
        global[this.buildClassName].prototype.research.materials,
        creature
      );
    }
    return {
      id: this.getEntityId(),
      name: this.getName(),
      tool: this.getConstructor().prototype.toolUtility,
      skill: SKILL_NAMES[this.getConstructor().prototype.skill],
      materials: Item.getMaterialsPayload(this.getMaterials(), creature),
      icon: global[this.buildClassName].getIcon(creature),
      actions: this.getActionsPayloads(creature),
      researchMaterials,
      placement: this.getConstructor()
        .prototype.placement.filter(nodeType =>
          creature.isNodeTypeKnown(nodeType)
        )
        .map(nodeType => Node.getName(nodeType))
    };
  }
}
Object.assign(Plan.prototype, {
  name: "?Plan?",
  skillGainMultiplier: 1
});
Action.registerContextualAction("Plan", target => Plan.getPlanById(target));

module.exports = global.Plan = Plan;
