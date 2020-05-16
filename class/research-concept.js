const Inspiration = require("./inspiration");

class ResearchConcept extends Inspiration {
  constructor(args) {
    args.id = args.id || `RC:${args.className}`;

    super(args);

    const props = this.getTierProps();

    this.name = args.name;
    this.dynamicName = args.dynamicName;
    this.className = args.className;
    this.itemClass = utils.newClassExtending(this.className, Item);

    let itemName;
    if (this.dynamicName) {
      itemName = {
        dynamicName: () => `Research Concept: ${this.dynamicName()}`
      };
    } else {
      itemName = {
        name: `Research Concept: ${this.name}`
      };
    }

    this.requirements = [
      ...this.requirements,
      ResearchConcept.knownItem(props.material.name)
    ];
    Item.itemFactory(this.itemClass, {
      ...itemName,
      order: ITEMS_ORDER.RESEARCH_CONCEPTS,
      weight: props.weight,
      icon: props.icon,
      crafting: {
        ...itemName,
        materials: {
          [props.material.name]: 1
        },
        toolUtility: props.toolUtility,
        skill: SKILLS.CRAFTING,
        baseTime: props.time,
        level: props.level
      }
    });

    this.onInspire = ResearchConcept.onInspire;
  }

  getTierProps() {
    // circular deps
    require("./items/materials/clay-tablet");
    require("./items/materials/parchment");
    switch (this.tier) {
      case ResearchConcept.TIERS.PARCHMENT:
        return {
          icon: `/${ICONS_PATH}/items/materials/pt_b_09_rc.png`,
          toolUtility: TOOL_UTILS.WRITING_PARCHMENT,
          material: Parchment,
          weight: Parchment.prototype.weight,
          time: 2 * MINUTES,
          level: 2
        };
      case ResearchConcept.TIERS.CLAY:
        return {
          icon: `/${ICONS_PATH}/prehistoricicon_44_b_text.png`,
          toolUtility: TOOL_UTILS.ETCHING,
          material: ClayTablet,
          weight: ClayTablet.prototype.weight,
          time: 2 * MINUTES,
          level: 1
        };
    }
  }

  static onInspire(player) {
    const recipe = Recipe.getRecipeById(this.itemClass.name);
    const creature = player.getCreature();
    if (!creature.knowsCraftingRecipe(recipe)) {
      creature.logging(
        "You feel an inspiration! You can now create a writing of a concept to use for research.",
        LOGGING.GOOD
      );
      creature.learnCrafting(recipe);
    }
  }
}

ResearchConcept.TIERS = {
  CLAY: 1,
  PARCHMENT: 2
};

module.exports = global.ResearchConcept = ResearchConcept;
