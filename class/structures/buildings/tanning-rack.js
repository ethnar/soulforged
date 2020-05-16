const Building = require("./.building");

class TanningRack extends Building {}
Building.buildingFactory(TanningRack, {
  name: "Tanning Rack",
  baseTime: 10 * MINUTES,
  icon: `/${ICONS_PATH}/structures/buildings/prehistoricicon_39_b.png`,
  deteriorationRate: 20 * DAYS,
  research: {
    materials: {
      ResearchConcept_ImproveHides: 0,
      BarkRope: 0,
      WoodenShaft: 0
    }
  },
  materials: {
    BarkRope: 40,
    WoodenShaft: 40
  }
});
module.exports = global.TanningRack = TanningRack;

new ResearchConcept({
  name: "Improve Hides",
  className: "ResearchConcept_ImproveHides",
  tier: ResearchConcept.TIERS.CLAY,
  requirements: [
    utils.or(
      ResearchConcept.knownItem("DeerHide"),
      ResearchConcept.knownItem("BearHide"),
      ResearchConcept.knownItem("WolfHide")
    )
  ]
});
