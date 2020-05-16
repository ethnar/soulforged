const BoneEquipment = require("./.bone-equipment");

class BoneSpear extends BoneEquipment {}
Item.itemFactory(BoneSpear, {
  name: "Bone Spear",
  order: ITEMS_ORDER.TOOLS,
  damage: {
    [DAMAGE_TYPES.SLICE]: 7,
    [DAMAGE_TYPES.PIERCE]: 12
  },
  buffs: {
    [BUFFS.SKILLS.FIGHTING_DODGE]: 0.3
  },
  hitChance: WeaponSystem.BASE_HIT.POLEARM,
  weight: 1,
  weaponSkill: SKILLS.FIGHTING_POLEARM,
  icon: `/${ICONS_PATH}/items/equipment/bone/prehistoricicon_143_b.png`,
  slots: {
    [EQUIPMENT_SLOTS.TOOL]: 1,
    [EQUIPMENT_SLOTS.WEAPON]: 2
  },
  utility: {
    [TOOL_UTILS.HUNTING]: 1.1,
    [TOOL_UTILS.FISHING]: 0.5
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      BoneKnife: 1,
      BarkRope: 1,
      Twig: 1
    },
    skill: SKILLS.CRAFTING,
    skillLevel: 1,
    baseTime: 4 * MINUTES
  }
});
module.exports = global.BoneSpear = BoneSpear;
