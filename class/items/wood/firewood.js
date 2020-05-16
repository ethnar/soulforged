const Item = require("../.item");

const icon = `/${ICONS_PATH}/items/wood/tradingicons_75.png`;

class Firewood extends Item {}
Item.itemFactory(Firewood, {
  name: "Firewood",
  order: ITEMS_ORDER.OTHER,
  icon,
  weight: 0.25,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      PoplarWood: 1
    },
    result: {
      Firewood: 16
    },
    skill: SKILLS.WOODCUTTING,
    skillLevel: -1,
    toolUtility: TOOL_UTILS.WOODCUTTING,
    baseTime: 5 * MINUTES
  }
});
module.exports = global.Firewood = Firewood;

new Recipe({
  id: "FirewoodSpruce",
  name: Firewood.prototype.name,
  icon,
  research: {
    sameAsCrafting: true
  },
  materials: {
    SpruceWood: 1
  },
  result: {
    Firewood: 16
  },
  skill: SKILLS.WOODCUTTING,
  skillLevel: -1,
  toolUtility: TOOL_UTILS.WOODCUTTING,
  baseTime: 3 * MINUTES
});

new Recipe({
  id: "FirewoodAcacia",
  name: Firewood.prototype.name,
  icon,
  research: {
    sameAsCrafting: true
  },
  materials: {
    AcaciaWood: 1
  },
  result: {
    Firewood: 16
  },
  skill: SKILLS.WOODCUTTING,
  skillLevel: -1,
  toolUtility: TOOL_UTILS.WOODCUTTING,
  baseTime: 3 * MINUTES
});
