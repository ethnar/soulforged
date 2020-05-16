const Item = require("../.item");

const icon = `/${ICONS_PATH}/items/leather/lz_b_05.png`;

class LeatherStraps extends Item {}
Item.itemFactory(LeatherStraps, {
  name: "Leather Straps",
  order: ITEMS_ORDER.OTHER,
  icon,
  weight: 0.1
});

new Recipe({
  id: "LeatherStrapsDeer",
  name: `Make ${LeatherStraps.prototype.name}`,
  icon,
  research: {
    sameAsCrafting: true
  },
  materials: {
    DeerLeather: 1
  },
  result: {
    LeatherStraps: 7
  },
  skill: SKILLS.LEATHERWORKING,
  toolUtility: TOOL_UTILS.CUTTING,
  skillLevel: 1,
  baseTime: 10 * MINUTES
});

new Recipe({
  id: "LeatherStrapsWolf",
  name: `Make ${LeatherStraps.prototype.name}`,
  icon,
  research: {
    sameAsCrafting: true
  },
  materials: {
    WolfLeather: 1
  },
  result: {
    LeatherStraps: 7
  },
  skill: SKILLS.LEATHERWORKING,
  toolUtility: TOOL_UTILS.CUTTING,
  skillLevel: 1,
  baseTime: 10 * MINUTES
});

new Recipe({
  id: "LeatherStrapsBear",
  name: `Make ${LeatherStraps.prototype.name}`,
  icon,
  research: {
    sameAsCrafting: true
  },
  materials: {
    BearLeather: 1
  },
  result: {
    LeatherStraps: 7
  },
  skill: SKILLS.LEATHERWORKING,
  toolUtility: TOOL_UTILS.CUTTING,
  skillLevel: 1,
  baseTime: 10 * MINUTES
});

module.exports = global.LeatherStraps = LeatherStraps;
