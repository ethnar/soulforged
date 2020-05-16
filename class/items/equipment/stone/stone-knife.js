const Item = require("../../.item");

class StoneKnife extends Item {}
Item.itemFactory(StoneKnife, {
  name: "Stone Knife",
  order: ITEMS_ORDER.TOOLS,
  damage: {
    [DAMAGE_TYPES.BLUNT]: 3,
    [DAMAGE_TYPES.SLICE]: 11,
    [DAMAGE_TYPES.PIERCE]: 4
  },
  buffs: {
    [BUFFS.SKILLS.FIGHTING_DODGE]: 0.5
  },
  hitChance: WeaponSystem.BASE_HIT.KNIFE,
  weaponSkill: SKILLS.FIGHTING_KNIFE,
  icon: `/${ICONS_PATH}/items/equipment/stone/prehistoricicon_46_b_gray.png`,
  weight: 0.8,
  slots: {
    [EQUIPMENT_SLOTS.TOOL]: 1,
    [EQUIPMENT_SLOTS.WEAPON]: 2
  },
  utility: {
    [TOOL_UTILS.ETCHING]: 1,
    [TOOL_UTILS.CUTTING]: 1
    // [TOOL_UTILS.SAWING]: 0.25,
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      SharpenedStone: 1,
      BarkRope: 1
    },
    skill: SKILLS.CRAFTING,
    skillLevel: 0.3,
    baseTime: 160
  }
});
module.exports = global.StoneKnife = StoneKnife;
