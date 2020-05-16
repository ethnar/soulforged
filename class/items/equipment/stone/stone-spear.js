const Item = require("../../.item");

class StoneSpear extends Item {}
Item.itemFactory(StoneSpear, {
  name: "Stone Spear",
  order: ITEMS_ORDER.TOOLS,
  damage: {
    [DAMAGE_TYPES.BLUNT]: 1,
    [DAMAGE_TYPES.SLICE]: 6,
    [DAMAGE_TYPES.PIERCE]: 11
  },
  buffs: {
    [BUFFS.SKILLS.FIGHTING_DODGE]: 0.3
  },
  hitChance: WeaponSystem.BASE_HIT.POLEARM,
  weight: 1.4,
  weaponSkill: SKILLS.FIGHTING_POLEARM,
  icon: `/${ICONS_PATH}/items/equipment/stone/prehistoricicon_31_b_gray.png`,
  slots: {
    [EQUIPMENT_SLOTS.TOOL]: 1,
    [EQUIPMENT_SLOTS.WEAPON]: 2
  },
  utility: {
    [TOOL_UTILS.HUNTING]: 1,
    [TOOL_UTILS.FISHING]: 0.4
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      StoneKnife: 1,
      BarkRope: 1,
      Twig: 1
    },
    skill: SKILLS.CRAFTING,
    skillLevel: 0.5,
    baseTime: 120
  }
});
module.exports = global.StoneSpear = StoneSpear;
