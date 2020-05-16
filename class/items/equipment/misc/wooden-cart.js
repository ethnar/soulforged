const Item = require("../../.item");

class WoodenCart extends ExpirableItem {}
Item.itemFactory(WoodenCart, {
  name: "Wooden Cart",
  icon: `/${ICONS_PATH}/items/equipment/misc/woodencart.png`,
  order: ITEMS_ORDER.TOOLS,
  weight: 45,
  expiresIn: 100 * DAYS,
  expiresIntegrity: true,
  slots: {
    [EQUIPMENT_SLOTS.TOOL]: 1
  },
  buffs: {
    [BUFFS.TRAVEL_SPEED]: -10,
    [BUFFS.TRAVEL_DIFFICULTY]: 2,
    [BUFFS.COMBAT_STRENGTH]: 20,
    [BUFFS.CARRY_CAPACITY]: 400
  },
  utility: {
    [TOOL_UTILS.TRANSPORTATION]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      WoodenWheel: 2,
      HardwoodBoard: 1,
      HardwoodShaft: 8,
      HardwoodPlank: 20,
      TrueIronNails: 30
    },
    skill: SKILLS.CARPENTRY,
    skillLevel: 6,
    baseTime: 5 * HOURS
  }
});
module.exports = global.WoodenCart = WoodenCart;
