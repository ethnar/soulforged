const Building = require("../.building");

class CookingStation extends Building {}
Building.buildingFactory(CookingStation, {
  name: "Cooking Station",
  deteriorationRate: 4 * MONTHS,
  baseTime: 20 * MINUTES,
  icon: `/${ICONS_PATH}/structures/buildings/infrastructure/sgi_77.png`,
  research: {
    sameAsCrafting: true
  },
  materials: {
    ClayPot: 40,
    Cauldron: 2,
    HardwoodPlank: 60,
    HardwoodShaft: 50,
    HardwoodBeam: 40,
    IronMetalRing: 50,
    Firewood: 40,
    LinenCloth: 15
    // DONE
  },
  buffs: {
    [BUFFS.SKILL_SPEED[SKILLS.COOKING]]: 50,
    [BUFFS.SKILLS.COOKING]: 0.5
  }
});
