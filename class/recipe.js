const Actionable = require("./.actionable");
const Action = require("./action");
const server = require("../singletons/server");

const recipeRegister = {};

const actions = Action.groupById([
  new Action({
    name: "Craft",
    icon: "/actions/icons8-hammer-100.png",
    context: "Recipe",
    difficulty: (recipe, creature) => recipe.getDifficultyLabel(creature),
    valid(recipe, creature) {
      // const recipe = Recipe.getRecipeById(recipeId);
      if (!creature.knowsCraftingRecipe(recipe)) {
        return false;
      }
      return true;
    },
    available(recipe, creature) {
      if (!creature.getToolLevel(recipe.getToolUtility())) {
        return "You need a " + recipe.getToolUtility() + " tool.";
      }
      const requiredBuilding = recipe.getBuilding();
      if (requiredBuilding) {
        const messages = [];
        const missingBuilding = requiredBuilding.find(
          buildingName =>
            !creature
              .getNode()
              .hasUnblockedStructure(buildingName, creature, messages)
        );
        if (missingBuilding) {
          if (messages.length) {
            return (
              `You need a ${requiredBuilding.join(", ")} to craft this item. ` +
              messages.join(". ")
            );
          }
          return `You need a ${requiredBuilding.join(
            ", "
          )} to craft this item.`;
        }
      }
      return true;
    },
    runCheck(recipe, creature) {
      const materials = recipe.getMaterials();
      const missing = {};
      if (!creature.hasMaterials(materials, missing)) {
        return `You do not have all of the required materials - missing ${global[
          Object.keys(missing).pop()
        ].getName()}`;
      }
      return true;
    },
    run(recipe, creature, seconds) {
      const efficiency = creature.getEfficiency(
        recipe.getSkill(),
        recipe.getToolUtility()
      );

      creature.actionProgress +=
        (seconds * efficiency * 100) / recipe.getBaseTime();

      const tool = creature.getTool();
      if (creature.isUsingTool(recipe.getToolUtility())) {
        tool.reduceIntegrity(0.0002);
      }

      if (creature.actionProgress >= 100) {
        let skillExperience = recipe.getBaseTime() * recipe.skillGainMultiplier;
        const skillGainMultiplier = recipe.getSkillGainDifficultyMultiplier(
          creature
        );

        const result = utils.cleanup(recipe.result);

        const successChance = recipe.getSuccessChance(creature);
        creature.actionProgress -= 100;

        const failureLevel = utils.random(1, 100) - successChance;
        utils.log(
          creature.name,
          "skill",
          creature.getSkillLevel(recipe.getSkill(), false).toFixed(2),
          "craft",
          recipe.id,
          `${successChance.toFixed(2)}%`,
          "success",
          failureLevel <= 0
        );
        creature.triggerQuestEvent("craftFinished", recipe);

        if (failureLevel <= 0) {
          // add resulting items
          Object.keys(result).forEach(itemClassName => {
            const classConstr = global[itemClassName];
            creature.addItemByType(classConstr, result[itemClassName] || 1);
          });
          creature.gainSkill(
            recipe.getSkill(),
            skillExperience,
            skillGainMultiplier
          );
          creature.gainStatsFromSkill(
            recipe.getSkill(),
            creature.getTimeSpentOnAction()
          );

          // remove the materials
          const materials = recipe.getMaterials();
          creature.spendMaterials(materials);
          recipe.triggerOnSuccess(creature);

          creature.triggerQuestEvent("craftSuccess", recipe);
        } else {
          creature.gainSkill(
            recipe.getSkill(),
            skillExperience / 2,
            skillGainMultiplier
          );
          creature.gainStatsFromSkill(
            recipe.getSkill(),
            creature.getTimeSpentOnAction()
          );

          creature.triggerQuestEvent("craftFailure", recipe);

          if (recipe.customFailureCallback) {
            recipe.customFailureCallback(
              recipe,
              creature,
              recipe.getBaseTime()
            );
          } else {
            const injuryChance = 100 - successChance;
            const accidentMessage = creature.accidentChance(
              injuryChance / 2,
              recipe.getSkill(),
              recipe.getToolUtility(),
              recipe.getBaseTime()
            );

            // remove the materials
            const originalMaterials = recipe.getMaterials();

            creature.wasteMaterials(
              `Crafting was unsuccessful. ${accidentMessage}`,
              originalMaterials,
              failureLevel,
              !!accidentMessage
            );
          }
        }

        return false;
      }
      return true;
    }
  })
]);

class Recipe extends Actionable {
  static actions() {
    return actions;
  }

