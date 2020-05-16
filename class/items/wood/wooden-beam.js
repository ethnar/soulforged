const Item = require("../.item");

const icon = `/${ICONS_PATH}/items/wood/wd_n4_b.png`;

class WoodenBeam extends Item {}
Item.itemFactory(WoodenBeam, {
  name: "Wooden Beam",
  order: ITEMS_ORDER.OTHER,
  icon,
  weight: 2,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      PoplarWood: 1
    },
    skill: SKILLS.CARPENTRY,
    skillLevel: 0,
    toolUtility: TOOL_UTILS.SAWING,
    baseTime: 20 * MINUTES
  }
});
module.exports = global.WoodenBeam = WoodenBeam;

new Recipe({
  id: "WoodenBeamSpruce",
  name: WoodenBeam.prototype.name,
  icon,
  research: {
    sameAsCrafting: true
  },
  materials: {
    SpruceWood: 1
  },
  result: {
    WoodenBeam: 1
  },
  skill: SKILLS.CARPENTRY,
  skillLevel: 0,
  toolUtility: TOOL_UTILS.SAWING,
  baseTime: 7 * MINUTES
});

new Recipe({
  id: "WoodenBeamAcacia",
  name: WoodenBeam.prototype.name,
  icon,
  research: {
    sameAsCrafting: true
  },
  materials: {
    AcaciaWood: 1
  },
  result: {
    WoodenBeam: 1
  },
  skill: SKILLS.CARPENTRY,
  skillLevel: 0,
  toolUtility: TOOL_UTILS.SAWING,
  baseTime: 7 * MINUTES
});
