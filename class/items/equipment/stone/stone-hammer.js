const Item = require("../../.item");

class StoneHammer extends Item {}
Item.itemFactory(StoneHammer, {
  name: "Stone Hammer",
  order: ITEMS_ORDER.TOOLS,
  damage: {
    [DAMAGE_TYPES.BLUNT]: 14,
    [DAMAGE_TYPES.SLICE]: 1
  },
  weight: 1.5,
  hitChance: WeaponSystem.BASE_HIT.HAMMER,
  weaponSkill: SKILLS.FIGHTING_HAMMER,
  icon: `/${ICONS_PATH}/items/equipment/stone/prehistoricicon_58_b_gray.png`,
  slots: {
    [EQUIPMENT_SLOTS.TOOL]: 1,
    [EQUIPMENT_SLOTS.WEAPON]: 2
  },
  utility: {
    [TOOL_UTILS.HAMMER]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      Stone: 1,
      BarkRope: 1,
      Twig: 1
    },
    skill: SKILLS.CRAFTING,
    baseTime: 120
  }
});
module.exports = global.StoneHammer = StoneHammer;
