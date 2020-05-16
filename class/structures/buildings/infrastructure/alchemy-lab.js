const Building = require("../.building");

class AlchemyLab extends Building {}
Building.buildingFactory(AlchemyLab, {
  name: "Alchemy Hut",
  deteriorationRate: 4 * MONTHS,
  baseTime: 30 * MINUTES,
  icon: `/${ICONS_PATH}/structures/buildings/infrastructure/sgi_28.png`,
  research: {
    sameAsCrafting: true
  },
  materials: {
    GlassFlask: 30,
    ClayFlask: 30,
    HardwoodFrame: 12,
    HardwoodShaft: 30,
    HardwoodPlank: 30,
    WoodenBoard: 8,
    TrueIronNails: 40,
    Thatch: 15
    // DONE
  },
  buffs: {
    [BUFFS.SKILL_SPEED[SKILLS.ALCHEMY]]: 70,
    [BUFFS.SKILLS.ALCHEMY]: 0.5
  }
});
