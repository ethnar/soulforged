const Building = require("./.building");
require("./cave-supports");

class CaveSupportsBetter extends CaveSupports {
  static getDescription() {
    return `A sturdy structure that helps avoid cave-ins.`;
  }

  earthQuakeDamage() {}
}
Building.buildingFactory(CaveSupportsBetter, {
  name: "Heavy Support Beams",
  deteriorationRate: 6 * MONTHS,
  baseTime: 40 * MINUTES,
  icon: `/${ICONS_PATH}/structures/buildings/sgi_89_dark.png`,
  toolUtility: TOOL_UTILS.HAMMER,
  noDemolish: true,
  research: {
    sameAsCrafting: true,
    materials: {
      ResearchConcept_ImprovedMiningSafety: 0
    }
  },
  materials: {
    IronNails: 15,
    HardwoodBeam: 25
  },
  placement: [
    NODE_TYPES.UNDERGROUND_CAVE,
    NODE_TYPES.UNDERGROUND_FLOOR,
    NODE_TYPES.UNDERGROUND_LAVA_PLAINS,
    NODE_TYPES.UNDERGROUND_VOLCANO
  ],
  obsoletes: ["CaveSupports"]
});

new ResearchConcept({
  name: "Improved Mining Safety",
  className: "ResearchConcept_ImprovedMiningSafety",
  tier: ResearchConcept.TIERS.PARCHMENT,
  requirements: [
    utils.and(
      ResearchConcept.knownItem("HardwoodBeam"),
      ResearchConcept.knownRecipe("CaveSupports"),
      ResearchConcept.hasSkillLevel(SKILLS.MINING, 4),
      ResearchConcept.hasSkillLevel(SKILLS.SPELUNKING, 4)
    )
  ]
});

module.exports = global.CaveSupportsBetter = CaveSupportsBetter;
