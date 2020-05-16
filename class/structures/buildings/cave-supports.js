const Building = require("./.building");

class CaveSupports extends Building {
  static getDescription() {
    return `A basic structure that helps avoid cave-ins.`;
  }

  earthQuakeDamage() {}
}
Building.buildingFactory(CaveSupports, {
  name: "Support Beams",
  deteriorationRate: 3 * MONTHS,
  baseTime: 15 * MINUTES,
  icon: `/${ICONS_PATH}/structures/buildings/sgi_89_light.png`,
  toolUtility: TOOL_UTILS.HAMMER,
  noDemolish: true,
  research: {
    sameAsCrafting: true,
    materials: {
      ResearchConcept_MiningSafety: 0
    }
  },
  materials: {
    IronNails: 15,
    WoodenBeam: 25
  },
  placement: [
    NODE_TYPES.UNDERGROUND_CAVE,
    NODE_TYPES.UNDERGROUND_FLOOR,
    NODE_TYPES.UNDERGROUND_LAVA_PLAINS,
    NODE_TYPES.UNDERGROUND_VOLCANO
  ]
});

new ResearchConcept({
  name: "Mining Safety",
  className: "ResearchConcept_MiningSafety",
  tier: ResearchConcept.TIERS.PARCHMENT,
  requirements: [
    utils.and(
      ResearchConcept.knownItem("WoodenBeam"),
      ResearchConcept.knowsTerrain(NODE_TYPES.UNDERGROUND_WALL),
      ResearchConcept.knowsTerrain(NODE_TYPES.UNDERGROUND_CAVE),
      ResearchConcept.knowsTerrain(NODE_TYPES.UNDERGROUND_FLOOR),
      ResearchConcept.knowsTerrain(NODE_TYPES.UNDERGROUND_BEDROCK),
      ResearchConcept.hasSkillLevel(SKILLS.MINING, 1)
    )
  ]
});

module.exports = global.CaveSupports = CaveSupports;
