const BoneEquipment = require("./.bone-equipment");

class BoneHatchet extends BoneEquipment {}
Item.itemFactory(BoneHatchet, {
  name: "Bone Hatchet",
  order: ITEMS_ORDER.TOOLS,
  damage: {
    [DAMAGE_TYPES.BLUNT]: 3,
    [DAMAGE_TYPES.SLICE]: 12,
    [DAMAGE_TYPES.PIERCE]: 5
  },
  weight: 1,
  hitChance: WeaponSystem.BASE_HIT.AXE,
  weaponSkill: SKILLS.FIGHTING_AXE,
  icon: `/${ICONS_PATH}/items/equipment/bone/miningicons_43_b.png`,
  slots: {
    [EQUIPMENT_SLOTS.TOOL]: 1,
    [EQUIPMENT_SLOTS.WEAPON]: 2
  },
  utility: {
    [TOOL_UTILS.WOODCUTTING]: 1.1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      Bone: 1,
      BarkRope: 1,
      Twig: 1
    },
    skill: SKILLS.CRAFTING,
    skillLevel: 1,
    toolUtility: TOOL_UTILS.CUTTING,
    baseTime: 4 * MINUTES
  }
});
module.exports = global.BoneHatchet = BoneHatchet;
