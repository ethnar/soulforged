const Building = require("../.building");

class Windmill extends Building {}
Building.buildingFactory(Windmill, {
  name: "Windmill",
  deteriorationRate: 8 * MONTHS,
  baseTime: 30 * MINUTES,
  icon: `/${ICONS_PATH}/structures/buildings/windmill-icon.png`,
  research: {
    materials: {
      LinenCloth: 0,
      WoodenBeam: 0,
      HardwoodFrame: 0,
      HardwoodShaft: 0,
      MahoganyCog: 0,
      ResearchConcept_Milling2: 0
    }
  },
  materials: {
    LinenCloth: 60,
    WoodenBeam: 30,
    HardwoodFrame: 6,
    HardwoodShaft: 30,
    MahoganyCog: 10
  },
  buffs: {
    [BUFFS.TOOL_UTILITY.MILLING]: 400
    // [BUFFS.SKILL_SPEED[SKILLS.WOODCUTTING]]: 400
  },
  placement: [
    NODE_TYPES.HILLS_DIRT,
    NODE_TYPES.HILLS_REDGRASS,
    NODE_TYPES.HILLS_GRASS,
    NODE_TYPES.HILLS_SNOW,
    NODE_TYPES.HILLS_COLD
  ],
  mapGraphic: (node, structure, homeLevel) => ({
    3: `tiles/custom/windmill.png`
  })
});

new ResearchConcept({
  name: "Improved milling",
  className: "ResearchConcept_Milling2",
  tier: ResearchConcept.TIERS.CLAY,
  requirements: [
    ResearchConcept.knownItem("LinenCloth"),
    ResearchConcept.knownItem("WoodenBoard"),
    ResearchConcept.knownItem("MortarPestle"),
    utils.or(
      ResearchConcept.knownItem("MahoganyCog"),
      ResearchConcept.knownItem("MahoganyWood")
    )
  ]
});

module.exports = global.Windmill = Windmill;
