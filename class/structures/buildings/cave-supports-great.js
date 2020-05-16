const Building = require("./.building");
require("./cave-supports");

class CaveSupportsGreat extends CaveSupports {
  static getDescription() {
    return `A massive structure that helps avoid cave-ins.`;
  }

  earthQuakeDamage() {}
}
Building.buildingFactory(CaveSupportsGreat, {
  name: "Cave Pillars",
  deteriorationRate: 24 * MONTHS,
  baseTime: 1.2 * HOURS,
  icon: `/${ICONS_PATH}/structures/buildings/sgi_89_grey.png`,
  toolUtility: TOOL_UTILS.CARVING,
  noDemolish: true,
  research: {
    sameAsCrafting: true,
    materials: {
      TabletWriting14338: 0,
      ResearchConcept_ImprovedMiningSafety: 0
    }
  },
  materials: {
    HardwoodBeam: 10,
    GraniteBlock: 60,
    TrueIronNails: 15
  },
  placement: [
    NODE_TYPES.UNDERGROUND_CAVE,
    NODE_TYPES.UNDERGROUND_FLOOR,
    NODE_TYPES.UNDERGROUND_LAVA_PLAINS,
    NODE_TYPES.UNDERGROUND_VOLCANO
  ],
  obsoletes: ["CaveSupportsBetter", "CaveSupports"]
});

module.exports = global.CaveSupportsGreat = CaveSupportsGreat;
