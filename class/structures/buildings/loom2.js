const Building = require("./.building");

class BasicLoom extends Building {}
Building.buildingFactory(BasicLoom, {
  name: "Loom",
  baseTime: 30 * MINUTES,
  icon: `/${ICONS_PATH}/structures/buildings/sgi_33.png`,
  deteriorationRate: 90 * DAYS,
  research: {
    sameAsCrafting: true,
    materials: {
      ResearchConcept_ImprovedWeaving: 0
    }
  },
  materials: {
    WoodenBoard: 12,
    HardwoodShaft: 30,
    LinenCloth: 10,
    TrueIronNails: 30
  },
  buffs: {
    [BUFFS.SKILLS.TAILORING]: 0.5
  },
  obsoletes: ["Loom"]
});
module.exports = global.BasicLoom = BasicLoom;

new ResearchConcept({
  name: "Improved Weaving",
  className: "ResearchConcept_ImprovedWeaving",
  tier: ResearchConcept.TIERS.PARCHMENT,
  requirements: [
    ResearchConcept.hasSkillLevel(SKILLS.TAILORING, 4),
    ResearchConcept.knownItem("Webs")
  ]
});
