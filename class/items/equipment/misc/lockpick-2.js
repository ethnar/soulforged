const Item = require("../../.item");

class NormalLockpicks extends Item {}
Item.itemFactory(NormalLockpicks, {
  name: "Lockpicks",
  icon: `/${ICONS_PATH}/items/equipment/misc/lock_picks_b_01_iron.png`,
  order: ITEMS_ORDER.TOOLS,
  weight: 0.1,
  durability: 2,
  slots: {
    [EQUIPMENT_SLOTS.TOOL]: 1
  },
  utility: {
    [TOOL_UTILS.LOCKPICKING]: 1.1
  },
  research: {
    sameAsCrafting: true,
    materials: {
      ResearchConcept_Lockpicking: 0
    }
  },
  crafting: {
    materials: {
      IronWire: 3,
      LeatherStraps: 1
    },
    skill: SKILLS.CRAFTING,
    skillLevel: 2,
    baseTime: 30 * MINUTES
  }
});
