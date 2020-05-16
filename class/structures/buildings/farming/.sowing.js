const Building = require("../.building");

class Sowing extends Building {
  constructor(args) {
    super(args);
  }

  static getFarmland(node) {
    return node.getBuildings().find(b => b instanceof Farmland);
  }

  static getFarmingProps() {
    return this.prototype.farming;
  }

  static availabilityCheck(plan, creature) {
    const farmland = Sowing.getFarmland(creature.getNode());
    const construct = plan.getConstructor();

    if (farmland && !farmland.hasPlotSpace()) {
      return "There is no more suitable space for farming here.";
    }

    const materials = plan.getMaterials();
    const hasAllMaterials = creature.hasMaterials(materials);
    if (!hasAllMaterials) {
      return "You need all of the materials to do that";
    }

    if (!construct.prototype.placement.includes(creature.getNode().getType())) {
      return `You cannot ${plan
        .getConstructor()
        .prototype.getName()
        .toLowerCase()} in this location`;
    }

    return true;
  }

  static onErected(plan, creature, self) {
    const node = creature.getNode();
    const construct = plan.getConstructor();

    const materials = self.remainingMaterialsNeeded;
    const skill = SKILLS.FARMING;
    const skillLevel = construct.prototype.skillLevel;
    const chance = creature.getSkillSuccessChance(skill, skillLevel);

    let skillExperience = plan.getBaseTime();

    const failureLevel = utils.random(1, 100) - chance;
    if (failureLevel <= 0) {
      let farmland = Sowing.getFarmland(node);

      if (!farmland) {
        farmland = new Farmland();
        node.addStructure(farmland);
      }

      farmland.addPlot(construct);

      creature.spendMaterials(materials);

      creature.gainSkill(
        skill,
        skillExperience,
        creature.getSkillGainDifficultyMultiplier(skill, skillLevel)
      );
      creature.gainStatsFromSkill(skill, creature.getTimeSpentOnAction());
    } else {
      creature.wasteMaterials(
        `Sowing was unsuccessful.`,
        materials,
        failureLevel
      );
      creature.gainSkill(
        skill,
        skillExperience / 2,
        creature.getSkillGainDifficultyMultiplier(skill, skillLevel)
      );
      creature.gainStatsFromSkill(skill, creature.getTimeSpentOnAction());
    }

    self.destroy();

    return true;
  }

  static allowSowPlant({
    skillLevel,
    plant,
    sowAmount,
    producesRange,
    growthTime,
    gatherTime,
    placement
  }) {
    const className = `Sow${plant}`;
    const itemClass = utils.newClassExtending(className, Sowing);
    const building = Building.buildingFactory(itemClass, {
      dynamicName: () => `Sow ${global[plant].getName()}`,
      icon: global[plant].prototype.icon,
      skillLevel,
      research: {
        materials: {
          [plant]: 0
        }
      },
      placement,
      farming: {
        skillLevel,
        produces: plant,
        producesRange,
        growthTime,
        gatherTime
      },
      materials: {
        [plant]: sowAmount
      },
      getAnythingPotentiallyBlocking(node) {
        return node.getCompleteStructures().find(s => s instanceof Farmland);
      }
    });
    Plan.getPlanById(className).defaultRepetitions = 1;
    return building;
  }
}
Building.buildingFactory(Sowing, {
  name: "?Sowing?",
  baseTime: 1 * HOURS,
  noRuins: true,
  skill: SKILLS.FARMING,
  skillLevel: -1,
  erectLabel: "Sow",
  placement: [NODE_TYPES.PLAINS],
  toolUtility: TOOL_UTILS.HOE
});
module.exports = global.Sowing = Sowing;
