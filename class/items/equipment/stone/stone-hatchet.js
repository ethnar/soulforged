const Item = require("../../.item");

class StoneHatchet extends Item {}
Item.itemFactory(StoneHatchet, {
  name: "Stone Hatchet",
  order: ITEMS_ORDER.TOOLS,
  damage: {
    [DAMAGE_TYPES.BLUNT]: 6,
    [DAMAGE_TYPES.SLICE]: 10,
    [DAMAGE_TYPES.PIERCE]: 4
  },
  weight: 1.4,
  hitChance: WeaponSystem.BASE_HIT.AXE,
  weaponSkill: SKILLS.FIGHTING_AXE,
  icon: `/${ICONS_PATH}/items/equipment/stone/prehistoricicon_23_b_gray.png`,
  slots: {
    [EQUIPMENT_SLOTS.TOOL]: 1,
    [EQUIPMENT_SLOTS.WEAPON]: 2
  },
  utility: {
    [TOOL_UTILS.WOODCUTTING]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      SharpenedStone: 1,
      BarkRope: 1,
      Twig: 1
    },
    skill: SKILLS.CRAFTING,
    baseTime: 120
  }
});
module.exports = global.StoneHatchet = StoneHatchet;