  getEntityId() {
    // TODO: Bit ugly
    return this.getRecipeId();
  }

  constructor(args) {
    super(args);
    Object.assign(this, args);
    this.id = args.id;
    this.name = args.name;
    this.icon = args.icon;
    this.materials = args.materials;
    this.onSuccess = args.onSuccess;
    if (args.research && args.research.sameAsCrafting) {
      args.research.materials = {
        ...(args.research.materials || {}),
        ...args.materials
      };
    }
    this.research = args.research;
    if (!this.id) {
      throw new Error("Recipe requires ID");
    }
    if (recipeRegister[this.id]) {
      throw new Error("Recipe ID must be unique " + this.id);
    }
    recipeRegister[this.id] = this;

    if (args.autoLearn) {
      new Inspiration({
        id: args.id,
        dynamicName: args.dynamicName,
        name: args.name,
        requirements: [
          ...Object.keys(args.materials).map(materialName =>
            ResearchConcept.knownItem(materialName)
          ),
          utils.not(ResearchConcept.knownRecipe(args.id))
        ],
        onInspire: player => {
          const creature = player.getCreature();
          creature.logging(
            `You feel an inspiration! You can now make: ${this.getName().toLowerCase()}`
          );
          creature.learnCrafting(this);
        }
      });
    }
  }

  triggerOnSuccess(creature) {
    if (this.onSuccess) {
      this.onSuccess(creature);
    }
  }

  getRecipeId() {
    return this.id;
  }

  static getRecipeById(id) {
    return recipeRegister[id];
  }

  static registerRecipeAlterId(id, recipeId) {
    if (this.getRecipeById(recipeId)) {
      recipeRegister[id] = this.getRecipeById(recipeId);
    }
  }

  static getRecipes() {
    return Object.values(Object.values(recipeRegister).toObject(r => r.id));
  }

  getSuccessChance(creature) {
    return creature.getSkillSuccessChance(this.skill, this.skillLevel);
  }

  getSkillGainDifficultyMultiplier(creature) {
    return creature.getSkillGainDifficultyMultiplier(
      this.skill,
      this.skillLevel
    );
  }

  getDifficultyLabel(creature) {
    return creature.getDifficultyLabel(this.skill, this.skillLevel);
  }

  getProp(prop, clean = true) {
    let result;
    result = this[prop];
    return clean ? utils.cleanup(result) : result;
  }

  getMaterials() {
    return this.getProp("materials");
  }

  getBaseTime() {
    return this.getProp("baseTime");
  }

  getSkill() {
    return this.getProp("skill");
  }

  getToolUtility() {
    return this.getProp("toolUtility");
  }

  getBuilding() {
    return this.getProp("building", false);
  }

  getProduces() {
    return Object.keys(utils.cleanup(this.result));
  }

  getMissingBuilding(node) {
    const requiredBuilding = this.getBuilding();
    if (!requiredBuilding) {
      return null;
    }
    const missingBuilding = requiredBuilding.find(
      buildingName => !node.hasStructure(buildingName)
    );
    if (missingBuilding) {
      return missingBuilding;
    }
    return null;
  }

  getIcon(creature) {
    return server.getImage(creature, this.icon);
  }

  getPayload(creature) {
    return {
      id: this.getRecipeId(),
      name: this.getName(),
      materials: Item.getMaterialsPayload(this.getMaterials(), creature),
      tool: this.getToolUtility(),
      skill: SKILL_NAMES[this.getSkill()],
      buildings:
        this.getBuilding() && this.getBuilding().map(b => global[b].getName()),
      icon: this.getIcon(creature),
      qty: this.resultQty || Object.values(this.result).shift(), // TODO: deprecated
      result: this.getResultPayload(creature), // TODO: deprecated
      results: this.getResultsPayload(creature),
      actions: this.getActionsPayloads(creature),
      researchMaterials: this.research
        ? Item.getMaterialsPayload(this.research.materials, creature)
        : null
    };
  }

  getResultPayload(creature) {
    const className = Object.keys(utils.cleanup(this.result)).shift();
    return global[className].getPayload(creature);
  }

  getResultsPayload(creature) {
    return Object.keys(this.result).map(className => ({
      item: global[className].getPayload(creature),
      qty: this.result[className]
    }));
  }
}
Object.assign(Recipe.prototype, {
  name: "?Recipe?",
  skillGainMultiplier: 1
});
Action.registerContextualAction("Recipe", target =>
  Recipe.getRecipeById(target)
);

module.exports = global.Recipe = Recipe;
