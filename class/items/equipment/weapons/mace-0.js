const BoneEquipment = require("../bone/.bone-equipment");

class BoneClub extends BoneEquipment {}
Item.itemFactory(BoneClub, {
  name: "Bone Club",
  order: ITEMS_ORDER.WEAPONS,
  damage: {
    [DAMAGE_TYPES.BLUNT]: 17,
    [DAMAGE_TYPES.SLICE]: 3,
    [DAMAGE_TYPES.PIERCE]: 2
  },
  skillCoefficients: {
    damage: {
      [DAMAGE_TYPES.BLUNT]: 0.3
    }
  },
  weight: 2,
  hitChance: WeaponSystem.BASE_HIT.MACE,
  weaponSkill: SKILLS.FIGHTING_MACE,
  icon: `/${ICONS_PATH}/items/equipment/bone/prehistoricicon_127_b.png`,
  slots: {
    [EQUIPMENT_SLOTS.WEAPON]: 2
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      Bone: 2,
      BarkRope: 1
    },
    skill: SKILLS.CRAFTING,
    skillLevel: 1,
    baseTime: 4 * MINUTES
  }
});
module.exports = global.BoneClub = BoneClub;
