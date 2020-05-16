const Building = require("./.building");

class Mint extends Building {}
Building.buildingFactory(Mint, {
  name: "Mint",
  deteriorationRate: 8 * MONTHS,
  baseTime: 40 * MINUTES,
  icon: `/${ICONS_PATH}/structures/buildings/sgi_87.png`,
  toolUtility: TOOL_UTILS.HAMMER,
  research: {
    materials: {
      LimestoneBlock: 0,
      LeadIngot: 0,
      HardwoodBeam: 0,
      HardwoodPlank: 0,
      ResearchConcept_Trading: 0
    }
  },
  materials: {
    LimestoneBlock: 20,
    LeadIngot: 15,
    HardwoodBeam: 16,
    HardwoodPlank: 40
  }
});

new ResearchConcept({
  name: "Currency",
  className: "ResearchConcept_Trading",
  tier: ResearchConcept.TIERS.PARCHMENT,
  requirements: [
    utils.and(
      ResearchConcept.knownItemsCountAtLeast(100),
      ResearchConcept.knownItem("LeadIngot"),
      utils.or(
        ResearchConcept.knownItem("MeltedBronze"),
        ResearchConcept.knownItem("MeltedIron")
      )
    )
  ]
});

module.exports = global.Mint = Mint;
