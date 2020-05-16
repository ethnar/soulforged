const Building = require("../.building");

class HuntingCamp extends Building {}
Building.buildingFactory(HuntingCamp, {
  name: "Hunting Camp",
  deteriorationRate: 4 * MONTHS,
  baseTime: 8 * MINUTES,
  icon: `/${ICONS_PATH}/structures/buildings/infrastructure/green_15.png`,
  research: {
    sameAsCrafting: true
  },
  materials: {
    IronSpear: 15,
    WoodenFrame: 8,
    WoodenPlank: 60,
    WoodenShaft: 30,
    WoodenBeam: 20,
    IronNails: 50,
    LeatherRope: 20,
    LionSkin: 20,
    DeerHide: 20,
    GoatHide: 20
    // DONE
  },
  buffs: {
    [BUFFS.SKILL_SPEED[SKILLS.HUNTING]]: 50,
    [BUFFS.SKILLS.HUNTING]: 0.5
  }
});
