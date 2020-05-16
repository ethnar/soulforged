const Building = require("./.building");

class Forge extends Building {}
Building.buildingFactory(Forge, {
  name: "Forge",
  deteriorationRate: 8 * MONTHS,
  baseTime: 30 * MINUTES,
  icon: `/${ICONS_PATH}/structures/buildings/sgi_55.png`,
  research: {
    materials: {
      Coal: 0,
      GraniteBlock: 0,
      LimestoneBlock: 0,
      HardwoodBeam: 0,
      WoodenBoard: 0,
      ResearchConcept_Smithing: 0
    }
  },
  materials: {
    GraniteBlock: 40,
    LimestoneBlock: 30,
    HardwoodBeam: 20,
    WoodenBoard: 8
  }
});

module.exports = global.Forge = Forge;
