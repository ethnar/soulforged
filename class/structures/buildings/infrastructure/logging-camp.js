const Building = require("../.building");

class LoggingCamp extends Building {}
Building.buildingFactory(LoggingCamp, {
  name: "LoggingCamp",
  deteriorationRate: 4 * MONTHS,
  baseTime: 20 * MINUTES,
  icon: `/${ICONS_PATH}/structures/buildings/infrastructure/sgi_128.png`,
  research: {
    sameAsCrafting: true
  },
  materials: {
    IronAxe: 20,
    AcaciaWood: 10,
    PoplarWood: 30,
    SpruceWood: 30,
    HardwoodShaft: 15,
    HardwoodPlank: 50,
    TrueIronNails: 50,
    WoodenCart: 3
    // DONE
  },
  buffs: {
    [BUFFS.SKILL_SPEED[SKILLS.WOODCUTTING]]: 75
  }
});
