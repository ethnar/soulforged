const BoneEquipment = require("./.bone-equipment");

class BoneKnife extends BoneEquipment {}
Item.itemFactory(BoneKnife, {
  name: "Bone Knife",
  order: ITEMS_ORDER.TOOLS,
  damage: {
    [DAMAGE_TYPES.BLUNT]: 1,
    [DAMAGE_TYPES.SLICE]: 14,
    [DAMAGE_TYPES.PIERCE]: 4
  },
  buffs: {
    [BUFFS.SKILLS.FIGHTING_DODGE]: 0.5
  },
  hitChance: WeaponSystem.BASE_HIT.KNIFE,
  weaponSkill: SKILLS.FIGHTING_KNIFE,
  icon: `/${ICONS_PATH}/items/equipment/bone/prehistoricicon_28_b_bone.png`,
  weight: 0.5,
  slots: {
    [EQUIPMENT_SLOTS.TOOL]: 1,
    [EQUIPMENT_SLOTS.WEAPON]: 2
  },
  utility: {
    [TOOL_UTILS.ETCHING]: 1,
    [TOOL_UTILS.CUTTING]: 1,
    [TOOL_UTILS.SAWING]: 0.25
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      Bone: 1,
      BarkRope: 1
    },
    skill: SKILLS.CRAFTING,
    toolUtility: TOOL_UTILS.CUTTING,
    skillLevel: 1,
    baseTime: 4 * MINUTES
  }
});
module.exports = global.BoneKnife = BoneKnife;
