const Building = require("./.building");

class Furnace extends Building {}
Building.buildingFactory(Furnace, {
  name: "Furnace",
  deteriorationRate: 8 * MONTHS,
  baseTime: 30 * MINUTES,
  icon: `/${ICONS_PATH}/structures/buildings/sgi_120.png`,
  research: {
    materials: {
      Coal: 0,
      GraniteBlock: 0,
      WoodenBeam: 0,
      WoodenBoard: 0,
      ResearchConcept_Smelting2: 0
    }
  },
  materials: {
    GraniteBlock: 60,
    WoodenBeam: 20,
    WoodenBoard: 10
  },
  buffs: {
    [BUFFS.SKILLS.SMELTING]: 0.3
  }
});

new ResearchConcept({
  name: "High temperature smelting",
  className: "ResearchConcept_Smelting2",
  tier: ResearchConcept.TIERS.CLAY,
  requirements: [
    ResearchConcept.knownItem("Magnetite"),
    ResearchConcept.knownItem("Crucible"),
    ResearchConcept.knownItem("Coal")
  ]
});

module.exports = global.Furnace = Furnace;
