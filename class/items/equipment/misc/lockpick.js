const Item = require("../../.item");
const WoodenDoors = require("../../../structures/dungeon/doors/wooden-doors");

class BasicLockpicks extends Item {}
Item.itemFactory(BasicLockpicks, {
  name: "Pliable Lockpicks",
  icon: `/${ICONS_PATH}/items/equipment/misc/lock_picks_b_01_copper.png`,
  order: ITEMS_ORDER.TOOLS,
  weight: 0.1,
  slots: {
    [EQUIPMENT_SLOTS.TOOL]: 1
  },
  buffs: {
    [BUFFS.SKILLS.LOCKPICKING]: -0.5
  },
  utility: {
    [TOOL_UTILS.LOCKPICKING]: 1
  },
  research: {
    sameAsCrafting: true,
    materials: {
      ResearchConcept_Lockpicking: 0
    }
  },
  crafting: {
    materials: {
      CopperWire: 3,
      LeatherStraps: 1
    },
    skill: SKILLS.CRAFTING,
    skillLevel: 2,
    baseTime: 30 * MINUTES
  }
});
module.exports = global.BasicLockpicks = BasicLockpicks;

new ResearchConcept({
  name: "Lockpicking",
  className: "ResearchConcept_Lockpicking",
  tier: ResearchConcept.TIERS.PARCHMENT,
  requirements: [
    utils.and(
      ResearchConcept.knownItem("CopperWire"),
      ResearchConcept.knownIcon(WoodenDoors.prototype.icon)
    )
  ]
});
