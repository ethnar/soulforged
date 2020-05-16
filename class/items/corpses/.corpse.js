const ExpirableItem = require("../.expirable-item");

const actions = {};

class Corpse extends ExpirableItem {
  static actions() {
    return { ...actions, ...Item.actions() };
  }

  getName() {
    return `${super.getName()} (corpse)`;
  }

  static onClassExtends(classDef) {
    new Recipe({
      id: `Butcher_${classDef.name}`,
      dynamicName: classDef.prototype.butcherName,
      icon: `/${ICONS_PATH}/items/corpses/gray_06.png`,
      result: classDef.prototype.produces,
      autoLearn: true,
      materials: {
        [classDef.name]: 1
      },
      skill: classDef.prototype.butcherSkill || SKILLS.DOCTORING,
      skillLevel: classDef.prototype.butcherSkillLevel || 0,
      toolUtility: classDef.prototype.butcherTool || TOOL_UTILS.CUTTING,
      baseTime: classDef.prototype.butcherTime,
      resultQty: 1,
      customFailureCallback: Corpse.customFailureCallback
    });
  }

  static customFailureCallback(recipe, creature, baseTime) {
    // spend the corpse
    const materials = recipe.getMaterials();
    creature.spendMaterials(materials);

    const successChance = recipe.getSuccessChance(creature);
    const failureLevel = utils.random(1, 100) - successChance;

    // apply injury
    const injuryChance = 100 - successChance;
    const accidentMessage = creature.accidentChance(
      injuryChance / 2,
      recipe.getSkill(),
      recipe.getToolUtility(),
      baseTime
    );

    // add all of the results
    const result = recipe.result;
    Object.keys(result).forEach(itemClassName => {
      const classConstr = global[itemClassName];
      creature.addItemByType(classConstr, result[itemClassName] || 1);
    });

    // and now remove some
    creature.wasteMaterials(
      `Butchering didn't go very well. ${accidentMessage}`,
      result,
      failureLevel,
      !!accidentMessage,
      !accidentMessage
    );
  }
}
Object.assign(Corpse.prototype, {
  name: "?Corpse?",
  weight: 50,
  expiresIn: 3 * DAYS,
  order: ITEMS_ORDER.CORPSE,
  toolUtility: TOOL_UTILS.CUTTING
});

module.exports = global.Corpse = Corpse;
