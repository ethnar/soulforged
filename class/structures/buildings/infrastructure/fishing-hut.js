const Building = require("../.building");

class FishingHut extends Building {}
Building.buildingFactory(FishingHut, {
  name: "Fishing Hut",
  deteriorationRate: 4 * MONTHS,
  baseTime: 10 * MINUTES,
  icon: `/${ICONS_PATH}/structures/buildings/infrastructure/sgi_52.png`,
  research: {
    sameAsCrafting: true
  },
  materials: {
    RatTail: 50,
    HardwoodFrame: 12,
    HardwoodShaft: 40,
    HardwoodPlank: 40,
    LeatherRope: 30,
    CopperMetalRing: 20,
    Thatch: 10
    // DONE
  },
  buffs: {
    [BUFFS.SKILL_SPEED[SKILLS.FISHING]]: 50,
    [BUFFS.SKILLS.FISHING]: 1
  }
});
