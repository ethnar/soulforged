const Building = require("../.building");

class MiningCamp extends Building {}
Building.buildingFactory(MiningCamp, {
  name: "MiningCamp",
  deteriorationRate: 4 * MONTHS,
  baseTime: 10 * MINUTES,
  icon: `/${ICONS_PATH}/structures/buildings/infrastructure/sgi_90.png`,
  research: {
    sameAsCrafting: true
  },
  materials: {
    IronPick: 10,
    Limestone: 30,
    LeadRod: 15,
    Granite: 30,
    HardwoodShaft: 15,
    HardwoodPlank: 50,
    TrueIronNails: 30,
    WoodenCart: 1
  },
  buffs: {
    [BUFFS.SKILL_SPEED[SKILLS.MINING]]: 75
  }
});
