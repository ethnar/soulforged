const Building = require("./.building");

class LargeFireplace extends Building {
  static getDescription() {
    return `A large, cosy fire that will keep going for quite a while.`;
  }

  earthQuakeDamage() {}
}
Building.buildingFactory(LargeFireplace, {
  name: "Fireside",
  deteriorationRate: 7 * DAYS,
  baseTime: 20 * SECONDS,
  icon: `/${ICONS_PATH}/structures/buildings/spellbook01_33.png`,
  research: {
    materials: {
      Stone: 0,
      Firewood: 0
    }
  },
  toolUtility: TOOL_UTILS.FIRESTARTER,
  materials: {
    Stone: 8,
    Firewood: 40
  },
  repair: {
    materials: {
      Firewood: 40
    }
  },
  obsoletes: ["Fireplace"],
  buffs: {
    [BUFFS.TEMPERATURE_MIN]: 3
  }
});
module.exports = global.LargeFireplace = LargeFireplace;
