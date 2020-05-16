const inspirationRegistry = {};

const checkingRegistry = {};
class Inspiration {
  constructor(args) {
    this.id = args.id || args.name;
    this.name = args.name;
    this.icon = args.icon;
    this.tier = args.tier;
    this.requirements = args.requirements;
    this.onInspire = args.onInspire;

    inspirationRegistry[this.id] = this;
  }

  static hasSkillLevel(skill, level) {
    return creature => creature.getSkillLevel(skill) >= level;
  }

  static knownIcon(icon) {
    return creature =>
      creature.getPlayer() && creature.getPlayer().knowsIcon(icon);
  }

  static knownItemsCountAtLeast(count) {
    return creature =>
      Object.keys(utils.cleanup(creature.getKnownItems())).length > count;
  }

  static knownItem(itemClassName) {
    return creature => creature.knowsItem(itemClassName);
  }

  static knownRecipe(recipeClassName) {
    return creature =>
      creature.knowsCraftingRecipe(Recipe.getRecipeById(recipeClassName));
  }

  static knownBuildingPlan(buildingClassName) {
    return creature =>
      creature.knowsBuilding(Plan.getPlanById(buildingClassName));
  }

  static knowsTerrain(type) {
    return creature => creature.isNodeTypeKnown(type);
  }

  static soulLevel(level) {
    return creature =>
      creature.isPlayableCharacter() &&
      creature.getPlayer().getSoulLevel() >= level;
  }

  static checkForInspiration(context) {
    if (!context || checkingRegistry[context.id]) {
      return;
    }
    if (!(context instanceof Player)) {
      return;
    }
    if (!context.getCreature()) {
      return;
    }
    checkingRegistry[context.id] = true;
    context.inspirations = context.inspirations || {};
    const creature = context.getCreature();
    const potentialInspirations = Object.keys(inspirationRegistry).filter(
      k => !context.inspirations[k]
    );

    potentialInspirations.forEach(key => {
      const researchConcept = inspirationRegistry[key];

      const meetsRequirements = researchConcept.requirements.every(
        requirementCallback => requirementCallback(creature)
      );

      if (meetsRequirements) {
        researchConcept.inspire(context);
      }
    });

    checkingRegistry[context.id] = false;
  }

  inspire(context) {
    context.inspirations = context.inspirations || {};
    context.inspirations[this.name] = true;

    if (this.onInspire) {
      this.onInspire(context);
    }
  }
}

module.exports = global.Inspiration = Inspiration;
