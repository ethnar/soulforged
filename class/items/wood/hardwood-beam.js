const Item = require("../.item");

const icon = `/${ICONS_PATH}/items/wood/wd_n4_b_dark.png`;

class HardwoodBeam extends Item {}
Item.itemFactory(HardwoodBeam, {
  name: "Hardwood Beam",
  order: ITEMS_ORDER.OTHER,
  icon,
  weight: 2.5,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      OakWood: 1
    },
    skill: SKILLS.CARPENTRY,
    skillLevel: 2,
    toolUtility: TOOL_UTILS.SAWING,
    baseTime: 60 * MINUTES
  }
});
module.exports = global.HardwoodBeam = HardwoodBeam;

new Recipe({
  id: "Hardwood Beam",
  name: HardwoodBeam.prototype.name,
  icon,
  research: {
    sameAsCrafting: true
  },
  materials: {
    PineWood: 1
  },
  result: {
    HardwoodBeam: 1
  },
  skill: SKILLS.CARPENTRY,
  skillLevel: 2,
  toolUtility: TOOL_UTILS.SAWING,
  baseTime: 20 * MINUTES
});

new Recipe({
  id: "HardwoodBeamMahogany",
  name: HardwoodBeam.prototype.name,
  icon,
  research: {
    sameAsCrafting: true
  },
  materials: {
    MahoganyWood: 1
  },
  result: {
    HardwoodBeam: 1
  },
  skill: SKILLS.CARPENTRY,
  skillLevel: 2,
  toolUtility: TOOL_UTILS.SAWING,
  baseTime: 20 * MINUTES
});
