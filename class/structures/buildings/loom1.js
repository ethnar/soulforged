const Building = require("./.building");

class Loom extends Building {}
Building.buildingFactory(Loom, {
  name: "Primitive Loom",
  baseTime: 10 * MINUTES,
  icon: `/${ICONS_PATH}/structures/buildings/sgi_33_discolored.png`,
  deteriorationRate: 40 * DAYS,
  research: {
    materials: {
      ResearchConcept_Weaving: 0,
      BarkRope: 0,
      WoodenShaft: 0,
      Twig: 0
    }
  },
  materials: {
    BarkRope: 30,
    WoodenShaft: 40,
    Twig: 50
  }
});
module.exports = global.Loom = Loom;

new ResearchConcept({
  name: "Weaving",
  className: "ResearchConcept_Weaving",
  tier: ResearchConcept.TIERS.CLAY,
  requirements: [
    utils.or(
      ResearchConcept.knownItem("BarkThread"),
      ResearchConcept.knownItem("LinenThread")
    )
  ]
});
