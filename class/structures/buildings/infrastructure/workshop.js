const Building = require("../.building");

class Workshop extends Building {}
Building.buildingFactory(Workshop, {
  name: "Workshop",
  deteriorationRate: 4 * MONTHS,
  baseTime: 30 * MINUTES,
  icon: `/${ICONS_PATH}/structures/buildings/infrastructure/sgi_24.png`,
  research: {
    sameAsCrafting: true
  },
  materials: {
    SilkCloth: 20,
    LeatherRope: 12,
    OakWood: 18,
    PineWood: 18,
    TrueIronNails: 50,
    HardwoodShaft: 40,
    HardwoodPlank: 50,
    HardwoodBoard: 6
  },
  buffs: {
    [BUFFS.SKILL_SPEED[SKILLS.CRAFTING]]: 50,
    [BUFFS.SKILLS.CRAFTING]: 1
  }
});
