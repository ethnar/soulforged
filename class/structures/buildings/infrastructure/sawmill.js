const Building = require("../.building");

class Sawmill extends Building {}
Building.buildingFactory(Sawmill, {
  name: "Sawmill",
  deteriorationRate: 4 * MONTHS,
  baseTime: 30 * MINUTES,
  icon: `/${ICONS_PATH}/structures/buildings/infrastructure/sgi_156.png`,
  research: {
    sameAsCrafting: true
  },
  materials: {
    IronSawBlade: 20,
    IronRod: 15,
    MahoganyCog: 12,
    LeatherRope: 20,
    HardwoodShaft: 40,
    HardwoodPlank: 50,
    HardwoodBoard: 6,
    GraniteBlock: 20,
    LimestoneBlock: 20
    // DONE
  },
  buffs: {
    [BUFFS.SKILL_SPEED[SKILLS.CARPENTRY]]: 50,
    [BUFFS.SKILLS.CARPENTRY]: 0.5
  }
});
